import * as twgl from 'twgl.js';
import quadVert from '../shaders/quad_vert.glsl?raw';
import quadFrag from '../shaders/quad_frag.glsl?raw';
import noiseTexSrc from '../images/noise.png?url';
import { createQuadBufferInfo } from '../utils';

class SharedResources {
  private gl : WebGL2RenderingContext;
  private quadProgram : twgl.ProgramInfo;
  private quadBuffer : twgl.BufferInfo;
  public noiseTex : WebGLTexture;

  constructor( gl : WebGL2RenderingContext ) {
    this.gl = gl;
    this.quadProgram = twgl.createProgramInfo( gl, [quadVert, quadFrag] );
    this.quadBuffer = createQuadBufferInfo( gl );
    this.noiseTex = twgl.createTexture( gl, { src : noiseTexSrc } );
  }

  drawQuad() {
    this.gl.useProgram( this.quadProgram.program );
    twgl.drawBufferInfo( this.gl, this.quadBuffer );
    this.gl.useProgram( null );
  }
}

let sharedResources : SharedResources | null = null;

export default function getSharedResources( gl : WebGL2RenderingContext ) : SharedResources {
  if ( !sharedResources ) {
    sharedResources = new SharedResources( gl );
  }

  return sharedResources;
}