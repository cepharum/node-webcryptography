const { normalizeAlgorithm } = require( "./algorithms" );
const { InvalidAccessError } = require( "./errors" );

/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { CryptoKey } baseKey
 * @param { AlgorithmIdentifier } derivedKeyType
 * @param { boolean } extractable
 * @param { KeyUsage[] } keyUsages
 * @return Promise <any>
 */
function deriveKey( algorithm, baseKey, derivedKeyType, extractable, keyUsages ) {
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "deriveBits" );
	} catch ( e ) {
		return Promise.reject( normalizedAlgorithm );
	}
	let normalizedDerivedKeyAlgorithmImport;
	try {
		normalizedDerivedKeyAlgorithmImport = normalizeAlgorithm( algorithm, "importKey" )
	} catch ( e ) {
		return Promise.reject( normalizedDerivedKeyAlgorithmImport );
	}
	let normalizedDerivedKeyAlgorithmLength;
	try {
		normalizedDerivedKeyAlgorithmLength = normalizeAlgorithm( algorithm, "get key length" )
	} catch ( e ) {
		return Promise.reject( normalizedDerivedKeyAlgorithmLength );
	}
	return new Promise( ( resolve, reject ) => {
		if ( normalizedAlgorithm.name !== baseKey.algorithm.name ) {
			throw new InvalidAccessError( "algorithm didn't match key" );
		}
		let keyOk = false;
		for ( let index = 0, usages = baseKey.usages, length = usages.length;
		      index < length; index++ ) {
			if ( usages[ index ] === "decrypt" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for decrypt algorithm" );
		}
		const length = normalizedDerivedKeyAlgorithmLength.process( derivedKeyType );
		const secret = normalizedAlgorithm.process( baseKey, algorithm, length );
		const result = normalizedDerivedKeyAlgorithmImport.process( "raw", secret, derivedKeyType, extractable );
		if ( (result.type === "secret" || result.type === "private") && result.usages.length < 1 ) {
			throw new SyntaxError("result of deriveKey not matching")
		}
		resolve( result );
	} )
}

module.exports = deriveKey;