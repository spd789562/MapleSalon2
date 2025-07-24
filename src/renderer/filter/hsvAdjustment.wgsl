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

    var tohsv: vec3<f32> = rgb2hsv(resultRGB);

    let origin_h: f32 = tohsv.x;
    let origin_s: f32 = tohsv.y;
    let origin_v: f32 = tohsv.z;

    // fix the red has weird range, 0-0.11 and 0.915-1
    var oh_to_compared: f32 = origin_h;
    if (oh_to_compared > 0.915) {
      oh_to_compared -= 0.915;
    }

    if (oh_to_compared >= uColorStart && oh_to_compared <= uColorEnd) {
        // hue
        resultRGB = hueShift(resultRGB, hue);

        tohsv = rgb2hsv(resultRGB);
        // all related of brightness modification will need to multiply with color.a, 
        // prevent alpha channel from being modified and been to bright

        // saturation
        if (saturation > 0.0) {
          // weird, but it really works
          if (tohsv.y > 0.1 && origin_v < 0.80) {
            tohsv.y = clamp(tohsv.y + saturation, 0.0, 1.0);
            // it also incress the brightness
            tohsv.z = clamp(tohsv.z + saturation * 0.2 * origin_v * color.a, 0.0, 1.0);
          }
        } else if (saturation < 0.0) {
          tohsv.y = clamp(tohsv.y + (tohsv.y * saturation * 0.8), 0.0, 1.0);
          // it also decress the brightness
          tohsv.z = clamp(tohsv.z + (saturation * 0.5 * origin_s) * color.a, 0.0, 1.0);
        }

        // value
        if (value < 0.0) {
          // in order to make sure the lower saturate will less effect
          tohsv.z += origin_v * value * origin_s;
        } else if (value > 0.0) {
          // * (1. - s) means the higher saturation of original color will less effect
          tohsv.z = clamp(tohsv.z + value * color.a * (1. - origin_s) * 0.6, 0., 1.);
          // also decrease the saturation but not too much
          tohsv.y = tohsv.y * max((1. - value), 0.05);
        }
        resultRGB = hsv2rgb(tohsv);
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
    let c = vec3<f32>(color.x, clamp(color.yz, vec2(0.0), vec2(1.0)));
    let p = abs(fract(c.xxx + K1.xyz) * 6.0 - K1.www);
    return c.z * mix(K1.xxx, clamp(p - K1.xxx, vec3(0.0), vec3(1.0)), c.y);
}