const CryptoKey = require( "./models/cryptoKey" );
const CryptoKeyPair = require( "./models/cryptoKeyPair" );
const { normalizeAlgorithm } = require( "./algorithms" );

/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { boolean } extractable
 * @param { KeyUsage[] } keyUsages
 * @return {Promise<any>}
 */
function generateKey( algorithm, extractable, keyUsages ) {
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm( algorithm, "generateKey" );
	} catch ( err ) {
		return Promise.reject( normalizedAlgorithm );
	}
	return new Promise( ( resolve, reject ) => {
		let result = normalizedAlgorithm.process( algorithm, extractable, keyUsages );
		if ( result instanceof CryptoKey ) {
			if ( (result.type === "secret" || result.type === "private") && result.usages.length < 1 ) {
				throw new SyntaxError( "generated Key not suitable" );
			}
		}
		if ( result instanceof CryptoKeyPair ) {
			if ( result.privateKey.usages.length < 1 ) {
				throw new SyntaxError( "generated privateKey not suitable" );
			}
		}
		resolve( result );
	} )
}

module.exports = generateKey;