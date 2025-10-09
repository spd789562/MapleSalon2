in vec2 vUV;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uAlpha;
uniform float uSameTexture;

const float steps = 15.0;

void main() {
  vec4 outColor = texture2D(uTexture1, vUV);

  if (uSameTexture == 0.0) {
    // logic from https://github.com/seotbeo/WzComparerR2/blob/91916d092efd2fab2307ddd338f96205abc28fd0/WzComparerR2/AvatarCommon/AvatarCanvas.cs#L2069
    
    // vec4 texture2 = texture2D(uTexture2, vUV);
    // vec4 color1 = floor(texture1 * 255.0 / 16.0) * (1.0 - uAlpha);
    // vec4 color2 = floor(texture2 * 255.0 / 16.0) * uAlpha;
    // texture1 = 
    //   floor(floor(color1 + color2) * 17.0) / 255.0;
    // basically simplified version of the above code to reduce the floor operations
    outColor = floor(mix(outColor, texture2D(uTexture2, vUV), uAlpha) * steps + 1e-6) / steps;
  }

  gl_FragColor = outColor;
}