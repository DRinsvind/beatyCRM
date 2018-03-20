import {connect} from 'react-redux';
import * as EmployeesActions from '../../state/actions/employees';
import EmployeesAdd from "../../components/employees/EmployeesAdd";
import {pushNotification} from '../../state/actions/alert';

const mapStateToProps = (state) => {
    return state.employeesAddReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(EmployeesActions.fetchSalons());
            dispatch(EmployeesActions.fetchPosts());
            dispatch(EmployeesActions.fetchRoles());
            dispatch(EmployeesActions.fetchTags());
            dispatch(EmployeesActions.fetchFamilyStatus());
        },
        onAddEmployee: (data) => {
            dispatch(EmployeesActions.sendEmployeeAdd(data));
        },
        onCheck: (data) => {
            dispatch(EmployeesActions.validateEmployee(data));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        onUploadImage: (data) => {
            dispatch(EmployeesActions.uploadImage(data));
        }
    };
};

const EmployeeAddContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeesAdd);

export default EmployeeAddContainer;
