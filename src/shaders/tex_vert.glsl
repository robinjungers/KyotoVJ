#version 300 es
precision mediump float;

uniform vec2 u_position;
uniform vec2 u_scale;

in vec2 a_position;
in vec2 a_texcoord;

out vec2 v_uv;

void main()
{
  v_uv = a_texcoord;

  vec2 pos = a_position * u_scale + u_position;

  gl_Position = vec4( pos, 0.0, 1.0 );
}