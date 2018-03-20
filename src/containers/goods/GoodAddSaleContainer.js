import { connect } from 'react-redux';
import * as actions from '../../state/actions/goods';
import { pushNotification } from '../../state/actions/alert';
import GoodsAddSale from '../../components/goods/GoodsAddSale';
import { checkInputValue } from '../../state/actions/clients';

const mapStateToProps = state => {
    return state.goodsReducer;
};

const mapDispatchToProps = dispatch => {
    return {
        onAddGood: (addedGood, warehouse_id, groupId, goodsType) => {
            console.log('onAddGood');
            dispatch(actions.addGood(addedGood, warehouse_id, groupId, goodsType));
        },
        onCheckGood: data => {
            dispatch(checkInputValue(data));
        },
        onNotifyShow: data => {
            dispatch(pushNotification(data));
        },
        onErrorsClear: () => {
            dispatch(actions.clearErrors());
        }
    };
};

const GoodAddSaleContainer = connect(mapStateToProps, mapDispatchToProps)(GoodsAddSale);

export default GoodAddSaleContainer;
