#version 300 es
precision mediump float;

in vec3 a_position;
in vec2 a_velocity;

out float v_mass;

uniform float u_ratio;

void main()
{
  v_mass = a_position.z;

  gl_PointSize = mix( 1.0, 3.0, v_mass * v_mass );
  gl_Position = vec4( a_position.xy / vec2( u_ratio, 1.0 ), 0.0, 1.0 );
}