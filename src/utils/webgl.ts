/**
 * WebGL availability detection utility.
 * Tests if the current browser environment supports a WebGL context before
 * attempting to initialize Three.js or @react-three/fiber Canvas.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
