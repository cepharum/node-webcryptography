const CryptoKey = require( "./cryptoKey" );

/**
 * @param {KeyAlgorithm} algorithm
 */
class CryptoKeyPair {
	constructor( { publicKey, privateKey } = {} ) {
		if ( !(privateKey instanceof CryptoKey) ) {
			throw new Error()
		}
		if ( !(publicKey instanceof CryptoKey) ) {
			throw new Error()
		}

		Object.defineProperties( this, {
			publicKey: {
				value: publicKey,
				writable: false,
			},
			privateKey: {
				value: privateKey,
				writable: false,
			}
		} )
	}
}

module.exports = CryptoKeyPair;