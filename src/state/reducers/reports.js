import {
    RECEIVE_REPORT
} from '../actions/reports';

const initialState = {
    report: []
};

export function reportsReducer(state = initialState, action) {
    switch (action.type) {
        case RECEIVE_REPORT:
            return {
                ...state,
                report: action.payload
            };
        default:
            return state;
    }
}

export default reportsReducer;