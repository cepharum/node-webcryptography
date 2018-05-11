const { InvalidAccessError, NotSupportedError } = require( "./errors" );
const { normalizeAlgorithm } = require( "./algorithms" );

/**
 * @param {AlgorithmIdentifier} algorithm
 * @param {CryptoKey} key
 * @param {BufferSource} data
 * @return Promise <any>
 */
function decrypt( algorithm, key, data ) {
	const dataBuffer = new Uint8Array( data ).slice( 0 ).buffer;
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "decrypt" )
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
			if ( usages[ index ] === "decrypt" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for decrypt algorithm" );
		}

		const plainText = normalizedAlgorithm.process(algorithm, key, dataBuffer);
		resolve( plainText );
	} );
}

module.exports = decrypt;
