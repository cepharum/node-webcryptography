let getRandomValues = require( "../lib/getRandomValues" );
let { TypeMismatchError, QuotaExceededError } = require( "../lib/errors" );
let should = require( "should" );

describe( "getRandomValues", function() {
	it( "accepts and returns Int8Array", () => {
		const provided = new Int8Array( 16 );
		const returned = getRandomValues( provided );

		returned.should.be.equal( provided );
	} );
	it( "accepts and returns UInt8Array", () => {
		const provided = new Uint8Array( 16 );
		const returned = getRandomValues( provided );

		returned.should.be.equal( provided );
	} );
	it( "accepts and returns Int16Array", () => {
		const provided = new Int16Array( 16 );
		const returned = getRandomValues( provided );

		returned.should.be.equal( provided );
	} );
	it( "accepts and returns Uint16Array", () => {
		const provided = new Uint16Array( 16 );
		const returned = getRandomValues( provided );

		returned.should.be.equal( provided );
	} );
	it( "accepts and returns Int32Array", () => {
		const provided = new Int32Array( 16 );
		const returned = getRandomValues( provided );

		returned.should.be.equal( provided );
	} );
	it( "accepts and returns Uint32Array", () => {
		const provided = new Uint32Array( 16 );
		const returned = getRandomValues( provided );

		returned.should.be.equal( provided );
	} );
	it( "accepts and returns UInt8ClampedArray", () => {
		if ( typeof UInt8ClampedArray !== "undefined" ) {
			const provided = new UInt8ClampedArray( 16 );
			const returned = getRandomValues( provided );

			returned.should.be.equal( provided );
		}
	} );
	it( "throws TypeMismatchError when given Array is not an instance of ArrayBufferView", () => {
		(() => getRandomValues( new String() )).should.throw( TypeMismatchError );
	} );
	it( "throws QuotaExceededError when given Array has a byteLength > 65536", () => {
		(() => getRandomValues( new Int8Array( 65537 ) )).should.throw( QuotaExceededError );
	} );
	it( "should return an array of different values", () => {
		let provided = new Int8Array( 65536 );
		let returned1 = getRandomValues( provided.slice( 0 ) );
		let returned2 = getRandomValues( provided.slice( 0 ) );

		provided.should.not.be.eql( returned1 );
		provided.should.not.be.eql( returned2 );
		returned1.should.not.be.eql( returned2 );

	} )
} );