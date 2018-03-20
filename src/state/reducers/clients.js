import {CLIENTS_LIST_RECEIVE,
    CLIENTS_EDIT_RECEIVE,
    CLIENTS_CATEGORIES_TREE_RECEIVE,
    CLEAR_CLIENT_EDIT_RESPONSE,
    CLIENTS_QUESTIONARY_RECEIVE,
    CLIENTS_TAGS_RECEIVE,
    ERROR_RECEIVE,
    CLIENTS_LIST_CLEAR} from "../actions/clients";

const listInitialState = {
    loading: true,
    clients: [],
    edit_client: null,
    categories: [],
    page_info: {
        page: 1,
        pages: 0,
    }
};

const editInitialState = {
    client: {
        "client_id": 0,
        "photo": null,
        "do_not_send_sms": 1,
        "do_not_send_email": 1,
        "deposit_sum": .0,
        "note": '',
        "info": {
            "person_id": 0,
            "last_name": '',
            "first_name": '',
            "second_name": null,
            "sex": '',
            "date_birth": '',
            "photo_id": null,
            "contacts": []
        },
        "category": null,
        "last_appointment": {
            "date_appointment": '',
            "salon": '',
            "services": [{
                "service_name": '',
                "master_name": '',
                "master_id": ''
            }],
            "cost": 0
        },
        "relative": [{
            "client_id": '',
            "client_name": ''
        }],
        "last_call_status": []
    },
    server_response: {},
    questions_groups: [],
    errors: {},
    notifications: [],
    tags_list: [],
    loading: true,
};

export function clientsListReducer(state = listInitialState, action) {
    switch (action.type) {
        case CLIENTS_LIST_RECEIVE:
            return {
                ...state,
                clients: action.payload.clients,
                page_info: action.payload.page_info,
                loading: false
            };
        case CLIENTS_CATEGORIES_TREE_RECEIVE:
            return {
                ...state,
                categories: action.payload
            };
        case CLIENTS_LIST_CLEAR:
            return {
                ...state,
                clients: action.payload,
                loading: true
            };
        default:
            return state;
    }
}

export function clientsEditReducer(state = editInitialState, action) {
    switch (action.type) {
        case CLIENTS_EDIT_RECEIVE:
            return {
                ...state,
                client: action.payload,
                loading: false
            };
        case CLEAR_CLIENT_EDIT_RESPONSE:
            return {
                ...state,
                server_response: {}
            };
        case CLIENTS_QUESTIONARY_RECEIVE:
            return {
                ...state,
                questions_groups: action.payload
            };
        case ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case CLIENTS_TAGS_RECEIVE:
            return {
                ...state,
                tags_list: action.payload
            };
        default:
            return state;
    }
}