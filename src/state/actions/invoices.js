import * as net from "../../utils/network";
import * as can from "../../constants";
import {push} from 'react-router-redux';
import {pushNotification} from './alert';

export const INVOICES_LIST_RECEIVE = 'INVOICES_LIST_RECEIVE';
export const INVOICES_CATEGORIES_TREE_RECEIVE = 'INVOICES_CATEGORIES_TREE_RECEIVE';
export const INVOICES_ITEM_EDIT_RECEIVE = 'INVOICES_ITEM_EDIT_RECEIVE';
export const INVOICES_VENDORS_LIST_RECEIVE = 'INVOICES_VENDORS_LIST_RECEIVE';

export const GOODS_CATEGORIES_RECEIVE = 'GOODS_CATEGORIES_RECEIVE';
export const GOODS_CATEGORY_GOODS_RECEIVE = 'GOODS_CATEGORY_GOODS_RECEIVE';
export const WAREHOUSES_LIST_RECEIVE = 'WAREHOUSES_LIST_RECEIVE';

export const CATEGORIES_DATA_CLEAR = 'CATEGORIES_DATA_CLEAR';
export const INVOICE_RECEIVE = 'INVOICE_RECEIVE';
export const RECEIVE_CLEAR_WAREHAUSE = 'RECEIVE_CLEAR_WAREHAUSE';
export const RECEIVE_CLEAR_ALL_RETURN_DATA = 'RECEIVE_CLEAR_ALL_RETURN_DATA';
export const INVOICES_LIST_RETURN_CLEAR = 'INVOICES_LIST_RETURN_CLEAR';
export const RECEIVE_DOCUMENTS_ERRORS = 'RECEIVE_DOCUMENTS_ERRORS';
export const GOODS_CATEGORY_INVENTORY_RECEIVE = 'GOODS_CATEGORY_INVENTORY_RECEIVE';

export const INVOICES_LIST_CLEAR = 'INVOICES_LIST_CLEAR';
export const GOODS_CATEGORIES_FOR_TRANSACTIONS_RECEIVE = 'GOODS_CATEGORIES_FOR_TRANSACTIONS_RECEIVE';
export const GOODS_TRANSACTION_CATEGORY_GOODS_RECEIVE = 'GOODS_TRANSACTION_CATEGORY_GOODS_RECEIVE';
export const RECEIVE_CLEAR_TRANSACTIONS_GOODS = 'RECEIVE_CLEAR_TRANSACTIONS_GOODS';
export const RECEIVE_RETURNING_INVOICES = 'RECEIVE_RETURNING_INVOICES';
export const RECEIVE_START_LOADING_INVOICE = 'RECEIVE_START_LOADING_INVOICE';
export const RECEIVE_PRINT_INVENTORY = 'RECEIVE_PRINT_INVENTORY';
export const CLEAR_HTML_FOR_INVENTORY = 'CLEAR_HTML_FOR_INVENTORY';
export const RECEIVE_DOCUMENT_NUMBER = 'RECEIVE_DOCUMENT_NUMBER';
export const RECEIVE_PERIOD_CHANGED = 'RECEIVE_PERIOD_CHANGED';
export const RECEIVE_PERIOD_DATE_CHANGED = 'RECEIVE_PERIOD_DATE_CHANGED';

function receiveInvoicesList(invoices, page_info) {
    return {type: INVOICES_LIST_RECEIVE, payload: {invoices, page_info}};
}

function receiveInvoicesCategoriesTree(categories) {
    return {type: INVOICES_CATEGORIES_TREE_RECEIVE, payload: categories};
}

function receiveVendorsList(vendors_list) {
    return {type: INVOICES_VENDORS_LIST_RECEIVE, payload: vendors_list};
}

function receiveReurningInvoices(invoices) {
    return {type: RECEIVE_RETURNING_INVOICES, payload: invoices};
}

// function receiveWarehousesList(warehouses_list) {
//     return {type: WAREHOUSES_LIST_RECEIVE, payload: warehouses_list};
// }

function receiveGoodsCategories(categories) {
    return {type: GOODS_CATEGORIES_RECEIVE, payload: categories};
}

function receiveGoodsCategoriesTrans(categories, dir) {
    return {type: GOODS_CATEGORIES_FOR_TRANSACTIONS_RECEIVE, payload: {categories: categories, direction: dir}};
}

function receiveCategoryGoods(goods, category_id) {
    return {type: GOODS_CATEGORY_GOODS_RECEIVE, payload: {goods: goods, category_id: category_id}};
}

function receiveCategoryGoodsInventory(goods, group_id, group_name) {
    return {type: GOODS_CATEGORY_INVENTORY_RECEIVE, payload: {goods: goods, group_id: group_id, group_name: group_name}};
}

function receiveTransactionCategoryGoods(goods, direction) {
    return {type: GOODS_TRANSACTION_CATEGORY_GOODS_RECEIVE, payload: {goods: goods, direction: direction}};
}

function cleareCategoriesData() {
    return {type: CATEGORIES_DATA_CLEAR};
}

function receiveInvoice(invoice) {
    return {type: INVOICE_RECEIVE, payload: invoice};
}

function receiveDocumentNumber(error) {
    return {type: RECEIVE_DOCUMENTS_ERRORS, payload: error}
}

function fetchInventoryHtml(data) {
    return {type: RECEIVE_PRINT_INVENTORY, payload: data}
}

export function clearInvoicesList() {
    return {type: INVOICES_LIST_CLEAR, payload: []};
}

export function clearReturnInvoicesList() {
    return {type: INVOICES_LIST_RETURN_CLEAR, payload: []};
}

