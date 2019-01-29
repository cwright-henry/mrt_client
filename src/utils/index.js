
const getErrorCode = (error) => {

	// If response does exist must be network error	
	if(!error.response) {
		return 'NETWORK_ERROR'
	}

	// Handle server side error codes 400 and 500
	if(error.hasOwnProperty('response') && error.response.hasOwnProperty('data')) {
		if(error.response.data.hasOwnProperty('code') && error.response.data.code.length > 0) {
			return error.response.data.code;
		}
	}

	// Catch all unknowns
	return 'UNKNOWN_ERROR';
}

export {
	getErrorCode
}