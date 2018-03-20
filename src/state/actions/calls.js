import * as can from "../../constants";
import * as net from "../../utils/network";
import notify from '../../components/commons/Notify';

/*
 * action types
 */
export const CALLS_LIST_RECEIVE = 'CALLS_LIST_RECEIVE';
export const SWITCH_CALL_RECEIVE = 'SWITCH_CALL_RECEIVE';
export const ADD_COMMENT_RECEIVE = 'ADD_COMMENT_RECEIVE';
export const CALLS_HISTORY_LIST_RECEIVE = 'CALLS_HISTORY_LIST_RECEIVE';
export const CLEAR_CALLS_HISTORY = 'CLEAR_CALLS_HISTORY';
export const STATUSES_LIST_RECEIVE = 'STATUSES_LIST_RECEIVE';
export const ADD_CALL_STATUS = 'ADD_CALL_STATUS';


/*
 * action utils
 */
function receiveCallsList(calls) {
    return {type: CALLS_LIST_RECEIVE, payload: calls};
}

function receiveCallsHistoryList(calls_history) {
    return {type: CALLS_HISTORY_LIST_RECEIVE, payload: calls_history};
}

function receiveSwitchCall(id) {
    return {type: SWITCH_CALL_RECEIVE, payload: id};
}

function receiveAddComment(comment, id) {
    return {
        type: ADD_COMMENT_RECEIVE,
        payload: {comment, id}
    };
}

function receiveCallsStatuses(statuses) {
    return {type: STATUSES_LIST_RECEIVE, payload: statuses};
}

export function clearCallsHistory() {
    return {type: CLEAR_CALLS_HISTORY, payload: []}
}

export function addStatus(status, call_id) {
    return {type: ADD_CALL_STATUS, payload: {status, call_id}}
}

export function fetchCalls() {
    return (dispatch,getState) => {
        return net.aGet(getState(), can.API_CALLS.allCalls)
            .then(resp => {
                dispatch(receiveCallsList(resp.data));
            });
    };
}

export function fetchCallsHistory(params) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALLS.getCallsHistory + params)
            .then(resp => {
                dispatch(receiveCallsHistoryList(resp.data));
            });
    };
}

export function switchCallState(id, status) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CALLS.callsCheck.replace('{id}', id), status)
            .then(resp => {
                notify({message: resp.message, status: resp.success ? 'success' : 'error'});
                if (resp.success) {
                    dispatch(receiveSwitchCall(id))
                }
            });
    };
}

export function addComment(comment, id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CALLS.comment.replace('{id}', id), {'note_performer': comment})
            .then(resp => {
                notify({message: resp.message, status: resp.success ? 'success' : 'error'});

                if (resp.success) {
                    dispatch(receiveAddComment(comment, id))
                }
            });
    };
}

export function fetchStatuses() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALLS.getCallsStatuses)
            .then(resp => {
                dispatch(receiveCallsStatuses(resp.data));
            });
    };
}