import * as types from '../actions/vendors';

const initialState = {
    vendors: [],
    loading: true,
    page_info: {
        page: 1,
        pages: 0
    },
    photo: null,
    type: '',
    errors: {}
};

const editInitialState = {
    vendor: {person: {contacts: []}},
    errors: {},
    type: '',
    photo: null
};


export function vendorsListReducer(state = initialState, action) {
    switch (action.type) {
        case types.VENDORS_LIST_RECEIVE:
            return {
                ...state,
                vendors: action.payload.vendors,
                page_info: action.payload.info,
                loading: false
            };
        default:
            return state;
    }
}

export function vendorAddReducer(state = initialState, action) {
    switch (action.type) {
        case types.VENDORS_ERRORS_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case types.CLEAR_VENDOR_FORM:
            return {
                ...state,
                errors: {}
            };
        case types.RECEIVE_VENDOR_PHOTO:
            return {
                ...state,
                photo: action.payload.id,
                type: action.payload.type
            };
        default:
            return state;
    }
}

export function vendorEditReducer(state = editInitialState, action) {
    switch (action.type) {
        case types.VENDORS_ITEM_EDIT_RECEIVE:
            return {
                ...state,
                vendor: action.payload,
                errors: {}
            };
        case types.VENDORS_ERRORS_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case types.CLEAR_VENDOR_FORM:
            return {
                ...state,
                errors: {}
            };
        case types.RECEIVE_VENDOR_PHOTO:
            return {
                ...state,
                photo: action.payload.id,
                type: action.payload.type
            };
        default:
            return state;
    }
}