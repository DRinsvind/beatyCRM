import {connect} from 'react-redux';
import {getFinancesOperationsList, getVendorsList,
    getAccounts, getExpensesList, clearState,
    getClientsList, createExpence, editExpence,
    deleteExpence, getServicesList, addExpence,
    addTransfer, addVendorPay, addCashBack} from '../../state/actions/finances';
import CashOffice from '../../components/finances/CashOffice';

const mapStateToProps = (state) => {
    return state.financesOperationsReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadFinances: (date) => {
            dispatch(getFinancesOperationsList(date));
            dispatch(getVendorsList());
            dispatch(getAccounts());
            dispatch(getExpensesList());
            dispatch(getClientsList());
        },
        onLoadFinancesList: (date) => {
            dispatch(getFinancesOperationsList(date));
        },
        onServicesLoad: (client_id) => {
            dispatch(getServicesList(client_id));
        },
        onCreateExpense: (data) => {
            dispatch(createExpence(data));
        },
        onEditExpense: (data, id) => {
            dispatch(editExpence(data, id));
        },
        onDeleteExpense: (id) => {
            dispatch(deleteExpence(id));
        },
        onAddExpense: (data, date) => {
           dispatch(addExpence(data, date));
        },
        onAddTransfer: (data, date) => {
            dispatch(addTransfer(data, date));
        },
        onAddVendorPay: (data, date) => {
            dispatch(addVendorPay(data, date));
        },
        onCashBack: (data, date) => {
            dispatch(addCashBack(data, date));
        },
        onClearState: () => {
            dispatch(clearState());
        }
    };
};

const FinancesListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CashOffice);

export default FinancesListContainer;