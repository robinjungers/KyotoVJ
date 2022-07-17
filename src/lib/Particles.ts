import * as twgl from 'twgl.js';

export default class Particles {
  private gl : WebGL2RenderingContext;
  private updateProgram : twgl.ProgramInfo;
  private renderProgram : twgl.ProgramInfo;
  private buffers : twgl.BufferInfo[] = [];
  private vertexArrays : twgl.VertexArrayInfo[] = [];
  private transformFeedbacks : WebGLTransformFeedback[] = [];
  private frame : number = 0;
  private count : number;

  constructor(
    gl : WebGL2RenderingContext,
    updateVert : string,
    updateFrag : string,
    renderVert : string,
    renderFrag : string,
    initialPositions : Float32Array,
    initialVelocities : Float32Array,
    count : number,
  ) {
    this.gl = gl;
    this.count = count;
    this.renderProgram = twgl.createProgramInfo( gl, [renderVert, renderFrag] );
    this.updateProgram = twgl.createProgramInfo( gl, [updateVert, updateFrag], {
      transformFeedbackVaryings : [
        'v_position',
        'v_velocity',
      ],
    } );

    for ( let i = 0; i < 2; ++ i ) {
      this.buffers[i] = twgl.createBufferInfoFromArrays( gl, {
        'a_position' : { numComponents : 3, data : initialPositions },
        'a_velocity' : { numComponents : 2, data : initialVelocities },
      } );
      
      this.transformFeedbacks[i] = twgl.createTransformFeedback( gl, this.updateProgram, this.buffers[i] );
      this.vertexArrays[i] = twgl.createVertexArrayInfo( gl, this.updateProgram, this.buffers[i] );
    }
  }

  get step() : [number, number] {
    const i = ( this.frame + 0 ) % 2;
    const j = ( this.frame + 1 ) % 2;

    return [i, j];
  }

  updateWithUniforms( values : any ) {
    const { gl } = this;
    const [i, j] = this.step;

    gl.enable( gl.RASTERIZER_DISCARD );
    gl.useProgram( this.updateProgram.program );
    twgl.setUniforms( this.updateProgram, values );

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

    ++ this.frame;
  }

  drawWithUniforms( values : any ) {
    const { gl } = this;
    const i = this.step[0];

    gl.useProgram( this.renderProgram.program );
    twgl.setUniforms( this.renderProgram, values );
    gl.bindVertexArray( this.vertexArrays[i].vertexArrayObject! );
    gl.drawArrays( gl.POINTS, 0, this.count );
    gl.bindVertexArray( null );
    gl.useProgram( null );
  }
}