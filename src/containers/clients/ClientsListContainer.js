import {connect} from 'react-redux';
import {fetchClientsList, fetchCategoriesTree, fetchCategoryByPath, clearClientsList} from "../../state/actions/clients";
import ClientsList from "../../components/clients/ClientsList";

const mapStateToProps = (state) => {
    return state.clientsListReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchClientsList());
            dispatch(fetchCategoriesTree());
        },
        onEditItem: (router, client) => {
            router.push('/clients/edit/' + client.client_id);
        },
        onDeleteItem: (router, item) => {
        },
        onLoadClientsWithParams: (category_path) => {
            dispatch(clearClientsList());
            dispatch(fetchCategoryByPath(category_path));
        },
        onClearClientsList: () => {
            dispatch(clearClientsList());
        }
    };
};

const ClientsListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientsList);

export default ClientsListContainer;
