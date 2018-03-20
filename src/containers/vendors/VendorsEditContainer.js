import {connect} from 'react-redux';
import {editVendor, fetchVendorEdit, validateVendor, clearVendorForm, uploadImage} from '../../state/actions/vendors';
import {pushNotification} from '../../state/actions/alert';
import VendorsEdit from "../../components/vendors/VendorsEdit";

const mapStateToProps = (state) => {
    return state.vendorEditReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (vendor_id) => {
           dispatch(fetchVendorEdit(vendor_id));
        },
        onEdit: (data, vendor_id, router) => {
            dispatch(editVendor(data, vendor_id, router));
        },
        onCheckInputValue: (data) => {
            dispatch(validateVendor(data));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        clearVendorForm: () => {
            dispatch(clearVendorForm());
        },
        onUploadImage: (data, type) => {
            dispatch(uploadImage(data, type));
        }
    };
};

const VendorsEditContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(VendorsEdit);

export default VendorsEditContainer;