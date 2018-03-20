import {connect} from 'react-redux';
import * as actions from "../../state/actions/goods";
import GoodSetAddPro from "../../components/goods/GoodSetAddPro";
import {pushNotification} from '../../state/actions/alert';

const mapStateToProps = (state) => ({
    ...state.goodsReducer,
    ...state
});

const mapDispatchToProps = (dispatch, props) => ({
    onAddGood: (addedGood, groupId, goodsType, warehouse, params) => {
        dispatch(actions.addGoodSet(addedGood, groupId, goodsType, warehouse, params))
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

});

    const GoodSetAddProContainer = connect(
        mapStateToProps,
        mapDispatchToProps
    )(GoodSetAddPro);

    export default GoodSetAddProContainer;
