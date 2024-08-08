in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec3 uHsv;
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

vec2 getSatAndValue(vec3 color) {
    float maxColor = max(color.r, max(color.g, color.b));
    float minColor = min(color.r, min(color.g, color.b));

    if (maxColor < 1e-8) return vec2(0.0, maxColor);

    return vec2((maxColor - minColor) / maxColor, maxColor);
}

void main() {
    vec4 color = texture(uTexture, vTextureCoord);
    
    vec3 resultRGB = color.rgb;

    float hue = uHsv[0];
    float saturation = uHsv[1];
    float value = uHsv[2];

    vec3 tohsv = rgb2hsv(resultRGB);
    
    float h = tohsv.x;
    float s = tohsv.y;
    float v = tohsv.z;

    // vec2 currSat = getSatAndValue(resultRGB);
    // if (h >= uColorStart && h <= uColorEnd) {
    //   float average = (resultRGB.r + resultRGB.g + resultRGB.b) / 3.0;
    //   // brightness
    //   if (value < 0.) {
    //     // in order to make sure the lower saturate will less effect
    //     resultRGB += value * currSat.x * currSat.y;
    //     // rgbSaturation += rgbSaturation * value * rgbValue;
    //   } else if (value > 0.) {
    //     // tohsv.y *= max(.0, .82 - value);
    //     // tohsv.z += value * 0.4 * color.a;
    //     resultRGB *= 1. + value * color.a;
    //     resultRGB += (average - color.rgb) * value;
    //   }
    //   // saturation
    //   average = (resultRGB.r + resultRGB.g + resultRGB.b) / 3.0;
    //   if (saturation > 0.) {
    //     if (currSat.x > 0.1 && currSat.y < 0.80) {
    //       resultRGB += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));
    //     }
    //   } else if (saturation < 0.) {
    //     resultRGB += (average - color.rgb) * (-saturation) * 0.9;
    //     resultRGB = clamp(resultRGB + (saturation * 0.1 * currSat.x), 0., 1.);
    //   }
    // }

    if (h >= uColorStart && h <= uColorEnd) {
        // hue
        resultRGB = hueShift(resultRGB, hue);
        
        tohsv = rgb2hsv(resultRGB);

        // all related of brightness modification will need to multiply with color.a, 
        // prevent alpha channel from being modified and been to bright

        // saturation
        if (saturation > 0.) {
          // weird, but it really works
          if (tohsv.y > 0.1 && v < 0.80) {
            tohsv.y = clamp(tohsv.y + saturation, 0.0, 1.0);
            // it also incress the brightness
            tohsv.z = clamp(tohsv.z + saturation * 0.2 * v * color.a, 0.0, 1.0);
          }
        } else if (saturation < 0.) {
          tohsv.y = clamp(tohsv.y + (tohsv.y * saturation * 0.8), 0.0, 1.0);
          // it also decress the brightness
          tohsv.z = clamp(tohsv.z + (saturation * 0.5 * s) * color.a, 0.0, 1.0);
        }

        // value
        if (value < 0.) {
          // in order to make sure the lower saturate will less effect
          tohsv.z += v * value * s;
        } else if (value > 0.) {
          // * (1. - s) means the higher saturation of original color will less effect
          tohsv.z = clamp(tohsv.z + value * color.a * (1. - s) * 0.6, 0., 1.);
          // also decrease the saturation but not too much
          tohsv.y = tohsv.y * max((1. - value), 0.05);
        }
        resultRGB = hsv2rgb(tohsv);
    }
  
    finalColor = mix(color, vec4(resultRGB, color.a), 1.0);
}