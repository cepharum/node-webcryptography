let { InvalidAccessError, NotSupportedError } = require( "./errors" );
let Crypto = require( "crypto" );

/**
 *
 * @param {AlgorithmIdentifier} algorithm
 * @param {CryptoKey} key
 * @param {BufferSource} data
 * @return {Promise<any>}
 */
function encrypt( algorithm, key, data ) {
	let dataBuffer = new Uint8Array( data ).slice( 0 ).buffer;
	if ( algorithm instanceof Object ) {
		algorithm = algorithm.name;
	}
	return new Promise( ( resolve, reject ) => {
		let cipher;
		try {
			cipher = Crypto.createCipher( algorithm, "" );
			cipher.setAutoPadding();
		}
		catch ( err ) {
			reject( new NotSupportedError( "can not create cypher", err ) );
		}
		if ( algorithm !== key.algorithm.name ) {
			throw new InvalidAccessError( "algorithm didn't match key" );
		}
		let keyOk = false;
		for ( let index = 0, length = key.usages.length, usages = key.usages; index < length; index++ ) {
			if ( usages[ index ] === "encrypt" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for encryption" );
		}

		let cypherText = Buffer.concat(
			[ cipher.update( String.fromCharCode.apply( null, dataBuffer ) ), cipher.final() ]
		);
		resolve( cypherText );
	} );
}

module.exports = encrypt;
