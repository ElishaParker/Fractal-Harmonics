uniform vec3 iColor;
uniform float iAudio;
varying vec3 vNormal;

void main() {
  vec3 n = normalize(vNormal);
  float diffuse = dot(n, normalize(vec3(0.5,0.5,1.0)));
  float fresnel = pow(1.0 - dot(n, vec3(0.0,0.0,1.0)), 2.0);
  vec3 col = iColor * (0.4 + 0.6 * diffuse + 0.3 * fresnel);
  col += iColor * iAudio * 0.8;
  gl_FragColor = vec4(col, 1.0);
}
