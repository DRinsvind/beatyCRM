import {
    CALLS_LIST_RECEIVE,
    SWITCH_CALL_RECEIVE,
    ADD_COMMENT_RECEIVE,
    CALLS_HISTORY_LIST_RECEIVE,
    CLEAR_CALLS_HISTORY,
    STATUSES_LIST_RECEIVE,
    ADD_CALL_STATUS
} from "../actions/calls";

const initialState = {
    calls: {
        birthday: [],
        lost: [],
        month: [],
        once: []
    },
    calls_history: [],
    loading: true,
    statuses_list: []
};

function checkCall(call_group, id) {
    return call_group.map((call) => {
        if (+call.call_id === +id) {
            call.state = !call.state;
        }
        return call;
    })
};

function addComment(call_group, id, comment) {
    return call_group.map((call) => {
        if (+call.call_id === +id) {
            call.comment = comment;
        }
        return call;
    })
};

function addStatus(call_group, id, status) {
    return call_group.map((call) => {
        if (+call.call_id === +id) {
            call.status = status;
        }
        return call;
    })
};


function callsReducer(state = initialState, action) {
    switch (action.type) {
        case CALLS_LIST_RECEIVE:
            return {
                ...state,
                calls: action.payload
            };
        case CALLS_HISTORY_LIST_RECEIVE:
            return {
                ...state,
                calls_history: action.payload,
                loading: false
            };
        case CLEAR_CALLS_HISTORY:
            return {
                ...state,
                calls_history: action.payload,
                loading: true
            };
        case SWITCH_CALL_RECEIVE:
            return {
                ...state,
                calls: {
                    birthday: checkCall(state.calls.birthday, action.payload),
                    lost: checkCall(state.calls.lost, action.payload),
                    month: checkCall(state.calls.month, action.payload),
                    once: checkCall(state.calls.once, action.payload)
                }
            };
        case ADD_COMMENT_RECEIVE:
            const {id, comment} = action.payload;

            return {
                ...state,
                calls: {
                    birthday: addComment(state.calls.birthday, id, comment),
                    lost: addComment(state.calls.lost, id, comment),
                    month: addComment(state.calls.month, id, comment),
                    once: addComment(state.calls.once, id, comment)
                }
            };
        case ADD_CALL_STATUS:
            const {call_id, status} = action.payload;

            return {
                ...state,
                calls: {
                    birthday: addStatus(state.calls.birthday, call_id, status),
                    lost: addStatus(state.calls.lost, call_id, status),
                    month: addStatus(state.calls.month, call_id, status),
                    once: addStatus(state.calls.once, call_id, status)
                }
            };

        case STATUSES_LIST_RECEIVE:
            return {
                ...state,
                statuses_list: action.payload
            };
        default:
            return state;
    }
}

export default callsReducer;