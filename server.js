const maxApi = require( 'max-api' );
const { WebSocket, WebSocketServer } = require( 'ws' );

const server = new WebSocketServer( { port: 5000 } );

server.on( 'connection', () => {
  console.log( 'New connection' );
} );

function broadcast( data ) {
  server.clients.forEach( ws => {
    if ( ws.readyState === WebSocket.OPEN ) {

    }
  } );
}

maxApi.addHandler( 'scene_', onMessageLoad );