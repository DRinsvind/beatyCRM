import {connect} from 'react-redux';
import {
    fetchTasksList,
    fetchTaskAdd,
    fetchEmployeesList,
    fetchTaskEdit,
    clearTasksList,
    sortTasksList
} from "../../state/actions/tasks";
import {pushNotification} from '../../state/actions/alert';
import TasksList from "../../components/tasks/TasksList";

const mapStateToProps = (state) => {
    return state.tasksListReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: (date) => {
            dispatch(clearTasksList());
            dispatch(fetchTasksList(date));
            dispatch(fetchEmployeesList());
        },
        onAdd: (data, date) => {
            dispatch(fetchTaskAdd(data, date));
        },
        onSelectTask: (task_id) => {
            dispatch(fetchTaskEdit(task_id));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        onTasksSelect: (task_group, group_name) => {

            // dispatch(clearTasksList()).then(() => {
            //     dispatch(sortTasksList(task_group, group_name));
            // });

            dispatch(clearTasksList()).then(() => {
                dispatch(sortTasksList(task_group, group_name));
            });

        }
    };
};

const TasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TasksList);

export default TasksContainer;