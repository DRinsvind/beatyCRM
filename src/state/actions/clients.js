import * as can from "../../constants";
import * as net from "../../utils/network";
import {pushNotification} from './alert';
import {push} from 'react-router-redux'

/*
 * action types
 */
export const CLIENTS_LIST_RECEIVE = 'CLIENTS_LIST_RECEIVE';
export const CLIENTS_EDIT_RECEIVE = 'CLIENTS_EDIT_RECEIVE';
export const CLIENTS_TAGS_RECEIVE = 'CLIENTS_TAGS_RECEIVE';
export const CLIENTS_QUESTIONARY_RECEIVE = 'CLIENTS_QUESTIONARY_RECEIVE';
export const CLIENTS_CATEGORIES_TREE_RECEIVE = 'CLIENTS_CATEGORIES_TREE_RECEIVE';
export const CLEAR_CLIENT_EDIT_RESPONSE = 'CLEAR_CLIENT_EDIT_RESPONSE';
export const ERROR_RECEIVE = 'ERROR_RECEIVE';
export const CLIENTS_LIST_CLEAR = 'CLIENTS_LIST_CLEAR';

/*
 * action utils
 */

function receiveClientsList(clients, page_info) {
    return {type: CLIENTS_LIST_RECEIVE, payload: {clients, page_info}};
}

function receiveClientsTags(clients_tags) {
    return {type: CLIENTS_TAGS_RECEIVE, payload: clients_tags};
}

function receiveCategoriesTree(categories) {
    return {type: CLIENTS_CATEGORIES_TREE_RECEIVE, payload: categories};
}

function receiveClientsEdit(client) {
    return {type: CLIENTS_EDIT_RECEIVE, payload: client};
}

function receiveClientsQuestionary(client) {
    return {type: CLIENTS_QUESTIONARY_RECEIVE, payload: client};
}

function clearClientEditResponse(response) {
    return {type: CLEAR_CLIENT_EDIT_RESPONSE, payload: response};
}

function clientsErrorsReceive(errors) {
    return {type: ERROR_RECEIVE, payload: errors};
}

export function clearClientsList () {
    return {type: CLIENTS_LIST_CLEAR, payload: []};
}

/*
 * actions creators
 */
export function fetchClientsList() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CLIENTS.getClients)
            .then(resp => {
                dispatch(receiveClientsList(resp.data, resp.info));
            });
    }
}

export function fetchCategoriesTree() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CLIENTS.getCategoriesTree)
            .then(resp => {
                dispatch(receiveCategoriesTree(resp.data))
            });
    }
}

export function fetchCategoryByPath(path) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_URL + path)
            .then(resp => {
                dispatch(receiveClientsList(resp.data, resp.info))
            });
    }
}

export function fetchClientsEdit(client_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CLIENTS.getClient.replace(/\{id}/, client_id))
            .then(resp => {
                dispatch(receiveClientsEdit(resp.data))
            });
    };
}

export function fetchClientsTags() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CLIENTS.getTags)
            .then(resp => {
                dispatch(receiveClientsTags(resp.data))
            });
    };
}

export function fetchClientsQuestionary(client_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CLIENTS.getQuestionary.replace(/\{id}/, client_id))
            .then(resp => {
                dispatch(receiveClientsQuestionary(resp.data))
            });
    };
}

export function editClientsQuestionary(editedClient, client_id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CLIENTS.getQuestionary.replace(/\{id}/, client_id), editedClient)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (+resp.code === 200) {
                    dispatch(fetchClientsQuestionary(client_id));
                    dispatch(push('/clients/profile/' + client_id));
                }
            });
    };
}

export function checkInputValue(values) {
    return (dispatch, getState) => {
        return net.aPatch(getState(), can.API_GOODS.validateNewProduct, values)
            .then(resp => {
                dispatch(clientsErrorsReceive(resp));
            });
    };
}


export function editClient(editedClient, client_id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CLIENTS.getClient.replace(/\{id}/, client_id), editedClient)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (+resp.code === 200) {
                    dispatch(clearClientEditResponse());
                    dispatch(fetchClientsEdit(client_id));
                    dispatch(push('/clients/profile/' + client_id));
                }
            });
    };
}
