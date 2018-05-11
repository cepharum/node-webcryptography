const decrypt = require("./lib/algorithms");
const deriveBits = require("./lib/deriveBits");
const deriveKey = require("./lib/deriveKey");
const digest = require("./lib/digest");
const encrypt = require("./lib/encrypt");
const exportKey = require("./lib/exportKey");
const generateKey = require("./lib/generateKey");
const getRandomValues = require("./lib/getRandomValues");
const importKey = require("./lib/importKey");
const sign = require("./lib/sign");
const unwrapKey = require("./lib/unwrapKey");
const verify = require("./lib/verify");
const wrapKey = require("./lib/wrapKey");

if ( !("self" in global) ) {
	Object.defineProperties( global, {
		self: {
			value: global
		}
	} )
}

if ( !("crypto" in global.self) ) {
	const crypto = {
		subtle: {
			decrypt,
			deriveBits,
			deriveKey,
			digest,
			encrypt,
			exportKey,
			generateKey,
			importKey,
			sign,
			unwrapKey,
			verify,
			wrapKey,
		},
		getRandomValues
	};

	Object.defineProperties( self, {
		crypto: {
			value: Object.seal( crypto )
		}
	} )
}
