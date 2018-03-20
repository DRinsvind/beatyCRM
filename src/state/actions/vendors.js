import * as can from "../../constants";
import * as net from "../../utils/network";
import {push} from 'react-router-redux'
import {pushNotification} from './alert';

export const VENDORS_LIST_RECEIVE = 'VENDORS_LIST_RECEIVE';
export const VENDORS_ITEM_EDIT_RECEIVE = 'VENDORS_ITEM_EDIT_RECEIVE';
export const VENDORS_ERRORS_RECEIVE = 'VENDORS_ERRORS_RECEIVE';
export const CLEAR_VENDOR_FORM = 'CLEAR_VENDOR_FORM';
export const RECEIVE_VENDOR_PHOTO = 'RECEIVE_VENDOR_PHOTO';


function receiveVendorsList(vendors, info) {
    return {type: VENDORS_LIST_RECEIVE, payload: {vendors: vendors, info: info}};
}

function receiveVendorsEdit(vendor) {
    return {type: VENDORS_ITEM_EDIT_RECEIVE, payload: vendor};
}

function receiveVendorsErrors(errors) {
    return {type: VENDORS_ERRORS_RECEIVE, payload: errors}
}

export function clearVendorForm() {
    return {type: CLEAR_VENDOR_FORM}
}

function receivePhoto(id, type) {
    return {type: RECEIVE_VENDOR_PHOTO, payload: {id: id, type: type}};
}

export function fetchVendorsList(params) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_VENDORS.getVendors + params)
            .then(resp => {
                dispatch(receiveVendorsList(resp.data, resp.info));
            });
    }
}

export function fetchVendorAdd(vendor) {
    return (dispatch, getState) => {
        return net.aPost(getState(), can.API_VENDORS.getVendors, vendor)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if (resp.success) {
                    dispatch(push('/vendors/'));
                }
            });
    };
}

export function fetchVendorEdit(vendor_id) {
    return (dispatch, getState) => {
        return net.aGet(getState(), can.API_VENDORS.getVendor.replace(/\{id}/, vendor_id))
            .then(resp => {
                dispatch(receiveVendorsEdit(resp.data));
            });
    };
}

export function deleteVendor(vendor_id) {
    return (dispatch, getState) => {
        return net.aDelete(getState(), can.API_VENDORS.getVendor.replace(/\{id}/, vendor_id))
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if(resp.success) {
                    dispatch(fetchVendorsList(''));
                }
            });
    };
}

export function editVendor(editedVendor, vendor_id, router) {
    return (dispatch, getState) => {
        return net.aPut(getState(), can.API_VENDORS.getVendor.replace(/\{id}/, vendor_id), editedVendor)
            .then(resp => {
                dispatch(pushNotification({text: resp.message, type: resp.success ? 'success' : 'error'}));
                if(resp.success) {
                    dispatch(fetchVendorEdit(vendor_id));
                    router.push('/vendors/profile/' + vendor_id);
                }
                if(resp.code === 400) {
                    dispatch(receiveVendorsErrors(resp.data.errors));
                }
            });
    };
}

export function validateVendor(data) {
    return (dispatch, getState) => {
        return net.aPatch(getState(), can.API_VENDORS.vendorsValidation, data)
            .then(resp => {
                if (resp.data.errors) {
                    dispatch(receiveVendorsErrors(resp.data.errors));
                }
            })
    }
}

export function uploadImage(data, type) {
    return (dispatch, getState) => {
        return net.aIPost(getState(), can.API_COMMONS.uploadImage, data)
            .then(resp => {
                dispatch(receivePhoto(resp.data, type));
            });
    }
}
