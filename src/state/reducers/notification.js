import {
    ACTION_NOTIFICATIONS_LIST_RECEIVE,
    ACTION_NOTIFICATIONS_NEW_RECEIVE,
} from "../actions/notification";

const initialState = {
    notifications: [],
    notificationsNew: [],
};

export default function notification(state = initialState, action) {
    switch (action.type) {
        case ACTION_NOTIFICATIONS_LIST_RECEIVE:
            return {
                ...state,
                notifications: action.payload
            };
        case ACTION_NOTIFICATIONS_NEW_RECEIVE:
            return {
                ...state,
                notificationsNew: action.payload
            };
        default:
            return state;
    }
}
