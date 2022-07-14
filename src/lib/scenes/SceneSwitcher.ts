import BaseScene from './BaseScene';

export default class SceneSwitcher {
  private currentScene : BaseScene;

  constructor(
    private scenes : BaseScene[],
  ) {
    this.currentScene = this.scenes[0];
  }

  setMod1( index : number, value : number ) { this.scenes[index].mod1 = value; }
  setMod2( index : number, value : number ) { this.scenes[index].mod2 = value; }
  setMod3( index : number, value : number ) { this.scenes[index].mod3 = value; }

  trigger1( index : number, value : number ) { this.scenes[index].trigger1( value ); }
  trigger2( index : number, value : number ) { this.scenes[index].trigger2( value ); }
  trigger3( index : number, value : number ) { this.scenes[index].trigger3( value ); }

  get currentOutputTexture() : WebGLTexture {
    return this.currentScene.outputTexture;
  }

  selectSceneByIndex( index : number ) {
    if ( index >= this.scenes.length ) {
      console.warn( 'No scene at this index' );
    }

    this.currentScene = this.scenes[index];
  }

  resizeCurrent() {
    this.currentScene.resize();
  }

  drawCurrent( time : number ) {
    this.currentScene.draw( time );
  }
}