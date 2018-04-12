class TypeMismatchError extends Error {
}

class QuotaExceededError extends Error {
}

class NotSupportedError extends Error {
}

class InvalidAccessError extends Error {
}

module.exports = {
	TypeMismatchError,
	QuotaExceededError,
	NotSupportedError,
	InvalidAccessError,
};