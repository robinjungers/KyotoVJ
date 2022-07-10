import * as twgl from 'twgl.js';
import texVS from '../shaders/tex_vert.glsl?raw'
import texFS from '../shaders/tex_frag.glsl?raw'

export default class TexQuad {
  private gl : WebGL2RenderingContext;
  private quad : twgl.BufferInfo;
  private program : twgl.ProgramInfo;

  constructor( gl : WebGL2RenderingContext ) {
    this.gl = gl;
    this.quad = twgl.createBufferInfoFromArrays( gl, {
      'a_position' : { numComponents : 2, data : [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0] },
      'a_texcoord' : { numComponents : 2, data : [ 0.0,  1.0, 1.0,  1.0, 1.0, 0.0,  0.0, 0.0] },
      indices : [0, 1, 2, 2, 3, 0],
    } );
    this.program = twgl.createProgramInfo( gl, [texVS, texFS] );
  
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