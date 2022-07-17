#version 300 es
precision mediump float;

in vec3 a_position;
in vec2 a_velocity;

out float v_mass;

uniform float u_ratio;
uniform float u_weight;
uniform float u_threshold;
uniform float u_gridSize;
uniform float u_gridAlign;

void main()
{
  v_mass = a_position.z;

  vec2 ratio = vec2( u_ratio, 1.0 );

  vec2 posBase = a_position.xy / ratio;
  vec2 posGridSize = u_gridSize * ratio;
  vec2 posGrid = floor( posGridSize * posBase ) / posGridSize;
  vec2 pos = mix( posBase, posGrid, u_gridAlign * normalize( a_velocity ) );

  gl_PointSize = u_weight;
  gl_Position = vec4( pos, 0.0, 1.0 );
}