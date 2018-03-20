import {connect} from 'react-redux';
import SettingGeneral from "../../components/setting/general/SettingGeneral";
import {changeSettingUrl} from  '../../state/actions/setting'
const mapStateToProps = (state) => {
    return {
        ...state

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeSettingUrl: (settingUrl) => {
            dispatch(changeSettingUrl(settingUrl))
        },
    };
};

const SettingContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingGeneral);

export default SettingContainer;
