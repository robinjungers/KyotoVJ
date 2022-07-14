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

uniform Hole u_holes[10];
uniform float u_radius;
uniform float u_force;
uniform float u_drag;

#define PI 3.14159
#define DT 60.0

void main()
{
  // Initial
	float m = a_position.z;
	vec2  p = a_position.xy;
	vec2  v = a_velocity.xy;
	
	// Circle limits
	p = min( length( p ), u_radius ) * normalize( p );

  // Attractors
	vec2 f = vec2( 0.0 );

  for ( int i = 0; i < 10; i ++ )
	{
		vec2  hole = u_radius * u_holes[i].pos;
		vec2  hole_v = normalize( hole - p );
		float hole_d = distance( hole, p );
		
    f += u_force * m * u_holes[i].mass * hole_v / hole_d;
	}

  // Gravity
	vec2 g = u_force * normalize( p );
	
	// Apply forces
	vec2 a = ( f + g - u_drag * v ) / m;

  // Apply acceleration
	vec2 new_v = v + a * DT;
	vec2 new_p = p + v * DT + 0.5 * a * DT * DT;
	
	// Feedback
	v_position = vec3( new_p, m );
	v_velocity = vec2( new_v );
}