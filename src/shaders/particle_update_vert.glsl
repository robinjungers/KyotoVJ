#version 300 es
precision mediump float;

in vec3 a_position;
in vec2 a_velocity;

out vec3 v_position;
out vec2 v_velocity;

struct Hole
{
	vec2 pos;
	float mass;
};

uniform Hole u_holes[20];

#define PI 3.14159
#define DT 60.0
#define RADIUS 1.2
#define ATTRACTOR_STRENGTH 1e-7
#define GRAVITY_STRENGTH 1e-7
#define DRAG_STRENGTH 1e-3

void main()
{
  // Initial
	float m = a_position.z;
	vec2  p = a_position.xy;
	vec2  v = a_velocity.xy;
	
	// Circle limits
	p = min( length( p ), RADIUS ) * normalize( p );

  // Attractors
	vec2 f = vec2( 0.0 );

  for ( int i = 0; i < 10; i ++ )
	{
		vec2  hole = RADIUS * u_holes[i].pos;
		vec2  hole_v = normalize( hole - p );
		float hole_d = distance( hole, p );
		
    f += ATTRACTOR_STRENGTH * m * u_holes[i].mass * hole_v / hole_d;
	}

  // Gravity
	vec2 g = GRAVITY_STRENGTH * normalize( p );
	
	// Apply forces
	vec2 a = ( f + g - DRAG_STRENGTH * v ) / m;

  // Apply acceleration
	vec2 new_v = v + a * DT;
	vec2 new_p = p + v * DT + 0.5 * a * DT * DT;
	
	// Feedback
	v_position = vec3( new_p, m );
	v_velocity = vec2( new_v );
}