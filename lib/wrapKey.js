const { normalizeAlgorithm } = require( "./algorithms" );
const { InvalidAccessError, NotSupportedError } = require( "./errors" );
const exportKey = require( "./exportKey" );


/**
 * @param { KeyFormat } format
 * @param { CryptoKey } key
 * @param { CryptoKey } wrappingKey
 * @param { AlgorithmIdentifier } wrapAlgorithm
 */
function wrapKey( format, key, wrappingKey, wrapAlgorithm ) {
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( wrapAlgorithm, "wrapKey" )
	} catch ( e ) {
		try {
			normalizedAlgorithm = normalizeAlgorithm( key.algorithm, "encrypt" )
		} catch ( e ) {
			return Promise.reject( normalizedAlgorithm );
		}
	}
	return new Promise( ( resolve, reject ) => {
		if ( normalizedAlgorithm.name !== wrappingKey.algorithm.name ) {
			throw new InvalidAccessError( "algorithm didn't match key" );
		}

		let keyOk = false;
		for ( let index = 0, length = key.usages.length, usages = key.usages;
		      index < length; index++ ) {
			if ( usages[ index ] === "wrapKey" ) {
				keyOk = true
			}
		}
		if ( !keyOk ) {
			throw new InvalidAccessError( "key isn't suitable for wrapKey algorithm" );
		}

		if ( !key.extractable ) {
			throw new InvalidAccessError( "key is not extractable" )
		}

		let key;
		try {
			key = exportKey( format, key )
		} catch ( e ) {
			throw new NotSupportedError( e )
		}
		let bytes;
		if ( format === "raw" || format === "pksc8" || format === "spki" ) {
			bytes = key;
		}
		if ( format === "jwk" ) {
			//  Convert key to an ECMAScript Object, as specified in [ WebIDL], performing the conversion
			//  in the context of a new global object.
			//
			// 	Let json be the result of representing key as a UTF-16 string conforming to the JSON grammar;
			//  for example, by executing the JSON.stringify algorithm specified in ECMA262 in the context of a new global object.
			//
			// 	Let bytes be the byte sequence the results from converting json, a JavaScript String comprised
			//  of UTF-16 code points, to UTF-8 code points.

			let json = JSON.stringify( key );
			let buf = Buffer.from(json);
			bytes = buf.toString("utf8");
		}
		if ( !normalizedAlgorithm ) {
			throw new NotSupportedError()
		}
		let result = normalizedAlgorithm.process( wrapAlgorithm, wrappingKey, bytes );
		resolve( result );
	} )
}

module.exports = wrapKey;