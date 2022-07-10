#version 300 es
precision highp float;

uniform sampler2D u_tex;

in vec2 v_uv;

out vec4 f_color;

void main()
{
  f_color = texture( u_tex, v_uv );
}