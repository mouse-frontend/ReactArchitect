import * as constants from './constants';

export function updateComponent(data) {
	return {
		type: constants.UPDATE_COMPONENT,
		payload: data
	};
}

export function createComponent(data) {
	return {
		type: constants.CREATE_COMPONENT,
		payload: data
	};
}

export function deleteComponent(data) {
	return {
		type: constants.DELETE_COMPONENT,
		payload: data
	};
}
