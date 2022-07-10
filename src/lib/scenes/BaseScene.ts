import * as twgl from 'twgl.js';

export default abstract class BaseScene {
  protected gl : WebGL2RenderingContext;
  protected frameBuffer : twgl.FramebufferInfo;

  constructor( gl : WebGL2RenderingContext ) {
    this.gl = gl;
    this.frameBuffer = twgl.createFramebufferInfo( gl, [
      { format : gl.RGBA, type : gl.UNSIGNED_BYTE, min : gl.LINEAR, wrap: gl.CLAMP_TO_EDGE },
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
    twgl.bindFramebufferInfo( this.gl, this.frameBuffer );
    this.internalDraw( time );
    twgl.bindFramebufferInfo( this.gl, null );
  }
}