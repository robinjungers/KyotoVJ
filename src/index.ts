import './index.css'
import * as twgl from 'twgl.js';
import { startDraw } from './utils';
import Controller, { Action } from './lib/Controller';
import TexQuad from './lib/TexQuad';
import ParticleScene from './lib/scenes/ParticleScene';
import ColorMapEffect from './lib/effects/ColorMapEffect';
import EffectSwitcher from './lib/effects/EffectSwitcher';
import MozaicEffect from './lib/effects/MozaicEffect';
import BlurEffect from './lib/effects/BlurEffect';
import SharedResources from './lib/SharedResources';
import TWEEN from '@tweenjs/tween.js';
import { FlowGlitchEffect } from './lib/effects/FlowGlitchEffect';

window.addEventListener( 'DOMContentLoaded', async () => {
  const canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';

  const gl = canvas.getContext( 'webgl2' )!;

  gl.disable( gl.DEPTH_TEST );
  gl.enable( gl.BLEND );
  gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA );
  
  console.debug( gl.getParameter( gl.VERSION ) );

  const sharedResources = new SharedResources( gl );
  const scene = new ParticleScene( gl, sharedResources );

  const effectSwitcher = new EffectSwitcher( [
    new ColorMapEffect( gl, sharedResources ),
    new BlurEffect( gl, sharedResources ),
    new MozaicEffect( gl, sharedResources ),
    new FlowGlitchEffect( gl, sharedResources ),
  ] );

  function onControl( action : Action, targetIndex : number, paramIndex : number, value : number ) {
    console.debug( action, targetIndex, paramIndex, value );

    switch ( action ) {
      case Action.SceneTrigger :
      scene.params.trigger( paramIndex, value );
      break;

      case Action.SceneMod :
      scene.params.setMod( paramIndex, value );
      break;

      case Action.EffectTrigger :
      effectSwitcher.trigger( targetIndex, paramIndex, value );
      break;

      case Action.EffectMod :
      effectSwitcher.setMod( targetIndex, paramIndex, value );
      break;
    }
  }

  const controller = new Controller( onControl );
  controller.requestMIDI().then( () => {
    controller.autoShowGUI();
  } );
  
  const quad = new TexQuad( gl );

  startDraw( ( time : number ) => {
    TWEEN.update( time );

    if ( twgl.resizeCanvasToDisplaySize( canvas, window.devicePixelRatio ) ) {
      scene.resize();
      effectSwitcher.resizeCurrent();
    }

    scene.draw( time );
    effectSwitcher.drawCurrent( scene.outputTexture, time );
    
    quad.draw( effectSwitcher.currentOutputTexture );
  } );
} );
  