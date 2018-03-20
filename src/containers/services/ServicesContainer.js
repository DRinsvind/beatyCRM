import {connect} from 'react-redux';
import {fetchCategories,
    fetchServices,
    deleteCategory,
    addNewCategory,
    editCategory,
    deleteService,
    fetchServiceEdit,
    fetchGoodsList,
    fetchServicesTags,
    clearServicesList
} from "../../state/actions/services";
import {fetchBrands} from '../../state/actions/goods'
import Services from "../../components/services/Services";

const mapStateToProps = (state) => {
    return {
        ...state.servicesReducer,
        ...state.menu

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchCategories('product','sale'));
            dispatch(fetchServices(1,'product','sale',''));
            dispatch(fetchBrands());
        },
        onLoadData: () => {
            dispatch(fetchServicesTags());
            dispatch(fetchGoodsList());
        },
        onItemTreeClick: (category_id) => {
            dispatch(clearServicesList());
            dispatch(fetchServices(category_id));
        },
        onRemoveService: (service_id, category_id) => {
            dispatch(deleteService(service_id, category_id));
        },
        onEditItemLoad: (service_id) => {
            dispatch(fetchCategories()).then(() => {
                dispatch(fetchServiceEdit(service_id));
            })
        },


  // CATEGORIES!!!!!---------------------------------------------------------------
        onDeleteCategory: (category_id) => {
            dispatch(deleteCategory(category_id));
        },
        onAddCategory: (parent_id, group_name, warehouse, goods_type) => {
            dispatch(addNewCategory(parent_id, group_name, warehouse, goods_type));
        },
        onEditCategory: (category_id, new_category_name) => {
            dispatch(editCategory(category_id, new_category_name));
        }
    };
};

const ServicesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Services);

export default ServicesContainer;
