import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let modelLoadPromise = null;

/**
 * Load face-api.js models with caching and error handling
 * @returns {Promise<void>}
 */
export async function loadModels() {
  if (modelsLoaded) return;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      modelsLoaded = true;
      console.log('✅ Face recognition models loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load face recognition models:', error);
      modelLoadPromise = null;
      throw new Error('Failed to load face recognition models. Please refresh the page.');
    }
  })();

  return modelLoadPromise;
}

/**
 * Check if models are loaded
 * @returns {boolean}
 */
export function areModelsLoaded() {
  return modelsLoaded;
}

// SsdMobilenetv1: MobileNetV1-based Single Shot MultiBox Detector
// More accurate than TinyFaceDetector, especially at angles, varied lighting, and partial occlusion
// minConfidence 0.35: Lower threshold to catch more faces, quality filtering happens later
export const SSD_OPTIONS = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.35 });

// For faster detection in real-time scenarios (lower accuracy but faster)
export const TINY_FACE_OPTIONS = new faceapi.TinyFaceDetectorOptions({ 
  inputSize: 416, 
  scoreThreshold: 0.5 
});

// Default to SSD for better accuracy (keep TINY_OPTIONS name for backwards compatibility)
export const TINY_OPTIONS = SSD_OPTIONS;

/**
 * Detect a single face in video element
 * @param {HTMLVideoElement} videoEl - Video element
 * @param {Object} options - Detection options (default: SSD_OPTIONS)
 * @returns {Promise<Object|null>} Detection result or null
 */
