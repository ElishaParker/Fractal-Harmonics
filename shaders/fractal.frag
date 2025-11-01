#ifdef GL_ES
precision highp float;
#endif

uniform float iTime;
uniform vec3 iResolution;
uniform float iAudio;
varying vec3 vPos;

// simple 3D bulb style color modulation (not full raymarch)
float mandelVal(vec3 p) {
  vec3 z = p;
  float dr = 1.0;
  float r = 0.0;
  float power = 8.0 + iAudio * 4.0;
  for (int i = 0; i < 6; i++) {
    r = length(z);
    if (r > 2.0) break;
    float theta = acos(z.z / r);
    float phi = atan(z.y, z.x);
    dr = pow(r, power - 1.0) * power * dr + 1.0;
    float zr = pow(r, power);
    theta *= power;
    phi *= power;
    z = zr * vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta));
    z += p;
  }
  return r;
}

void main() {
  float r = mandelVal(normalize(vPos) * (1.5 + iAudio * 0.5));
  float hue = fract(0.5 + 0.3 * sin(iTime*0.3) + iAudio*0.6);
  vec3 col = vec3(hue, r*0.4, 1.0 - r*0.2);
  col = pow(col, vec3(0.8));
  gl_FragColor = vec4(col, 1.0);
}
