#version 300 es
precision mediump float;

uniform float u_grey;
uniform float u_alpha;

in float v_mass;

out vec4 f_color;

void main()
{
  f_color = vec4( vec3( u_grey ), u_alpha );
}