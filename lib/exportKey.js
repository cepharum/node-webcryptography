const { normalizeAlgorithm } = require( "./algorithms" );
const { InvalidAccessError } = require( "./errors" );

/**
 * @param { KeyFormat } format
 * @param { CryptoKey } key
 * @return Promise <any>
 */
function exportKey( format, key ) {
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( key.algorithm, "exportKey" )
	} catch ( e ) {
		return Promise.reject( normalizedAlgorithm );
	}
	return new Promise( ( resolve, reject ) => {
		if ( !key.extractable ) {
			throw new InvalidAccessError( "key is not extractable" )
		}
		const result = normalizedAlgorithm.process( key, format );
		resolve( result );
	} )
}

module.exports = exportKey;