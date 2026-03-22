import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

// SsdMobilenetv1: MobileNetV1-based Single Shot MultiBox Detector — more accurate
// than TinyFaceDetector especially at angles, varied lighting and partial occlusion.
// minConfidence 0.45: catches faces in dim light without too many false positives.
export const TINY_OPTIONS = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 });

export async function detectFace(videoEl) {
  const detection = await faceapi
    .detectSingleFace(videoEl, TINY_OPTIONS)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection || null;
}

/** Unit-normalize a Float32Array to length 1. */
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
 * Capture `frames` detections from the video, average their descriptors,
 * unit-normalize the result, and return a stable Float32Array.
 * Averaging multiple frames eliminates noise from micro-movements and blinks.
 */
export async function captureAveragedDescriptor(videoEl, frames = 8) {
  const descriptors = [];
  for (let i = 0; i < frames; i++) {
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
    const det = await faceapi
      .detectSingleFace(videoEl, TINY_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (det) descriptors.push(det.descriptor);
    if (i < frames - 1) await new Promise(r => setTimeout(r, 80));
  }
  if (descriptors.length === 0) return null;
  const avg = new Float32Array(128);
  for (const d of descriptors) {
    for (let i = 0; i < 128; i++) avg[i] += d[i];
  }
  for (let i = 0; i < 128; i++) avg[i] /= descriptors.length;
  return normalize(avg);
}

// Estimate head yaw from face landmarks
// negative = turned right, positive = turned left, ~0 = straight
export function estimateYaw(landmarks) {
  const pts = landmarks.positions;
  const faceW = pts[16].x - pts[0].x;
  if (faceW < 1) return 0;
  const center = (pts[0].x + pts[16].x) / 2;
  return (pts[30].x - center) / (faceW / 2);
}

export function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

// Parse stored face_data — handles both:
//   reference format: JSON array [128 numbers]
//   old wrapped format: {descriptor: [...], captureCount: N, enrolledAt: "..."}
function parseStoredDescriptor(faceData) {
  try {
    const parsed = JSON.parse(faceData);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && parsed.descriptor) return parsed.descriptor;
  } catch {
    // ignore
  }
  return null;
}

/**
 * Call once after fetching enrolled faces from the API.
 * Supports two storage formats:
 *   NEW: { descriptors: [[128 nums], ...], enrolledAt } — one per pose (most accurate)
 *   OLD: plain [128 nums] array — single blended average (backwards compat)
 * Each entry gets a `_descriptors` array of unit-normalized Float32Arrays.
 */
export function prepareDescriptors(enrolledFaces) {
  return enrolledFaces.reduce((acc, face) => {
    if (!face.face_data) return acc;
    try {
      const parsed = JSON.parse(face.face_data);
      let vecs = [];
      if (Array.isArray(parsed)) {
        // NEW multi-pose: [[128], [128], [128]]
        if (Array.isArray(parsed[0])) {
          vecs = parsed.map(d => normalize(new Float32Array(d)));
        } else {
          // OLD single descriptor plain array
          vecs = [normalize(new Float32Array(parsed))];
        }
      } else if (parsed && parsed.descriptor) {
        vecs = [normalize(new Float32Array(parsed.descriptor))];
      }
      if (vecs.length > 0) {
        acc.push({ ...face, _descriptors: vecs });
      }
    } catch { /* skip malformed */ }
    return acc;
  }, []);
}

// threshold: 0.42 — tight cutoff to reduce false-positive matches
// ambiguityMargin: reject match if 2nd-best is within 15% of best (prevents confusion
// between similar-looking people)
export function findBestMatch(descriptor, preparedFaces, threshold = 0.42) {
  const query = normalize(
    descriptor instanceof Float32Array ? descriptor : new Float32Array(descriptor)
  );

  let bestDistance = Infinity;
  let bestMatch = null;
  let secondBestDistance = Infinity;

  for (const face of preparedFaces) {
    const vecs = face._descriptors;
    if (!vecs || vecs.length === 0) continue;
    // Distance to this student = minimum across all their stored pose descriptors
    let minDist = Infinity;
    for (const stored of vecs) {
      let sum = 0;
      for (let i = 0; i < 128; i++) {
        const d = query[i] - stored[i];
        sum += d * d;
      }
      const dist = Math.sqrt(sum);
      if (dist < minDist) minDist = dist;
    }
    if (minDist < bestDistance) {
      secondBestDistance = bestDistance;
      bestDistance = minDist;
      bestMatch = face;
    } else if (minDist < secondBestDistance) {
      secondBestDistance = minDist;
    }
  }

  if (!bestMatch || bestDistance >= threshold) return null;

  // Ambiguity check: if 2nd-best is within 15% of best, the match is uncertain
  if (secondBestDistance < bestDistance * 1.15) return null;

  return { student: bestMatch, distance: bestDistance };
}

export { faceapi };
