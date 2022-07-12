import BaseScene from './BaseScene';

export default class SceneSwitcher {
  private currentScene : BaseScene;

  constructor(
    private scenes : BaseScene[],
  ) {
    this.currentScene = this.scenes[0];
  }

  set mod1( value : number ) { this.currentScene.mod1 = value; }
  set mod2( value : number ) { this.currentScene.mod2 = value; }
  set mod3( value : number ) { this.currentScene.mod3 = value; }

  trigger1() { this.currentScene.trigger1(); }
  trigger2() { this.currentScene.trigger2(); }
  trigger3() { this.currentScene.trigger3(); }

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