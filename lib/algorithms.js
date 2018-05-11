const { NotSupportedError } = require( "./errors" );
const RsaSSA = require("./RSASSA-PKCS1-v1_5/index");

module.exports.names = AlgorithmNames = {
	RsaSSA: "RSASSA-PKCS1-v1_5",
	RsaPSS: "RSA-PSS",
	RsaOAEP: "RSA-OAEP",
	AesECB: "AES-ECB",
	AesCTR: "AES-CTR",
	AesCMAC: "AES-CMAC",
	AesGCM: "AES-GCM",
	AesCBC: "AES-CBC",
	AesKW: "AES-KW",
	Sha1: "SHA-1",
	Sha256: "SHA-256",
	Sha384: "SHA-384",
	Sha512: "SHA-512",
	EcDSA: "ECDSA",
	EcDH: "ECDH",
	Hmac: "HMAC",
	Pbkdf2: "PBKDF2",
};

supportedAlgorithms = {
	"decrypt": [],
	"deriveBits": [],
	"deriveKeys": [],
	"digest": [],
	"encrypt": [],
	"exportKey": [],
	"generateKey": [],
	"getRandomValues": [],
	"importKey": [],
	"sign": [
		{ name: AlgorithmNames.RsaSSA, algorithm: RsaSSA.sign }
		],
	"unwrapKey": [],
	"verify": [],
	"wrapKey": []
};

module.exports.normalizeAlgorithm = function( alg, op ) {
	if ( typeof alg === "string" ) {
		alg = { name: alg };
	}
	if ( typeof alg === "object" ) {
		const registeredAlgorithms = supportedAlgorithms[ op ];
		let algName = alg.name;

		for ( let index = 0, length = registeredAlgorithms.length; index < length; index++ ) {
			if ( algName.toLowerCase() === registeredAlgorithms[ index ].name.toLowerCase() ) {
				return {
					name: registeredAlgorithms[ index ].name,
					process: registeredAlgorithms[ index ].algorithm
				};
			}
		}
		return NotSupportedError( `${op} is not supported by ${alg}` )
	}
};