import {REHYDRATE} from "redux-persist/constants";
import {
    ACTION_AUTHORIZATION_CLEAR,
    ACTION_AUTHORIZATION_FAILURE,
    ACTION_AUTHORIZATION_SUCCESS,
    ACTION_USER_INFORMATION_RECEIVE,
    ACTION_SAVE_LAST_PATHNAME,
    ACTION_RECEIVE_SALONS
} from "../actions/core";

const initialState = {
    loaded: false,
    token: {
        value: '',
        valid: false
    },
    salons: [],
    lastpath: ''
};

export default function core(state = initialState, action) {
    switch (action.type) {
        case ACTION_RECEIVE_SALONS:
            return {
                ...state,
                salons: action.payload
            };
        case ACTION_AUTHORIZATION_SUCCESS:
            return {
                ...state,
                ...action.payload,
                error: undefined
            };
        case ACTION_AUTHORIZATION_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case ACTION_USER_INFORMATION_RECEIVE:
            return {
                ...state,
                user: action.payload
            };
        case ACTION_SAVE_LAST_PATHNAME:
            const pathname = action.payload;

            return {
                ...state,
                lastpath: pathname
            };
        case ACTION_AUTHORIZATION_CLEAR:
            return {
                ...state,
                token: initialState.token
            };
        case REHYDRATE:
            if (action.payload.core) {
                const {value} = action.payload.core.token;

                return {
                    ...state,
                    ...action.payload.core,
                    token: {
                        value: value,
                        valid: false
                    },
                    loaded: true,
                };
            }

            return {
                ...state,
                loaded: true
            };
        default:
            return state;
    }
}