import * as twgl from 'twgl.js';
import { randomFloat, times } from '../../utils';
import SharedResources from "../SharedResources";
import BaseEffect from "./BaseEffect";
import quadVert from '../../shaders/quad_vert.glsl?raw';
import flowFrag from '../../shaders/flow_frag.glsl?raw';
import TexQuad from '../TexQuad';

export class FlowGlitchEffect extends BaseEffect {
  private pastFrameBuffers : twgl.FramebufferInfo[];
  private accumFrameBuffers : twgl.FramebufferInfo[];
  private program : twgl.ProgramInfo;
  private frame : number = 0;
  private texQuad : TexQuad;

  constructor( gl : WebGL2RenderingContext, sharedResources : SharedResources ) {
    super( gl, sharedResources );

    this.program = twgl.createProgramInfo( gl, [quadVert, flowFrag] );
    this.texQuad = new TexQuad( gl );
    this.pastFrameBuffers = times( 2, () => {
      return twgl.createFramebufferInfo( gl, [
        { format : gl.RGBA, type : gl.UNSIGNED_BYTE, min : gl.LINEAR, wrap : gl.REPEAT },
      ] );
    } );
    this.accumFrameBuffers = times( 2, () => {
      return twgl.createFramebufferInfo( gl, [
        { format : gl.RGBA, type : gl.UNSIGNED_BYTE, min : gl.LINEAR, wrap : gl.REPEAT },
      ] );
    } );
  }

  get outputTexture() : WebGLTexture {
    const i = ( this.frame % 2 );

    return this.accumFrameBuffers[i].attachments[0];
  }

  protected internalResize() {
    this.pastFrameBuffers.forEach( pastFrameBuffer => {
      twgl.resizeFramebufferInfo( this.gl, pastFrameBuffer, pastFrameBuffer.attachments );
    } );
    this.accumFrameBuffers.forEach( accumFrameBuffer => {
      twgl.resizeFramebufferInfo( this.gl, accumFrameBuffer, accumFrameBuffer.attachments );
    } );
  }
  protected internalDraw( texture : WebGLTexture ) {
    const i = ( this.frame + 0 ) % 2;
    const j = ( this.frame + 1 ) % 2;

    twgl.bindFramebufferInfo( this.gl, this.pastFrameBuffers[i] );
    this.texQuad.draw( texture );
    twgl.bindFramebufferInfo( this.gl, null );

    twgl.bindFramebufferInfo( this.gl, this.accumFrameBuffers[j] );
    this.sharedResources.drawQuadWithProgramInfo( this.program, {
      'u_tex' : this.pastFrameBuffers[i].attachments[0],
      'u_past' : this.pastFrameBuffers[j].attachments[0],
      'u_accum' : this.accumFrameBuffers[i].attachments[0],
      'u_seed' : randomFloat( 0.0, 1.0 ),
      'u_persistence' : this.params.getMod( 0, 0.0, 1.0 ),
    } );
    twgl.bindFramebufferInfo( this.gl, null );

    ++ this.frame;
  }
}