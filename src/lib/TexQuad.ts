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

  draw( texture : WebGLTexture ) {
    this.gl.useProgram( this.program.program )
    twgl.setUniforms( this.program, {
      'u_tex' : texture,
    } );
    twgl.drawBufferInfo( this.gl, this.quad, this.gl.TRIANGLES );
    this.gl.useProgram( null );
  }
}