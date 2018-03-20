import {
    FINANCES_OPERATIONS_LIST,
    VENDORS_LIST,
    ACCOUNTS_LIST_RESEIVE,
    INVOICES_LIST,
    CLIENTS_LIST,
    SERVICES_LIST,
    EXPENSES_LIST,
    FIN_OPERATIONS_CLEAR
} from '../actions/finances';

const initialState = {
    finances: {},
    vendors: [],
    accounts: [],
    invoices: [],
    clients: [],
    services: [],
    expenses: [],
    load: true
};

export function financesOperationsReducer(state = initialState, action) {
    switch (action.type) {
        case FINANCES_OPERATIONS_LIST:
            return {
                ...state,
                finances: action.payload,
                load: false
            };
        case VENDORS_LIST:
            return {
                ...state,
                vendors: action.payload
            };
        case ACCOUNTS_LIST_RESEIVE:
            return {
                ...state,
                accounts: action.payload
            };
        case INVOICES_LIST:
            return {
                ...state,
                invoices: action.payload
            };
        case CLIENTS_LIST:
            return {
                ...state,
                clients: action.payload
            };
        case SERVICES_LIST:
            return {
                ...state,
                services: action.payload
            };
        case EXPENSES_LIST:
            return {
                ...state,
                expenses: action.payload
            };
        case FIN_OPERATIONS_CLEAR:
            return {
                ...state,
                load: true,
                finances: {}
            };
        default:
            return state;
    }
}