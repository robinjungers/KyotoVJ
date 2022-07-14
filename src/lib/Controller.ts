import { lerp } from "../utils";

export enum Action {
  Noop = 'Noop',
  SceneToggle = 'SceneToggle',
  SceneTrigger1 = 'SceneTrigger1',
  SceneTrigger2 = 'SceneTrigger2',
  SceneTrigger3 = 'SceneTrigger3',
  SceneMod1 = 'SceneMod1',
  SceneMod2 = 'SceneMod2',
  SceneMod3 = 'SceneMod3',
  EffectToggle = 'EffectToggle',
  EffectTrigger1 = 'EffectTrigger1',
  EffectTrigger2 = 'EffectTrigger2',
  EffectTrigger3 = 'EffectTrigger3',
  EffectMod1 = 'EffectMod1',
  EffectMod2 = 'EffectMod2',
  EffectMod3 = 'EffectMod3',
};

const NOTE_SCENE_ACTIONS =  [
  Action.SceneToggle,
  Action.SceneTrigger1,
  Action.SceneTrigger2,
  Action.SceneTrigger3,
];
const NOTE_EFFECT_ACTIONS =  [
  Action.EffectToggle,
  Action.EffectTrigger1,
  Action.EffectTrigger2,
  Action.EffectTrigger3,
];
const CONTROL_SCENE_ACTIONS =  [
  Action.Noop,
  Action.SceneMod1,
  Action.SceneMod2,
  Action.SceneMod3,
];
const CONTROL_EFFECT_ACTIONS =  [
  Action.Noop,
  Action.EffectMod1,
  Action.EffectMod2,
  Action.EffectMod3,
];

const MIDI_NOTE_ON = 144;
const MIDI_NOTE_OFF = 128;
const MIDI_CONTROL = 176;
const NUM_POSITIONS = 10;
const NUM_TYPES = NUM_POSITIONS * 4;

function getActionIndex( pitch : number ) : number {
  return Math.floor( ( pitch % NUM_TYPES ) / NUM_POSITIONS )
}

type ActionCallback = ( action : Action, index : number, value : number ) => void;

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
    const index = pitch % NUM_POSITIONS;
    const actionIndex = getActionIndex( pitch );
    const action = ( pitch < NUM_TYPES )
      ? NOTE_SCENE_ACTIONS[actionIndex]
      : NOTE_EFFECT_ACTIONS[actionIndex];

    this.onAction( action, index, velocity );
  }

  private processControl( pitch : number, control : number ) {
    const index = pitch % NUM_POSITIONS;
    const value = lerp( control, 0, 127, 0.0, 1.0 );
    const actionIndex = getActionIndex( pitch );
    const action = ( pitch < NUM_TYPES )
      ? CONTROL_SCENE_ACTIONS[actionIndex]
      : CONTROL_EFFECT_ACTIONS[actionIndex];

    this.onAction( action, index, value );
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