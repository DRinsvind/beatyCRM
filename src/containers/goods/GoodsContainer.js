import { connect } from 'react-redux';
import * as actions from '../../state/actions/goods';
import * as vendors from '../../state/actions/vendors';
import { pushNotification } from '../../state/actions/alert';
import Goods from '../../components/goods/Goods';

const mapStateToProps = state => {
    return {
        vendors: [...state.vendorsListReducer.vendors],
        ...state.goodsReducer,
        ...state.menu,
        ...state.treeReducer
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoad: (type, warehouse) => {
            dispatch(actions.fetchCategories(type, warehouse));
            dispatch(actions.fetchGoods(1, 'product', warehouse, ''));
            dispatch(vendors.fetchVendorsList(''));
        },
        onChangeWarehouse: (type, warehouse) => {
            dispatch(actions.clearGoodsList());
            dispatch(actions.fetchCategories(type, warehouse));
        },
        onLoadData: () => {
            dispatch(actions.fetchBrands());
            dispatch(actions.fetchGoodsTags());
        },
        onLoadUnits: () => {
            dispatch(actions.fetchUnits());
        },
        onLoadGoodsList: (groupId, goodsType, warehouse) => {
            dispatch(actions.fetchGoodsList(groupId, goodsType, warehouse));
        },

        onLoadGoodsWithParamsScroll: (groupId, goodsType, warehouse, params) => {
        dispatch(actions.fetchGoodsScroll(groupId, goodsType, warehouse, params));
        },

        onLoadGoodsWithParams: (groupId, goodsType, warehouse, params) => {
            dispatch(actions.fetchGoods(groupId, goodsType, warehouse, params));
        },
        onLoadPackageDetails: package_id => {
            dispatch(actions.getPackageDetails(package_id));
        },
        onRemoveGood: (good_id, goodsType, category_id, warehouse) => {
            dispatch(actions.deleteGood(good_id, goodsType, category_id, warehouse));
        },
        onEditItemLoad: (good_id, type, warehouse) => {
            dispatch(actions.fetchCategories(type, warehouse)).then(() => {
                let params = '?warehouse=' + warehouse;
                dispatch(actions.fetchGoodEdit(good_id, params));
            });
        },
        onPushNotification: (text, type) => {
            dispatch(pushNotification({ text: text, type: type }));
        },

        // --------------------CATEGORIES--------------------------------------------
        onDeleteCategory: (categoryId, goodsType, warehouse) => {
            dispatch(actions.deleteCategory(categoryId, goodsType, warehouse));
        },
        onAddCategory: (data, goodsType, warehouse) => {
            dispatch(actions.addNewCategory(data, goodsType, warehouse));
        },
        onEditCategory: (groupId, data, goodsType, warehouse) => {
            dispatch(actions.editCategory(groupId, data, goodsType, warehouse));
        },

        //---------------------------TREE----------------------------------------------
        onCloseNode: closeNode => {
            dispatch(actions.onTreeClose(closeNode));
        },
        onOpenNode: openNode => {
            dispatch(actions.onTreeOpen(openNode));
        },
        onChangeOpenTree: open => {
            dispatch(actions.onChangeOpenTree(open));
        }
    };
};

const GoodsContainer = connect(mapStateToProps, mapDispatchToProps)(Goods);

export default GoodsContainer;
