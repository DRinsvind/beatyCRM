import {connect} from 'react-redux';
import {fetchVendorsList, deleteVendor} from "../../state/actions/vendors";
import VendorsList from "../../components/vendors/VendorsList";

const mapStateToProps = (state) => {
    return state.vendorsListReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (params) => {
            dispatch(fetchVendorsList(params));
        },
        onEditItem: (router, vendor) => {
            router.push('/vendors/edit/' + vendor);
        },
        onDeleteItem: (router, vendor) => {
            dispatch(deleteVendor(vendor));
        }
    };
};

const VendorsListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(VendorsList);

export default VendorsListContainer;