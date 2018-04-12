/**
 * @param { AlgorithmIdentifier } algorithm
 * @param { CryptoKey } baseKey
 * @param { AlgorithmIdentifier } derivedKeyType
 * @param { boolean } extractable
 * @param { KeyUsage[] } keyUsages
 * @return Promise <any>
 */
function deriveKey( algorithm, baseKey, derivedKeyType, extractable, keyUsages ) {
	// Todo
}

module.exports = deriveKey;