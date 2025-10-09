in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec3 uHsv;
uniform float uAlpha;
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

    vec3 resultHSV = rgb2hsv(resultRGB);
    
    float originH = resultHSV.x;
    float originS = resultHSV.y;
    float originV = resultHSV.z;

    // vec2 currSat = getSatAndValue(resultRGB);
    // if (h >= uColorStart && h <= uColorEnd) {
    //   float average = (resultRGB.r + resultRGB.g + resultRGB.b) / 3.0;
    //   // brightness
    //   if (value < 0.) {
    //     // in order to make sure the lower saturate will less effect
    //     resultRGB += value * currSat.x * currSat.y;
    //     // rgbSaturation += rgbSaturation * value * rgbValue;
    //   } else if (value > 0.) {
    //     // resultHSV.y *= max(.0, .82 - value);
    //     // resultHSV.z += value * 0.4 * color.a;
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

    // fix the red has weird range, 0-0.11 and 0.9166-1
    float oHToCompared = originH;
    if (oHToCompared > 0.9166) {
      oHToCompared -= 0.9166;
    }

    if (originH >= uColorStart && originH <= uColorEnd && color.rgb != vec3(0.0) && color.rgb != vec3(1.0)) {
        // hue
        resultRGB = hueShift(resultRGB, hue);

        // bound is 1.0 when rgb value is greater than 0.9333, otherwise 0.9333
        vec3 bound = max(
          step(vec3(0.9333), resultRGB), 
          vec3(0.9333)
        );
        
        resultHSV = rgb2hsv(resultRGB);

        // all related of brightness modification will need to multiply with color.a, 
        // prevent alpha channel from being modified and been to bright

        // saturation
        if (saturation > 0.) {
          // weird, but it really works
          if (resultHSV.y > 0.1 && originV < 0.80) {
            resultHSV.y += saturation;
            // it also increase the brightness
            resultHSV.z += saturation * 0.2 * originV * color.a;
          }
        } else if (saturation < 0.) {
          resultHSV.y += (resultHSV.y * saturation * 0.8);
          // it also decrease the brightness
          resultHSV.z += (saturation * 0.5 * originS) * color.a;
        }

        // apply negative brightness
        if (value < 0.) {
          // in order to make sure the lower saturate will less effect
          resultHSV.z += originV * value * originS;
        } else if (value > 0.) {
          // * (1. - s) means the higher saturation of original color will less effect
          resultHSV.z = resultHSV.z + value * color.a * (1. - resultHSV.y) * 0.6;
          // also decrease the saturation but not too much
          resultHSV.y *= max((1. - value), 0.05);
        }
        resultRGB = hsv2rgb(clamp(resultHSV, 0.0, 1.0));

        // wzcr2's positive brightness implementation
        // from https://github.com/seotbeo/WzComparerR2/blob/91916d092efd2fab2307ddd338f96205abc28fd0/WzComparerR2/AvatarCommon/Prism.cs#L265
        // if (value > 0.) {
        //   if (resultHSV.z > 0.9999 || resultHSV.y < 0.0001) {
        //     resultRGB += (1.0 - resultRGB) * value * color.a;
        //   } else {
        //     float amount = (1.0 - resultHSV.z) * resultHSV.y * 0.2 + resultHSV.z;
        //     resultRGB += (amount - resultRGB) * value * color.a;
        //   }
        // }
        resultRGB = clamp(resultRGB, vec3(0.0), bound);
    }
  
    finalColor = vec4(resultRGB, color.a) * uAlpha;
}