import {ACTION_ALERT_PUSH, ACTION_ALERT_POP} from '../actions/alert';

const initialState = {
    messages: []
};

export default function alert(state = initialState, action) {
    switch (action.type) {
        case ACTION_ALERT_PUSH:
            return {
                ...state,
                messages: state.messages.concat([action.payload])
            };
        case ACTION_ALERT_POP:
            const messages = [...state.messages];
            messages.shift();
            return {
                ...state,
                messages
            };
        default:
            return state;
    }
};