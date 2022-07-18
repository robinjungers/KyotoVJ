#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform float u_aberration;
uniform float u_low;
uniform float u_high;
uniform bool u_split;

in vec2 v_uv;

out vec4 f_color;

void main()
{
  float d = u_aberration * distance( v_uv, vec2( 0.5 ) );

  vec3 texColBase = texture( u_tex, v_uv ).rgb;
  texColBase.gb = texture( u_tex, v_uv + d ).gb;

  vec3 texColFinal = ( u_split && v_uv.x > 0.5 )
    ? mix( vec3( u_high ), vec3( u_low ), texColBase * texColBase )
    : mix( vec3( u_low ), vec3( u_high ), texColBase * texColBase );

  f_color = vec4( texColFinal, 1.0 );
}