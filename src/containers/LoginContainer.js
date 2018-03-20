import {connect} from "react-redux";
import {fetchSalonsIfNeeded, retrieveToken} from "../state/actions/core";
import Login from "../components/Login";

const mapStateToProps = (state) => {
    return state.core;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchSalonsIfNeeded());
        },
        onSubmit: (data) => {
            dispatch(retrieveToken(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);