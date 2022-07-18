import * as twgl from 'twgl.js';
import BaseEffect from './BaseEffect';
import quadVert from '../../shaders/quad_vert.glsl?raw';
import blurFrag from '../../shaders/blur_frag.glsl?raw';
import SharedResources from '../SharedResources';

export default class BlurEffect extends BaseEffect {
  private program : twgl.ProgramInfo;

  constructor( gl : WebGL2RenderingContext, sharedResources : SharedResources ) {
    super( gl, sharedResources );

    this.params.setMod( 0, 0.5 );
    this.params.setMod( 1, 0.0 );
    this.params.setMod( 2, 0.0 );

    this.program = twgl.createProgramInfo( gl, [quadVert, blurFrag] );
  }

  protected internalResize() {}
  protected internalDraw( texture : WebGLTexture ) {
    const { gl } = this;

    twgl.bindFramebufferInfo( this.gl, this.frameBuffer );
    this.sharedResources.drawQuadWithProgramInfo( this.program, {
      'u_ratio' : gl.canvas.width / gl.canvas.height,
      'u_amount' : this.params.getMod( 0, 0.01, 0.05 ),
      'u_tex' : texture,
    } );
    twgl.bindFramebufferInfo( this.gl, null );
  }
}