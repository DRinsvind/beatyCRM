import * as can from "../../constants";
import * as net from "../../utils/network";
import {pushNotification} from './alert';

/*
 * action types
 */
export const DATE_APPOINTMENTS_RECEIVE = 'DATE_APPOINTMENTS_RECEIVE';
export const CLIENT_DATE_APPOINTMENTS_RECEIVE = 'CLIENT_DATE_APPOINTMENTS_RECEIVE';
export const CALENDAR_SERVICES_RECEIVE = 'CALENDAR_SERVICES_RECEIVE';
export const CALENDAR_GOODS_RECEIVE = 'CALENDAR_GOODS_RECEIVE';
export const SELECTED_CLIENT_CLEAR = 'SELECTED_CLIENT_CLEAR';
export const ERRORS_CLEAR = 'ERRORS_CLEAR';
export const SCROLLED_SWITCH = 'SCROLLED_SWITCH';
export const HIDE_CHECK_WINDOW = 'HIDE_CHECK_WINDOW';
export const SECTION_ID_RESPONSE = 'SECTION_ID_RESPONSE';
export const SERVICE_REQUEST = 'SERVICE_REQUEST';
export const SERVICE_RESPONSE = 'SERVICE_RESPONSE';
export const CALENDAR_MASTERS_RECEIVE = 'CALENDAR_MASTERS_RECEIVE';
export const SELECTED_CLIENT_ADD_NEW = 'SELECTED_CLIENT_ADD_NEW';
export const SHOW_CHECK = 'SHOW_CHECK';
export const DATA_FOR_CHECK_RECEIVE = 'DATA_FOR_CHECK_RECEIVE';
export const DATA_FOR_CHECK_PRINT = 'DATA_FOR_CHECK_PRINT';
export const DATA_FOR_UNPAID_PRINT = 'DATA_FOR_UNPAID_PRINT';
export const CLEAR_HTML_FOR_CHECK = 'CLEAR_HTML_FOR_CHECK';
export const CLEAR_HTML_FOR_UNPAID_CHECK = 'CLEAR_HTML_FOR_UNPAID_CHECK';
export const REFERENCE_SEARCHES_LIST = 'REFERENCE_SEARCHES_LIST';

export const RECEIVE_UNPAID_BILLS = 'RECEIVE_UNPAID_BILLS';
export const RECEIVE_UNPAID_BILLS_INFO = 'RECEIVE_UNPAID_BILLS_INFO';

/*
 * action utils
 */
function receiveUnpaidBillsList(unpaid_bills) {
    return {type: RECEIVE_UNPAID_BILLS, payload: unpaid_bills};
}

function receiveUnpaidBillInfo(bill) {
    return {type: RECEIVE_UNPAID_BILLS_INFO, payload: bill};
}

function receiveDateAppointments(appointments) {
    return {type: DATE_APPOINTMENTS_RECEIVE, payload: appointments};
}

function receiveClientDateAppointments(client) {
    return {type: CLIENT_DATE_APPOINTMENTS_RECEIVE, payload: client};
}

function receiveCalendarServicesTree(services) {
    return {type: CALENDAR_SERVICES_RECEIVE, payload: services};
}

function receiveCalendarGoodsTree(goods) {
    return {type: CALENDAR_GOODS_RECEIVE, payload: goods};
}

function receiveSectionId(section_id) {
    return {type: SECTION_ID_RESPONSE, payload: section_id};
}

function receiveService(service_info) {
    return {type: SERVICE_RESPONSE, payload: service_info};
}
function clearSelectedClient() {
    return {type: SELECTED_CLIENT_CLEAR};
}
function receiveMastersList(masters) {
    return {type: CALENDAR_MASTERS_RECEIVE, payload: masters};
}

function showCheck (client_id) {
    return {type: SHOW_CHECK, client_id};
}

function fetchDataForCheck (data, appointment_id) {
    return {type: DATA_FOR_CHECK_RECEIVE, payload: {data: data, appointment_id: appointment_id}}
}

function fetchCheckHtml (data) {
    return {type: DATA_FOR_CHECK_PRINT, payload: data}
}

function fetchUnpaidBillHtml (data) {
    return {type: DATA_FOR_UNPAID_PRINT, payload: data}
}

function fetchReferenceSearches (data) {
    return {type: REFERENCE_SEARCHES_LIST, payload: data}
}

