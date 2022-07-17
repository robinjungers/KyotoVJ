import { lerp } from "../utils";

export enum Action {
  Noop = 'Noop',
  SceneTrigger = 'SceneTrigger',
  SceneMod = 'SceneMod',
  EffectTrigger = 'EffectTrigger',
  EffectMod = 'EffectMod',
};

const MIDI_NOTE_ON = 144;
const MIDI_NOTE_OFF = 128;
const MIDI_CONTROL = 176;
const NUM_POSITIONS = 10;

function getActionIndices( pitch : number ) : [number, number] {
  const targetIndex = Math.floor( pitch / NUM_POSITIONS );
  const paramIndex = pitch % NUM_POSITIONS;

  return [targetIndex, paramIndex];
}

type ActionCallback = ( action : Action, targetIndex : number, paramIndex : number, value : number ) => void;

export default class Controller {
  private access : WebMidi.MIDIAccess | null = null;
  private input : WebMidi.MIDIInput | null = null;
  
  constructor(
    private onAction : ActionCallback,
  ) {
  }

  get inputs() {
    if ( this.access ) {
      return Array.from( this.access.inputs.values() );
    }

    return [];
  }
  
  private async selectInputByID( id : string ) {
    if ( !this.access ) {
      throw 'Device not initialized';
    }
    
    const input = this.access.inputs.get( id );
    
    if ( !input ) {
      throw 'Input not available';
    }
    
    if ( this.input ) {
      this.input.onstatechange = () => {};
      this.input.onmidimessage = () => {};
      this.input.close();
    }

    this.input = input;
    this.input.onstatechange = this.onMIDIState.bind( this );
    this.input.onmidimessage = this.onMIDIMessage.bind( this );
    
    await this.input.open();
  }

  private processNote( pitch : number, velocity : number ) {
    const [targetIndex, paramIndex] = getActionIndices( pitch );

    if ( targetIndex === 0 ) {
      this.onAction( Action.SceneTrigger, 0, paramIndex, velocity );
    } else {
      this.onAction( Action.EffectTrigger, targetIndex - 1, paramIndex, velocity );
    }
  }

  private processControl( pitch : number, control : number ) {
    const [targetIndex, paramIndex] = getActionIndices( pitch );
    const value = lerp( control, 0, 127, 0.0, 1.0 );

    if ( targetIndex === 0 ) {
      this.onAction( Action.SceneMod, 0, paramIndex, value );
    } else {
      this.onAction( Action.EffectMod, targetIndex - 1, paramIndex, value );
    }
  }

  private onMIDIState( _ : WebMidi.MIDIConnectionEvent ) {}
  private onMIDIMessage( event : WebMidi.MIDIMessageEvent ) {
    const [t, a, b] = event.data;

    switch ( t ) {
      case MIDI_NOTE_ON :
      this.processNote( a, b );
      break;

      case MIDI_NOTE_OFF :
      this.processNote( a, 0 );
      break;

      case MIDI_CONTROL :
      this.processControl( a, b );
      break;
    }
  }
  
  async requestMIDI() {
    const access = await navigator.requestMIDIAccess();
    
    this.access = access;
    
    if ( this.inputs.length === 0 ) {
      throw 'No MIDI input available';
    }

    await this.selectInputByID( this.inputs[0].id );
  }
  
  autoShowGUI() {
    let isHidden = true;
    
    const selectElement = document.createElement( 'select' );
    selectElement.style.position = 'fixed';
    selectElement.style.left = '10px';
    selectElement.style.top = '10px';
    selectElement.style.zIndex = '999';
    selectElement.style.display = 'none';
    selectElement.onchange = ( event : Event ) => {
      const id = ( event.target as HTMLSelectElement ).value;

      this.selectInputByID( id );
    };
    
    for ( const input of this.inputs ) {
      const optionElement = document.createElement( 'option' );
      optionElement.value = input.id;
      optionElement.innerText = input.name ?? input.id;

      selectElement.appendChild( optionElement );
    }
    
    document.body.appendChild( selectElement );
    
    window.addEventListener( 'keydown', ( event : KeyboardEvent ) => {
      if ( event.key === 'g' ) {
        isHidden = !isHidden;
        selectElement.style.display = isHidden ? 'none' : 'block';
      }
    } );
  }
}