#version 300 es
precision highp float;

uniform vec4 u_color;

out vec4 f_color;

void main()
{
  f_color = u_color;
}