#version 300 es
precision highp float;

in vec2 v_uv;

out vec4 f_color;

void main()
{
  f_color = vec4( v_uv, 1.0, 1.0 );
}