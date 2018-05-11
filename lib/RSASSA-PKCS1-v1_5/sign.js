const { InvalidAccessError } = require( "../errors" );
const crypto = require( "crypto" );
const asn = require( "asn1.js" );

/**
 * @param {AlgorithmIdentifier} algorithm
 * @param {CryptoKey} key
 * @param {ArrayBuffer} dataBuffer
 * @return {ArrayBuffer}
 */
function sign( algorithm, key, dataBuffer ) {

	if ( key.type === "private" ) {
		throw new InvalidAccessError( "private key can not be used for sign" )
	}
	const { hash } = algorithm;
	const emLen = 64;  // extract modulus from RSA key
	let EM = EMSA_PKCS1_v1_5_ENCODE( dataBuffer, emLen, hash );
	let sign;
	try {
		sign = crypto.createSign("RSA-"+hash.toUpperCase());
	} catch(e){
		throw new Error("sign method not supported: " + e)
	}
	sign.update(EM, "hex");
	return sign.sign(key._handle)
}

/**
 *
 * @param {ArrayBuffer} M message to encode
 * @param {number} emLen intended length in octets of the encoded message, at least
 *                 tLen + 11, where tLen is the octet length of the DER
 *                 encoding T of a certain value computed during the encoding
 *                 operation
 * @param {string} hash hash function (hLen denotes the length in octets of the hash
 *                 function output)
 */
function EMSA_PKCS1_v1_5_ENCODE( M, emLen, hash ) {
	const hashAlgorithm = crypto.createHash( hash );

	const DigestInfo = asn.define( "DigestInfo", function() {
		this.seq().obj(
			this.key( "digestAlgorithm" ).use( AlgorithmIdentifier ),
			this.key( "digest" ).octstr(),
		)
	} );
	const AlgorithmIdentifier = asn.define( "AlgorithmIdentifier", function() {
		this.seq().obj(
			this.key( "algorithm" ).objid(),
			this.key( "parameters" ).null_(),
		)
	} );

	let hashedData;
	try {
		hashAlgorithm.update( M );
		hashedData = hashAlgorithm.digest()
	} catch ( e ) {
		console.error( e );
	}

	let objectIdentifier;
	switch ( hash ) {
		case "md2":
			objectIdentifier = [ 1, 2, 840, 113549, 2, 2 ];
			break;
		case "md5":
			objectIdentifier = [ 1, 2, 840, 113549, 2, 5 ];
			break;
		case "sha1":
			objectIdentifier = [ 1, 3, 14, 3, 2, 26 ];
			break;
		case "sha256":
			objectIdentifier = [ 2, 16, 840, 1, 101, 3, 4, 2, 1 ];
			break;
		case "sha384":
			objectIdentifier = [ 2, 16, 840, 1, 101, 3, 4, 2, 2 ];
			break;
		case "sha512":
			objectIdentifier = [ 2, 16, 840, 1, 101, 3, 4, 2, 3 ];
			break;
	}

	let T = DigestInfo.encode( {
		digestAlgorithm: {
			algorithm: objectIdentifier,
		},
		digest: hashedData,
	}, 'der' );

	const tLen = T.byteLength;
	if ( emLen < (tLen + 11) ) {
		throw new Error( "intended encoded message length too short" )
	}

	const PSLen = (emLen - tLen - 3) < 8 ? 8 : (emLen - tLen - 3);
	const PS = new Buffer.alloc( PSLen, 0xff );

	const EM1 = new Buffer.alloc( 2 );
	EM1[ 0 ] = 0x00;
	EM1[ 1 ] = 0x01;

	const EM2 = new Buffer.alloc( 1 );
	EM2[ 0 ] = 0x00;

	const totalLength = 2 + PSLen + 1 + tLen; // EM1.byteLength + PSlen + EM2.byteLength + tLen
	return Buffer.concat( [ EM1, PS, EM2, T ], totalLength )
}


module.exports = sign;

console.log( sign( { hash: "md5" }, {}, Buffer.from( "hello world" ) ).toString( "hex" ) );
