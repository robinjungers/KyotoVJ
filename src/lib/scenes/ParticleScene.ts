import BaseScene from './BaseScene';
import * as twgl from 'twgl.js';
import updateVert from '../../shaders/particle_update_vert.glsl?raw';
import updateFrag from '../../shaders/particle_update_frag.glsl?raw';
import renderVert from '../../shaders/particle_render_vert.glsl?raw';
import renderFrag from '../../shaders/particle_render_frag.glsl?raw';
import { lerp, randomFloat, times } from '../../utils';

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
  private updateProgram : twgl.ProgramInfo;
  private renderProgram : twgl.ProgramInfo;
  private buffers : twgl.BufferInfo[] = [];
  private vertexArrays : twgl.VertexArrayInfo[] = [];
  private transformFeedbacks : WebGLTransformFeedback[] = [];
  private frame : number = 0;
  private count : number = 1e6;
  private holes = makeHoles( 10 );

  constructor( gl : WebGL2RenderingContext ) {
    super( gl, 0.9, 0.0, 0.2 );

    this.renderProgram = twgl.createProgramInfo( gl, [renderVert, renderFrag] );
    this.updateProgram = twgl.createProgramInfo( gl, [updateVert, updateFrag], {
      transformFeedbackVaryings : [
        'v_position',
        'v_velocity',
      ],
    } );
    
    const [positions, velocities] = makeInitialData( this.count );

    for ( let i = 0; i < 2; ++ i ) {
      this.buffers[i] = twgl.createBufferInfoFromArrays( gl, {
        'a_position' : { numComponents : 3, data : positions },
        'a_velocity' : { numComponents : 2, data : velocities },
      } );
      
      this.transformFeedbacks[i] = twgl.createTransformFeedback( gl, this.updateProgram, this.buffers[i] );
      this.vertexArrays[i] = twgl.createVertexArrayInfo( gl, this.updateProgram, this.buffers[i] );
    }
  }

  trigger1() {
    this.holes = makeHoles( 10 );
  }

  trigger2( _ : number ) {}
  trigger3( _ : number ) {}

  protected internalResize() {
    const { gl } = this;

    twgl.bindFramebufferInfo( gl, this.frameBuffer );
    gl.clearColor( 0.85, 0.85, 0.85, 0.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    twgl.bindFramebufferInfo( gl, null );
  }

  protected internalDraw() {
    const { gl } = this;

    const i = ( this.frame + 0 ) % 2;
    const j = ( this.frame + 1 ) % 2;

    gl.enable( gl.RASTERIZER_DISCARD );
    gl.useProgram( this.updateProgram.program );
    twgl.setUniforms( this.updateProgram, {
      'u_holes' : this.holes,
      'u_radius' : lerp( this.mod1, 0.0, 1.0, 0.2, 1.5 ),
      'u_force' : lerp( this.mod2, 0.0, 1.0, 1e-8, 1e-6 ),
      'u_drag' : lerp( this.mod3, 0.0, 1.0, 1e-5, 1e-2 ),
    } );

    gl.bindVertexArray( this.vertexArrays[i].vertexArrayObject! );
    gl.bindTransformFeedback( gl.TRANSFORM_FEEDBACK, this.transformFeedbacks[j] );
    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.buffers[j].attribs!['a_position'].buffer );
    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.buffers[j].attribs!['a_velocity'].buffer );

    gl.beginTransformFeedback( gl.POINTS );
    gl.drawArrays( gl.POINTS, 0, this.count );
    gl.endTransformFeedback();

    gl.bindTransformFeedback( gl.TRANSFORM_FEEDBACK, null );
    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, null );
    gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 1, null );
    gl.bindVertexArray( null );

    gl.useProgram( null );
    gl.disable( gl.RASTERIZER_DISCARD );

    gl.clearColor( 0.85, 0.85, 0.85, 0.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.useProgram( this.renderProgram.program );
    twgl.setUniforms( this.renderProgram, {
      'u_ratio' : gl.canvas.width / gl.canvas.height,
    } );
    gl.bindVertexArray( this.vertexArrays[j].vertexArrayObject! );
    gl.drawArrays( gl.POINTS, 0, this.count );
    gl.bindVertexArray( null );
    gl.useProgram( null );

    ++ this.frame;
  }
}