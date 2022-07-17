import * as twgl from 'twgl.js';
import noiseTex from '../images/noise_color.png?url';
import { createQuadBufferInfo } from '../utils';

export default class SharedResources {
  private gl : WebGL2RenderingContext;
  private quadBuffer : twgl.BufferInfo;
  public noiseTex : WebGLTexture;

  constructor( gl : WebGL2RenderingContext ) {
    this.gl = gl;
    this.quadBuffer = createQuadBufferInfo( gl );
    this.noiseTex = twgl.createTexture( gl, {
      src : noiseTex,
      min : gl.LINEAR,
      mag : gl.LINEAR,
      wrap : gl.CLAMP_TO_EDGE,
    } );
  }

  drawQuad() {
    twgl.drawBufferInfo( this.gl, this.quadBuffer );
  }

  drawQuadWithProgramInfo( programInfo : twgl.ProgramInfo, uniforms : any ) {
    this.gl.useProgram( programInfo.program );
    twgl.setUniforms( programInfo, uniforms );
    this.drawQuad();
    this.gl.useProgram( null );
  }

  clearWithColor( r : number, g : number, b : number, a : number ) {
    this.gl.clearColor( r, g, b, a );
    this.gl.clear( this.gl.COLOR_BUFFER_BIT );
  }
}