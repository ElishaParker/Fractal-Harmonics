uniform float iTime;
uniform float iAudio;
varying vec3 vNormal;

void main() {
  float ripple = sin((position.y * 8.0) + (iTime * 5.0)) * 0.05;
  float wave = sin((position.x * 6.0) + (iTime * 3.0)) * 0.03;
  float pulse = iAudio * 0.4;
  vec3 displaced = position + normal * (ripple + wave + pulse);
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
