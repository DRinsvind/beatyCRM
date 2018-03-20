import {
    WORK_SCHEDULE_RECEIVE,
    EMPLOYEES_GROUPS_RECEIVE,
    CLEAR_SCHEDULE,
    WORK_SCHEDULES_LOAD,
    WORK_SCHEDULE_POST_RECEIVE
} from "../actions/work_schedule";

const initialStateWS = {
    employees_groups: [],
    load: true,
    work_schedule: [],
    work_schedule_post: {},
};

export function workScheduleReducer(state = initialStateWS, action) {
    switch (action.type) {
        case WORK_SCHEDULES_LOAD:
            return {
                ...state,
                load: true
            };
        case WORK_SCHEDULE_RECEIVE:
            return {
                ...state,
                work_schedule: action.payload,
                load: false
            };
        case EMPLOYEES_GROUPS_RECEIVE:
            return {
                ...state,
                employees_groups: action.payload
            };
        case WORK_SCHEDULE_POST_RECEIVE:
            return {
                ...state,
                work_schedule_post: action.payload,
                load: false
            };
        case CLEAR_SCHEDULE:
            return {
                ...state,
                load: true
            };
        default:
            return state;
    }
}