import * as net from '../../utils/network';
import * as can from '../../constants';
import { pushNotification } from './alert';

/*
 * action types
 */
export const GOODS_CATEGORIES_RECEIVE = 'GOODS_CATEGORIES_RECEIVE';
export const GOODS_CATEGORY_ITEMS_RECEIVE = 'GOODS_CATEGORY_ITEMS_RECEIVE';
export const GOODS_CATEGORY_ITEMS_RECEIVE_FOR_SET = 'GOODS_CATEGORY_ITEMS_RECEIVE_FOR_SET';
export const BRANDS_RECEIVE = 'BRANDS_RECEIVE';
export const GOODS_TAGS_RECEIVE = 'GOODS_TAGS_RECEIVE';
export const UNITS_RECEIVE = 'UNITS_RECEIVE';
export const ADD_EDITED_GOOD = 'ADD_EDITED_GOOD';
export const ADD_GOOD = 'ADD_GOOD';
export const GOOD_RECEIVE = 'GOOD_RECEIVE';
export const GOODS_LIST_RECEIVE = 'GOODS_LIST_RECEIVE';
export const GOODS_INFO_CLEAR = 'GOODS_INFO_CLEAR';
export const GOODS_ERRORS_CLEAR = 'GOODS_ERRORS_CLEAR';
export const GOODS_LIST_CLEAR = 'GOODS_LIST_CLEAR';
export const PACKAGE_DETAILS_RECEIVE = 'PACKAGE_DETAILS_RECEIVE';

export const TREE_CLOSE = 'TREE_CLOSE';
export const TREE_OPEN = 'TREE_OPEN';
export const CHANGE_OPEN_TREE = 'CHANGE_OPEN_TREE';

// -------------------PACKAGES--------------------------------------

export const GOODS_ERROR_RECEIVE = 'GOODS_ERROR_RECEIVE';

/*
 * action utils
 */

function receiveGoodsCategories(categories) {
    return { type: GOODS_CATEGORIES_RECEIVE, payload: categories };
}

function receiveGood(good_expanded) {
    return { type: GOOD_RECEIVE, payload: good_expanded };
}

function receiveBrands(brands) {
    console.log(brands,'BRAAAAAANDS')
    return { type: BRANDS_RECEIVE, payload: brands };
}

function receiveGoodsTags(goods_tags) {
    return { type: GOODS_TAGS_RECEIVE, payload: goods_tags };
}

function receiveUnits(units) {
    return { type: UNITS_RECEIVE, payload: units };
}

function receiveCategoryGoods(goods, page_info, category_id) {
    return { type: GOODS_CATEGORY_ITEMS_RECEIVE, payload: { goods, page_info, category_id } };
}
function receiveCategoryGoodsForSet(goods, page_info, category_id) {
    return { type: GOODS_CATEGORY_ITEMS_RECEIVE_FOR_SET, payload: { goods, page_info, category_id } };
}

function receiveGoodsList(goods_list) {
    return { type: GOODS_LIST_RECEIVE, payload: goods_list };
}

function clearGoodInfo() {
    return { type: GOODS_INFO_CLEAR };
}

function goodErrorsReceive(errors) {
    return { type: GOODS_ERROR_RECEIVE, payload: errors };
}

export function clearGoodsList() {
    return { type: GOODS_LIST_CLEAR, payload: [] };
}

export function receivePackageDetails(package_details) {
    return { type: PACKAGE_DETAILS_RECEIVE, payload: package_details };
}

// ------------------------------------------------------

function treeClose(closeNode) {
    return { type: TREE_CLOSE, payload: closeNode };
}
function treeOpen(openNode) {
    return { type: TREE_OPEN, payload: openNode };
}

function changeOpenTree(open) {
    return { type: CHANGE_OPEN_TREE, payload: open };
}

// -----------------------------------------------------------------------------

export function fetchCategories(goodsType, warehouse) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getGroupsForType.replace(/\{goodsType}/, goodsType).replace(/\{warehouse}/, warehouse)).then(json => {
            dispatch(receiveGoodsCategories(json.data));
        });
    };
}

export function fetchGoodsScroll(groupId, goodsType, warehouse, params) {
    return (dispatch, getState) => {
        return net
            .aGet(
                getState(),
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, groupId)
                    .replace(/\{goodsType}/, goodsType)
                    .replace(/\{warehouse}/, warehouse) + params
            )
            .then(json => {
                dispatch(receiveCategoryGoods(json.data, json.info, groupId));
            });
    };
}

export function fetchGoods(groupId, goodsType, warehouse, params) {
    return (dispatch, getState) => {
        return net
            .aGet(
                getState(),
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, groupId)
                    .replace(/\{goodsType}/, goodsType)
                    .replace(/\{warehouse}/, warehouse) + params
            )
            .then(json => {
                dispatch(clearGoodsList());
                dispatch(receiveCategoryGoods(json.data, json.info, groupId));
            });
    };
}

