#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform sampler2D u_past;
uniform sampler2D u_accum;
uniform float u_seed;
uniform float u_persistence;

in vec2 v_uv;

out vec4 f_color;

float rand( vec2 co )
{
	return fract( sin( dot( co, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

vec2 get_flow( sampler2D tex0, sampler2D tex1, vec2 uv )
{
	float lambda = 0.01;
	vec2 off = vec2( 0.1, 0.0 );

	vec4 gradX =
		( texture( tex0, uv + off.xy ) - texture( tex0, uv - off.xy ) ) +
		( texture( tex1, uv + off.xy ) - texture( tex1, uv - off.xy ) );
	vec4 gradY =
		( texture( tex0, uv + off.yx ) - texture( tex0, uv - off.yx ) ) +
		( texture( tex1, uv + off.yx ) - texture( tex1, uv - off.yx ) );
  vec4 gradMag = sqrt( ( gradX * gradX ) + ( gradY * gradY ) + lambda );
  vec4 diff = texture( tex0, uv ) - texture( tex1, uv );
  
  return vec2(
    ( diff * ( gradX / gradMag ) ).x,
		( diff * ( gradY / gradMag ) ).x
  );
}

void main()
{
  float flow = length( get_flow( u_tex, u_past, v_uv ) );
  float randSize = 5.0;
  float randSeed = rand( floor( randSize * v_uv ) / randSize + u_seed );
  float randThresh = mix( 0.0, 10.0 * flow, u_persistence );

  f_color = ( randSeed < randThresh )
    ? texture( u_accum, v_uv )
    : texture( u_tex, v_uv );

  f_color.rgb += u_persistence * 10.0 * flow;
}