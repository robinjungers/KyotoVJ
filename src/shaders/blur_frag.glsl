#version 300 es
precision highp float;

uniform sampler2D u_tex;
uniform float u_ratio;
uniform float u_amount;

in vec2 v_uv;

out vec4 f_color;

#define SA 32
#define TWOPI 6.283185
#define MARGIN 0.01

void main()
{
	vec2 uv = MARGIN + ( 1.0 - 2.0 * MARGIN ) * v_uv;
	
	for ( int i = 0; i < SA; i ++ )
	{
		float off_d = distance( uv, vec2( 0.5 ) );
    float off_ra = max( 0.04 * u_amount * log( off_d + 0.98 ), 0.0 );
		float off_th = TWOPI * float( i ) / float( SA );
		vec2  off = off_ra * vec2( cos( off_th ), sin( off_th ) );
		
		f_color += texture( u_tex, uv + off * vec2( 1.0, u_ratio ) ) / float( SA );
	}
}