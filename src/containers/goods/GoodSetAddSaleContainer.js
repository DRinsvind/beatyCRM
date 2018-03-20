import {connect} from 'react-redux';
import * as actions from "../../state/actions/goods";
import GoodSetAddSale from "../../components/goods/GoodSetAddSale";
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
    fetchGoodsForSet: (groupId, goodsType, warehouse, params) => {
      dispatch(actions.fetchGoodsForSet(groupId, goodsType, warehouse, params));
    },

});

    const GoodSetAddSaleContainer = connect(
        mapStateToProps,
        mapDispatchToProps
    )(GoodSetAddSale);

    export default GoodSetAddSaleContainer;
