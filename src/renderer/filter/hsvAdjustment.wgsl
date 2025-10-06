struct HsvUniforms {
    uHsv:vec3<f32>,
    uAlpha:f32,
    uColorStart:f32,
    uColorEnd:f32,
};

@group(0) @binding(1) var uTexture: texture_2d<f32>; 
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var<uniform> hsvUniforms: HsvUniforms;

@fragment
fn mainFragment(
    @location(0) uv: vec2<f32>,
    @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {
    let color: vec4<f32> = textureSample(uTexture, uSampler, uv);
    var resultRGB: vec3<f32> = color.rgb;

    let hue: f32 = hsvUniforms.uHsv[0];
    let saturation: f32 = hsvUniforms.uHsv[1];
    let value: f32 = hsvUniforms.uHsv[2];

    let uColorStart: f32 = hsvUniforms.uColorStart;
    let uColorEnd: f32 = hsvUniforms.uColorEnd;

    var resultHSV: vec3<f32> = rgb2hsv(resultRGB);

    let origin_h: f32 = resultHSV.x;
    let origin_s: f32 = resultHSV.y;
    let origin_v: f32 = resultHSV.z;

    // fix the red has weird range, 0-0.11 and 0.9166-1
    var oh_to_compared: f32 = origin_h;
    if (oh_to_compared > 0.9166) {
      oh_to_compared -= 0.9166;
    }

    if (
      oh_to_compared >= uColorStart && 
      oh_to_compared <= uColorEnd &&
      any(color.rgb != vec3(0.0)) &&
      any(color.rgb != vec3(1.0))
    ) {
        // hue
        resultRGB = hueShift(resultRGB, hue);

        resultHSV = rgb2hsv(resultRGB);

        // bound is 1.0 when rgb value is greater than 0.9333, otherwise 0.9333
        // bound by pre channel
        let bound = max(
          step(vec3(0.9333), resultRGB),
          vec3(0.9333)
        );

        // all related of brightness modification will need to multiply with color.a, 
        // prevent alpha channel from being modified and been to bright

        // saturation
        if (saturation > 0.0) {
          // weird, but it really works
          if (resultHSV.y > 0.1 && origin_v < 0.80) {
            resultHSV.y += saturation;
            // it also incress the brightness
            resultHSV.z += saturation * 0.2 * origin_v * color.a;
          }
        } else if (saturation < 0.0) {
          resultHSV.y += (resultHSV.y * saturation * 0.8);
          // it also decress the brightness
          resultHSV.z += (saturation * 0.5 * origin_s) * color.a;
        }

        // value
        if (value < 0.0) {
          // in order to make sure the lower saturate will less effect
          resultHSV.z += origin_v * value * origin_s;
        }  else if (value > 0.0) {
          // * (1. - s) means the higher saturation of original color will less effect
          resultHSV.z = resultHSV.z + value * color.a * (1. - origin_s) * 0.6;
          // also decrease the saturation but not too much
          resultHSV.y = resultHSV.y * max((1. - value), 0.05);
        }
        resultRGB = hsv2rgb(saturate(resultHSV));

        // wzcr2's positive brightness implementation
        // from https://github.com/seotbeo/WzComparerR2/blob/91916d092efd2fab2307ddd338f96205abc28fd0/WzComparerR2/AvatarCommon/Prism.cs#L265
        // if (value > 0.0) {
        //   if (resultHSV.z > 0.9999 || resultHSV.y < 0.0001) {
        //     resultRGB += (1.0 - resultRGB) * value * color.a;
        //   } else {
        //     let amount = (1.0 - resultHSV.z) * resultHSV.y * 0.2 + resultHSV.z;
        //     resultRGB += (amount - resultRGB) * value * color.a;
        //   }
        // }

        resultRGB = clamp(resultRGB, vec3(0.0), bound);
    }

    return mix(color, vec4<f32>(resultRGB, color.a), 1) * hsvUniforms.uAlpha;
}

// https://gist.github.com/mairod/a75e7b44f68110e1576d77419d608786?permalink_comment_id=3195243#gistcomment-3195243
const k: vec3<f32> = vec3(0.57735, 0.57735, 0.57735);

fn hueShift(color: vec3<f32>, angle: f32) -> vec3<f32> {
    let cos_angle = cos(angle);
    return vec3<f32>(
        color * cos_angle +
        cross(k, color) * sin(angle) +
        k * dot(k, color) * (1.0 - cos_angle)
    );
}

// code from https://gist.github.com/983/e170a24ae8eba2cd174f
const K: vec4<f32> = vec4<f32>(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);

fn rgb2hsv(c: vec3<f32>) -> vec3<f32> {
    let p = mix(vec4<f32>(c.bg, K.wz), vec4<f32>(c.gb, K.xy), step(c.b, c.g));
    let q = mix(vec4<f32>(p.xyw, c.r), vec4<f32>(c.r, p.yzx), step(p.x, c.r));

    let d: f32 = q.x - min(q.w, q.y);
    let e: f32 = 1.0e-10;
    return vec3<f32>(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

const K1: vec4<f32> = vec4<f32>(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
fn hsv2rgb(color: vec3<f32>) -> vec3<f32> {
    let c = vec3<f32>(color.x, saturate(color.yz));
    let p = abs(fract(c.xxx + K1.xyz) * 6.0 - K1.www);
    return c.z * mix(K1.xxx, saturate(p - K1.xxx), c.y);
}