export function clearGoodsTransactionList(direction) {
    return {type: RECEIVE_CLEAR_TRANSACTIONS_GOODS, payload: {goods: [], direction: direction}}
}

export function clearReturnFormWarehouse() {
    return {type: RECEIVE_CLEAR_WAREHAUSE}
}

export function clearAllReturnData() {
    return {type: RECEIVE_CLEAR_ALL_RETURN_DATA}
}

export function startLoadingData() {
    return {type: RECEIVE_START_LOADING_INVOICE}
}

export function clearInventoryHTML () {
    return {type: CLEAR_HTML_FOR_INVENTORY}
}

function receiveDocumentNum(number) {
    return {type: RECEIVE_DOCUMENT_NUMBER, payload: number}
}

export function changePeriod(pediod) {
    return {type: RECEIVE_PERIOD_CHANGED, payload: pediod}
}

export function onChangePeriodDate(name, value) {
    return {type: RECEIVE_PERIOD_DATE_CHANGED, payload: {[name]: value}}
}

export function fetchInvoicesList(type, params, from, to) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getInvoicesList.replace(/\{type_name}/, type).replace(/\{date_from}/, from).replace(/\{date_to}/, to) + params)
            .then(resp => {
                if (resp.success) {
                    dispatch(receiveInvoicesList(resp.data, resp.info));
                }
            });
    }
}

export function fetchInvoicesCategoriesTree() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getInvoicesCategories)
            .then(resp => {
                dispatch(receiveInvoicesCategoriesTree(resp.data))
            });
    }
}

export function fetchVendorsList() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getVendorsList)
            .then(resp => {
                dispatch(receiveVendorsList(resp.data));
            });
    };
}

export function fetchGoodsTree(goodsType, warehouse) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getGroupsForType.replace(/\{goodsType}/, goodsType).replace(/\{warehouse}/, warehouse))
            .then(resp => {
                dispatch(receiveGoodsCategories(resp.data));
            });
    };
}

export function selectTransactionWarehouse(warehouse, goodsType, dir) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getGroupsForType.replace(/\{goodsType}/, goodsType).replace(/\{warehouse}/, warehouse))
            .then(resp => {
                dispatch(receiveGoodsCategoriesTrans(resp.data, dir));
            });
    };
}

export function fetchCategoriesGoods(groupId, goodsType, warehouse, params) {
    return (dispatch, getState) => {
        return net.aGet(getState(),  can.API_GOODS.getGoodsWithinGroup.replace(/\{groupId}/, groupId).replace(/\{goodsType}/, goodsType)
            .replace(/\{warehouse}/, warehouse)+params)
            .then(resp => {
                dispatch(receiveCategoryGoods(resp.data, groupId));
            });
    };
}

export function fetchCategoriesGoodsInventory(group_id, group_name) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getInventoryCategoryGoods.replace(/\{group_id}/, group_id))
            .then(resp => {
                dispatch(receiveCategoryGoodsInventory(resp.data, group_id, group_name));
            })
    }
}

export function fetchOnLoadInvoices(vendor_id, good_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getInvoices.replace(/\{vendor_id}/, vendor_id).replace(/\{good_id}/, good_id))
            .then(resp => {
                dispatch(receiveReurningInvoices(resp.data));
            })
    }
}

export function loadGroupsGoods(groupId, goodsType, warehouse, params, dir) {
    return (dispatch, getState) => {
        return net.aGet(getState(),  can.API_GOODS.getGoodsWithinGroup.replace(/\{groupId}/, groupId).replace(/\{goodsType}/, goodsType)
            .replace(/\{warehouse}/, warehouse)+params)
            .then(resp => {
                dispatch(receiveTransactionCategoryGoods(resp.data, dir));
            });
    };
}

export function addInvoice(data, type, from, to) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_INVOICES.addInvoice.replace('{type_name}', type), data)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    if (type === 'inventory') {
                        dispatch(fetchPrintDoc(resp.data));
                    }
                    dispatch(cleareCategoriesData());
                    dispatch(fetchInvoicesList(type, '', from, to));
                }
            });
    };
}

export function fetchInvoiceData(id, type) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getInvoice.replace('{id}', id).replace('{type_name}', type))
            .then(resp => {
                dispatch(receiveInvoice(resp.data));
            });
    };
}

function fetchPrintDoc(doc_id) {
    return (dispatch, getState) => {
        return net.asGet(getState(), can.API_INVOICES.printDocument.replace(/{doc_id}/, doc_id))
            .then(resp => {
                dispatch(fetchInventoryHtml(resp));
            });
    };
}

export function clearCategory() {
    return (dispatch) => {
        dispatch(cleareCategoriesData())
    }
}

export function validateDocumentNumber(data) {
    return (dispatch, getState) => {
        return net.aPatch(getState(), can.API_INVOICES.validateInvoices, data)
            .then(resp => {
                if(resp.data.errors) {
                    dispatch(receiveDocumentNumber(resp.data.errors));
                } else {
                    dispatch(receiveDocumentNumber({}));
                }
            })
    }
}

export function editInventory(id, data, from, to, router) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_INVOICES.editInventory.replace(/\{id}/, id), data)
            .then(resp => {
                if (resp.success) {
                    dispatch(fetchInvoicesList('inventory', '', from, to));
                    router.push('/invoices/');
                }
            })
    }
}

export function generateDocumentNumber(type) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_INVOICES.getDocNumber.replace(/\{type}/, type))
            .then(resp => {
                dispatch(receiveDocumentNum(resp.data));
            })
    }
}