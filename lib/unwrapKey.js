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
	// Todo
}

module.exports = unwrapKey;