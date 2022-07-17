import * as twgl from 'twgl.js';
import Params from '../Params';
import SharedResources from '../SharedResources';

export default abstract class BaseEffect {
  protected gl : WebGL2RenderingContext;
  protected sharedResources : SharedResources;
  protected frameBuffer : twgl.FramebufferInfo;
  public params = new Params();

  constructor(
    gl : WebGL2RenderingContext,
    sharedResources : SharedResources,
  ) {
    this.gl = gl;
    this.sharedResources = sharedResources;
    this.frameBuffer = twgl.createFramebufferInfo( gl, [
      { format : gl.RGBA, type : gl.UNSIGNED_BYTE, min : gl.LINEAR, wrap : gl.REPEAT },
    ] );
  }

  get outputTexture() : WebGLTexture {
    return this.frameBuffer.attachments[0];
  }

  protected abstract internalResize() : void;
  protected abstract internalDraw( texture : WebGLTexture, time : number ) : void;

  resize() {
    twgl.resizeFramebufferInfo( this.gl, this.frameBuffer, this.frameBuffer.attachments );

    this.internalResize();
  }

  draw( texture : WebGLTexture, time : number ) {
    this.internalDraw( texture, time );
  }
}