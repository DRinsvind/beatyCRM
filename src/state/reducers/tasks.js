import {
    TASKS_LIST_RECEIVE,
    TASKS_ITEM_EDIT_RECEIVE,
    EMPLOYEES_LIST_RECEIVE,
    TASKS_LIST_CLEAR,
    TASKS_LIST_SORT
} from "../actions/tasks";

import {ERROR_RECEIVE} from "../actions/clients";

const initialState = {
    tasks: [],
    all_tasks: [],
    task: {
        data: []
    },
    selected_group: 'Все задачи',
    errors: [],
    employees: [],
    loading: true
};


export function tasksListReducer(state = initialState, action) {
    switch (action.type) {
        case TASKS_LIST_RECEIVE:
            return {
                ...state,
                all_tasks: action.payload,
                tasks: action.payload,
                selected_group: 'Все задачи',
                loading: false
            };
        case ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case EMPLOYEES_LIST_RECEIVE:
            return {
                ...state,
                employees: action.payload
            };
        case TASKS_LIST_CLEAR:
            return {
                ...state,
                tasks: action.payload,
                loading: true
            };

        case TASKS_LIST_SORT:
            let sort_tasks = [];
            if (action.payload.group_name === 'all') {
                sort_tasks = state.all_tasks;
            } else {
                state.all_tasks.forEach((task) => {
                    if (task.type === action.payload.group_name) {
                        sort_tasks.push(task);
                    }
                });
            }

            return {
                ...state,
                tasks: sort_tasks,
                selected_group: action.payload.task_group,
                loading: false
            };


        default:
            return state;
    }
}

export function tasksEditReducer(state = initialState, action) {
    switch (action.type) {
        case EMPLOYEES_LIST_RECEIVE:
            return {
                ...state,
                employees: action.payload
            };
        case TASKS_ITEM_EDIT_RECEIVE:
            return {
                ...state,
                task: action.payload
            };
        default:
            return state;
    }
}
