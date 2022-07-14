import * as twgl from 'twgl.js';
import { createQuadBufferInfo } from '../../utils';
import BaseEffect from './BaseEffect';
import quadVert from '../../shaders/quad_vert.glsl?raw';
import colorMapFrag from '../../shaders/color_map_frag.glsl?raw';

function getLowHigh( index : number ) : [number, number] {
  switch ( index ) {
    case 0 : return [0.1, 0.9];
    case 1 : return [0.2, 0.8];
    case 2 : return [0.3, 0.6];
    case 3 : return [0.4, 0.1];
    case 4 : return [0.8, 0.3];
    case 5 : return [0.6, 0.2];
  }

  return [0.0, 1.0];
}

export default class Effect1 extends BaseEffect {
  private quad : twgl.BufferInfo;
  private program : twgl.ProgramInfo;
  private mapLow = getLowHigh( 0 )[0];
  private mapHigh = getLowHigh( 0 )[1];

  constructor( gl : WebGL2RenderingContext ) {
    super( gl, 0.2, 0.7, 0.5 );

    this.quad =  createQuadBufferInfo( gl );
    this.program = twgl.createProgramInfo( gl, [quadVert, colorMapFrag] );
  
    twgl.setBuffersAndAttributes( gl, this.program, this.quad );
  }

  trigger1( value : number) {
    const colors = getLowHigh( value );

    this.mapLow = colors[0];
    this.mapHigh = colors[1];
  }

  trigger2( _ : number) {}
  trigger3( _ : number) {}

  protected internalResize() {}
  protected internalDraw( texture : WebGLTexture ) {
    const { gl } = this;

    gl.useProgram( this.program.program );
    twgl.setUniforms( this.program, {
      'u_position' : [0.0, 0.0],
      'u_scale' : [1.0, 1.0],
      'u_tex' : texture,
      'u_low' : this.mapLow,
      'u_high' : this.mapHigh,
    } );
    twgl.drawBufferInfo( gl, this.quad, gl.TRIANGLES );
    gl.useProgram( null );
  }
}