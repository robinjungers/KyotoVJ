#version 300 es
precision highp float;

uniform vec4 u_color;
uniform float u_ratio;
uniform float u_grid;

in vec2 v_uv;

out vec4 f_color;

#define LINE_WEIGHT 0.002

void main()
{
  vec2 d = mod( v_uv * vec2( u_ratio, 1.0 ), u_grid );
  float line = max(
    d.x > LINE_WEIGHT ? 0.0 : 1.0,
    d.y > LINE_WEIGHT ? 0.0 : 1.0
  );

  f_color = vec4( u_color.rgb - 0.05 * line, u_color.a );
}