export function clearHTML () {
    return {type: CLEAR_HTML_FOR_CHECK, payload: undefined}
}

export function clearUnpaidHTML () {
    return {type: CLEAR_HTML_FOR_UNPAID_CHECK, payload: undefined}
}

/*
 * ACTIONS CREATORS
 */
export function fetchUnpaidBillsList() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getUnpaidBills)
            .then(resp => {
                dispatch(receiveUnpaidBillsList(resp.data));
            })
    }
}

export function fetchGetUnpaidBillInfo(appointment_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getUnpaidBillInfo.replace(/\{id}/, appointment_id))
            .then(resp => {
                dispatch(receiveUnpaidBillInfo(resp.data));
            })
    }
}

export function fetchDateAppointments(date) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getAppointments.replace(/\{date}/, date))
            .then(resp => {
                dispatch(receiveDateAppointments(resp.data));
            });
    }
}

export function fetchClientDateAppointments(client_id, date) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getClientsAppointments.replace('{id}', client_id).replace('{date}', date))
            .then(resp => {
                dispatch(receiveClientDateAppointments(resp.data));
            });
    }
}

export function fetchCalendarServicesTree() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getServicesCategories)
            .then(resp => {
                dispatch(receiveCalendarServicesTree(resp.data[0].subcategory));
            });
    };
}

export function fetchCalendarGoodsTree() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getCalendarGoods)
            .then(resp => {
                dispatch(receiveCalendarGoodsTree(resp.data[0].subcategory))
            });
    };
}

export function fetchMastersList() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getMasters)
            .then(resp => {
                dispatch(receiveMastersList(resp.data));
            });
    };
}

/*
 * OLD API
 */

export function fetchSectionId(category_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getServicesSection.replace('{id}', category_id))
            .then(resp => {
                dispatch(receiveSectionId(resp.data))
            });
    };
}

export function fetchServiceInfo(service_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_SERVICES.getService.replace(/\{id}/, service_id))
            .then(resp => {
                dispatch(receiveService(resp.data));
            });
    };
}

export function addAppointment(appointment) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_CALENDAR.addAppointment, appointment)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
            });
    };
}

export function confirmCheck(appointment_id, date) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CALENDAR.appointmentConfirm.replace(/\{id}/, appointment_id))
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchDateAppointments(date));
                }
            });
    };
}

export function checkoutCheck(appointment_id, data, date) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CALENDAR.appointmentCheckout.replace(/\{id}/, appointment_id), data)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchDateAppointments(date));
                    dispatch(clearSelectedClient());
                    dispatch(fetchUnpaidBillsList());
                }
            });
    };
}

export function cancelCheck(appointment_id, date) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_CALENDAR.appointmentCancel.replace(/\{id}/, appointment_id))
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchDateAppointments(date));
                }
            });
    };
}

export function printCheck(appointment_id, data) {
    return (dispatch, getState) => {
        return net.asPost(getState(), can.API_CALENDAR.checkPrint.replace(/\{id}/, appointment_id), data)
            .then(resp => {
                    dispatch(fetchCheckHtml(resp));
            });
    };
}

export function printUnpaidBill(appointment_id) {
    return (dispatch, getState) => {
        return net.asGet(getState(), can.API_COMMONS.printUnpaidBill.replace(/\{id}/, appointment_id))
            .then(resp => {
                dispatch(fetchUnpaidBillHtml(resp));
            });
    };
}

export function saveClientAppointment(appointmentServices, date) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_CALENDAR.addAppointment, appointmentServices)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(fetchDateAppointments(date));
                    dispatch(clearSelectedClient());
                    dispatch(fetchUnpaidBillsList());
                }
            });
    };
}

export function saveAppointmentForCheck(appointmentServices, date) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_CALENDAR.addAppointment, appointmentServices)
            .then(resp => {
                dispatch(fetchClientDateAppointments(+resp.data, date));
                dispatch(fetchDateAppointments(date));
                dispatch(showCheck(+resp.data));
            });
    };
}

export function showClientCheck (client_id, appointment_id, date) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getClientsAppointments.replace('{id}', client_id).replace('{date}', date))
            .then(resp => {
                dispatch(fetchDataForCheck(resp.data, appointment_id))
            });
    }
}

export function fetchSearchesList () {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_CALENDAR.getSearchesList)
            .then(resp => {
                dispatch(fetchReferenceSearches(resp.data))
            });
    }
}