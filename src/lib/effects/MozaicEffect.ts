import * as twgl from 'twgl.js';
import BaseEffect from './BaseEffect';
import quadVert from '../../shaders/quad_vert.glsl?raw';
import mozaicFrag from '../../shaders/mozaic_frag.glsl?raw';
import { lerp } from '../../utils';
import SharedResources from '../SharedResources';

export default class MozaicEffect extends BaseEffect {
  private program : twgl.ProgramInfo;

  constructor( gl : WebGL2RenderingContext, sharedResources : SharedResources ) {
    super( gl, sharedResources );

    this.program = twgl.createProgramInfo( gl, [quadVert, mozaicFrag] );
  }

  protected internalResize() {}
  protected internalDraw( texture : WebGLTexture ) {
    const { gl } = this;

    twgl.bindFramebufferInfo( this.gl, this.frameBuffer );
    gl.useProgram( this.program.program );
    twgl.setUniforms( this.program, {
      'u_ratio' : gl.canvas.width / gl.canvas.height,
      'u_noise' : this.sharedResources.noiseTex,
      'u_tex' : texture,
      'u_repeat' : this.params.getMod( 0, 1.0, 20.0 ),
    } );
    this.sharedResources.drawQuad();
    gl.useProgram( null );
    twgl.bindFramebufferInfo( this.gl, null );
  }
}