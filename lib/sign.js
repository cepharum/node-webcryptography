const { InvalidAccessError, NotSupportedError } = require( "./errors" );
const {normalizedAlgorithm} = require("./algorithms");

/**
 *
 * @param {AlgorithmIdentifier} algorithm
 * @param {CryptoKey} key
 * @param {BufferSource} data
 * @return {Promise<any>}
 */
function encrypt( algorithm, key, data ) {
	let dataBuffer = new Uint8Array( data ).slice( 0 ).buffer;
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "sign" )
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
			if ( usages[ index ] === "sign" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for signing" );
		}

		const signedText = normalizedAlgorithm.process( algorithm, key, dataBuffer );
		resolve( signedText );
	} );
}

module.exports = encrypt;
