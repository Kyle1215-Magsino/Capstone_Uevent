import { useState, useEffect, useRef, useCallback } from 'react';
import { getStudents, saveFaceData } from '../api/studentApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { loadModels, estimateYaw, faceapi, TINY_OPTIONS, captureAveragedDescriptor } from '../utils/faceApi';

const ENROLL_STEPS = [
  { title: 'Look Straight Ahead', sub: 'Position your face clearly in the camera', check: yaw => Math.abs(yaw) < 0.12 },
  { title: 'Turn Your Head Right', sub: 'Slowly turn your head to your right', check: yaw => yaw < -0.13 },
  { title: 'Turn Your Head Left', sub: 'Slowly turn your head to your left', check: yaw => yaw > 0.13 },
];

export default function FaceEnrollmentPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [modelsReady, setModelsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [frontLight, setFrontLight] = useState(false);

  const selectRef = useRef(null);

  // Enrollment step state
  const [enrolling, setEnrolling] = useState(false);
  const [enrollStep, setEnrollStep] = useState(0);
  const [enrollStepStatus, setEnrollStepStatus] = useState('waiting');
  const [enrollStepTitle, setEnrollStepTitle] = useState('');
  const [enrollStepSub, setEnrollStepSub] = useState('');
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollFailMsg, setEnrollFailMsg] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const enrollCancelledRef = useRef(false);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    Promise.all([
      getStudents().then(res => setStudents(res.data)),
      loadModels().then(() => setModelsReady(true)),
    ]).finally(() => setLoading(false));
    return () => stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    enrollCancelledRef.current = true;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setEnrolling(false);
    setEnrollSuccess(false);
    setEnrollFailMsg(null);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        await new Promise(resolve => {
          if (videoRef.current.readyState >= 2) { resolve(); return; }
          videoRef.current.addEventListener('loadeddata', resolve, { once: true });
          setTimeout(resolve, 5000);
        });
      }
      setCameraActive(true);
    } catch {
      toast.error('Could not access camera. Please allow camera permission.');
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.student_id} ${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const startEnrollment = async () => {
    if (!selectedStudent) { toast.warning('Select a student first.'); return; }
    if (!modelsReady) { toast.warning('Models still loading. Please wait.'); return; }

    if (!cameraActive) {
      await startCamera();
      await new Promise(r => setTimeout(r, 600));
    }
    if (!streamRef.current) { toast.error('Camera not available.'); return; }

    enrollCancelledRef.current = false;
    setEnrolling(true);
    setEnrollSuccess(false);
    setEnrollFailMsg(null);
    setEnrollProgress(0);

    const video = videoRef.current;
    const descriptors = [];

    for (let stepIdx = 0; stepIdx < ENROLL_STEPS.length; stepIdx++) {
      if (enrollCancelledRef.current) break;

      const step = ENROLL_STEPS[stepIdx];
      setEnrollStep(stepIdx);
      setEnrollStepTitle(step.title);
      setEnrollStepSub(step.sub);
      setEnrollStepStatus('waiting');

      let stepDone = false;

      // Each step gets up to ~18s (50 × 350ms)
      for (let attempt = 0; attempt < 50; attempt++) {
        if (enrollCancelledRef.current) break;

        // Yield to browser to prevent UI freeze
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

        try {
          const detection = await faceapi
            .detectSingleFace(video, TINY_OPTIONS)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!detection) {
            setEnrollStepSub('No face detected — look at the camera');
            await new Promise(r => setTimeout(r, 150));
            continue;
          }

          const yaw = estimateYaw(detection.landmarks);

          if (step.check(yaw)) {
            setEnrollStepStatus('active');
            setEnrollStepSub('Hold still...');

            await new Promise(r => setTimeout(r, 300));
            await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

            // Confirm pose is still correct
            const confirm = await faceapi
              .detectSingleFace(video, TINY_OPTIONS)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (confirm && step.check(estimateYaw(confirm.landmarks))) {
              // Capture 8 averaged frames for a stable descriptor per pose
              setEnrollStepSub('Capturing samples...');
              const avgDesc = await captureAveragedDescriptor(video, 8);
              if (avgDesc) {
                descriptors.push(Array.from(avgDesc));
              } else {
                descriptors.push(Array.from(confirm.descriptor));
              }
              setEnrollStepStatus('done');
              setEnrollStepTitle('✓ ' + step.title);
              setEnrollStepSub('Captured!');
              setEnrollProgress(stepIdx + 1);
              await new Promise(r => setTimeout(r, 500));
              stepDone = true;
              break;
            } else {
              setEnrollStepStatus('waiting');
              setEnrollStepSub(step.sub);
            }
          } else {
            setEnrollStepStatus('waiting');
          }
        } catch (err) {
          console.error('Enrollment step error:', err);
        }

        await new Promise(r => setTimeout(r, 100));
      }

      if (!stepDone && !enrollCancelledRef.current) {
        setEnrolling(false);
        setEnrollFailMsg(`Timed out on: "${step.title}". Make sure your face is well-lit and clearly visible, then try again.`);
        return;
      }
    }

    setEnrolling(false);
    if (enrollCancelledRef.current) return;

    if (descriptors.length === 0) {
      setEnrollFailMsg('Could not capture any face data. Please try again.');
      return;
    }

    // Store descriptors as a 2D array [[128 nums], [128 nums], [128 nums]]
    // Keeping each pose separate gives findBestMatch more discrimination power
    // than a single blended average.
    setSaving(true);
    try {
      await saveFaceData(selectedStudent, { face_data: JSON.stringify(descriptors) });
      setEnrollSuccess(true);
      toast.success(`Face enrolled! ${descriptors.length} poses captured.`);
      const res = await getStudents();
      setStudents(res.data);
      setTimeout(() => {
        setEnrollSuccess(false);
        stopCamera();
      }, 3000);
    } catch (err) {
      setEnrollFailMsg(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (studentId) => {
    if (!confirm('Remove face data for this student?')) return;
    try {
      await saveFaceData(studentId, { face_data: null });
      toast.success('Face data removed.');
      const res = await getStudents();
      setStudents(res.data);
    } catch {
      toast.error('Failed to remove face data.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Face Enrollment</h1>
        <p className="text-sm text-gray-500 mt-1">Enroll student face data for biometric check-in</p>
      </div>

      {!modelsReady && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          Loading face recognition models...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-300 overflow-visible">
          <h3 className="font-semibold text-gray-900 mb-4">Enroll Student</h3>

          <div className="mb-4 relative" ref={selectRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>

            {/* Combobox — click or type to open the dropdown */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedStudent(''); setShowDropdown(true); }}
                onClick={() => setShowDropdown(true)}
                placeholder="Search by ID or name..."
                className="w-full pl-10 pr-9 py-2.5 border border-green-300 rounded-xl bg-gray-50 text-sm text-gray-900 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-400"
              />
              {search ? (
                <button
                  type="button"
                  onPointerDown={e => { e.preventDefault(); setSearch(''); setSelectedStudent(''); setShowDropdown(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              ) : (
                <button
                  type="button"
                  onPointerDown={e => { e.preventDefault(); setShowDropdown(prev => !prev); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className={`w-4 h-4 transition-transform duration-150 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              )}
            </div>

            {/* Dropdown list */}
            {showDropdown && !selectedStudent && (
              <ul className="absolute z-20 w-full mt-1 bg-white border border-green-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center">No students found</li>
                ) : (
                  filteredStudents.map(s => (
                    <li
                      key={s.id}
                      onPointerDown={e => {
                        e.preventDefault();
                        setSelectedStudent(String(s.id));
                        setSearch(`${s.last_name}, ${s.first_name} (${s.student_id})`);
                        setShowDropdown(false);
                      }}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-green-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl select-none"
                    >
                      <span>{s.last_name}, {s.first_name} <span className="text-gray-400">({s.student_id})</span></span>
                      {s.face_data && <span className="text-xs text-green-600 font-medium">enrolled</span>}
                    </li>
                  ))
                )}
              </ul>
            )}

            {/* Selected student preview card */}
            {selectedStudent && (() => {
              const s = students.find(st => st.id === parseInt(selectedStudent));
              if (!s) return null;
              return (
                <div className="mt-2 flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                  <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.first_name?.[0]}{s.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{s.first_name} {s.last_name}</p>
                    <p className="text-xs text-gray-500">{s.student_id} · {s.course}</p>
                  </div>
                  {s.face_data
                    ? <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-100 rounded-full border border-green-200">Re-enroll</span>
                    : <span className="text-xs text-orange-500 font-medium px-2 py-0.5 bg-orange-50 rounded-full border border-orange-200">Not enrolled</span>
                  }
                </div>
              );
            })()}
          </div>

          {/* Camera area */}
          <div
            className={`relative rounded-xl overflow-hidden mb-4 transition-all duration-300 ${frontLight ? 'ring-[10px] ring-white shadow-[0_0_50px_15px_rgba(255,255,255,0.85)]' : 'bg-gray-900'}`}
            style={{ aspectRatio: '4/3', background: frontLight ? '#111' : undefined }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline muted
              style={{ transform: 'scaleX(-1)', display: cameraActive ? 'block' : 'none', filter: frontLight ? 'brightness(1.3) contrast(1.1)' : undefined }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ transform: 'scaleX(-1)', display: cameraActive ? 'block' : 'none' }}
            />

            {/* Camera off placeholder */}
            {!cameraActive && !enrollSuccess && !enrollFailMsg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">Camera starts automatically</p>
                <p className="text-xs text-gray-500">Select a student, then click Start Face Enrollment</p>
              </div>
            )}

            {/* Enrollment step overlay */}
            {enrolling && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
                {/* Face guide oval */}
                <div className={`w-52 h-64 border-4 rounded-[50%] mb-5 transition-all duration-500 ${
                  enrollStepStatus === 'done' ? 'border-solid border-green-400' :
                  enrollStepStatus === 'active' ? 'border-dashed border-yellow-400' :
                  'border-dashed border-white/30'
                }`} />
                <p className="text-white text-lg font-bold text-center px-4 drop-shadow">{enrollStepTitle}</p>
                <p className="text-white/60 text-sm mt-2 text-center px-6">{enrollStepSub}</p>
                {/* Step dots */}
                <div className="flex items-center gap-3 mt-5">
                  {ENROLL_STEPS.map((_, i) => (
                    <div key={i} className={`rounded-full transition-all duration-300 ${
                      i < enrollProgress ? 'w-3 h-3 bg-green-400' :
                      i === enrollStep ? 'w-4 h-4 bg-yellow-400 animate-pulse' :
                      'w-3 h-3 bg-white/20'
                    }`} />
                  ))}
                </div>
                <button
                  onClick={() => { enrollCancelledRef.current = true; setEnrolling(false); }}
                  className="mt-6 text-white/40 hover:text-white/80 text-xs transition px-4 py-1"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Success overlay */}
            {enrollSuccess && (
              <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white text-xl font-bold">Face Enrolled!</p>
                  <p className="text-white/80 text-sm mt-1">{students.find(s => s.id === parseInt(selectedStudent))?.first_name} {students.find(s => s.id === parseInt(selectedStudent))?.last_name}</p>
                  <p className="text-white/60 text-xs mt-1">3 poses captured &amp; averaged</p>
                </div>
              </div>
            )}

            {/* Fail overlay */}
            {enrollFailMsg && (
              <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center z-20">
                <div className="text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-white text-lg font-bold">Enrollment Failed</p>
                  <p className="text-white/80 text-sm mt-2 max-w-xs">{enrollFailMsg}</p>
                  <button
                    onClick={() => { setEnrollFailMsg(null); startEnrollment(); }}
                    className="mt-4 bg-white text-red-700 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar during enrollment */}
          {enrolling && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Step {enrollStep + 1} of 3</span>
                <span className="text-xs text-gray-400">{enrollProgress}/3 captured</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(enrollProgress / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* How-to instructions */}
          {!enrolling && !enrollSuccess && !enrollFailMsg && (
            <div className="p-4 bg-green-50 rounded-lg border border-forest-100 mb-4">
              <h4 className="text-sm font-semibold text-forest-700 mb-2">How to Enroll</h4>
              <ol className="text-xs text-green-700 space-y-1 list-decimal list-inside">
                <li>Search and select a student above</li>
                <li>Click <strong>"Start Face Enrollment"</strong></li>
                <li>Follow the on-screen instructions: look straight, turn right, turn left</li>
                <li>Each step captures a face sample from a different angle</li>
                <li>Face data is automatically saved once all 3 poses are captured</li>
              </ol>
            </div>
          )}

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
            {cameraActive && !enrolling && !enrollSuccess && (
              <button onClick={stopCamera} className="px-4 py-2.5 bg-gray-500 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition">
                Stop Camera
              </button>
            )}
            <button
              onClick={startEnrollment}
              disabled={saving || enrolling || !selectedStudent || !modelsReady || enrollSuccess}
              className="flex-1 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {saving ? 'Saving...' : enrolling ? 'Enrolling (3 poses)...' : 'Start Face Enrollment'}
            </button>
          </div>
        </div>

        {/* Enrolled students list */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-300">
          <h3 className="font-semibold text-gray-900 mb-4">
            Enrolled Students
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({students.filter(s => s.face_data).length})
            </span>
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {students.filter(s => s.face_data).map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-50 transition group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{s.first_name} {s.last_name}</p>
                    <p className="text-xs text-gray-500">{s.student_id} · {s.course}</p>
                    {s.face_enrolled_at && (
                      <p className="text-[10px] text-green-600 mt-0.5">
                        Enrolled {new Date(s.face_enrolled_at).toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(s.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs font-medium transition px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
            {students.filter(s => s.face_data).length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm">No students enrolled yet.</p>
                <p className="text-xs mt-1">Select a student and click Start Face Enrollment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






