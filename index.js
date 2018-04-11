if ( !("self" in global) ) {
	Object.defineProperties( global, {
		self: {
			value: global
		}
	} )
}

if ( !("crypto" in global.self) ) {

	const crypto = {
		subtle: {},
		getRandomValues: {}
	};

	Object.defineProperties( self, {
		crypto: {
			value: Object.seal( crypto )
		}
	} )
}
