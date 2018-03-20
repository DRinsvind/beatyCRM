import * as net from '../../utils/network';
import * as can from '../../constants';
import {push} from 'react-router-redux';


// CONSTANTS
export const ACTION_NOTIFICATIONS_LIST_RECEIVE = 'ACTION_NOTIFICATIONS_LIST_RECEIVE';
export const ACTION_NOTIFICATIONS_NEW_RECEIVE = 'ACTION_NOTIFICATIONS_NEW_RECEIVE';


// ACTIONS
function actionNotificationsListReceive(data) {
    return {type: ACTION_NOTIFICATIONS_LIST_RECEIVE, payload: data}
}

function actionNotificationsNewReceive(data) {
    return {type: ACTION_NOTIFICATIONS_NEW_RECEIVE, payload: data}
}

// CREATORS
/**
 *
 * @returns {function(*, *)}
 */
export function fetchNotifications() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getNotificationsList)
            .then((resp) => {
                dispatch(actionNotificationsListReceive(resp.data));
            });
    };
}

/**
 *
 * @returns {function(*, *)}
 */
export function fetchNotificationsNew() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getNotifications)
            .then((resp) => {
                dispatch(actionNotificationsNewReceive(resp.data));
            });
    };
}

/**
 *
 * @param data
 * @returns {function(*, *)}
 */
export function changeNotificationState(data) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_COMMONS.getNotificationsList, data)
            .then((resp) => {
                dispatch(fetchNotificationsNew());
            });
    };
}