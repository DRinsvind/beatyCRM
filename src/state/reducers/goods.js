import * as types from '../actions/goods';

import { ERROR_RECEIVE } from '../actions/clients';

const initialState = {
    categories: [],
    goods: [],
    good_exp: null,
    categoryName: '',
    category_id: 0,
    units: [],
    goods_list: [],
    goods_tags: [],
    brands: [],
    errors: {},
    loading: true,
    page_info: {
        page: 1,
        pages: 0
    }
};

const initialTreeState = {
    closeNode: [],
    openTree: true
};

export function goodsReducer(state = initialState, action) {
    switch (action.type) {
        case types.GOODS_LIST_RECEIVE:
            return {
                ...state,
                goods_list: action.payload
            };
        case types.GOOD_RECEIVE:
            return {
                ...state,
                good_exp: action.payload
            };
        case types.GOODS_ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };
        case ERROR_RECEIVE:
            return {
                ...state,
                errors: action.payload
            };

        case types.GOODS_TAGS_RECEIVE:
            return {
                ...state,
                goods_tags: action.payload
            };
        case types.BRANDS_RECEIVE:
            return {
                ...state,
                brands: action.payload
            };
        case types.UNITS_RECEIVE:
            return {
                ...state,
                units: action.payload
            };
        case types.GOODS_CATEGORY_ITEMS_RECEIVE:
            let goods = [];
            if (action.payload.category_id === state.category_id) {
                goods = [...state.goods, ...action.payload.goods];
            } else {
                goods = action.payload.goods;
            }
            return {
                ...state,
                goods: goods,
                page_info: action.payload.page_info,
                category_id: action.payload.category_id,
                loading: false
            };
        case types.GOODS_CATEGORY_ITEMS_RECEIVE_FOR_SET:
            return {
                ...state,
                goods: action.payload.goods,
                category_id: action.payload.category_id
            };
        case types.GOODS_CATEGORIES_RECEIVE:
            return {
                ...state,
                categories: action.payload,
                loading: false
            };
        case types.GOODS_INFO_CLEAR:
            return {
                ...state,
                good_exp: null
            };
        case types.GOODS_ERRORS_CLEAR:
            return {
                ...state,
                errors: {}
            };
        case types.GOODS_LIST_CLEAR:
            return {
                ...state,
                loading: true,
                goods: action.payload
            };
        case types.PACKAGE_DETAILS_RECEIVE:
            return {
                ...state,
                package: action.payload
            };

        // ----------------------------------------------------------------
        case types.ADD_EDITED_GOOD:
            let res = state.goods.map(good => {
                if (+good.good_id === +action.payload.good_id) {
                    return {
                        ...good,
                        article: action.payload.article,
                        good_name: action.payload.good_name,
                        brand: action.payload.brand,
                        sale_price: action.payload.sale_price
                    };
                }
                return good;
            });
            return {
                ...state,
                goods: res
            };
        case types.ADD_GOOD:
            return {
                ...state,
                goods: state.goods.push(action.payload)
            };
        // ------------------------------------------------------------------------

        default:
            return state;
    }
}

export function treeReducer(state = initialTreeState, action) {
    switch (action.type) {
        case types.TREE_OPEN:
            let closeNode = [...state.closeNode];
            let index = closeNode.indexOf(action.payload);
            if (index >= 0) {
                closeNode.splice(index, 1);
                return {
                    ...state,
                    closeNode: closeNode,
                    openTree: 'none'
                };
            }
            return state;
        case types.TREE_CLOSE:
            if (state.closeNode.indexOf(action.payload) === -1) {
                return {
                    ...state,
                    closeNode: [...state.closeNode, action.payload],
                    openTree: 'none'
                };
            }

            return state;
        case types.CHANGE_OPEN_TREE:
            return {
                ...state,
                closeNode: [],
                openTree: action.payload
            };
        default:
            return state;
    }
}
