import {connect} from 'react-redux';
import {fetchInvoiceData, startLoadingData, editInventory} from "../../state/actions/invoices";
import InvoiceView from "../../components/invoices/InvoiceView";

const mapStateToProps = (state) => {
    return state.invoiceReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (id, type) => {
            dispatch(startLoadingData());
            dispatch(fetchInvoiceData(id, type));
        },
        onEditInventory: (id, data, from, to, router) => {
            dispatch(editInventory(id, data, from, to, router));
        }
    };
};

const InvoiceViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceView);

export default InvoiceViewContainer;