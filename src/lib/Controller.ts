type NoteCallback = ( pitch : number, velocity : number ) => void;

export default class Controller {
  private access : WebMidi.MIDIAccess | null = null;
  private input : WebMidi.MIDIInput | null = null;
  private controls = new Map<number, number>();
  private onNote? : NoteCallback;
  
  constructor( onNote? : NoteCallback ) {
    this.onNote = onNote;
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

  private onMIDIState( _ : WebMidi.MIDIConnectionEvent ) {
  }

  private onMIDIMessage( event : WebMidi.MIDIMessageEvent ) {
    const pitch = event.data[1];
    const velocity = event.data[2];

    this.controls.set( pitch, velocity );

    this.onNote?.( pitch, velocity );
  }

  getControlValue( pitch : number ) : number {
    return this.controls.get( pitch ) ?? 0.0;
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