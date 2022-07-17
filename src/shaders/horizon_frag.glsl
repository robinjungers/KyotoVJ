#version 300 es
precision mediump float;

uniform sampler2D u_noise;
uniform float u_ratio;
uniform float u_rotation;

in vec2 v_uv;

out vec4 f_color;

#define PI 3.14159
#define rotate( p, a ) p = cos( a ) * p + sin( a ) * vec2( p.y, -p.x );

float rand( vec2 co )
{
	return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

float noise( vec3 x )
{
	vec3 p = floor( x );
	vec3 f = fract( x );
	f = f * f * ( 3.0 - 2.0 * f );
	vec2 uv = ( p.xy + vec2( 37.0, 17.0 ) * p.z ) + f.xy;
	vec2 rg = texture( u_noise, ( uv + 0.5 ) / 256.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}

float fbm( vec3 x )
{
	float fbm = 0.0;
	float freq = 0.5;
	float amp = 0.5;
	for ( int i = 0; i < 2; i++ ) {
		freq *= 0.6;
		amp *= 2.0;
		fbm += amp * noise( freq * x );
	}
	return fbm;
}

const float nudge = 0.739513;
const float normalizer = 1.0 / sqrt( 1.0 + nudge * nudge );

float spiralNoise( vec3 p )
{
	float noise = 0.0;
	float freq  = 2.8;
	for ( int i = 0; i < 2; i++ ) {
		noise += abs( cos( p.x * freq ) + sin( p.y * freq ) ) / freq;
		p.xy += vec2( p.y, -p.x ) * nudge;
		p.xy *= normalizer;
		p.xz += vec2( p.z, -p.x ) * nudge;
		p.xz *= normalizer;
		freq *= 1.8;
	}
	return noise;
}

float spiralFbm( vec3 p )
{
	float noise = p.y;
	noise += spiralNoise( p.xyz * 0.721 ) * 0.7;
	noise -= spiralNoise( p.xzy * 0.927 ) * 0.5;
	return noise;
}

float diff( float a, float b )
{
	float phi = mod( abs( b - a ), 2.0 * PI );
	return phi > PI ? ( 2.0 * PI ) - phi : phi;
}

float torus( vec3 p, vec2 t )
{
	vec2 q = vec2( length( p.xz ) - t.x, p.y );
	return length( q ) - t.y;
}

float map( vec3 p )
{
	float d = abs( spiralFbm( 1.0 * p ) * 0.4 );
	d = max( d, torus( p, vec2( 2.2, 0.8 ) ) );
	// d *= 0.6 * fbm( 20.0 * p );
	return d;
}

bool computeIntersection( vec3 pos, vec3 dir, out float near, out float far, float rad2 )
{
	float b = dot( dir, pos );
	float c = dot( pos, pos) - rad2;
	float delta = b * b - c;
	if ( delta < 0.0 )
	return false;
	float deltasqrt = sqrt( delta );
	near = -b - deltasqrt;
	far = -b + deltasqrt;
	return far > 0.0;
}

vec3 computeLightBending( vec3 pos, vec3 dir, float f )
{
	vec3 hVec = vec3( 0.0 ) - pos;
	vec3 hDef = f * normalize( hVec ) / dot( hVec, hVec );
	return normalize( dir + hDef );
}

#define N_ITER 70
#define D_MIN 0.1
void main()
{
  vec2 uvCentered  = ( v_uv - 0.5 ) * vec2( u_ratio, 1.0 );
	vec3 pos = vec3( 0.0, 0.0, -5.0 );
	vec3 dir = normalize( vec3( uvCentered, 1.0 ) );
	vec4 locColor = vec4( 0.0 );
	vec4 totColor = vec4( 0.0 );
	
  float locDens = 0.0;
	float totDens = 0.0;
	float tNear = 0.0;
	float tFar  = 0.0;
	
  if ( computeIntersection( pos, dir, tNear, tFar, 40.0 ) ) {
		float tDepth = tFar - tNear;
		float tStep = tNear * step( 0.0, tNear );
		float t = 0.0;
		for ( int i = 0; i < N_ITER; i++ ) {
			t += tStep;
			if ( totDens > 0.9 || totColor.a > 0.99 || t > tFar ) break;
			pos += tStep * dir;
			vec3 p = pos;
			rotate( p.xz, u_rotation );
			rotate( p.yz, -0.1 );
			rotate( p.xy, -0.2 );
			vec3  lPos = vec3( 0.0, -0.3, 2.5 );
			float lDist = distance( lPos, p );
			float lInt = 0.1;
			totColor +=  lInt * tStep / ( lDist * lDist );
			float d = map( p );
			if ( d < D_MIN ) {
				locDens = tStep * ( D_MIN - d );
				totDens += ( 5.0 - totDens ) * locDens;
				locColor = vec4( 0.5 * totDens );
				locColor.rgb *= mix( 1.0, 0.3, min( lDist, 1.6 ) );
				totColor += locColor * ( 1.0 - totColor.a );
			}
			dir = computeLightBending( pos, dir, 0.5 * tStep );
			d *= 0.8 + 0.2 * rand( v_uv * vec2( i ) );
			tStep =  50.0 * max( 0.1 * d * length( pos ), 0.15 ) / float( N_ITER );
		}
		totColor = clamp( totColor, 0.0, 1.0 );
		totColor.rbg = totColor.rgb * totColor.rgb * ( 3.0 - 2.0 * totColor.rgb );
	}
	totColor.rgb = pow( totColor.rgb, vec3( 1.0 / 2.2 ) );
	
  f_color = totColor;
}
