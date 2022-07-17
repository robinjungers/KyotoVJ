inlets = 1
outlets = 1

var MIDI_NOTE = 144;
var MIDI_CONTROL = 176;
var NUM_POSITIONS = 10;

function _cmd( midiCode, targetIndex, paramIndex, value ) {
	
	var midiPitch = targetIndex * NUM_POSITIONS + paramIndex;
	var midiVelocity = value;
	
	outlet( 0, midiCode );
	outlet( 0, midiPitch );
	outlet( 0, midiVelocity );
	
}

function scene_trigger( paramIndex, value ) {
	
	_cmd( MIDI_NOTE, 0, paramIndex, value );
	
}

function scene_mod( paramIndex, value ) {
	
	_cmd( MIDI_CONTROL, 0, paramIndex, value );
	
}

function effect_trigger( effectIndex, paramIndex, value ) {
	
	_cmd( MIDI_NOTE, effectIndex + 1, paramIndex, value );
	
}

function effect_mod( effectIndex, paramIndex, value ) {
	
	_cmd( MIDI_CONTROL, effectIndex + 1, paramIndex, value );
	
}