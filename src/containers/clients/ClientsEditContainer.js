import {connect} from 'react-redux';
import {fetchClientsEdit, editClient, fetchClientsTags, fetchClientsQuestionary, editClientsQuestionary, checkInputValue} from '../../state/actions/clients';
import {pushNotification} from '../../state/actions/alert';
import ClientsEdit from "../../components/clients/ClientsEdit";

const mapStateToProps = (state) => {
    return state.clientsEditReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (client_id) => {
            dispatch(fetchClientsTags());
            dispatch(fetchClientsEdit(client_id));
            dispatch(fetchClientsQuestionary(client_id));
        },
        // onSave: (editedClient, client_id, router) => {
        //     dispatch(editClient(editedClient, client_id))
        //         .then(()=> {
        //             router.push('/clients/');
        //         });
        // },
        onEdit: (data, client_id, router) => {
            dispatch(editClient(data, client_id));
        },
        onQuestionaryEdit: (data, client_id, router) => {
            dispatch(editClientsQuestionary(data, client_id));
        },
        onCheckInputValue: (data) => {
            dispatch(checkInputValue(data));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },

    };
};

const ClientsEditContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientsEdit);

export default ClientsEditContainer;