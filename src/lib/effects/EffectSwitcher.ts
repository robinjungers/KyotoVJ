import BaseEffect from './BaseEffect';

type EffectState = {
  effect : BaseEffect;
  isActive : boolean;
}

export default class EffectSwitcher {
  private effectStates : EffectState[];

  constructor( effects : BaseEffect[] ) {
    this.effectStates = effects.map( effect => {
      return {
        effect,
        isActive : true,
      };
    } );
  }

  setMod( effectIndex : number, paramIndex : number, value : number ) {
    this.effectStates[effectIndex].effect.params.setMod( paramIndex, value );
  }

  trigger( effectIndex : number, paramIndex : number, value : number ) {
    this.effectStates[effectIndex].effect.params.trigger( paramIndex, value );
  }

  get currentOutputTexture() : WebGLTexture {
    let { outputTexture } = this.effectStates[0].effect;

    for ( const effectState of this.effectStates ) {
      if ( effectState.isActive ) {
        outputTexture = effectState.effect.outputTexture;
      }
    }

    return outputTexture;
  }

  toggleSceneAtIndex( index : number, activate : boolean ) {
    this.effectStates[index].isActive = activate;
  }

  resizeCurrent() {
    for ( const effectState of this.effectStates ) {
      effectState.effect.resize();
    }
  }

  drawCurrent( texture : WebGLTexture, time : number ) {
    let parentTexture = texture;

    for ( const effectState of this.effectStates ) {
      if ( effectState.isActive ) {
        effectState.effect.draw( parentTexture, time );

        parentTexture = effectState.effect.outputTexture;
      }
    }
  }
}