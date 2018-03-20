import {connect} from 'react-redux';
import Setting from "../../components/setting/Setting";

const mapStateToProps = (state) => {
    return {
        ...state

    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

const SettingContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Setting);

export default SettingContainer;
