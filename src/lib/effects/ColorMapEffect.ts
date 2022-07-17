import * as twgl from 'twgl.js';
import BaseEffect from './BaseEffect';
import quadVert from '../../shaders/quad_vert.glsl?raw';
import colorMapFrag from '../../shaders/color_map_frag.glsl?raw';
import SharedResources from '../SharedResources';

function getLowHigh( index : number ) : [number, number] {
  switch ( index ) {
    case 0 : return [0.1, 0.9];
    case 1 : return [0.2, 0.8];
    case 2 : return [0.1, 0.8];
    case 3 : return [0.3, 0.9];
    case 4 : return [0.8, 0.2];
    case 5 : return [0.7, 0.1];
  }

  return [0.0, 1.0];
}

export default class ColorMapEffect extends BaseEffect {
  private program : twgl.ProgramInfo;
  private mapLow = getLowHigh( 0 )[0];
  private mapHigh = getLowHigh( 0 )[1];
  private split = false;

  constructor( gl : WebGL2RenderingContext, sharedResources : SharedResources ) {
    super( gl, sharedResources );

    this.program = twgl.createProgramInfo( gl, [quadVert, colorMapFrag] );
    this.params.on( 'trigger', ( index : number, value : number ) => {
      switch ( index ) {
        case 0 : return this.trigger0( value );
        case 1 : return this.trigger1( value );
      }
    } );
  }

  private trigger0( value : number ) {
    const colors = getLowHigh( value );

    this.mapLow = colors[0];
    this.mapHigh = colors[1];
  }

  private trigger1( value : number ) {
    this.split = value > 0;
  }

  protected internalResize() {}
  protected internalDraw( texture : WebGLTexture ) {
    const { gl } = this;

    twgl.bindFramebufferInfo( gl, this.frameBuffer );
    this.sharedResources.drawQuadWithProgramInfo( this.program, {
      'u_tex' : texture,
      'u_low' : this.mapLow,
      'u_high' : this.mapHigh,
      'u_split' : this.split
    } );
    twgl.bindFramebufferInfo( gl, null );
  }
}