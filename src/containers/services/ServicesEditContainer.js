import {connect} from 'react-redux';
import {
    editService,
    clearErrors,
    clearEditedService
} from "../../state/actions/services";
import ServicesEdit from "../../components/services/ServicesEdit";
import {checkInputValue} from "../../state/actions/clients";
import {pushNotification} from '../../state/actions/alert';


const mapStateToProps = (state) => {
    return state.servicesReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onEditService: (editedService, service_id) => {
            dispatch(editService(editedService, service_id));
        },
        onCheckService: (data) => {
            dispatch(checkInputValue(data));
        },
        onErrorsClear: () => {
            dispatch(clearErrors());
        },
        onClearEditedService: () => {
            dispatch(clearEditedService());
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        }
    };
};

const ServicesEditContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ServicesEdit);

export default ServicesEditContainer;

