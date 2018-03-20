import * as net from "../../utils/network";
import * as can from "../../constants";
import {pushNotification} from './alert';

/*
 * action types
 */
export const WORK_SCHEDULE_RECEIVE = 'WORK_SCHEDULE_RECEIVE';
export const WORK_SCHEDULE_POST_RECEIVE = 'WORK_SCHEDULE_POST_RECEIVE';
export const EMPLOYEES_GROUPS_RECEIVE = 'EMPLOYEES_GROUPS_RECEIVE';
export const CLEAR_SCHEDULE = 'CLEAR_SCHEDULE';
export const WORK_SCHEDULES_LOAD = 'WORK_SCHEDULES_LOAD';

/*
 * action utils
 */

function receiveWorkSchedule(schedule) {
    return {type: WORK_SCHEDULE_RECEIVE, payload: schedule};
}

function receiveWorkSchedulePost(schedule) {
    return {type: WORK_SCHEDULE_POST_RECEIVE, payload: schedule};
}

function receiveEmployeesGroups(groups) {
    return {type: EMPLOYEES_GROUPS_RECEIVE, payload: groups};
}

export function fetchClearWorkSchedule() {
    return {type: CLEAR_SCHEDULE, payload: null}
}

/*
 * actions creators
 */

export function fetchWorkSchedule(date) {
    return (dispatch, getState) => {
        dispatch({type: WORK_SCHEDULES_LOAD});

        return net.aGet(getState(), can.API_SCHEDULE.getWorkSchedule.replace(/\{date}/, date))
            .then(resp => {
                dispatch(receiveWorkSchedule(resp.data));
            })
    }
}

export function fetchWorkSchedulePost(path, date) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_URL + path + '/' + date)
            .then(resp => {
                dispatch(receiveWorkSchedulePost(resp.data));
            })
    }
}

export function fetchEmployeesGroups() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_SCHEDULE.getEmployeesGroups)
            .then(resp => {
                dispatch(receiveEmployeesGroups(resp.data));
            })
    }
}

export function fetchAddWorkingDay(data) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_SCHEDULE.addWorkingDay, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                }
            });
    }
}

export function fetchChangeWorkingHours(data) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_SCHEDULE.changeWorkingHours, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                }
            });
    }
}