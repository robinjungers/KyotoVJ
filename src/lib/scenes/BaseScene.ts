import * as twgl from 'twgl.js';
import SharedResources from '../SharedResources';
import Params from '../Params';

export default abstract class BaseScene {
  protected gl : WebGL2RenderingContext;
  protected sharedResources : SharedResources;
  protected frameBuffer : twgl.FramebufferInfo;
  public params = new Params();

  constructor(
    gl : WebGL2RenderingContext,
    sharedResources : SharedResources
  ) {
    this.gl = gl;
    this.sharedResources = sharedResources;
    this.frameBuffer = twgl.createFramebufferInfo( gl, [
      { format : gl.RGBA, type : gl.UNSIGNED_BYTE, min : gl.LINEAR, wrap: gl.REPEAT },
    ] );
  }

  get outputTexture() : WebGLTexture {
    return this.frameBuffer.attachments[0];
  }

  protected abstract internalResize() : void;
  protected abstract internalDraw( time : number ) : void;

  resize() {
    twgl.resizeFramebufferInfo( this.gl, this.frameBuffer, this.frameBuffer.attachments );

    this.internalResize();
  }

  draw( time : number ) {
    this.internalDraw( time );
  }
}