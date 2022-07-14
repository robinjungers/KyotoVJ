#version 300 es
precision mediump float;

in float v_mass;

out vec4 f_color;

void main()
{
  float grey = mix( 0.0, 0.2, v_mass * v_mass );

  f_color = vec4( vec3( grey ), 0.1 );
}