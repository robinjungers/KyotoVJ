#version 300 es
precision mediump float;

in vec2 a_position;
in vec2 a_texcoord;

out vec2 v_uv;

void main()
{
  v_uv = a_texcoord;

  gl_Position = vec4( a_position, 0.0, 1.0 );
}