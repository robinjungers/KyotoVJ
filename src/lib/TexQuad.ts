import * as twgl from 'twgl.js';
import quadVert from '../shaders/quad_vert.glsl?raw'
import texFrag from '../shaders/tex_frag.glsl?raw'
import { createQuadBufferInfo } from '../utils';

export default class TexQuad {
  private gl : WebGL2RenderingContext;
  private quad : twgl.BufferInfo;
  private program : twgl.ProgramInfo;

  constructor( gl : WebGL2RenderingContext ) {
    this.gl = gl;
    this.quad = createQuadBufferInfo( gl )
    this.program = twgl.createProgramInfo( gl, [quadVert, texFrag] );
  
    twgl.setBuffersAndAttributes( gl, this.program, this.quad );
  }

  draw( texture : WebGLTexture, margin : number = 0.0 ) {
    const { gl } = this;

    const ratio = gl.canvas.width / gl.canvas.height;
    const marginX = 1.0 - margin / ratio;
    const marginY = 1.0 - margin;

    gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );
    gl.clearColor( 0.1, 0.1, 0.1, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.useProgram( this.program.program )
    twgl.setUniforms( this.program, {
      'u_position' : [0.0, 0.0],
      'u_scale' : [marginX, marginY],
      'u_tex' : texture,
    } );
    twgl.drawBufferInfo( gl, this.quad, gl.TRIANGLES );
    gl.useProgram( null );
  }
}