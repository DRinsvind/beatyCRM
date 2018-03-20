import {connect} from 'react-redux';
import {fetchVendorAdd, validateVendor, clearVendorForm, uploadImage} from '../../state/actions/vendors';
import VendorsAdd from "../../components/vendors/VendorsAdd";
import {pushNotification} from '../../state/actions/alert';

const mapStateToProps = (state) => {
    return state.vendorAddReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {

        },
        onAddVendor: (data) => {
            dispatch(fetchVendorAdd(data));
        },
        onCheck: (data) => {
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

const VendorsAddContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(VendorsAdd);

export default VendorsAddContainer;
