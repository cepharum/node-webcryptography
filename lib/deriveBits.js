const { normalizeAlgorithm } = require( "./algorithms" );
const { InvalidAccessError } = require( "./errors" );

/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { CryptoKey } baseKey
 * @param { number } length //unsigned long
 * @return Promise <ArrayBuffer>
 */
function deriveBits( algorithm, baseKey, length ) {
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm(algorithm, "deriveBits");
	} catch ( e ) {
		return Promise.reject( normalizedAlgorithm )
	}
	return new Promise( ( resolve, reject ) => {
		if ( normalizedAlgorithm.name !== baseKey.algorithm.name ) {
			throw new InvalidAccessError( "algorithm did not match key" );
		}

		let keyOk = false;
		for ( let index = 0, length = key.usages.length, usages = key.usages;
		      index < length; index++ ) {
			if ( usages[ index ] === "deriveBits" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for deriveBits algorithm" );
		}

		//  TODO    reread specification for "associated with the -relevant global object- of this"
		let result = new ArrayBuffer( normalizedAlgorithm.process( baseKey, algorithm, length ) );
		resolve(result)

	} )
}

module.exports = deriveBits;