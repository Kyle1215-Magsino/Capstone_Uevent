import { useState, useEffect, useRef, useCallback } from 'react';
import { getActiveEvents } from '../api/eventApi';
import { processCheckin, getLiveAttendance } from '../api/attendanceApi';
import { getFaceData } from '../api/studentApi';
import { toast } from 'react-toastify';
import { loadModels, findBestMatch, faceapi, TINY_OPTIONS, prepareDescriptors, captureAveragedDescriptor } from '../utils/faceApi';

export default function CheckinPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [method, setMethod] = useState('manual');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState({ attendances: [], stats: { total: 0, present: 0, late: 0, locationVerified: 0 } });
  const [clock, setClock] = useState(new Date());
  const [useLocation, setUseLocation] = useState(false);
  const [coords, setCoords] = useState(null);
  const rfidRef = useRef(null);

  // Face recognition state
  const [modelsReady, setModelsReady] = useState(false);
  const [faceCamera, setFaceCamera] = useState(false);
  const [matching, setMatching] = useState(false);
  const [cameraStatusText, setCameraStatusText] = useState('');
  const [cameraStatusColor, setCameraStatusColor] = useState('yellow');
  const [matchedStudent, setMatchedStudent] = useState(null);
  const [enrolledFaces, setEnrolledFaces] = useState([]);
  const [frontLight, setFrontLight] = useState(false);
  const faceVideoRef = useRef(null);
  const faceCanvasRef = useRef(null);
  const faceStreamRef = useRef(null);

  // Load active events
  useEffect(() => {
    getActiveEvents().then(res => setEvents(res.data));
  }, []);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll live attendance
  useEffect(() => {
    if (!selectedEvent) return;
    const poll = () => getLiveAttendance(selectedEvent).then(res => setLiveData(res.data)).catch(() => {});
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [selectedEvent]);

  // Get location
  useEffect(() => {
    if (useLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords(null)
      );
    }
  }, [useLocation]);

  // Auto-focus RFID input
  useEffect(() => {
    if (method === 'rfid' && rfidRef.current) rfidRef.current.focus();
  }, [method]);

  // Load face models when facial tab selected
  useEffect(() => {
    if (method === 'facial') {
      loadModels().then(() => setModelsReady(true));
      getFaceData().then(res => setEnrolledFaces(prepareDescriptors(res.data))).catch(() => {});
    } else {
      stopFaceCamera();
    }
    return () => stopFaceCamera();
  }, [method]);

  const stopFaceCamera = useCallback(() => {
    if (faceStreamRef.current) {
      faceStreamRef.current.getTracks().forEach(t => t.stop());
      faceStreamRef.current = null;
    }
    setFaceCamera(false);
    setCameraStatusText('');
    setMatchedStudent(null);
  }, []);

  const startFaceCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      faceStreamRef.current = stream;
      if (faceVideoRef.current) {
        faceVideoRef.current.srcObject = stream;
        await faceVideoRef.current.play();
      }
      setFaceCamera(true);
      setCameraStatusText('Ready — position your face');
      setCameraStatusColor('green');
    } catch {
      toast.error('Could not access camera.');
      setCameraStatusColor('red');
    }
  };

  const captureAndMatch = async () => {
    if (!modelsReady || matching) return;
    const video = faceVideoRef.current;
    const canvas = faceCanvasRef.current;
    if (!video || !canvas || !faceStreamRef.current) { toast.error('Camera not ready.'); return; }

    setMatching(true);
    setMatchedStudent(null);
    setCameraStatusText('Scanning face...');
    setCameraStatusColor('yellow');

    try {
      // Yield to browser before heavy detection
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

      // Get one detection first for quality check + bounding box
      let detection = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        detection = await faceapi
          .detectSingleFace(video, TINY_OPTIONS)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) break;
        await new Promise(r => setTimeout(r, 300));
      }

      // Clear canvas
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!detection) {
        setCameraStatusText('No face detected');
        setCameraStatusColor('red');
        toast.error('No face detected. Look directly at the camera and try again.');
        return;
      }

      // Quality check: face must be at least 4% of frame area for a reliable descriptor
      const faceArea = detection.detection.box.width * detection.detection.box.height;
      const frameArea = video.videoWidth * video.videoHeight;
      if (faceArea / frameArea < 0.04) {
        setCameraStatusText('Move closer to camera');
        setCameraStatusColor('red');
        toast.error('Face too far away — move closer to the camera.');
        return;
      }

      // Draw bounding box with forest green (#22C55E)
      const box = detection.detection.box;
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw landmarks with leaf color (#B0CE88)
      ctx.fillStyle = '#B0CE88';
      detection.landmarks.positions.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Average 5 frames for a stable descriptor before matching
      setCameraStatusText('Analyzing...');
      const avgDescriptor = await captureAveragedDescriptor(video, 5);
      const descriptorToMatch = avgDescriptor ?? new Float32Array(detection.descriptor);

      // Find best match
      const match = findBestMatch(descriptorToMatch, enrolledFaces);
      if (match) {
        const confidence = ((1 - match.distance) * 100).toFixed(1);
        setCameraStatusText(`Matched: ${match.student.first_name} ${match.student.last_name} (${confidence}%)`);
        setCameraStatusColor('green');
        setMatchedStudent({ ...match.student, confidence });
        handleCheckin(match.student.student_id || String(match.student.id), 'facial');
      } else {
        setCameraStatusText('No match found');
        setCameraStatusColor('red');
        toast.warning('Face not recognized. Try adjusting lighting or move closer.');
      }
    } catch (err) {
      console.error('Face match error:', err);
      setCameraStatusText('Detection error');
      setCameraStatusColor('red');
    } finally {
      setMatching(false);
    }
  };

  const handleCheckin = async (studentId, overrideMethod) => {
    if (!selectedEvent) {
      toast.warning('Please select an event.');
      return;
    }
    if (!studentId?.toString().trim()) {
      toast.warning('Please enter a student identifier.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        student_identifier: studentId.toString().trim(),
        event_id: selectedEvent,
        verification_method: overrideMethod || method,
        location_lat: coords?.lat || null,
        location_lng: coords?.lng || null,
      };
      const res = await processCheckin(payload);
      toast.success(`${res.data.student_name} checked in (${res.data.status}).`);
      setIdentifier('');
      getLiveAttendance(selectedEvent).then(r => setLiveData(r.data));
      if (overrideMethod === 'facial') {
        setTimeout(() => setMatchedStudent(null), 2500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleCheckin(identifier);
  };

  const handleRfidKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheckin(identifier);
    }
  };

  const selectedEventObj = events.find(e => e.id === parseInt(selectedEvent));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Event Check-In</h1>
        <p className="text-sm text-gray-500 mt-1">Process student attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel: Check-in controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Event selector & clock */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-300 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Active Event</label>
              <select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400"
              >
                <option value="">Select an event...</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.event_name} ({new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">{clock.toLocaleTimeString()}</p>
              <p className="text-sm text-gray-500">{clock.toLocaleDateString()}</p>
              {selectedEventObj && (
                <span className={`px-2 py-1 rounded text-xs ${selectedEventObj.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedEventObj.status}
                </span>
              )}
            </div>
          </div>

          {/* Method tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-green-300">
            <div className="flex border-b">
              {['manual', 'rfid', 'facial'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setIdentifier(''); }}
                  className={`flex-1 py-3 text-sm font-medium capitalize ${method === m ? 'border-b-2 border-forest-400 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {m === 'facial' ? 'Face Recognition' : m.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-4">
              {method === 'manual' && (
                <form onSubmit={handleManualSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Enter student ID..."
                      className="flex-1 px-4 py-2.5 border border-green-400 rounded-xl bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={loading || !selectedEvent || !identifier.trim()}
                      className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Check In'}
                    </button>
                  </div>
                </form>
              )}

              {method === 'rfid' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Scan RFID tag or type &amp; press Enter:</p>
                  <div className="flex gap-2">
                    <input
                      ref={rfidRef}
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      onKeyDown={handleRfidKeyDown}
                      placeholder="Waiting for RFID scan..."
                      className="flex-1 px-3 py-3 border-2 border-forest-300 rounded-lg text-lg font-mono focus:border-forest-400"
                      autoFocus
                    />
                    <button
                      onClick={() => handleCheckin(identifier.trim())}
                      disabled={loading || !selectedEvent || !identifier.trim()}
                      className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Check In'}
                    </button>
                  </div>
                </div>
              )}

              {method === 'facial' && (
                <div>
                  {!modelsReady ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-forest-400 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-sm text-gray-500">Loading face recognition models...</p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`relative rounded-xl overflow-hidden mb-4 transition-all duration-300 ${frontLight ? 'ring-[10px] ring-white shadow-[0_0_50px_15px_rgba(255,255,255,0.85)]' : 'bg-gray-900'}`}
                        style={{ aspectRatio: '4/3', background: frontLight ? '#111' : undefined }}
                      >
                        <video
                          ref={faceVideoRef}
                          className="w-full h-full object-cover"
                          playsInline muted
                          style={{ display: faceCamera ? 'block' : 'none', filter: frontLight ? 'brightness(1.3) contrast(1.1)' : undefined }}
                        />
                        <canvas
                          ref={faceCanvasRef}
                          className="absolute inset-0 w-full h-full"
                          style={{ display: faceCamera ? 'block' : 'none' }}
                        />

                        {/* Camera status pill */}
                        {faceCamera && cameraStatusText && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full animate-pulse ${
                                cameraStatusColor === 'green' ? 'bg-green-400' :
                                cameraStatusColor === 'red' ? 'bg-red-400' : 'bg-yellow-400'
                              }`} />
                              {cameraStatusText}
                            </div>
                          </div>
                        )}

                        {/* Match result overlay */}
                        {matchedStudent && (
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">
                                {matchedStudent.first_name?.[0]}{matchedStudent.last_name?.[0]}
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm">{matchedStudent.first_name} {matchedStudent.last_name}</p>
                                <p className="text-gray-300 text-xs">{matchedStudent.student_id} — {matchedStudent.confidence}% match</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {!faceCamera && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Start the camera to begin</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setFrontLight(f => !f)}
                          className={`px-3 py-2.5 text-sm font-medium rounded-xl border transition flex items-center gap-1.5 ${
                            frontLight
                              ? 'bg-yellow-100 border-yellow-300 text-yellow-700 shadow-inner'
                              : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-yellow-50 hover:border-yellow-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                          {frontLight ? 'Light On' : 'Front Light'}
                        </button>
                        {!faceCamera ? (
                          <button
                            onClick={startFaceCamera}
                            disabled={!selectedEvent}
                            className="flex-1 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            Start Camera
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={captureAndMatch}
                              disabled={matching}
                              className="flex-1 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              {matching ? 'Detecting...' : 'Capture & Match'}
                            </button>
                            <button
                              onClick={stopFaceCamera}
                              className="px-4 py-2.5 bg-gray-500 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition"
                            >
                              Stop
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        {enrolledFaces.length} enrolled face(s) loaded</p>
                    </>
                  )}
                </div>
              )}

              {/* Location toggle */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useLocation"
                  checked={useLocation}
                  onChange={e => setUseLocation(e.target.checked)}
                />
                <label htmlFor="useLocation" className="text-sm text-gray-600">
                  Enable location verification
                  {coords && <span className="text-green-600 ml-1">(GPS active)</span>}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Live stats & feed */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-300">
            <h3 className="font-semibold text-gray-900 mb-3">Live Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-2xl font-bold text-green-600">{liveData.stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-2xl font-bold text-green-600">{liveData.stats.present}</p>
                <p className="text-xs text-gray-500">Present</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded text-center">
                <p className="text-2xl font-bold text-yellow-600">{liveData.stats.late}</p>
                <p className="text-xs text-gray-500">Late</p>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center">
                <p className="text-2xl font-bold text-purple-600">{liveData.stats.locationVerified}</p>
                <p className="text-xs text-gray-500">Location Verified</p>
              </div>
            </div>
          </div>

          {/* Live feed */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-300 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Live Feed</h3>
            <div className="space-y-2">
              {liveData.attendances.map(a => (
                <div key={a.id} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                  <div>
                    <p className="font-medium">{a.student?.first_name} {a.student?.last_name}</p>
                    <p className="text-xs text-gray-500">{a.student?.student_id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${a.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(a.check_in_time).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {liveData.attendances.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No check-ins yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






