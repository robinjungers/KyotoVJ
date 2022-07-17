#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform vec2 u_direction;
uniform vec2 u_resolution;

in vec2 v_uv;

out vec4 f_color;

const int samples = 16;
const float sigma = float( samples ) * 0.25;

float gaussian( vec2 i ) 
{
  return exp( -0.5 * dot( i /= sigma, i ) ) / ( 6.28 * sigma * sigma );
}

vec4 blur( sampler2D sp, vec2 U, vec2 scale )
{
  vec4 O = vec4(0);  
  int s = samples;
  
  for ( int i = 0; i < s*s; i++ ) {
      vec2 d = vec2(i%s, i/s) - float(samples)/2.;
      O += gaussian(d) * texture( sp, U + scale * d );
  }
  
  return O;
}

void main()
{
  vec4 bloom = blur( u_tex, v_uv, 10.0 / u_resolution );

  f_color = texture( u_tex, v_uv ) + mix( vec4( 0.0 ), bloom, 1.0 - bloom.r );
}