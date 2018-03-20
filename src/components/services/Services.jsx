import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ServicesAddContainer from '../../containers/services/ServicesAddContainer'
import ServicesEditContainer from '../../containers/services/ServicesEditContainer'
import Modal from '../commons/modals/Modal';
import TreeView from '../commons/TreeView';
import ServicesTable from './ServicesTable';
import deepAssign from 'deep-assign';
import AddCategoryModal from '../commons/modals/AddCategoryModal';
import RemoveCategoryModal from '../commons/modals/RemoveCategoryModal';
import EditCategoryModal from '../commons/modals/EditCategoryModal';

const initialCategoryState = {
    id: '',
    name: ''
};

const $ = window.$;

/**
 *
 */
class Services extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            categoryTemp: deepAssign({}, initialCategoryState),
            loading: props.loading,
            search: ''
        };
    }

    componentDidMount() {
        this.props.onLoad();
        $('#ModalAddCategory').on('hidden.bs.modal', () => {
            document.querySelector('#formAddCategory').reset();
            this.setState({
                categoryTemp: deepAssign({}, initialCategoryState)
            });
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.categories || nextProps.category_id) {
            nextState.categories = this.mapToDataCategories(nextProps.categories, nextProps.category_id);
        }
        if (nextProps.loading !== this.props.loading) {
            nextState.loading = nextProps.loading;
            nextState.categories = this.mapToDataCategories(nextProps.categories, nextProps.category_id);
        }
    }

    changeSearch = (val) => {
        this.setState({
            search: val,
        });
    };

    mapToDataCategories = (categories, category_id) => {
        let i = 0;
        const loadNodes = (items) => {
            return items.map((item) => {
                i++;
                let flag = (i <= 1) ? true : false;
                if (item.subgroup && item.subgroup.length > 0) {
                    return {
                        item: item,
                        id: item.good_group_id,
                        text: item.good_group_name,
                        children: loadNodes(item.subgroup),
                        state: item.good_group_id === category_id ? {
                            opened: true,
                            selected: true,
                            disabled: this.state.loading
                        } : {
                            opened: true,
                            selected: false,
                            disabled: this.state.loading
                        }
                    };
                }

                return {
                    item: item,
                    id: item.good_group_id,
                    text: item.good_group_name,
                    type: 'file',
                    state: item.good_group_id === category_id ? {
                        selected: true,
                        disabled: this.state.loading
                    } : {
                        selected: false,
                        disabled: this.state.loading
                    }
                };
            });
        };

        return loadNodes(categories);
    };

    onItemSelect = (category) => {
        this.props.onItemTreeClick(category.id);
    };

    onItemEdit = (service_id) => {
        if (this.props.services_tags.length < 1 || this.props.goods_list.length < 1) {
            this.props.onLoadData();
        }
        this.props.onEditItemLoad(service_id);
    };

    addCategory = (e) => {
        document.querySelector('#formAddCategory').reset();
        window.$('#ModalAddCategory').modal('hide');
        e.preventDefault();
        this.props.onAddCategory(+this.state.categoryTemp.id, this.state.categoryTemp.name);
        this.state.categoryTemp = deepAssign({}, initialCategoryState);
    };

    onAddCategoryName = (id) => {
        let temp = this.state.categoryTemp;
        temp.id = id;
        this.setState({
            categoryTemp: temp
        });
        $('#ModalAddCategory').modal('show');
    };

    editCategory = (e) => {
        document.querySelector('#formEditCategory').reset();
        window.$('#ModalEditCategory').modal('hide');
        e.preventDefault();
        this.props.onEditCategory(+this.state.categoryTemp.id, this.state.categoryTemp.name);
        this.state.categoryTemp = deepAssign({}, initialCategoryState);
    };

    onEditCategoryName = (id, name) => {
        this.setState({
            categoryTemp: {
                id: id,
                name: name
            }
        });
        $('#ModalEditCategory').modal('show');
    };
    saveAddCaterogy = () => {
        document.getElementById('save-services-add').click();
    };
    onRemoveCategory = (id) => {
        let temp = this.state.categoryTemp;
        temp.id = id;
        this.setState({
            categoryTemp: temp,
        });
        $('#ModalRemoveCategory').modal('show');
    };

    removeCategory = (e) => {
        e.preventDefault();
        this.props.onDeleteCategory(this.state.categoryTemp.id);
        this.setState({
            categoryTemp: deepAssign({}, initialCategoryState)
        });
        window.$('#ModalRemoveCategory').modal('hide');
    };

    onRemoveService = (id, categoryId) => {
        this.setState({
            removingService: {
                id: id,
                categoryId: categoryId
            }
        });
        $('#ModalRemoveService').modal('show');
    };

    removeService = () => {
        this.props.onRemoveService(this.state.removingService.id, this.state.removingService.categoryId);
        this.setState({
            removingService: undefined
        });
        window.$('#ModalRemoveService').modal('hide');
    };

    inputChangeName = (e) => {
        let temp = this.state.categoryTemp;
        temp.name = e.target.value;
        this.setState({
            categoryTemp: temp,
        });
    };

    render() {
        return (
            <section className="content-with-menu">
                <Modal
                       save={this.saveAddCaterogy}
                       customClass="modal-block modal-block-full"
                       name="servicesAdd"
                       id="ModalAdd"
                       idForm="formAdd"
                       title="Услуга"
                       fa="fa-plus-circle"
                >
                    <ServicesAddContainer category_id={this.props.category_id}/>
                </Modal>

                <Modal id="ModalRemoveService"
                       customClass="modal-dialog"
                       title="Удаление услуги">
                    <h4 className="text-center">
                        Вы уверены, что хотите удалить услугу?
                    </h4>
                    <div className="modal-footer row">
                        <div className="text-right">
                            <button type="button"
                                    className="btn btn-primary mr-sm"
                                    onClick={this.removeService}>
                                <i className="fa fa-fw fa-trash"/>&nbsp;Удалить
                            </button>
                            <button type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal">
                                <i className="fa fa-fw fa-times"/>&nbsp;Отмена
                            </button>
                        </div>
                    </div>
                </Modal>

                <AddCategoryModal
                    inputChangeName={this.inputChangeName}
                    addCategory={this.addCategory}/>

                <RemoveCategoryModal
                    removeCategory={this.removeCategory}/>

                <EditCategoryModal
                    categoryTemp={this.state.categoryTemp}
                    inputChangeName={this.inputChangeName}
                    editCategory={this.editCategory}/>

                <div className="content-with-menu-container">
                    <menu
                        id="content-menu"
                        className="inner-menu"
                        role="menu"
                    >
                        <div className="nano">
                            <div className="nano-content">
                                {/*<div className="inner-menu-content">*/}
                                    {/*<hr className="separator"/>*/}
                                    <div className="sidebar-widget m-none">
                                        <div className="widget-header">
                                            <h6 className="title"
                                                style={{
                                                    paddingTop: 5,
                                                    paddingLeft: 14,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                УСЛУГИ
                                            </h6>
                                            <i
                                                className="fa fa-plus-circle "
                                                aria-hidden="true"
                                                onClick={e =>
                                                    // this.onAddTopCategory(e)
                                                    console.log('AddCategory')
                                                }
                                                style={{
                                                    marginLeft: '15px',
                                                    color: '#e58c8c',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                        <div className="widget-content">
                                            <TreeView items={this.state.categories}
                                                      onItemSelect={this.onItemSelect}
                                                      onAddCategory={this.onAddCategoryName}
                                                      onRenameCategory={this.onEditCategoryName}
                                                      onRemoveCategory={this.onRemoveCategory}/>
                                        </div>
                                    </div>
                                {/*</div>*/}
                            </div>
                        </div>
                    </menu>
                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <section className="panel">
                                    <header className="panel-heading">

                                        {/*<div*/}
                                            {/*className="pull-right"*/}
                                            {/*style={{*/}
                                            {/*'position': 'relative',*/}
                                            {/*'top': '-25px'*/}
                                        {/*}}>*/}
                                            {/*<div className="row">*/}
                                                {/*<div className="col-md-12 text-center">*/}
                                                    {/*<a href="#ModalAdd"*/}
                                                       {/*className="btn btn-primary mr-md"*/}
                                                       {/*data-toggle="modal"*/}
                                                       {/*onClick={(e) => {*/}
                                                           {/*e.preventDefault();*/}
                                                           {/*if (this.props.services_tags.length < 1 || this.props.goods_list.length < 1) {*/}
                                                               {/*this.props.onLoadData();*/}
                                                           {/*}*/}
                                                       {/*}}>*/}
                                                        {/*<i className="fa fa-fw fa-plus mr-xs"/>*/}
                                                        {/*Услуга*/}
                                                    {/*</a>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}

                                        <div
                                            className="pull-right"
                                            style={{
                                                position: 'relative',
                                                top: '-25px',
                                                right: '-17px'
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-md-12 goods-header-search">
                                                    <div className="input-group mb-md searchCustom">
                                                        <input
                                                            id="q"
                                                            name="q"
                                                            type="text"
                                                            className="form-control goods-search border-right-none"
                                                            placeholder="Поиск..."
                                                            // value={this.props.search
                                                            //     ? this.props.search
                                                            //     : this.state.search}
                                                            // onChange={e => {
                                                            //     e.preventDefault();
                                                            //     this.searchChange(e.target.value);
                                                            // }}
                                                        />
                                                        <span
                                                            className="input-group-btn"
                                                            style={{
                                                                width: '0'
                                                            }}
                                                        >
                                                                <button className="btn btn-default text-free border-left-none goods-button-search">
                                                                    <i className="fa fa-search" />
                                                                </button>
                                                            </span>
                                                    </div>

                                                    <a
                                                        href='#ModalAdd'
                                                        className="btn btn-primary mr-md goods-add"
                                                        style={{
                                                            marginLeft: '20px'
                                                        }}
                                                        data-toggle="modal"
                                                        onClick={(e) => {
                                                        e.preventDefault();
                                                        if (this.props.services_tags.length < 1 || this.props.goods_list.length < 1) {
                                                        this.props.onLoadData();
                                                        }
                                                        }}
                                                    >
                                                        <i className="fa fa-plus-circle" />
                                                        &nbsp;
                                                        <i className="fa fa-cut" />
                                                    </a>
                                                    <a
                                                        href={this.state.selected_warehouse == 1
                                                            ? '#ModalAddSetPro'
                                                            : '#ModalAddSetSale'}
                                                        className="btn btn-custom goods-add"
                                                        data-toggle="modal"
                                                        // onClick={e => {
                                                        //     e.preventDefault();
                                                        //     if (this.props.goods_tags.length < 1 || this.props.brands.length < 1) {
                                                        //         this.props.onLoadData();
                                                        //     }
                                                        // }}
                                                    >
                                                        <i className="fa fa-exchange" />
                                                        &nbsp;
                                                        <i className="fa fa-usd" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </header>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div
                                                className="col-md-12"
                                                style={{marginTop: '-30px'}}
                                            >
                                                <ServicesTable items={this.props.services}
                                                               key={this.props.services.group_id}
                                                               onItemEdit={this.onItemEdit}
                                                               router={this.props.router}
                                                               category_id={this.props.category_id}
                                                               onRemoveService={this.onRemoveService}
                                                               menu={this.state.menu}
                                                               loading={this.state.loading}
                                                               search={this.state.search}
                                                               changeSearch={this.changeSearch}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <Modal handlePressButt={this.onEditButtonClick}
                                       customClass="modal-block modal-block-full"
                                       id="ModalEdit"
                                       idForm="formEdit"
                                       title="Редактирование услуги">
                                    <ServicesEditContainer service_id={this.state.service_id}/>
                                </Modal>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }
}

Services.propTypes = {
    categories: PropTypes.array.isRequired,
    category_id: PropTypes.number.isRequired,
    services: PropTypes.array.isRequired,
    services_tags: PropTypes.array.isRequired,
    goods_list: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onLoadData: PropTypes.func.isRequired,
    onItemTreeClick: PropTypes.func.isRequired,
    onDeleteCategory: PropTypes.func.isRequired,
    onAddCategory: PropTypes.func.isRequired,
    onEditCategory: PropTypes.func.isRequired,
    onRemoveService: PropTypes.func.isRequired,
    onEditItemLoad: PropTypes.func.isRequired
};

export default Services;