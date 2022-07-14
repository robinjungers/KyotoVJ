import './index.css'
import * as twgl from 'twgl.js';
import { startDraw } from './utils';
import Controller, { Action } from './lib/Controller';
import TexQuad from './lib/TexQuad';
import SceneSwitcher from './lib/scenes/SceneSwitcher';
import ParticleScene from './lib/scenes/ParticleScene';
import ColorMapEffect from './lib/effects/ColorMapEffect';
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
    new ParticleScene( gl ),
  ] );

  const effectSwitcher = new EffectSwitcher( [
    new ColorMapEffect( gl )
  ] );

  function onControl( action : Action, index : number, value : number ) {
    console.debug( action, index, value );

    switch ( action ) {
      case Action.SceneToggle : return sceneSwitcher.selectSceneByIndex( index );
      case Action.SceneTrigger1 : return sceneSwitcher.trigger1( index, value )
      case Action.SceneTrigger2 : return sceneSwitcher.trigger2( index, value )
      case Action.SceneTrigger3 : return sceneSwitcher.trigger3( index, value )
      case Action.SceneMod1 : return sceneSwitcher.setMod1( index, value )
      case Action.SceneMod2 : return sceneSwitcher.setMod2( index, value )
      case Action.SceneMod3 : return sceneSwitcher.setMod3( index, value )
      case Action.EffectToggle : return effectSwitcher.toggleSceneAtIndex( index, value > 0 );
      case Action.EffectTrigger1 : return effectSwitcher.trigger1( index, value )
      case Action.EffectTrigger2 : return effectSwitcher.trigger2( index, value )
      case Action.EffectTrigger3 : return effectSwitcher.trigger3( index, value )
      case Action.EffectMod1 : return effectSwitcher.setMod1( index, value )
      case Action.EffectMod2 : return effectSwitcher.setMod2( index, value )
      case Action.EffectMod3 : return effectSwitcher.setMod3( index, value )
    }
  }

  const controller = new Controller( onControl );
  controller.requestMIDI().then( () => {
    controller.autoShowGUI();
  } );
  
  const quad = new TexQuad( gl );

  startDraw( ( time : number ) => {
    if ( twgl.resizeCanvasToDisplaySize( canvas, window.devicePixelRatio ) ) {
      sceneSwitcher.resizeCurrent();
      effectSwitcher.resizeCurrent();
    }

    sceneSwitcher.drawCurrent( time );
    effectSwitcher.drawCurrent( sceneSwitcher.currentOutputTexture, time );
    
    quad.draw( effectSwitcher.currentOutputTexture );
  } );
} );
  