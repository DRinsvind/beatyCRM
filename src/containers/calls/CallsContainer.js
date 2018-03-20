import {connect} from 'react-redux';
import Calls from "../../components/calls/Calls";
import {
    fetchCalls,
    switchCallState,
    addComment,
    fetchCallsHistory,
    clearCallsHistory,
    fetchStatuses,
    addStatus
} from '../../state/actions/calls';
import {pushNotification} from '../../state/actions/alert';

const mapStateToProps = (state) => {
    return state.callsReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadCallsList: () => {
            dispatch(fetchStatuses());
            dispatch(fetchCalls());
        },
        onLoadCallsHistory: (params) => {
            dispatch(clearCallsHistory());
            dispatch(fetchCallsHistory(params));
        },
        onCheckCall: (id, status) => {
            dispatch(switchCallState(id, status))
        },
        onAddComment: (data, id) => {
            dispatch(addComment(data, id))
        },
        onAddStatus: (data, id) => {
            dispatch(addStatus(data, id))
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
    };
};

const CallsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Calls);

export default CallsContainer;