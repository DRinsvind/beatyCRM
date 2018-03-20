import {connect} from 'react-redux';
import {
    addService,
    clearErrors
} from "../../state/actions/services";
import ServicesAdd from "../../components/services/ServicesAdd";
import {checkInputValue} from "../../state/actions/clients";
import {pushNotification} from '../../state/actions/alert';
import {fetchGoodsTree,clearCategory,fetchCategoriesGoods} from '../../state/actions/invoices';
const mapStateToProps = (state) => ({
    ...state.servicesReducer,
    token: state.core.token,
    goodsTest:state.invoicesListReducer,
    brands:state.goodsReducer.brands
});

const mapDispatchToProps = (dispatch) => {
    return {
        onAddService: (addedService) => {
            dispatch(addService(addedService))
        },
        onCheckService: (data) => {
            dispatch(checkInputValue(data));
        },
        onErrorsClear: () => {
            dispatch(clearErrors());
        },
        onNotifyShow: (data) => {
            dispatch(pushNotification(data));
        },
        /////////
        onSelCategory: (groupId, goodsType, warehouse, params) => {
            dispatch(clearCategory());
            dispatch(fetchCategoriesGoods(groupId, goodsType, warehouse, params));
        },
        onAddCategoriesGoods: (type, warehouse) => {
            console.log('DISPATCH',type, warehouse);
            dispatch(fetchGoodsTree(type, warehouse));
        },
    };
};

const ServicesAddContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ServicesAdd);

export default ServicesAddContainer;
