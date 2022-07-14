import * as twgl from 'twgl.js';

export default abstract class BaseEffect {
  protected gl : WebGL2RenderingContext;
  protected frameBuffer : twgl.FramebufferInfo;
  public mod1 : number = 0.0;
  public mod2 : number = 0.0;
  public mod3 : number = 0.0;

  constructor(
    gl : WebGL2RenderingContext,
    intialMod1 : number = 0.0,
    intialMod2 : number = 0.0,
    intialMod3 : number = 0.0,
  ) {
    this.gl = gl;
    this.frameBuffer = twgl.createFramebufferInfo( gl, [
      { format : gl.RGBA, type : gl.UNSIGNED_BYTE, min : gl.LINEAR, wrap: gl.CLAMP_TO_EDGE },
    ] );

    this.mod1 = intialMod1;
    this.mod2 = intialMod2;
    this.mod3 = intialMod3;
  }

  get outputTexture() : WebGLTexture {
    return this.frameBuffer.attachments[0];
  }

  public abstract trigger1( value : number ) : void;
  public abstract trigger2( value : number ) : void;
  public abstract trigger3( value : number ) : void;

  protected abstract internalResize() : void;
  protected abstract internalDraw( texture : WebGLTexture, time : number ) : void;

  resize() {
    twgl.resizeFramebufferInfo( this.gl, this.frameBuffer, this.frameBuffer.attachments );

    this.internalResize();
  }

  draw( texture : WebGLTexture, time : number ) {
    twgl.bindFramebufferInfo( this.gl, this.frameBuffer );
    this.internalDraw( texture, time );
    twgl.bindFramebufferInfo( this.gl, null );
  }
}