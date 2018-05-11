const { normalizeAlgorithm } = require( "./algorithms" );


/**
 * @param { KeyFormat } format
 * @param { BufferSource|JsonWebKey } keyData
 * @param { AlgorithmIdentifier } algorithm
 * @param { boolean } extractable
 * @param { KeyUsage[] }keyUsages
 * @return Promise <CryptoKey>
 */
function importKey( format, keyData, algorithm, extractable, keyUsages ) {
	let key;
	if ( format === "raw" || format === "pkcs8" || format === "spki" ) {
		if ( isJsonWebKey( keyData ) ) {
			throw new TypeError()
		}
		key = new Uint8Array( data ).slice( 0 ).buffer;
	}
	if ( format === "jwk" ) {
		if ( !isJsonWebKey( keyData ) ) {
			throw new TypeError()
		}
	}
	let normalizedAlgorithm;
	try {
		normalizedAlgorithm = normalizeAlgorithm(algorithm, "importKey")
	} catch ( e ) {
		return Promise.reject(normalizedAlgorithm)
	}
	return new Promise( ( resolve, reject ) => {
		let result = normalizedAlgorithm.process( key, algorithm, format, extractable, keyUsages );
		if ( (result.type === "secret" || result.type === "private") && keyUsages.length < 1 ) {
			throw new SyntaxError();
		}
		result.extractable = extractable;
		result.usages = keyUsages;
		resolve( result );
	} );
}

function isJsonWebKey( keyData ) {
	function isArrayOfStrings( array ) {
		let result = true;
		for ( let index = 0, length = array.length; index < length; index++ ) {
			if ( !(typeof array[ index ] === "string") ) {
				result = false;
			}
		}
		return result;
	}

	function isArrayOfRsaOtherPrimesInfo( array ) {
		let result = true;
		for ( let index = 0, length = array.length; index < length; index++ ) {
			let item = array[ index ];
			if ( !(
				typeof item.r === "string"
				&& typeof item.d === "string"
				&& typeof item.t === "string"
			) ) {
				result = false;
			}
		}
		return result;
	}

	return (
		keyData instanceof Object
		&& keyData.kty instanceof String
		&& (keyData.use ? typeof keyData.use === "string" : true)
		&& (keyData.key_ops ? (keyData.key_ops instanceof Array && isArrayOfStrings( keyData.key )) : true)
		&& (keyData.use ? typeof keyData.use === "string" : true)
		&& (keyData.alg ? typeof keyData.alg === "string" : true)
		&& (keyData.kid ? typeof keyData.kid === "string" : true)
		&& (keyData.x5u ? typeof keyData.x5u === "string" : true)
		&& (keyData.x5c ? typeof keyData.x5c === "string" : true)
		&& (keyData.x5t ? typeof keyData.x5t === "string" : true)
		&& (keyData.ext ? typeof keyData.ext === "boolean" : true)
		&& (keyData.crv ? typeof keyData.crv === "string" : true)
		&& (keyData.x ? typeof keyData.x === "string" : true)
		&& (keyData.y ? typeof keyData.y === "string" : true)
		&& (keyData.d ? typeof keyData.d === "string" : true)
		&& (keyData.n ? typeof keyData.n === "string" : true)
		&& (keyData.e ? typeof keyData.e === "string" : true)
		&& (keyData.p ? typeof keyData.p === "string" : true)
		&& (keyData.q ? typeof keyData.q === "string" : true)
		&& (keyData.dp ? typeof keyData.dp === "string" : true)
		&& (keyData.dq ? typeof keyData.dq === "string" : true)
		&& (keyData.qi ? typeof keyData.qi === "string" : true)
		&& (keyData.oth ? keyData.oth instanceof Array && isArrayOfRsaOtherPrimesInfo( keyData.oth ) : true)
		&& (keyData.k ? typeof keyData.k === "string" : true)
	)
}

function importKeyOperation( key, algorithm, format, extractable, keyUsages ) {
	let result = {};
	Object.defineProperties( result, {
		algorithm: {
			value: algorithm,
			writable: false
		},
		format: {
			value: format,
			writable: false
		},
		extractable: {
			value: extractable,
			writable: false
		},
		usages: {
			value: keyUsages,
			writable: false
		},
		_key: {
			value: key,
			enumerable: false
		}
	} );
	return {
		result
	}
}

module.exports = importKey;