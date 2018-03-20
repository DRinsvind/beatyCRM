import * as net from "../../utils/network";
import * as can from "../../constants";
import {pushNotification} from './alert';

/*
 * action types
 */
export const SERVICES_CATEGORIES_RECEIVE = 'SERVICES_CATEGORIES_RECEIVE';
export const SERVICES_CATEGORY_ITEMS_RECEIVE = 'SERVICES_CATEGORY_ITEMS_RECEIVE';
export const SERVICES_ERRORS_CLEAR = 'SERVICES_ERRORS_CLEAR';
export const SERVICES_INFO_CLEAR = 'SERVICES_INFO_CLEAR';
export const GOODS_LIST_RECEIVE = 'GOODS_LIST_RECEIVE';
export const SERVICE_TAGS_RECEIVE = 'SERVICE_TAGS_RECEIVE';
export const SERVICE_RECEIVE = 'SERVICE_RECEIVE';
export const SERVICES_LIST_CLEAR = 'SERVICES_LIST_CLEAR';


/*
 * action utils
 */

function receiveServicesCategories(categories) {
    return {type: SERVICES_CATEGORIES_RECEIVE, payload: categories};
}

function receiveGoodsList(goods_list) {
    return {type: GOODS_LIST_RECEIVE, payload: goods_list};
}

function receiveServicesTags(services_tags) {
    return {type: SERVICE_TAGS_RECEIVE, payload: services_tags};
}

function clearServiceInfo() {
    return {type: SERVICES_INFO_CLEAR}
}

function receiveService(service_expanded) {
    return {type: SERVICE_RECEIVE, payload: service_expanded};
}

function receiveCategoryServices(services, category_id) {
    return {type: SERVICES_CATEGORY_ITEMS_RECEIVE, payload: {services, category_id}};
}

export function clearServicesList() {
    return {type: SERVICES_LIST_CLEAR, payload: []};
}



/*export function fetchServices(category_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_SERVICES.getServices.replace(/\{id}/, category_id))
            .then(json => dispatch(receiveCategoryServices(json.data, category_id)));
    };
}*/

export function fetchServices(groupId, goodsType, warehouse, params){
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getGoodsWithinGroup.replace(/\{groupId}/, groupId).replace(/\{goodsType}/, goodsType)
            .replace(/\{warehouse}/, warehouse)+params)
            .then((json) => {
                dispatch(receiveCategoryServices(json.data, groupId));
            });
    };
}

/*export function fetchCategories() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_SERVICES.getCategories)
            .then(json => dispatch(receiveServicesCategories(json.data)));
    };
}*/

export function fetchCategories(goodsType, warehouse){
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getGroupsForType.replace(/\{goodsType}/, goodsType).replace(/\{warehouse}/, warehouse))
            .then(json => {dispatch(receiveServicesCategories(json.data))}
            );
    }
}

export function fetchGoodsList() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_GOODS.getAllGoods)
            .then((json) => {
                dispatch(receiveGoodsList(json.data));
            });
    };
}

export function fetchServicesTags() {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_COMMONS.getTags)
            .then((json) => {
                dispatch(receiveServicesTags(json.data));
            });
    };
}

export function fetchServiceEdit(group_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_SERVICES.getEditedService.replace(/\{id}/, group_id))
            .then(json => dispatch(receiveService(json.data)));
    };
}

export function addService(addedService) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_SERVICES.addService, addedService)
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchServices(addedService.service_group_id));
                    dispatch(fetchServicesTags());
                }
            });
    };
}

export function editService(editedService, service_id) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_SERVICES.getEditedService.replace(/\{id}/, service_id), editedService)
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchServices(editedService.service_group_id));
                    dispatch(fetchServicesTags());
                }
            });
    };
}

export function deleteService(service_id, category_id) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_SERVICES.getEditedService.replace(/\{id}/, service_id))
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchServices(category_id));
                }
            });
    };
}

export function clearEditedService() {
    return (dispatch) => {
        return dispatch(clearServiceInfo());
    };
}

export function clearErrors() {
    return {type: SERVICES_ERRORS_CLEAR};
}


// CATEGORIES!!!!!--------------------------------------------------

export function deleteCategory(category_id) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_SERVICES.changeCategories.replace(/\{id}/, category_id))
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchCategories());
                }
            });
    };
}

export function fetchChangeCategories(dragKey, sendData) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_SERVICES.changeCategories.replace(/\{id}/, dragKey), sendData)
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchCategories());
                }
            });
    };
}

export function addNewCategory(parent_id, nameCategory) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_SERVICES.addCategory.replace(/\{id}/, parent_id), {parent_id: parent_id, group_name: nameCategory})
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchCategories());
                }
            });
    };
}

export function editCategory(category_id, newNameCategory) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_SERVICES.editCategory.replace(/\{id}/, category_id), {group_name: newNameCategory})
            .then((json) => {
                dispatch(pushNotification({text: json.message, type: json.success ? 'success' : 'error'}));
                if (json.success) {
                    dispatch(fetchCategories());
                }
            });
    };
}
