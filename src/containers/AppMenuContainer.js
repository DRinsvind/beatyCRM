import {connect} from 'react-redux';
import {fetchAppMenuIfNeeded, changeComponent} from "../state/actions/menu";
import AppMenu from "../components/AppMenu";

const mapStateToProps = (state) => {
    return state.menu;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchAppMenuIfNeeded());
        },
        onMenuItemSelected: (item) => {
            dispatch(changeComponent(item));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppMenu);