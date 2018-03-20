import * as net from "../../utils/network";
import * as can from "../../constants";
import {pushNotification} from './alert';

export const FINANCES_OPERATIONS_LIST = 'FINANCES_OPERATIONS_LIST';
export const VENDORS_LIST = 'VENDORS_LIST';
export const ACCOUNTS_LIST_RESEIVE = 'ACCOUNTS_LIST_RESEIVE';
export const INVOICES_LIST = 'INVOICES_LIST';
export const CLIENTS_LIST = 'CLIENTS_LIST';
export const SERVICES_LIST = 'SERVICES_LIST';
export const EXPENSES_LIST = 'EXPENSES_LIST';
export const FIN_OPERATIONS_CLEAR = 'FIN_OPERATIONS_CLEAR';

function receiveFinancesOperationsList(finances) {
    return {type: FINANCES_OPERATIONS_LIST, payload: finances};
}

function receiveVendorsList(vendors) {
    return {type: VENDORS_LIST, payload: vendors};
}

function receiveAccountsList(accounts) {
    return {type: ACCOUNTS_LIST_RESEIVE, payload: accounts};
}

function receiveInvoicesList(invoices) {
    return {type: INVOICES_LIST, payload: invoices};
}

function receiveClientsList(clients) {
    return {type: CLIENTS_LIST, payload: clients};
}

function receiveServicesList(services) {
    return {type: SERVICES_LIST, payload: services};
}

function receiveExpensesList(expenses) {
    return {type: EXPENSES_LIST, payload: expenses};
}

export function getFinancesOperationsList(date) {
    return(dispatch, getState) => {
        return net.aGet(getState(), can.API_FINANCES.getFinancesOperationsList.replace('{date}', date))
            .then(resp => {
                dispatch(receiveFinancesOperationsList(resp.data));
            })
    }
}

export function getVendorsList() {
    return(dispatch, getState) => {
        return net.aGet(getState(), can.API_FINANCES.getVendorsList)
            .then(resp => {
                dispatch(receiveVendorsList(resp.data));
            })
    }
}

export function getAccounts() {
    return(dispatch, getState) => {
        return net.aGet(getState(), can.API_FINANCES.getAccountsList)
            .then(resp => {
                dispatch(receiveAccountsList(resp.data));
            })
    }
}

export function getClientsList() {
    return(dispatch, getState) => {
        return net.aGet(getState(), can.API_FINANCES.getClientsList)
            .then(resp => {
                dispatch(receiveClientsList(resp.data));
            })
    }
}

export function getServicesList(id) {
    return(dispatch, getState) => {
        return net.aGet(getState(), can.API_FINANCES.getServicesList.replace('{client_id}', id))
            .then(resp => {
                dispatch(receiveServicesList(resp.data));
            })
    }
}

export function getExpensesList() {
    return(dispatch, getState) => {
        return net.aGet(getState(), can.API_FINANCES.getExpensesList)
            .then(resp => {
                dispatch(receiveExpensesList(resp.data));
            })
    }
}

export function createExpence(data) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_FINANCES.createExpense, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getExpensesList());
                }
            })
    }
}

export function addExpence(data, date) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_FINANCES.addExpense, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getFinancesOperationsList(date));
                }
            })
    }
}

export function editExpence(data, id) {
    return(dispatch, getState) => {
        return net.aPut(getState(), can.API_FINANCES.editExpense.replace('{id}', id), data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getExpensesList());
                }
            })
    }
}

export function deleteExpence(id) {
    return(dispatch, getState) => {
        return net.aDelete(getState(), can.API_FINANCES.editExpense.replace('{id}', id))
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getExpensesList());
                }
            })
    }
}

export function addTransfer(data, date) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_FINANCES.addTransfer, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getFinancesOperationsList(date));
                }
            })
    }
}

export function addVendorPay(data, date) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_FINANCES.addPayVendor, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getFinancesOperationsList(date));
                }
            })
    }
}

export function addCashBack(data, date) {
    return(dispatch, getState) => {
        return net.aPost(getState(), can.API_FINANCES.addCashBack, data)
            .then(resp => {
                if (resp.success) {
                    dispatch(pushNotification({text: resp.message}));
                    dispatch(getFinancesOperationsList(date));
                }
            })
    }
}

export function clearState() {
    return {type: FIN_OPERATIONS_CLEAR};
}
