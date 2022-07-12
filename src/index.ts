import './index.css'
import * as twgl from 'twgl.js';
import { startDraw } from './utils';
import Controller, { Action } from './lib/Controller';
import TexQuad from './lib/TexQuad';
import SceneSwitcher from './lib/scenes/SceneSwitcher';
import Scene1 from './lib/scenes/Scene1';
import Effect1 from './lib/effects/Effect1';
import EffectSwitcher from './lib/effects/EffectSwitcher';

window.addEventListener( 'DOMContentLoaded', async () => {
  const canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';

  const gl = canvas.getContext( 'webgl2' )!;

  gl.disable( gl.DEPTH_TEST );
  gl.enable( gl.BLEND );
  gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA );
  
  console.debug( gl.getParameter( gl.VERSION ) );

  const sceneSwitcher = new SceneSwitcher( [
    new Scene1( gl ),
  ] );

  const effectSwitcher = new EffectSwitcher( [
    new Effect1( gl )
  ] );

  const controller = new Controller(
    ( action : Action, index : number, value : number ) => {
      console.debug( action, index, value );

      switch ( action ) {
        case Action.SceneToggle :
        sceneSwitcher.selectSceneByIndex( index );
        break;
      }
    },
  );

  controller.requestMIDI().then( () => {
    controller.autoShowGUI();
  } );
  
  const quad = new TexQuad( gl );

  startDraw( ( time : number ) => {
    if ( twgl.resizeCanvasToDisplaySize( canvas, window.devicePixelRatio ) ) {
      sceneSwitcher.resizeCurrent();
    }

    sceneSwitcher.drawCurrent( time );
    effectSwitcher.drawCurrent( time, sceneSwitcher.currentOutputTexture );
    
    quad.draw( effectSwitcher.currentOutputTexture );
  } );
} );
  