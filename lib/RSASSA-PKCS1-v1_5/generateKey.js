const crypto = require( "crypto" );

/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { boolean } extractable
 * @param { KeyUsage[] } keyUsages
 * @return {Promise<any>}
 */
function generateKey( algorithm, extractable, keyUsages ) {
	for ( let index = 0, length = keyUsages.length; index < length; index++ ) {
		if ( keyUsages[ index ] !== "sign" && keyUsages[ index ] !== "verify" ) {
			throw new SyntaxError( "keyUsages should only contain 'sign' or 'verify'" );
		}

	}
}

module.exports = generateKey;

generateKey( {}, {}, [ "sign", "verify" ] );
