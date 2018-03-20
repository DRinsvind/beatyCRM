import {connect} from 'react-redux';
import * as EmplActions from "../../state/actions/employees";
import * as NoteActions from '../../state/actions/alert';
import EmployeesList from "../../components/employees/EmployeesList";

const mapStateToProps = (state) => {
    return state.employeesListReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(EmplActions.fetchCategoriesTree());
        },
        onLoadModules: () => {
            dispatch(EmplActions.fetchGetAccessRights());
        },
        onAddEmployeesGroup: (data) => {
            dispatch(EmplActions.addEmployeesGroup(data));
        },
        onEmployeesGroupSelect: (group_id) => {
            dispatch(EmplActions.onEmployeesGroupSelect(group_id));
        },
        onEditEmployeesGroup: (data, group_id) => {
            dispatch(EmplActions.onEditEmployeesGroup(data, group_id));
        },
        onLoadEmployee: (employee_id) => {
            dispatch(EmplActions.fetchEmployeeEdit(employee_id));
            dispatch(EmplActions.fetchTags());
        },
        onLoadDataForEdit: () => {
            dispatch(EmplActions.fetchSalons());
            dispatch(EmplActions.fetchPosts());
            dispatch(EmplActions.fetchRoles());
            dispatch(EmplActions.fetchTags());
            dispatch(EmplActions.fetchFamilyStatus());
            dispatch(EmplActions.fetchPaymentSchemes());
        },
        onEditEmployee: (data, employee_id) => {
            dispatch(EmplActions.sendEmployeeEdit(data, employee_id));
        },
        onEditSalary: (data, employee_id) => {
          dispatch(EmplActions.sendSalaryEdit(data, employee_id));
        },
        onNotifyShow: (data) => {
            dispatch(NoteActions.pushNotification(data));
        },
        onCheckData: (data) => {
            dispatch(EmplActions.validateEmployee(data));
        },
        clearEmployeesInitialState: () => {
            dispatch(EmplActions.clearEmployeesInitialState());
        },
        onAddNewEmployee: (role_id) => {
            dispatch(EmplActions.onAddNewEmployee(role_id));
        },
        onUploadImage: (data) => {
            dispatch(EmplActions.uploadImage(data));
        },
        onLoadScheduleTypes: () => {
            dispatch(EmplActions.fetchSheduleTypes());
        },
        onLoadEmployeeSchedule: (date) => {
            dispatch(EmplActions.fetchEmployeeShedule(date));
        },
        onUpdateEmployeeShedule: (date, params) => {
            dispatch(EmplActions.updateEmployeeShedule(date, params));
        },
    };
};

const EmployeesListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeesList);

export default EmployeesListContainer;
