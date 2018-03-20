import {
    SERVICES_CATEGORIES_RECEIVE,
    SERVICES_CATEGORY_ITEMS_RECEIVE,
    SERVICE_RECEIVE,
    SERVICE_TAGS_RECEIVE,
    GOODS_LIST_RECEIVE,
    SERVICES_ERRORS_CLEAR,
    SERVICES_INFO_CLEAR,
    SERVICES_LIST_CLEAR
} from "../actions/services";

import {ERROR_RECEIVE} from "../actions/clients";

const initialState = {
    categories: [],
    services: [],
    item: [],
    service_exp: null,
    category_id: 0,
    services_tags: [],
    goods_list: [],
    errors: {},
    loading: true
};

function servicesReducer(state = initialState, action) {

    switch (action.type) {

        case SERVICES_CATEGORIES_RECEIVE:
            return {
                ...state,
                categories: action.payload
            };
        case SERVICE_TAGS_RECEIVE:
            return {
                ...state,
                services_tags: action.payload
            };
        case GOODS_LIST_RECEIVE:
            return {
                ...state,
                goods_list: action.payload
            };
        case ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case SERVICES_ERRORS_CLEAR:
            return {
                ...state,
                errors: {}
            };
        case SERVICES_INFO_CLEAR:
            return {
                ...state,
                service_exp: null
            };
        case SERVICE_RECEIVE:
            return {
                ...state,
                service_exp: action.payload
            };
        case SERVICES_CATEGORY_ITEMS_RECEIVE:
            return {
                ...state,
                services: action.payload.services,
                category_id: action.payload.category_id,
                loading: false,
            };
        case SERVICES_LIST_CLEAR:
            return {
                ...state,
                loading: true,
                services: action.payload
            };
        default:
            return state;
    }
}

export default servicesReducer;