import * as net from "../../utils/network";
import * as can from "../../constants";
import {push} from 'react-router-redux';
import {pushNotification} from './alert';

const ACCESS_RIGHTS = [
    {id: 0, module: 'Товари', subModules: [{id: 1, module: 'Витрина'}, {id: 2, module: 'Проф'}]},
    {id: 3, module: 'Сотрудники', subModules: [{id: 4, module: 'Сотрудники 1'}, {id: 5, module: 'Сотрудники 2'}]}
];
/*
 * action types
 */
export const SALONS_LIST_RECEIVE = 'SALONS_LIST_RECEIVE';
export const POSTS_LIST_RECEIVE = 'POSTS_LIST_RECEIVE';
export const ROLES_LIST_RECEIVE = 'ROLES_LIST_RECEIVE';
export const EMPLOYEE_ITEM_RECEIVE = 'EMPLOYEE_ITEM_RECEIVE';
export const EMPLOYEES_CATEGORIES_TREE_RECEIVE = 'EMPLOYEES_CATEGORIES_TREE_RECEIVE';
export const EMPLOYEES_TAGS_RECEIVE = 'EMPLOYEES_TAGS_RECEIVE';
export const RECEIVE_EMPLOYEE_ERRORS = 'RECEIVE_EMPLOYEE_ERRORS';
export const RECEIVE_ACCESS_RIGHTS = 'RECEIVE_ACCESS_RIGHTS';
export const RECEIVE_EMPLOYEES_GROUP = 'RECEIVE_EMPLOYEES_GROUP';
export const RECEIVE_EMPLOYEE_PHOTO = 'RECEIVE_EMPLOYEE_PHOTO';
export const RECEIVE_EMPLOYEE_ROLE_ID = 'RECEIVE_EMPLOYEE_ROLE_ID';
export const CLEAR_EMPLOYEES_INITIAL_STATE = 'CLEAR_EMPLOYEES_INITIAL_STATE';
export const FAMILY_STATUS_RECEIVE = 'FAMILY_STATUS_RECEIVE';
export const LOAD_SCHEDULE_TYPES = 'LOAD_SCHEDULE_TYPES';
export const LOAD_EMPLOYEE_SCHEDULE = 'LOAD_EMPLOYEE_SCHEDULE';
export const RECEIVE_PAYMENT_SCHEME = 'RECEIVE_PAYMENT_SCHEME';


/*
 * action utils
 */

function receiveCategoriesTree(categories) {
    return {type: EMPLOYEES_CATEGORIES_TREE_RECEIVE, payload: categories};
}

function receiveSalonsList(salons) {
    return {type: SALONS_LIST_RECEIVE, payload: salons};
}

function receivePostsList(posts) {
    return {type: POSTS_LIST_RECEIVE, payload: posts};
}

function receiveRolesList(roles) {
    return {type: ROLES_LIST_RECEIVE, payload: roles};
}

function receiveFamilyStatus(status) {
    return {type: FAMILY_STATUS_RECEIVE, payload: status};
}

function receiveEmployeesTags(employees_tags) {
    return {type: EMPLOYEES_TAGS_RECEIVE, payload: employees_tags};
}

function receiveEmployeeEdit(employee) {
    return {type: EMPLOYEE_ITEM_RECEIVE, payload: employee};
}

function employeeErrorsReceive(errors) {
    return {type: RECEIVE_EMPLOYEE_ERRORS, payload: errors}
}

function receiveEmployeesAccessRights(rights) {
    return {type: RECEIVE_ACCESS_RIGHTS, payload: rights}
}

function receiveEmployeesGroup(group) {
    return {type: RECEIVE_EMPLOYEES_GROUP, payload: group}
}

export function clearEmployeesInitialState() {
    return {type: CLEAR_EMPLOYEES_INITIAL_STATE}
}

function receivePhoto(id) {
    return {type: RECEIVE_EMPLOYEE_PHOTO, payload: id};
}

export function onAddNewEmployee(role_id) {
    return {type: RECEIVE_EMPLOYEE_ROLE_ID, payload: role_id}
}

export function onLoadScheduleTypes(types) {
    return {type: LOAD_SCHEDULE_TYPES, payload: types}
}

export function onLoadEmployeeSchedule(data) {
    return {type: LOAD_EMPLOYEE_SCHEDULE, payload: data}
}

export function receivePaymentSchemes(data) {
  return {type: RECEIVE_PAYMENT_SCHEME, payload: data}
}



/*
 * actions creators
 */
 export function updateEmployeeShedule(date, params) {
     return (dispatch, getState) => {
         return net.aPut(getState(), can.API_EMPLOYEES.updateEmployeeSchedule.replace(/\{date}/, date), params)
         .then(json => dispatch(fetchEmployeeShedule(date)));
     }
  }

 export function fetchEmployeeShedule(date) {
     return (dispatch, getState) => {
         return net.aGet(getState(), can.API_EMPLOYEES.getEmployeeSchedule.replace(/\{date}/, date))
         .then(json => dispatch(onLoadEmployeeSchedule(json.data)));
     }
  }

 export function fetchSheduleTypes() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getScheduleTypes)
        .then(json => dispatch(onLoadScheduleTypes(json.data)));
    }
 }

export function fetchCategoriesTree() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getCategoriesTree)
            .then(json => dispatch(receiveCategoriesTree(json.data)));
    }
}

export function fetchGetAccessRights() {
    return (dispatch, getState) => {
        // return net.aGet(getState(), can.API_EMPLOYEES.getRights)
        //     .then(resp => dispatch(receiveEmployeesAccessRights(resp.data)));
        return dispatch(receiveEmployeesAccessRights(ACCESS_RIGHTS));
    }
}

export function fetchSalons() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getSalons)
            .then(json => dispatch(receiveSalonsList(json.data)));
    };
}

export function fetchPosts() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getEmployeesPosts)
            .then(json => dispatch(receivePostsList(json.data)));
    };
}

export function fetchRoles() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getEmployeesRoles)
            .then(json => dispatch(receiveRolesList(json.data)));
    };
}

export function fetchTags() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getTags)
            .then(json => dispatch(receiveEmployeesTags(json.data)));
    };
}

export function fetchFamilyStatus() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getFamilyStatus)
            .then(json => dispatch(receiveFamilyStatus(json.data)));
    };
}

export function fetchPaymentSchemes() {
  return (dispatch, getState) => {
    return net.aGet(getState(), can.API_EMPLOYEES.getPaymentShemes)
      .then(json => dispatch(receivePaymentSchemes(json.data)));
  };
}

export function onEmployeesGroupSelect(gorup_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getEmployeesGroup.replace(/\{id}/, gorup_id))
            .then(resp => dispatch(receiveEmployeesGroup(resp.data)));
    }
}

export function onEditEmployeesGroup(data, group_id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_EMPLOYEES.editEmployeesGroup.replace(/\{id}/, group_id), data)
            .then(resp => {
                dispatch(receiveEmployeesGroup(resp.data));
                dispatch(fetchCategoriesTree());
            });
    }
}

export function fetchEmployeeEdit(employee_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_EMPLOYEES.getEmployee.replace(/\{id}/, employee_id))
            .then(json => dispatch(receiveEmployeeEdit(json.data)));
    };
}

export function addEmployeesGroup(data) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_EMPLOYEES.addEmployeesGroup, data)
            .then(resp => {
                dispatch(receiveEmployeesGroup(resp.data));
                dispatch(fetchCategoriesTree());
            });
    }
}


export function sendEmployeeAdd(employee) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_EMPLOYEES.addEmployee, employee)
            .then((data) => {
                dispatch(pushNotification({text: data.message, type: data.success ? 'success' : 'error'}));
                if (+data.code === 200) {
                    dispatch(push('/employees/'))
                }
            });
    };
}


export function sendEmployeeEdit(editedEmployee, employee_id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_EMPLOYEES.getEmployee.replace(/\{id}/, employee_id), editedEmployee)
            .then((data) => {
                dispatch(pushNotification({text: data.message, type: data.success ? 'success' : 'error'}));
                if (+data.code === 200) {
                    dispatch(fetchEmployeeEdit(employee_id));
                }

            });
    }
}

export function sendSalaryEdit(editedSalary, employee_id) {
  return (dispatch, getState) => {
    return net.aPut(getState(), can.API_EMPLOYEES.setSalary.replace(/\{id}/, employee_id), editedSalary)
      .then((data) => {
        dispatch(pushNotification({text: data.message, type: data.success ? 'success' : 'error'}));
        if (+data.code === 200) {
          dispatch(fetchEmployeeEdit(employee_id));
        }
      });
  }
}

export function validateEmployee(values) {
    return (dispatch, getState) => {
        return net.aPatch(getState(), can.API_EMPLOYEES.validateEmployees, values)
            .then(resp => {
                if (resp.data.errors) {
                    dispatch(employeeErrorsReceive(resp.data.errors));
                }
            });
    };
}

export function uploadImage(data) {
    return (dispatch, getState) => {
        return net.aIPost(getState(), can.API_COMMONS.uploadImage, data)
            .then(resp => {
                dispatch(receivePhoto(resp.data));
            });
    }
}
