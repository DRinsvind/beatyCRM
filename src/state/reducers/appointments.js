import {
    SELECTED_CLIENT_CLEAR,
    DATE_APPOINTMENTS_RECEIVE,
    CLIENT_DATE_APPOINTMENTS_RECEIVE,
    CALENDAR_SERVICES_RECEIVE,
    CALENDAR_GOODS_RECEIVE,
    SECTION_ID_RESPONSE,
    SERVICE_RESPONSE,
    CALENDAR_MASTERS_RECEIVE,
    ERRORS_CLEAR,
    SELECTED_CLIENT_ADD_NEW,
    SCROLLED_SWITCH,
    SHOW_CHECK,
    HIDE_CHECK_WINDOW,
    DATA_FOR_CHECK_RECEIVE,
    DATA_FOR_CHECK_PRINT,
    CLEAR_HTML_FOR_CHECK,
    REFERENCE_SEARCHES_LIST,
    RECEIVE_UNPAID_BILLS,
    RECEIVE_UNPAID_BILLS_INFO,
    DATA_FOR_UNPAID_PRINT,
    CLEAR_HTML_FOR_UNPAID_CHECK
} from "../actions/appointments";

import {ERROR_RECEIVE} from "../actions/clients";

const initialState = {
    appointments: [],
    client_info: {
        client_id: '',
        last_name: '',
        second_name: '',
        first_name: '',
        phone: '',
        category_id: '',
        category_name: '',
        note: ''
    },
    categories: [],
    section_id: '',
    service_info: {
        amount: ''
    },
    scrolled: true,
    client_id_for_check: undefined,
    html_for_check: undefined,
    references_list: [],
    unpaid_bills: [],
    unpaid_bill_info: {},
    loading: true
};

function appointmentsReducer(state = initialState, action) {
    switch (action.type) {
        case DATE_APPOINTMENTS_RECEIVE:
            return {
                ...state,
                appointments: action.payload,
                loading: false
            };
        case CLIENT_DATE_APPOINTMENTS_RECEIVE:
            return {
                ...state,
                selectedClient: action.payload
            };
        case SELECTED_CLIENT_CLEAR:
            return {
                ...state,
                selectedClient: undefined,
                scrolled: true
            };
        case CALENDAR_SERVICES_RECEIVE:
            return {
                ...state,
                services: action.payload
            };
        case CALENDAR_GOODS_RECEIVE:
            return {
                ...state,
                goods: action.payload
            };
        case CALENDAR_MASTERS_RECEIVE:
            return {
                ...state,
                masters: action.payload,
            };
        case SECTION_ID_RESPONSE:
            return {
                ...state,
                section_id: action.payload.section_id.post_id
            };
        case SERVICE_RESPONSE:
            return {
                ...state,
                service_info: action.payload
            };
        case ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case ERRORS_CLEAR:
            return {
                ...state,
                errors: {}
            };
        case SELECTED_CLIENT_ADD_NEW:
            return {
                ...state,
                selectedClient: action.data,
            };
        case SCROLLED_SWITCH:
            return {
                ...state,
                scrolled: action.scrolled_state
            };
        case SHOW_CHECK:
            return {
                ...state,
                client_id_for_check: action.client_id
            };
        case HIDE_CHECK_WINDOW:
            return {
                ...state,
                client_id_for_check: undefined
            };
        case DATA_FOR_CHECK_RECEIVE:
            return {
                ...state,
                selectedClientData: {
                    selectedClientDetails: action.payload.data,
                    selectedAppointmentId: action.payload.appointment_id
                }
            };
        case DATA_FOR_CHECK_PRINT:
            return {
                ...state,
                html_for_check: action.payload
            };
        case DATA_FOR_UNPAID_PRINT:
            return {
                ...state,
                html_unpaid_for_check: action.payload
            };
        case CLEAR_HTML_FOR_CHECK:
            return {
                ...state,
                html_for_check: action.payload
            };
        case CLEAR_HTML_FOR_UNPAID_CHECK:
            return {
                ...state,
                html_unpaid_for_check: action.payload
            };
        case REFERENCE_SEARCHES_LIST:
            return {
                ...state,
                references_list: action.payload
            };
        case RECEIVE_UNPAID_BILLS:
            return {
                ...state,
                unpaid_bills: action.payload
            };
        case RECEIVE_UNPAID_BILLS_INFO:
            return {
                ...state,
                unpaid_bill_info: {
                    selectedClientDetails: action.payload,
                    selectedAppointmentId: action.payload.appointments[0].appointment_id
                }
            };
        default:
            return state;
    }
}

export default appointmentsReducer;
