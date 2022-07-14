inlets = 1
outlets = 1

var MIDI_NOTE = 144;
var MIDI_CONTROL = 176;
var NUM_POSITIONS = 10;
var NUM_TYPES = NUM_POSITIONS * 4;

function _cmd( midiCode, type, param, index, value ) {
	var midiPitch = type * NUM_TYPES + param * NUM_POSITIONS + index;
	var midiVelocity = value;
	
	post( midiPitch );
	
	outlet( 0, midiCode );
	outlet( 0, midiPitch );
	outlet( 0, midiVelocity );
}

function scene_toggle( index, value ) { _cmd( MIDI_NOTE, 0, 0, index, value ); }

function scene_trigger1( index, value ) { _cmd( MIDI_NOTE, 0, 1, index, value ); }
function scene_trigger2( index, value ) { _cmd( MIDI_NOTE, 0, 2, index, value ); }
function scene_trigger3( index, value ) { _cmd( MIDI_NOTE, 0, 3, index, value ); }

function scene_mod1( index, value ) { _cmd( MIDI_CONTROL, 0, 1, index, value ); }
function scene_mod2( index, value ) { _cmd( MIDI_CONTROL, 0, 2, index, value ); }
function scene_mod3( index, value ) { _cmd( MIDI_CONTROL, 0, 3, index, value ); }

function effect_toggle( index, value ) { _cmd( MIDI_NOTE, 1, 0, index, value ); }

function effect_trigger1( index, value ) { _cmd( MIDI_NOTE, 1, 1, index, value ); }
function effect_trigger2( index, value ) { _cmd( MIDI_NOTE, 1, 2, index, value ); }
function effect_trigger3( index, value ) { _cmd( MIDI_NOTE, 1, 3, index, value ); }

function effect_mod1( index, value ) { _cmd( MIDI_CONTROL, 1, 1, index, value ); }
function effect_mod2( index, value ) { _cmd( MIDI_CONTROL, 1, 2, index, value ); }
function effect_mod3( index, value ) { _cmd( MIDI_CONTROL, 1, 3, index, value ); }