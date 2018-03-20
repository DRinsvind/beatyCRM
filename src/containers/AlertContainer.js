import {connect} from "react-redux";
import {popNotification} from '../state/actions/alert';
import Alert from '../components/commons/Alert';

const mapStateToProps = (state) => {
    return state.alert;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onReadMessage: () => {
            dispatch(popNotification());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Alert);