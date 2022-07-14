#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform float u_low;
uniform float u_high;

in vec2 v_uv;

out vec4 f_color;

void main()
{
  vec3 texColBase = texture( u_tex, v_uv ).rgb;
  vec3 texColFinal = mix( vec3( u_low ), vec3( u_high ), texColBase * texColBase );

  f_color = vec4( texColFinal, 1.0 );
}