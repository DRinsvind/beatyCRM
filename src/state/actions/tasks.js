import * as can from "../../constants";
import * as net from "../../utils/network";
import {push} from 'react-router-redux';
import {pushNotification} from './alert';

export const TASKS_LIST_RECEIVE = 'TASKS_LIST_RECEIVE';
export const EMPLOYEES_LIST_REQUEST = 'EMPLOYEES_LIST_REQUEST';
export const EMPLOYEES_LIST_RECEIVE = 'EMPLOYEES_LIST_RECEIVE';
export const TASKS_ITEM_EDIT_RECEIVE = 'TASKS_ITEM_EDIT_RECEIVE';
export const TASKS_LIST_CLEAR = 'TASKS_LIST_CLEAR';
export const TASKS_LIST_SORT = 'TASKS_LIST_SORT';

function receiveTasksList(tasks) {
    return {type: TASKS_LIST_RECEIVE, payload: tasks};
}

function receiveEmployeesList(employees) {
    return {type: EMPLOYEES_LIST_RECEIVE, payload: employees};
}

function receiveTaskEdit(task) {
    return {type: TASKS_ITEM_EDIT_RECEIVE, payload: task};
}

function clearTasks() {
    return {type: TASKS_LIST_CLEAR, payload: []};
}

export function clearTasksList() {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch(clearTasks());
            resolve();
        });
    }
}

export function sortTasksList(task_group, group_name) {
    return {type: TASKS_LIST_SORT, payload: {group_name: group_name, task_group: task_group}};
}

export function fetchTasksList(date) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_TASKS.getTasks.replace(/{date}/, date))
            .then(resp => {
                dispatch(receiveTasksList(resp.data));
            });
    }
}

export function fetchEmployeesList() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_TASKS.getEmployees)
            .then(resp => {
                dispatch(receiveEmployeesList(resp.data));
            });
    }
}

export function fetchTaskAdd(task, date) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_TASKS.addTask, task)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchTasksList(date));
                }
            });
    };
}

export function fetchTaskEdit(task_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_TASKS.getTask.replace(/\{id}/, task_id))
            .then(resp => {
                dispatch(receiveTaskEdit(resp));
                dispatch(push('/tasks/edit/' + task_id));
            });
    };
}

export function deleteTask(task_id) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_TASKS.getTask.replace(/\{id}/, task_id))
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(push('/tasks/'));
                }
            });
    };
}

export function editTask(editedTask, task_id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_TASKS.getTask.replace(/\{id}/, task_id), editedTask)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchTaskEdit(task_id));
                }
            });
    };
}

export function editTaskState(task_id, data) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_TASKS.taskState.replace(/\{id}/, task_id), data)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchTaskEdit(task_id));
                }
            });
    };
}

export function addTaskNote(task_id, data) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_TASKS.taskComment.replace(/\{id}/, task_id), data)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchTaskEdit(task_id));
                }
            });
    };
}

export function deleteTaskComment(task_id) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_TASKS.taskComment.replace(/\{id}/, task_id))
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchTaskEdit(task_id));
                }
            });
    };
}