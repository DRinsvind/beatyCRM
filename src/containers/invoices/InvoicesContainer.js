import {connect} from 'react-redux';
import * as actions from '../../state/actions/invoices';
import Invoices from "../../components/invoices/Invoices";

const mapStateToProps = (state) => {
    return state.invoicesListReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (type, params, from, to, isClearInvoicesList) => {
            dispatch(actions.fetchInvoicesCategoriesTree());
            if (isClearInvoicesList) {
              dispatch(actions.clearInvoicesList());
            }
            dispatch(actions.fetchInvoicesList(type, params, from, to));
        },
        onLoadVendorsList: (params) => {
            dispatch(actions.fetchVendorsList(params));
        },
        onAddSelect: (type, warehouse) => {
            dispatch(actions.fetchGoodsTree(type, warehouse));
        },
        onSelCategory: (groupId, goodsType, warehouse, params) => {
            dispatch(actions.clearCategory());
            dispatch(actions.fetchCategoriesGoods(groupId, goodsType, warehouse, params));
        },
        onAddInvoice: (data, type, from, to) => {
            dispatch(actions.addInvoice(data, type, from, to));
        },
        onCancel: () => {
            dispatch(actions.clearCategory())
        },
        selectTransactionWarehouse: (warehouse, type, dir) => {
            dispatch(actions.selectTransactionWarehouse(warehouse, type, dir));
        },
        onLoadGroupsGoods: (groupId, goodsType, warehouse, params, dir) => {
            dispatch(actions.clearGoodsTransactionList(dir));
            dispatch(actions.loadGroupsGoods(groupId, goodsType, warehouse, params, dir));
        },
        onInventorySelCategory: (group_id, group_name) => {
            dispatch(actions.fetchCategoriesGoodsInventory(group_id, group_name));
        },
        onLoadInvoices: (vedor_id, good_id) => {
            dispatch(actions.clearReturnInvoicesList());
            dispatch(actions.fetchOnLoadInvoices(vedor_id, good_id));
        },
        clearReturnFormWarehouse: () => {
            dispatch(actions.clearReturnFormWarehouse());
        },
        clearAllReturnData: () => {
            dispatch(actions.clearAllReturnData());
        },
        onLoadInvoice: (id, type) => {
            dispatch(actions.fetchInvoiceData(id, type));
        },
        onValidateDocNumber: (data) => {
            dispatch(actions.validateDocumentNumber(data));
        },
        clearInventoryHTML: () => {
            dispatch(actions.clearInventoryHTML());
        },
        generateDocumentNumber: (type) => {
            dispatch(actions.generateDocumentNumber(type));
        },
        onChangePeriod: (period) => {
            dispatch(actions.changePeriod(period));
        },
        onChangePeriodDate: (name, value) => {
            dispatch(actions.onChangePeriodDate(name, value));
        }
    };
};

const InvoicesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Invoices);

export default InvoicesContainer;