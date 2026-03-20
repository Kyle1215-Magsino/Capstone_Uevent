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

// minConfidence: 0.3 matches reference project
const SSD_OPTIONS = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });

export async function detectFace(videoEl) {
  const detection = await faceapi
    .detectSingleFace(videoEl, SSD_OPTIONS)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection || null;
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
    if (Array.isArray(parsed)) return parsed;         // reference plain-array format
    if (parsed && parsed.descriptor) return parsed.descriptor; // old wrapped format
  } catch {
    // ignore
  }
  return null;
}

// threshold: 0.45 matches reference project
export function findBestMatch(descriptor, enrolledFaces, threshold = 0.45) {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const face of enrolledFaces) {
    try {
      const stored = parseStoredDescriptor(face.face_data);
      if (!stored) continue;
      const dist = euclideanDistance(descriptor, stored);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestMatch = face;
      }
    } catch {
      continue;
    }
  }

  if (bestMatch && bestDistance < threshold) {
    return { student: bestMatch, distance: bestDistance };
  }
  return null;
}

export { faceapi };
