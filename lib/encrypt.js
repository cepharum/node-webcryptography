const { InvalidAccessError } = require( "./errors" );
const { normalizeAlgorithm } = require( "./algorithms" );

/**
 * @param {AlgorithmIdentifier} algorithm
 * @param {CryptoKey} key
 * @param {BufferSource} data
 * @return {Promise<any>}
 */
function encrypt( algorithm, key, data ) {
	const dataBuffer = new Uint8Array( data ).slice( 0 ).buffer;
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "encrypt" )
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
			if ( usages[ index ] === "encrypt" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for encrypt algorithm" );
		}
		const cypherText = normalizedAlgorithm.process( key, algorithm, dataBuffer);
		resolve( cypherText );
	} );
}

module.exports = encrypt;
