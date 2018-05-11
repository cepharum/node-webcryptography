const sign = require( "../lib/sign" );
const { TypeMismatchError, QuotaExceededError } = require( "../lib/errors" );
const should = require( "should" );


describe( "sign", () => {
	it( "accept string as alg", () => {
		const cryptoKey = {
			algorithm: {
				name: "SHA256"
			},
			extractable: false,
			type: "string",
			usages: [ "sign" ],
		};
		let data = new ArrayBuffer( 10 );
		return sign( "SHA256", cryptoKey, data )
	} );
	it( "accept Object as alg", () => {
		const cryptoKey = {
			algorithm: {
				name: "SHA256"
			},
			extractable: false,
			type: "string",
			usages: [ "sign" ],
		};

		let str = "encrypt me please!";
		let data = new ArrayBuffer( str.length * 2 ); // 2 bytes for each char
		let bufView = new Uint16Array( data );
		for ( let i = 0, strLen = str.length; i < strLen; i++ ) {
			bufView[ i ] = str.charCodeAt( i );
		}
		return sign( { name: "SHA256" }, cryptoKey, data )
			.then( res => {
				console.log( String.fromCharCode.apply( null, new Uint16Array( data ) ) )
				done();
			} )
	} )
} );
