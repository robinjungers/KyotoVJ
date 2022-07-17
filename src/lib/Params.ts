import { EventEmitter } from 'events';
import { lerp, times } from '../utils';

const NUM_MODS = 10;

export default class Params extends EventEmitter {
  private mods = times( NUM_MODS, () => 0.0 );

  constructor() {
    super();
  }

  trigger( index : number, value : number ) {
    this.emit( 'trigger', index, value );
  }

  setMod( index : number, value : number ) {
    if ( index < 0 || index >= NUM_MODS ) {
      throw 'Bad index';
    }
    
    this.mods[index] = value;
  }

  getMod(
    index : number,
    lerpMin : number = 0.0,
    lerpMax : number = 1.0,
  ) : number {
    if ( index < 0 || index >= NUM_MODS ) {
      throw 'Bad index';
    }
    
    return lerp( this.mods[index], 0.0, 1.0, lerpMin, lerpMax );
  }
}