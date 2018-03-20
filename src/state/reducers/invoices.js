import * as types from '../actions/invoices';
import {
    FORMAT_DATE_WITH_SLASH
} from '../../utils/index'

const initialState = {
    invoice: {},
    loading: true
};

const listInitialState = {
    invoices: [],
    categories: [],
    goods_categories: [],
    vendors_list: [],
    warehouses_list: [{id: 0, text: 'Витрина', type: 'sale'}, {id: 1, text: 'Проф. использование', type: 'pro'}],
    goods: [],
    category_id: 0,
    category_name: '',
    loading: true,
    page_info: {
        page: 1,
        pages: 0
    },
    groupsFrom: [],
    groupsTo: [],
    goodsFrom: [],
    goodsTo: [],
    returnInvoices: [],
    returnLoad: '',
    invoice: {},
    errors: {},
    html_inventory: undefined,
    docNum: '',
    period: 'date',
    requested_date: {
        from: FORMAT_DATE_WITH_SLASH(new Date()),
        to: FORMAT_DATE_WITH_SLASH(new Date())
    },
};

const editInitialState = {
    invoice: {},
    errors: []
};


export function invoicesListReducer(state = listInitialState, action) {
    let goodsFrom = state.goodsFrom;
    let goodsTo = state.goodsTo;
    switch (action.type) {
      case types.INVOICES_LIST_RECEIVE:
            return {
                ...state,
                invoices: [...state.invoices, ...action.payload.invoices],
                page_info: action.payload.page_info,
                loading: false
            };
        case types.INVOICES_CATEGORIES_TREE_RECEIVE:
            return {
                ...state,
                categories: action.payload
            };
        case types.INVOICES_VENDORS_LIST_RECEIVE:
            return {
                ...state,
                vendors_list: action.payload
            };
        case types.WAREHOUSES_LIST_RECEIVE:
            return {
                ...state,
                warehouses_list: action.payload
            };
        case types.GOODS_CATEGORIES_RECEIVE:
            return {
                ...state,
                goods_categories: action.payload,
                returnLoad: '',
                goods: []
            };
        case types.GOODS_CATEGORY_GOODS_RECEIVE:
            return {
                ...state,
                goods: action.payload.goods,
                category_id: action.payload.category_id,
                returnLoad: ''
            };
        case types.GOODS_CATEGORY_INVENTORY_RECEIVE:
            return {
                ...state,
                goods: action.payload.goods,
                category_id: action.payload.group_id,
                category_name: action.payload.group_name
            };
        case types.CATEGORIES_DATA_CLEAR:
            return {
                ...state,
                goods: [],
                returnInvoices: [],
                returnLoad: 'goods'
            };
        case types.INVOICES_LIST_RETURN_CLEAR:
            return {
                ...state,
                returnInvoices: [],
                returnLoad: 'invoices'
            };
        case types.INVOICES_LIST_CLEAR:
            return {
                ...state,
                invoices: action.payload,
                loading: true
            };
        case types.GOODS_CATEGORIES_FOR_TRANSACTIONS_RECEIVE:
            let groupsFrom = state.groupsFrom;
            let groupsTo = state.groupsTo;
            if (action.payload.direction === 'from') {
                goodsFrom = [];
                groupsFrom = action.payload.categories;
            } else {
                goodsTo = [];
                groupsTo = action.payload.categories;
            }
            return {
                ...state,
                groupsFrom: groupsFrom,
                groupsTo: groupsTo,
                goodsFrom: goodsFrom,
                goodsTo: goodsTo
            };
        case types.GOODS_TRANSACTION_CATEGORY_GOODS_RECEIVE:
            if (action.payload.direction === 'from') {
                goodsFrom = action.payload.goods;
            } else {
                goodsTo = action.payload.goods;
            }
            return {
                ...state,
                goodsFrom: goodsFrom,
                goodsTo: goodsTo,
            };
        case types.RECEIVE_CLEAR_TRANSACTIONS_GOODS:
            if (action.payload.direction === 'from') {
                goodsFrom = action.payload.goods;
            } else {
                goodsTo = action.payload.goods;
            }
            return {
                ...state,
                goodsFrom: goodsFrom,
                goodsTo: goodsTo
            };
        case types.RECEIVE_RETURNING_INVOICES:
            return {
                ...state,
               returnInvoices: action.payload,
                returnLoad: ''
            };
        case types.RECEIVE_CLEAR_WAREHAUSE:
           return {
               ...state,
               goods: [],
               returnInvoices: [],
               goods_categories: [],
               returnLoad: 'groups'
           };
        case types.RECEIVE_CLEAR_ALL_RETURN_DATA:
            return {
                ...state,
                returnLoad: '',
                returnInvoices: [],
                goods_categories: [],
                goods: []
            };
        case types.INVOICE_RECEIVE:
            return {
                ...state,
                invoice: action.payload
            };
        case types.RECEIVE_DOCUMENTS_ERRORS:
            return {
                ...state,
                errors: action.payload
            };
        case types.RECEIVE_PRINT_INVENTORY:
            return {
                ...state,
                html_inventory: action.payload
            };
        case types.CLEAR_HTML_FOR_INVENTORY:
            return {
                ...state,
                html_inventory: undefined
            };
        case types.RECEIVE_DOCUMENT_NUMBER:
            return {
                ...state,
                docNum: action.payload
            };
        case types.RECEIVE_PERIOD_CHANGED:
            return {
                ...state,
                period: action.payload
            };
        case types.RECEIVE_PERIOD_DATE_CHANGED:
            return {
                ...state,
                requested_date: {
                    ...state.requested_date,
                    ...action.payload
                },
                period: 'other'
            };
        default:
            return state;
    }
}

export function invoiceReducer(state = initialState, action) {
    switch (action.type) {
        case types.INVOICE_RECEIVE:
            return {
                ...state,
                invoice: action.payload,
                loading: false
            };
        case types.RECEIVE_START_LOADING_INVOICE:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}

export function invoiceEditReducer(state = editInitialState, action) {
    switch (action.type) {
        case types.INVOICES_ITEM_EDIT_RECEIVE:
            return {
                ...state,
                invoice: action.payload
            };
        case types.ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        default:
            return state;
    }
}