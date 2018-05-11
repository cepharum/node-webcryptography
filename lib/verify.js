const { InvalidAccessError } = require( "./errors" );
const { normalizeAlgorithm } = require( "./algorithms" );

/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { CryptoKey }key
 * @param { BufferSource } signature
 * @param { BufferSource } data
 * @return Promise <any>
 */
function verify( algorithm, key, signature, data ) {
	let dataBuffer = new Uint8Array( data ).slice( 0 ).buffer;
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "verify" )
	} catch ( e ) {
		return Promise.reject( normalizedAlgorithm );
	}
	return new Promise( ( resolve, reject ) => {
		if ( normalizedAlgorithm.name !== key.algorithm.name ) {
			throw new InvalidAccessError( "algorithm didn't match key" );
		}
		let keyOk = false;
		for ( let index = 0, length = key.usages.length, usages = key.usages;
		      index < length; index++ ) {
			if ( usages[ index ] === "verify" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for verify algorithm" );
		}

		let result = normalizedAlgorithm.process( key, algorithm, signature, dataBuffer );
		resolve( result );
	} );
}

module.exports = verify;