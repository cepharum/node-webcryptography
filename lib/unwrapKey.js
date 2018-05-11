const { InvalidAccessError, NotSupportedError } = require( "./errors" );
const { normalizeAlgorithm } = require( "./algorithms" );

/**
 * @param { KeyFormat } format
 * @param { BufferSource } wrappedKey
 * @param { CryptoKey } unwrappingKey
 * @param { AlgorithmIdentifier } unwrapAlgorithm
 * @param { AlgorithmIdentifier } unwrappedKeyAlgorithm
 * @param { boolean } extractable
 * @param { KeyUsage[] } keyUsages
 * @return { Promise < CryptoKey > }
 */
function unwrapKey( format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages ) {
	let wrappedKeyBuffer = new Uint8Array( wrappedKey ).slice( 0 ).buffer;
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( unwrapAlgorithm, "unwrapKey" )
	} catch ( e ) {
		try {
			normalizedAlgorithm = normalizeAlgorithm( unwrapAlgorithm, "decrypt" )
		} catch ( e ) {
			return Promise.reject( normalizedAlgorithm );
		}
	}
	let normalizedKeyAlgorithm;
	try {
		normalizedKeyAlgorithm = normalizeAlgorithm( unwrapAlgorithm, "importKey" )
	} catch ( e ) {
		return Promise.reject( normalizedKeyAlgorithm );
	}
	return new Promise( ( resolve, reject ) => {
		if ( normalizedAlgorithm.name !== unwrappingKey.algorithm.name ) {
			throw new InvalidAccessError( "algorithm didn't match key" );
		}

		let keyOk = false;
		for ( let index = 0, length = key.usages.length, usages = key.usages;
		      index < length; index++ ) {
			if ( usages[ index ] === "unwrapKey" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for unwrapKey algorithm" );
		}
		if ( !normalizedAlgorithm ) {
			throw new NotSupportedError( `${unwrapAlgorithm} does not support ${op}` )
		}
		let key = normalizedAlgorithm.process( unwrapAlgorithm, unwrappingKey, wrappedKey );

		let bytes;
		if ( format === "raw" || format === "pkcs8" || format === "spki" ) {
			bytes = key;
		}
		if ( format === "jwk" ) {
			//TODO
			// Let bytes be the result of executing the parse a JWK algorithm, with key as the data to be parsed.

			//  Let data be the sequence of bytes to be parsed.
			//
			// Let json be the Unicode string that results from interpreting data according to UTF-8.
			//
			// Convert json to UTF-16.
			//
			// Let result be the object literal that results from executing the JSON.parse internal function in the context of a new
			// global object, with text argument set to a JavaScript String containing json.
			// Let key be the result of converting result to the IDL dictionary type of JsonWebKey.
			//
			// If the "kty" field of key is not defined, then throw a DataError.
			//
			// Return key.
			let json = JSON.parse( key );
		}
		let result = normalizedKeyAlgorithm( unwrappedKeyAlgorithm, format, usages, extractable, bytes );
		if ( (result.type === "secret" || result.type === "private") && keyUsages.length < 1 ) {
			throw new SyntaxError();
		}
		result.extractable = extractable;
		result.usages = keyUsages;
		resolve( result );
	} )
}

module.exports = unwrapKey;