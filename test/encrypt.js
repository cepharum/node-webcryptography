const encrypt = require( "../lib/encrypt" );
const decrpyt = require( "../lib/decrypt" );
const { TypeMismatchError, QuotaExceededError } = require( "../lib/errors" );
const should = require( "should" );


describe( "encrypt", () => {
	it( "accept string as alg", () => {
		const cryptoKey = {
			algorithm: {
				name: "aes192"
			},
			extractable: false,
			type: "string",
			usages: [ "encrypt" ],
		};
		let data = new ArrayBuffer( 10 );
		encrypt( "aes192", cryptoKey, data )
	} );
	it( "accept Object as alg", () => {
		const cryptoKey = {
			algorithm: {
				name: "aes192"
			},
			extractable: false,
			type: "string",
			usages: [ "encrypt" ],
		};

		let str = "encrypt me please!";
		let data = new ArrayBuffer( str.length * 2 ); // 2 bytes for each char
		let bufView = new Uint16Array( data );
		for ( let i = 0, strLen = str.length; i < strLen; i++ ) {
			bufView[ i ] = str.charCodeAt( i );
		}
		console.log( data );
		return encrypt( { name: "aes192" }, cryptoKey, data ).then( buf => {
			decrpyt( { name: "aes192" }, cryptoKey, buf )
				.then( res => console.log( String.fromCharCode.apply(null, new Uint16Array(data)) ) )
		} )
	} );
} );