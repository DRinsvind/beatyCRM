import {connect} from 'react-redux';
import {
    fetchWorkSchedule,
    fetchAddWorkingDay,
    fetchEmployeesGroups,
    fetchClearWorkSchedule,
    fetchChangeWorkingHours,
    fetchWorkSchedulePost
} from "../../state/actions/work_schedule";
import WorkSchedule from "../../components/schedule/WorkSchedule";

const mapStateToProps = (state) => {
    return state.workScheduleReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadSchedule: (date) => {
            dispatch(fetchWorkSchedule(date));
            dispatch(fetchEmployeesGroups());
        },
        onSelectCategory: (path, date) => {
            dispatch(fetchWorkSchedulePost(path, date));
            dispatch(fetchClearWorkSchedule());
        },
        onAddWorkingDay: (data) => {
            dispatch(fetchAddWorkingDay(data));
        },
        onChangeWorkingHours: (data) => {
            dispatch(fetchChangeWorkingHours(data));
        }
    };
};

const WorkScheduleContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkSchedule);

export default WorkScheduleContainer;