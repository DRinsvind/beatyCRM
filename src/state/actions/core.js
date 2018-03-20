import * as can from "../../constants";
import * as net from "../../utils/network";
import {push} from "react-router-redux";


// CONSTANTS
export const ACTION_AUTHORIZATION_SUCCESS = 'ACTION_AUTHORIZATION_SUCCESS';
export const ACTION_AUTHORIZATION_FAILURE = 'ACTION_AUTHORIZATION_FAILURE';
export const ACTION_AUTHORIZATION_CLEAR = 'ACTION_AUTHORIZATION_CLEAR';
export const ACTION_USER_INFORMATION_RECEIVE = 'ACTION_USER_INFORMATION_RECEIVE';
export const ACTION_RECEIVE_SALONS = 'ACTION_RECEIVE_SALONS';
export const ACTION_SAVE_LAST_PATHNAME = 'ACTION_SAVE_LAST_PATHNAME';

// ACTIONS
function actionAuthorizationSuccess(token) {
    return {
        type: ACTION_AUTHORIZATION_SUCCESS,
        payload: {
            stamp: Date.now(),
            token: {
                value: token,
                valid: true
            }
        }
    };
}

function actionAuthorizationFailure(message) {
    return {type: ACTION_AUTHORIZATION_FAILURE, payload: message};
}

function actionAuthorizationClear() {
    return {type: ACTION_AUTHORIZATION_CLEAR};
}

function actionReceiveSalons(data) {
    return {type: ACTION_RECEIVE_SALONS, payload: data};
}

function actionSaveLastPathname(location) {
    return {type: ACTION_SAVE_LAST_PATHNAME, payload: location};
}

function actionUserInfromationReceive(user) {
    return {type: ACTION_USER_INFORMATION_RECEIVE, payload: user};
}

// CREATORS
/**
 *
 * @returns {function(*, *)}
 */
export function authorizationRequired() {
    return (dispatch, getState) => {
        const {core, routing} = getState();

        dispatch(actionSaveLastPathname(routing.locationBeforeTransitions.pathname));

        if (!core.token.value && !core.token.valid) {
            dispatch(push('/login'));
        } else if (core.token.value && !core.token.valid) {
            dispatch(verifyToken());
        }
    };
}

/**
 * Retrieve API token.
 *
 * @param data
 * @returns {function(*, *)}
 */
export function retrieveToken(data) {
    return (dispatch, getState) => {
        const {core} = getState();

        return net.aPost(getState(), can.API_COMMONS.getToken, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(fetchUserInformation());
                    dispatch(actionAuthorizationSuccess(resp.data));

                    return dispatch(push(core.lastpath));
                }

                return dispatch(actionAuthorizationFailure(resp.data.errors.description));
            });
    }
}

/**
 * Validate API token.
 *
 * @returns {function(*, *)}
 */
export function verifyToken() {
    return (dispatch, getState) => {
        const {core} = getState();

        if (core.token.value && !core.token.valid) {
            const {value} = core.token;

            return net.aGet(getState(), can.API_COMMONS.verifyToken)
                .then(resp => {
                    if (resp.success) {
                        dispatch(actionAuthorizationSuccess(value));

                        return dispatch(push(core.lastpath));
                    }

                    return dispatch(actionAuthorizationFailure(resp.data.errors.description));
                });
        }
    };
}

/**
 *
 * @returns {function(*, *)}
 */
export function fetchUserInformation() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getUser)
            .then(resp => {
                dispatch(actionUserInfromationReceive(resp));
            });
    };
}

/**
 *
 * @returns {function(*, *)}
 */
export function fetchSalonsIfNeeded() {
    return (dispatch, getState) => {
        if (!getState().core.salons.length) {
            return net.aGet(getState(), can.API_COMMONS.getSalons)
                .then(resp => {
                    if (resp.success) {
                        dispatch(actionReceiveSalons(resp.data))
                    }
                });
        }
    };
}

/**
 *
 * @returns {function(*)}
 */
export function authorizationFlush() {
    return (dispatch) => {
        dispatch(actionAuthorizationClear());
        dispatch(push('/login'));
    };
}