export function fetchGoodsForSet(groupId, goodsType, warehouse, params) {
    return (dispatch, getState) => {
        return net
            .aGet(
                getState(),
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, groupId)
                    .replace(/\{goodsType}/, goodsType)
                    .replace(/\{warehouse}/, warehouse) + params
            )
            .then(json => {
                dispatch(receiveCategoryGoodsForSet(json.data, json.info, groupId));
            });
    };
}

export function fetchBrands() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getBrands).then(json => dispatch(receiveBrands(json.data)));
    };
}

export function fetchGoodsTags() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getTags).then(json => {
            dispatch(receiveGoodsTags(json.data));
        });
    };
}

export function fetchUnits() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getUnits).then(json => {
            dispatch(receiveUnits(json.data));
        });
    };
}

export function fetchGoodEdit(good_id, params) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getEditGood.replace(/\{productId}/, good_id) + params).then(json => {
            dispatch(receiveGood(json.data));
        });
    };
}

export function fetchGoodsList(groupId, goodsType, warehouse) {
    return (dispatch, getState) => {
        return net
            .aGet(
                getState(),
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, groupId)
                    .replace(/\{goodsType}/, goodsType)
                    .replace(/\{warehouse}/, warehouse)
            )
            .then(json => {
                dispatch(receiveGoodsList(json.data));
            });
    };
}

/**
 *
 * @param params
 */

export function addGood(params, warehouse_id, groupId, goodsType) {
    console.log('ACTION_ADD_GOOD', params);
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_GOODS.addGood, params).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                let warehouseName = warehouse_id === 1 ? 'pro' : 'sale';
                dispatch(fetchGoods(groupId, goodsType, warehouseName, ''));
                dispatch(fetchGoodsTags());
                dispatch(fetchBrands());
            }
        });
    };
}

export function editGood(productId, data, good_group_id, warehouse) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_GOODS.getEditGood.replace(/\{productId}/, productId), data).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                // dispatch(addEditedGood(editedGood));
                dispatch(fetchGoods(good_group_id, 'product', warehouse, ''));
                dispatch(fetchGoodsTags());
                dispatch(fetchBrands());
                dispatch(clearEditedGood());
            }
        });
    };
}

export function deleteGood(good_id, goodsType, category_id, warehouse) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_GOODS.removeExistedProduct.replace(/\{productId}/, good_id)).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                dispatch(fetchGoods(category_id, goodsType, warehouse, ''));
            }
        });
    };
}

export function clearEditedGood() {
    return dispatch => {
        return dispatch(clearGoodInfo());
    };
}

export function clearErrors() {
    return { type: GOODS_ERRORS_CLEAR };
}

//-------------------------------------CATEGORIES-----------------------------------------------

export function deleteCategory(category_id, goodsType, warehouse) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_GOODS.removeExistedGroup.replace(/\{groupId}/, category_id)).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                dispatch(fetchCategories(goodsType, warehouse));
            }
        });
    };
}

export function addNewCategory(data, goodsType, warehouse) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_GOODS.createNewGroup, data).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                dispatch(fetchCategories(goodsType, warehouse));
            }
        });
    };
}

export function editCategory(groupId, data, goodsType, warehouse) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_GOODS.updateExistedGroup.replace(/\{groupId}/, groupId), data).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                dispatch(fetchCategories(goodsType, warehouse));
            }
        });
    };
}

//PACKAGES
export function validatePackage(values) {
    return (dispatch, getState) => {
        return net.aPatch(getState(), can.API_GOODS.validatePackage, values).then(resp => {
            dispatch(goodErrorsReceive(resp));
        });
    };
}

export function getPackageDetails(package_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getPackageDetails.replace(/\{package_id}/, package_id)).then(json => {
            dispatch(receivePackageDetails(json.data));
        });
    };
}

export function editGoodSet(editedGood, package_id, category_id, warehouse) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_GOODS.getEditSetGood.replace(/\{package_id}/, package_id), editedGood).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                //dispatch(fetchGoods(category_id, 'product', warehouse, ''));
                dispatch(fetchGoodsTags());
                //dispatch(fetchBrands());
                dispatch(clearEditedGood());
            }
        });
    };
}

export function addGoodSet(addedGood, groupId, goodsType, warehouse, params) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_GOODS.addGoodSet, addedGood).then(json => {
            dispatch(pushNotification({ text: json.message, type: json.success ? 'success' : 'error' }));
            if (json.success) {
                dispatch(fetchGoods(groupId, goodsType, warehouse, params));
                dispatch(fetchGoodsTags());
                dispatch(fetchBrands());
            }
        });
    };
}

export function onTreeClose(closeNode) {
    return dispatch => {
        dispatch(treeClose(closeNode));
    };
}

export function onTreeOpen(openNode) {
    return dispatch => {
        dispatch(treeOpen(openNode));
    };
}

export function onChangeOpenTree(open) {
    return dispatch => {
        dispatch(changeOpenTree(open));
    };
}

///////////////////////
