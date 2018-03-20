import {connect} from 'react-redux';
import {fetchTaskEdit, deleteTask, editTask, fetchEmployeesList, editTaskState, deleteTaskComment, addTaskNote, fetchTasksList} from "../../state/actions/tasks";
import {pushNotification} from '../../state/actions/alert';
import ShowTask from "../../components/tasks/ShowTask";

const mapStateToProps = (state) => {
    return state.tasksEditReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onItem: (task_id) => {
            dispatch(fetchTaskEdit(task_id));
            dispatch(fetchEmployeesList());
        },
        onEdit: (data, task_id) => {
            dispatch(editTask(data, task_id));
        },
        onDeleteTask: (router, task_id, date) => {
            dispatch(deleteTask(task_id, date));
        },
        onEditTaskState: (task_id, data) => {
            dispatch(editTaskState(task_id, data));
        },
        onAddEditTaskNote: (task_id, data) => {
            dispatch(addTaskNote(task_id, data));
        },
        onDeleteComment: (task_id) => {
            dispatch(deleteTaskComment(task_id));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        onBackClick: (date, router) => {
            dispatch(fetchTasksList(date)).then(router.push('/tasks/'));
        }
    };
};

const EditTasksContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowTask);

export default EditTasksContainer;