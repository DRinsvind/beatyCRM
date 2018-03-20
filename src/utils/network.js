import fetch from "isomorphic-fetch";

/**
 * Process GET request with authorization token.
 *
 * @param state application state object.
 * @param url request address.
 * @returns {*} request promise.
 */
export function aGet(state, url) {
    const {value} = state.core.token;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': value
        }
    }).then(resp => resp.json());
}

export function aPatch(state, url, data) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': value
        },
        body: JSON.stringify(data)
    }).then(resp => resp.json());
}

/**
 * Process POST request with authorization token.
 *
 * @param state application state object.
 * @param url request address.
 * @param data request body data.
 * @returns {*} request promise.
 */



export function aPost(state, url, data) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': value
        },
        body: JSON.stringify(data)
    }).then(resp => resp.json());
}

export function aIPost(state, url, data) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': value
        },
        body: data
    }).then(resp => resp.json());
}

/**
 * Process POST request with authorization token without encoding.
 *
 * @param state application state object.
 * @param url request address.
 * @param data request body data.
 * @returns {*} request promise.
 */
export function asPost(state, url, data) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/html; charset=UTF-8',
            'Authorization': value
        },
        body: JSON.stringify(data)
    }).then(resp => resp.text());
}

export function asGet(state, url) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/html; charset=UTF-8',
            'Authorization': value
        }
    }).then(resp => resp.text());
}

/**
 * Process PUT request with authorization token.
 *
 * @param state application state object.
 * @param url request address.
 * @param data request body data.
 * @returns {*} request promise.
 */
export function aPut(state, url, data) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': value
        },
        body: JSON.stringify(data)
    }).then(resp => resp.json());
}

/**
 * Process DELETE request with authorization token.
 *
 * @param state application state object.
 * @param url request address.
 * @returns {*} request promise.
 */
export function aDelete(state, url) {
    const {value} = state.core.token;

    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': value
        }
    }).then(resp => resp.json());
}

export default {
    aGet,
    aPatch,
    aPost,
    asPost,
    asGet,
    aPut,
    aDelete
};