export async function detectFace(videoEl, options = SSD_OPTIONS) {
  try {
    const detection = await faceapi
      .detectSingleFace(videoEl, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection || null;
  } catch (error) {
    console.error('Face detection error:', error);
    return null;
  }
}

/**
 * Unit-normalize a Float32Array to length 1
 * @param {Float32Array} v - Vector to normalize
 * @returns {Float32Array} Normalized vector
 */
function normalize(v) {
  let norm = 0;
  for (let i = 0; i < v.length; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm);
  if (norm < 1e-9) return v;
  const out = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / norm;
  return out;
}

/**
 * Capture multiple frames and average their descriptors for stability
 * Uses adaptive frame selection to pick the best quality frames
 * @param {HTMLVideoElement} videoEl - Video element
 * @param {number} frames - Number of frames to capture (default: 10)
 * @param {Object} options - Detection options
 * @param {Function} onProgress - Progress callback (frameIndex, totalFrames)
 * @returns {Promise<Float32Array|null>} Averaged and normalized descriptor
 */
export async function captureAveragedDescriptor(videoEl, frames = 10, options = SSD_OPTIONS, onProgress = null) {
  const detections = [];
  const startTime = Date.now();
  const maxAttempts = frames * 2; // Try up to 2x frames to get good quality
  let attempts = 0;
  
  while (detections.length < frames && attempts < maxAttempts) {
    attempts++;
    
    // Yield to browser for smooth UI
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    
    const det = await faceapi
      .detectSingleFace(videoEl, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (det) {
      // Calculate quality score
      const quality = calculateFaceQuality(det);
      
      // Only accept high-quality detections (quality > 0.5)
      if (quality > 0.5) {
        detections.push({
          descriptor: det.descriptor,
          quality: quality,
          detection: det
        });
        
        if (onProgress) onProgress(detections.length, frames);
      }
    }
    
    // Wait between frames for natural variation
    if (detections.length < frames) {
      await new Promise(r => setTimeout(r, 120));
    }
  }
  
  const elapsed = Date.now() - startTime;
  console.log(`📸 Captured ${detections.length}/${frames} high-quality frames in ${elapsed}ms (${attempts} attempts)`);
  
  if (detections.length === 0) return null;
  
  // Sort by quality and use top frames for averaging
  detections.sort((a, b) => b.quality - a.quality);
  const topDetections = detections.slice(0, Math.min(frames, detections.length));
  
  // Weighted average based on quality scores
  const avg = new Float32Array(128);
  let totalWeight = 0;
  
  for (const det of topDetections) {
    const weight = det.quality;
    totalWeight += weight;
    for (let i = 0; i < 128; i++) {
      avg[i] += det.descriptor[i] * weight;
    }
  }
  
  // Normalize by total weight
  for (let i = 0; i < 128; i++) {
    avg[i] /= totalWeight;
  }
  
  console.log(`✨ Used top ${topDetections.length} frames with avg quality ${(topDetections.reduce((sum, d) => sum + d.quality, 0) / topDetections.length).toFixed(2)}`);
  
  return normalize(avg);
}

/**
 * Estimate head yaw (rotation) from face landmarks
 * @param {Object} landmarks - Face landmarks
 * @returns {number} Yaw angle (-1 to 1, negative = right, positive = left, 0 = straight)
 */
export function estimateYaw(landmarks) {
  const pts = landmarks.positions;
  const faceW = pts[16].x - pts[0].x;
  if (faceW < 1) return 0;
  const center = (pts[0].x + pts[16].x) / 2;
  return (pts[30].x - center) / (faceW / 2);
}

/**
 * Estimate head pitch (up/down tilt) from face landmarks
 * @param {Object} landmarks - Face landmarks
 * @returns {number} Pitch angle (-1 to 1, negative = down, positive = up, 0 = straight)
 */
export function estimatePitch(landmarks) {
  const pts = landmarks.positions;
  const eyeY = (pts[36].y + pts[45].y) / 2;
  const noseY = pts[30].y;
  const chinY = pts[8].y;
  const faceH = chinY - eyeY;
  if (faceH < 1) return 0;
  return (noseY - eyeY) / faceH - 0.5;
}

/**
 * Calculate face quality score (0-1)
 * Higher score = better quality for recognition
 * @param {Object} detection - Face detection result
 * @returns {number} Quality score (0-1)
 */
export function calculateFaceQuality(detection) {
  if (!detection) return 0;
  
  let score = 0;
  
  // Detection confidence (0-1)
  const confidence = detection.detection.score;
  score += confidence * 0.4;
  
  // Face size (larger is better, up to 0.3)
  const box = detection.detection.box;
  const faceArea = box.width * box.height;
  const frameArea = 640 * 480; // Typical video size
  const sizeScore = Math.min(faceArea / (frameArea * 0.15), 1);
  score += sizeScore * 0.3;
  
  // Face angle (frontal is better, up to 0.3)
  const yaw = Math.abs(estimateYaw(detection.landmarks));
  const pitch = Math.abs(estimatePitch(detection.landmarks));
  const angleScore = Math.max(0, 1 - (yaw + pitch) / 2);
  score += angleScore * 0.3;
  
  return Math.min(score, 1);
}

/**
 * Euclidean distance between two vectors
 * @param {Float32Array|Array} a - First vector
 * @param {Float32Array|Array} b - Second vector
 * @returns {number} Distance
 */
export function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

/**
 * Prepare enrolled face descriptors for matching
 * Supports multiple storage formats for backwards compatibility
 * @param {Array} enrolledFaces - Array of face records from API
 * @returns {Array} Prepared faces with normalized descriptors
 */
export function prepareDescriptors(enrolledFaces) {
  const prepared = enrolledFaces.reduce((acc, face) => {
    if (!face.face_data) return acc;
    
    try {
      const parsed = JSON.parse(face.face_data);
      let vecs = [];
      
      if (Array.isArray(parsed)) {
        // Multi-pose format: [[128], [128], [128]]
        if (Array.isArray(parsed[0])) {
          vecs = parsed.map(d => normalize(new Float32Array(d)));
        } else {
          // Single descriptor: [128]
          vecs = [normalize(new Float32Array(parsed))];
        }
      } else if (parsed && parsed.descriptor) {
        // Legacy format: {descriptor: [128], ...}
        vecs = [normalize(new Float32Array(parsed.descriptor))];
      }
      
      if (vecs.length > 0) {
        acc.push({ 
          ...face, 
          _descriptors: vecs,
          _poseCount: vecs.length
        });
      }
    } catch (error) {
      console.warn(`Failed to parse face data for student ${face.student_id}:`, error);
    }
    
    return acc;
  }, []);
  
  console.log(`✅ Prepared ${prepared.length} enrolled faces with ${prepared.reduce((sum, f) => sum + f._poseCount, 0)} total poses`);
  return prepared;
}

/**
 * Find best matching face from enrolled faces
 * Uses advanced multi-pose matching with quality weighting and strict ambiguity detection
 * @param {Float32Array|Array} descriptor - Query descriptor
 * @param {Array} preparedFaces - Prepared enrolled faces
 * @param {number} threshold - Distance threshold (default: 0.50, lower = stricter)
 * @param {number} ambiguityMargin - Margin for ambiguity detection (default: 0.20)
 * @returns {Object|null} Match result with student and distance, or null
 */
export function findBestMatch(descriptor, preparedFaces, threshold = 0.50, ambiguityMargin = 0.20) {
  if (!descriptor || preparedFaces.length === 0) return null;
  
  const query = normalize(
    descriptor instanceof Float32Array ? descriptor : new Float32Array(descriptor)
  );

  const matches = [];

  // Calculate distances to all enrolled faces
  for (const face of preparedFaces) {
    const vecs = face._descriptors;
    if (!vecs || vecs.length === 0) continue;
    
    // Calculate distance to each pose and find minimum
    const distances = vecs.map(stored => euclideanDistance(query, stored));
    const minDist = Math.min(...distances);
    const avgDist = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    
    // Use weighted score: 70% minimum distance, 30% average distance
    // This balances single-pose accuracy with overall consistency
    const score = minDist * 0.7 + avgDist * 0.3;
    
    matches.push({
      face: face,
      distance: score,
      minDistance: minDist,
      avgDistance: avgDist,
      poseCount: vecs.length
    });
  }

  // Sort by distance (lower is better)
  matches.sort((a, b) => a.distance - b.distance);

  const bestMatch = matches[0];
  const secondBest = matches[1];

  // No match found or distance too high
  if (!bestMatch || bestMatch.distance >= threshold) {
    console.log(`❌ No match found (best distance: ${bestMatch?.distance.toFixed(3)}, threshold: ${threshold})`);
    return null;
  }

  // Strict ambiguity check: reject if second-best is too close to best
  // This prevents false positives when multiple people look similar
  if (secondBest) {
    const ambiguityThreshold = bestMatch.distance * (1 + ambiguityMargin);
    if (secondBest.distance < ambiguityThreshold) {
      const margin = ((secondBest.distance - bestMatch.distance) / bestMatch.distance * 100).toFixed(1);
      console.log(`⚠️ Ambiguous match rejected (best: ${bestMatch.distance.toFixed(3)}, second: ${secondBest.distance.toFixed(3)}, margin: ${margin}%)`);
      return null;
    }
  }

  // Calculate confidence score (0-100)
  // Higher confidence = lower distance relative to threshold
  const confidence = Math.max(0, Math.min(100, (1 - bestMatch.distance / threshold) * 100));
  
  // Require minimum confidence of 40% for acceptance
  if (confidence < 40) {
    console.log(`⚠️ Low confidence match rejected (${confidence.toFixed(1)}%)`);
    return null;
  }

  console.log(`✅ Match found: ${bestMatch.face.first_name} ${bestMatch.face.last_name}`);
  console.log(`   Distance: ${bestMatch.distance.toFixed(3)} (min: ${bestMatch.minDistance.toFixed(3)}, avg: ${bestMatch.avgDistance.toFixed(3)})`);
  console.log(`   Confidence: ${confidence.toFixed(1)}% | Poses: ${bestMatch.poseCount}`);

  return { 
    student: bestMatch.face, 
    distance: bestMatch.distance,
    minDistance: bestMatch.minDistance,
    avgDistance: bestMatch.avgDistance,
    confidence: confidence,
    poseCount: bestMatch.poseCount
  };
}

/**
 * Validate video element is ready for face detection
 * @param {HTMLVideoElement} videoEl - Video element
 * @returns {boolean} True if ready
 */
export function isVideoReady(videoEl) {
  return videoEl && 
         videoEl.readyState >= 2 && 
         videoEl.videoWidth > 0 && 
         videoEl.videoHeight > 0;
}

/**
 * Get optimal canvas size for face detection
 * @param {HTMLVideoElement} videoEl - Video element
 * @returns {Object} {width, height}
 */
export function getOptimalCanvasSize(videoEl) {
  const maxWidth = 640;
  const maxHeight = 480;
  
  let width = videoEl.videoWidth;
  let height = videoEl.videoHeight;
  
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Advanced multi-stage face verification
 * Performs multiple captures and cross-validates for maximum accuracy
 * @param {HTMLVideoElement} videoEl - Video element
 * @param {Array} preparedFaces - Prepared enrolled faces
 * @param {Object} options - Verification options
 * @returns {Promise<Object|null>} Verification result or null
 */
export async function verifyFaceMultiStage(videoEl, preparedFaces, options = {}) {
  const {
    stages = 3,              // Number of verification stages
    framesPerStage = 5,      // Frames to capture per stage
    minConsistency = 0.67,   // Minimum consistency (2/3 stages must match same person)
    onProgress = null
  } = options;

  console.log(`🔍 Starting ${stages}-stage verification...`);
  const stageResults = [];

  for (let stage = 0; stage < stages; stage++) {
    if (onProgress) onProgress(stage + 1, stages, 'capturing');

    // Capture averaged descriptor for this stage
    const descriptor = await captureAveragedDescriptor(
      videoEl, 
      framesPerStage, 
      SSD_OPTIONS,
      (frame, total) => {
        if (onProgress) onProgress(stage + 1, stages, 'processing', frame, total);
      }
    );

    if (!descriptor) {
      console.log(`⚠️ Stage ${stage + 1} failed: no face detected`);
      continue;
    }

    // Find best match for this stage
    const match = findBestMatch(descriptor, preparedFaces);
    
    if (match) {
      stageResults.push({
        stage: stage + 1,
        studentId: match.student.id,
        student: match.student,
        distance: match.distance,
        confidence: match.confidence
      });
      console.log(`✅ Stage ${stage + 1}: ${match.student.first_name} ${match.student.last_name} (${match.confidence.toFixed(1)}%)`);
    } else {
      console.log(`❌ Stage ${stage + 1}: no match found`);
    }

    // Small delay between stages
    if (stage < stages - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Analyze results for consistency
  if (stageResults.length === 0) {
    console.log('❌ Verification failed: no matches in any stage');
    return null;
  }

  // Count matches per student
  const studentCounts = {};
  for (const result of stageResults) {
    studentCounts[result.studentId] = (studentCounts[result.studentId] || 0) + 1;
  }

  // Find most common match
  let maxCount = 0;
  let mostCommonStudentId = null;
  for (const [studentId, count] of Object.entries(studentCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonStudentId = parseInt(studentId);
    }
  }

  // Check consistency threshold
  const consistency = maxCount / stages;
  if (consistency < minConsistency) {
    console.log(`⚠️ Verification failed: inconsistent results (${(consistency * 100).toFixed(0)}% < ${(minConsistency * 100).toFixed(0)}%)`);
    return null;
  }

  // Get all results for the most common student
  const matchingResults = stageResults.filter(r => r.studentId === mostCommonStudentId);
  
  // Calculate average confidence and distance
  const avgConfidence = matchingResults.reduce((sum, r) => sum + r.confidence, 0) / matchingResults.length;
  const avgDistance = matchingResults.reduce((sum, r) => sum + r.distance, 0) / matchingResults.length;

  const finalResult = {
    student: matchingResults[0].student,
    confidence: avgConfidence,
    distance: avgDistance,
    consistency: consistency,
    stagesMatched: maxCount,
    totalStages: stages,
    verified: true
  };

  console.log(`✅ Verification successful: ${finalResult.student.first_name} ${finalResult.student.last_name}`);
  console.log(`   Confidence: ${avgConfidence.toFixed(1)}% | Consistency: ${(consistency * 100).toFixed(0)}% (${maxCount}/${stages} stages)`);

  return finalResult;
}

export { faceapi };
