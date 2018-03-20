import {connect} from 'react-redux';
import * as actions from "../../state/actions/goods";
import GoodSetEdit from "../../components/goods/GoodSetEdit";
import {pushNotification} from '../../state/actions/alert';

const mapStateToProps = (state) => ({
    ...state.goodsReducer,
    ...state
});

const mapDispatchToProps = (dispatch) => {
    return {
        onEditGoodSet: (editedGood, package_id, category_id,  warehouse) => {
            dispatch(actions.editGoodSet(editedGood, package_id, category_id, warehouse));
        },
        onCheckGoodSet: (data) => {
            dispatch(actions.validatePackage(data));
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        onErrorsClear: () => {
            dispatch(actions.clearErrors());
        },
        onClearEditedGood: () => {
            dispatch(actions.clearEditedGood());
        },
    };
};

const GoodSetEditContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GoodSetEdit);

export default GoodSetEditContainer;
