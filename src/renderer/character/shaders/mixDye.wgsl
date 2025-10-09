struct GlobalUniforms {
  projectionMatrix:mat3x3<f32>,
  worldTransformMatrix:mat3x3<f32>,
  worldColorAlpha: vec4<f32>,
  uResolution: vec2<f32>,
}

struct LocalUniforms {
  uTransformMatrix:mat3x3<f32>,
  uColor:vec2<f32>,
  uRound:f32,
}

struct MixDyeUniforms {
  uAlpha:f32,
  uSameTexture:f32,
}

@group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
@group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
@group(2) @binding(1) var uTexture1 : texture_2d<f32>;
@group(2) @binding(2) var uSampler1 : sampler;
@group(2) @binding(3) var uTexture2 : texture_2d<f32>;
@group(2) @binding(4) var uSampler2 : sampler;
@group(3) @binding(0) var<uniform> mixDyeUniforms: MixDyeUniforms;


struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) vUV : vec2<f32>
}

@vertex
fn mainVert(
  @location(0) aPosition : vec2<f32>,
  @location(1) aUV: vec2<f32>,
) -> VertexOutput {
  var mvp = globalUniforms.projectionMatrix 
      * globalUniforms.worldTransformMatrix 
      * localUniforms.uTransformMatrix;

  return VertexOutput(
      vec4<f32>(mvp * vec3<f32>(aPosition, 1.0), 1.0),
      aUV
  );
}

const steps: f32 = 15.0;

@fragment
fn mainFrag(input: VertexOutput) -> @location(0) vec4<f32>{
  var outColor: vec4<f32> = textureSample(uTexture1, uSampler1, input.vUV);
  
  if (mixDyeUniforms.uSameTexture == 0.0) {
    let texture2: vec4<f32> = textureSample(uTexture2, uSampler2, input.vUV);
    outColor = floor(mix(outColor, texture2, mixDyeUniforms.uAlpha) * steps + 1e-6) / steps;
  }

  return outColor;
}