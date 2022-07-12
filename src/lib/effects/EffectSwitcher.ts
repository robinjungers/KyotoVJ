import BaseEffect from './BaseEffect';



export default class EffectSwitcher {
  private currentEffects : BaseEffect[] = [];

  constructor(
    private effects : BaseEffect[],
  ) {
  }

  setMod1( index : number, value : number ) { this.effects[index].mod1 = value; }
  setMod2( index : number, value : number ) { this.effects[index].mod2 = value; }
  setMod3( index : number, value : number ) { this.effects[index].mod3 = value; }

  trigger1( index : number ) { this.effects[index].trigger1(); }
  trigger2( index : number ) { this.effects[index].trigger2(); }
  trigger3( index : number ) { this.effects[index].trigger3(); }

  get currentOutputTexture() : WebGLTexture {
    const i = this.currentEffects.length - 1;

    return this.currentEffects[i].outputTexture;
  }

  toggleSceneAtIndex( index : number, activate : boolean ) {
    const effect = this.effects[index];
    const foundIndex = this.currentEffects.indexOf( effect );

    if ( activate ) {
      if ( foundIndex === -1 ) {
        this.currentEffects.push( effect );
      }
    } else {
      if ( foundIndex !== -1 ) {
        this.currentEffects.splice( foundIndex, 1 );
      }
    }
  }

  resizeCurrent() {
    this.currentEffects.forEach( effect => {
      effect.resize();
    } );
  }

  drawCurrent( time : number ) {
    this.currentEffects.forEach( effect => {
      effect.draw( time );
    } );
  }
}