export function lerp( x : number, a : number, b : number, c : number, d : number ) : number {
  return c + ( d - c ) * ( x - a ) / ( b - a );
}

export function randomFloat( min : number, max : number ) : number {
  return lerp( Math.random(), 0.0, 1.0, min, max );
}

export function randomInt( min : number, max : number ) : number {
  return Math.floor( randomFloat( min, max ) );
}

export function autoResize( canvas : HTMLCanvasElement, onResize? : () => void ) : () => void {
  const callback = () => {
    const dpr = window.devicePixelRatio;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = dpr * w;
    canvas.height = dpr * h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    onResize?.();
  };

  window.addEventListener( 'resize', callback );

  callback();

  return () => {
    window.removeEventListener( 'resize', callback );
  };
}

export function startDraw( draw : ( time : number ) => void ) : () => void {
  let frameId = -1.0;

  const callback = ( time : number ) => {
    frameId = window.requestAnimationFrame( callback );

    draw( time );
  };

  frameId = window.requestAnimationFrame( callback );

  return () => {
    window.cancelAnimationFrame( frameId );
  };
}

export function times<T>( length : number, fn : ( i : number ) => T ) : T[] {
  return Array.from( { length }, ( _, i ) => fn( i ) );
}