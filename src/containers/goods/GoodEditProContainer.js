import {connect} from 'react-redux';
import * as actions from "../../state/actions/goods";
import GoodsEditPro from "../../components/goods/GoodsEditPro";
import {checkInputValue} from "../../state/actions/clients";
import {pushNotification} from '../../state/actions/alert';

const mapStateToProps = (state) => {
    return state.goodsReducer;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onEditGood: (productId, data, good_group_id, warehouse) => {
            dispatch(actions.editGood(productId, data, good_group_id, warehouse));
        },
        onCheckGood: (data) => {
            dispatch(checkInputValue(data));
        },
        onClearEditedGood: () => {
            dispatch(actions.clearEditedGood());
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        onErrorsClear: () => {
            dispatch(actions.clearErrors());
        }
    };
};

const GoodEditProContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GoodsEditPro);

export default GoodEditProContainer;
