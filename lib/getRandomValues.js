let { TypeMismatchError, QuotaExceededError } = require( "./errors" );
let crypto = require( "crypto" );

/**
 *
 * @param array
 * @return {Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|UInt8ClampedArray}
 */
function getRandomValues( array ) {
	if ( !(array instanceof Int8Array)
		&& !(array instanceof Uint8Array)
		&& !(array instanceof Int16Array)
		&& !(array instanceof Uint16Array)
		&& !(array instanceof Int32Array)
		&& !(array instanceof Uint32Array)
		&& (typeof UInt8ClampedArray === "undefined" || !(array instanceof UInt8ClampedArray))
	) {
		throw new TypeMismatchError();
	}

	if ( array.byteLength > 65536 ) {
		throw new QuotaExceededError();
	}

	crypto.randomFillSync( new Uint8Array( array.buffer ) );
	return array;
}

module.exports = getRandomValues;
