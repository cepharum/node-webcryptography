/**
 * @param {KeyAlgorithm} algorithm
 */
class CryptoKey {
	constructor( { algorithm, extractable, type, usages, algorithm_cached, usages_cached, handle } = {} ) {
		if ( !(typeof algorithm === "object" && algorithm.name) ) {
			throw new Error()
		}
		if ( !(typeof extractable === "boolean") ) {
			throw new Error()
		}
		if ( !(typeof type === "string") ) {
			throw new Error()
		}
		if ( !(usages instanceof Array) ) {
			throw new Error()
		}
		for ( let index = 0, length = usages.length; index < length; index++ ) {
			if ( !(typeof usages[ index ] === "string") ) {
				throw new Error()
			}
		}
		this.algorithm_cached = algorithm_cached;
		this.usages_cached = usages_cached;
		this.handle = handle;

		Object.defineProperties( this, {
			algorithm: {
				value: algorithm,
				writable: false,
			},
			extractable: {
				value: extractable,
				writable: false,
			},
			type: {
				value: type,
				writable: false,
			},
			usages: {
				value: usages,
				writable: false,
			}
		} )
	}
}

module.exports = CryptoKey;