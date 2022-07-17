#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform sampler2D u_noise;
uniform float u_ratio;
uniform float u_repeat;

in vec2 v_uv;

out vec4 f_color;

void main()
{
  vec2 uv = v_uv;

  if ( u_repeat > 1.0 )
  {
    vec2 uvRepeat = u_repeat * vec2( 1.0, 1.0 / u_ratio );
    vec2 uvSeed = floor( v_uv * uvRepeat ) / uvRepeat;
    
    uv += texture( u_noise, uvSeed ).rg;
  }

  f_color = vec4( texture( u_tex, uv ).rgb, 1.0 );
}