const { InvalidAccessError } = require( "./errors" );
const { normalizeAlgorithm } = require( "./algorithms" );


/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { BufferSource } data
 * @return Promise <any>
 */
function digest( algorithm, data ) {
	const dataBuffer = new Uint8Array( data ).slice( 0 ).buffer;
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "digest" )
	} catch ( e ) {
		return Promise.reject( normalizedAlgorithm );
	}
	return new Promise( ( resolve, reject ) => {
		let result = normalizedAlgorithm.process( algorithm, dataBuffer );
		resolve( result );
	} )
}

module.exports = digest;

