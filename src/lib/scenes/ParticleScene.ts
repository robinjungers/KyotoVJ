import BaseScene from './BaseScene';
import * as twgl from 'twgl.js';
import updateVert from '../../shaders/particle_update_vert.glsl?raw';
import updateFrag from '../../shaders/particle_update_frag.glsl?raw';
import renderVert from '../../shaders/particle_render_vert.glsl?raw';
import renderFrag from '../../shaders/particle_render_frag.glsl?raw';
import quadVert from '../../shaders/quad_vert.glsl?raw';
import backgroundFrag from '../../shaders/background_frag.glsl?raw';
import { randomFloat, times } from '../../utils';
import Particles from '../Particles';
import SharedResources from '../SharedResources';

function makeInitialData( count : number ) : [Float32Array, Float32Array] {
  const positions = new Float32Array( count * 3 );
  const velocities = new Float32Array( count * 2 );

  for ( let i = 0; i < count; ++ i ) {
    const theta = randomFloat( 0.0, 2.0 * Math.PI );
    const radius = randomFloat( 0.0, 1.0 );

    positions[i * 3 + 0] = radius * Math.cos( theta );
    positions[i * 3 + 1] = radius * Math.sin( theta );
    positions[i * 3 + 2] = randomFloat( 0.0, 1.0 );
    velocities[i * 2 + 0] = 0.0;
    velocities[i * 2 + 1] = 0.0;
  }

  return [positions, velocities];
}

type Hole = {
  pos : [number, number];
  mass : number;
}

function makeHoles( count : number ) : Hole[] {
  return times<Hole>( count, () => {
    const theta = randomFloat( 0.0, 2.0 * Math.PI );
    const radius = randomFloat( 0.5, 1.0 );

    return {
      mass : randomFloat( 0.0, 1.0 ),
      pos : [
        radius * Math.cos( theta ),
        radius * Math.sin( theta ),
      ],
    }
  } );
}

export default class ParticleScene extends BaseScene {
  private particles : Particles;
  private backgroundProgram : twgl.ProgramInfo;
  private holes = makeHoles( 10 );

  constructor( gl : WebGL2RenderingContext, sharedResources : SharedResources ) {
    super( gl, sharedResources );

    const count = 2e6;
    const [
      initialPositions,
      initialVelocities,
    ] = makeInitialData( count );

    this.particles = new Particles(
      gl,
      updateVert,
      updateFrag,
      renderVert,
      renderFrag,
      initialPositions,
      initialVelocities,
      count,
    );

    this.backgroundProgram = twgl.createProgramInfo( gl, [quadVert, backgroundFrag] );

    this.params.setMod( 0, 0.5 );
    this.params.setMod( 1, 0.0 );
    this.params.setMod( 2, 1.0 );
    this.params.on( 'trigger', ( index : number ) => {
      switch ( index ) {
        case 0 : return this.trigger0();
      }
    } );
  }

  private trigger0() {
    this.holes = makeHoles( 10 );
  }

  protected internalResize() {}
  protected internalDraw() {
    const { gl } = this;

    this.particles.updateWithUniforms( {
      'u_holes' : this.holes,
      'u_radius' : this.params.getMod( 0, 0.2, 2.0 ),
      'u_force' : this.params.getMod( 1, 1e-8, 1e-6 ),
      'u_drag' : this.params.getMod( 2, 1e-5, 1e-2 ),
    } );

    twgl.bindFramebufferInfo( gl, this.frameBuffer );
    this.sharedResources.drawQuadWithProgramInfo( this.backgroundProgram, {
      'u_color' : [0.85, 0.85, 0.85, 0.1],
      'u_ratio' : gl.canvas.width / gl.canvas.height,
      'u_grid' : 0.02,
    } );
    this.particles.drawWithUniforms( {
      'u_ratio' : gl.canvas.width / gl.canvas.height,
      'u_weight' : 3.0,
      'u_grey' : 0.2,
      'u_alpha' : 0.05,
      'u_gridSize' : this.params.getMod( 3, 1.0, 10.0 ),
      'u_gridAlign' : this.params.getMod( 4, 0.0, 1.0 ),
    } );
    twgl.bindFramebufferInfo( gl, null );
  }
}