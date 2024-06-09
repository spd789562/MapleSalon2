in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec3 uHsl;
uniform float uColorStart;
uniform float uColorEnd;


/* code from https://gist.github.com/983/e170a24ae8eba2cd174f */
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// code from: https://github.com/pixijs/filters/blob/main/src/hsl-adjustment/hsladjustment.frag#L18
const vec3 k = vec3(0.57735, 0.57735, 0.57735);

vec3 hueShift(vec3 color, float angle) {
    float cosAngle = cos(angle);
    return vec3(
    color * cosAngle +
      cross(k, color) * sin(angle) +
      k * dot(k, color) * (1.0 - cosAngle)
    );
}

void main() {
    vec4 color = texture(uTexture, vTextureCoord);
    
    vec3 resultRGB = color.rgb;

    float hue = uHsl[0];
    float saturation = uHsl[1];
    float value = uHsl[2];

    vec3 tohsv = rgb2hsv(resultRGB);
    
    float h = tohsv.x;
    float s = tohsv.y;
    float v = tohsv.z;

    // hue
    resultRGB = hueShift(resultRGB, hue);
    tohsv = rgb2hsv(resultRGB);

    bool isTransparent = color.a == 0.;

    if (h >= uColorStart && h <= uColorEnd) {
        // value
        if (value < 0.) {
          // why multuply by lightness tho?
          tohsv.z += v * value * tohsv.y;
        } else if (value > 0.) {
          tohsv.y *= max(.0, .82 - value);
          tohsv.z += value * 0.4 * color.a;
        }
        // saturation
        if (saturation > 0.) {
          tohsv.y += tohsv.y * saturation * 6.;
        } else if (saturation < 0.) {
          tohsv.y += tohsv.y * saturation * 0.8;
          tohsv.z += (saturation * 0.4) * tohsv.y;
        }
        resultRGB = hsv2rgb(tohsv);
    }
  
    finalColor = vec4(resultRGB, color.a);
}