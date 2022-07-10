import './index.css'
import * as twgl from 'twgl.js';
import { startDraw } from './utils';
import Controller from './lib/Controller';
import Scene1 from './lib/scenes/Scene1';
import TexQuad from './lib/TexQuad';

window.addEventListener( 'DOMContentLoaded', async () => {
  const canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';

  const gl = canvas.getContext( 'webgl2' )!;

  gl.disable( gl.DEPTH_TEST );
  gl.enable( gl.BLEND );
  gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA );
  
  console.debug( gl.getParameter( gl.VERSION ) );

  const controller = new Controller();
  const scene = new Scene1( gl );

  controller.requestMIDI().then( () => {
    controller.autoShowGUI();
  } );
  
  const quad = new TexQuad( gl );

  startDraw( ( time : number ) => {
    if ( twgl.resizeCanvasToDisplaySize( canvas, window.devicePixelRatio ) ) {
      scene.resize();
    }

    scene.draw( time );
    quad.draw( scene.outputTexture );
  } );
} );
  