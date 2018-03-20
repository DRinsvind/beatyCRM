import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GoodAddProContainer from '../../containers/goods/GoodAddProContainer';
import GoodAddSaleContainer from '../../containers/goods/GoodAddSaleContainer';
import GoodSetAddSaleContainer from '../../containers/goods/GoodSetAddSaleContainer';
import GoodSetAddProContainer from '../../containers/goods/GoodSetAddProContainer';
import GoodEditProContainer from '../../containers/goods/GoodEditProContainer';
import GoodEditSaleContainer from '../../containers/goods/GoodEditSaleContainer';
import GoodSetEditContainer from '../../containers/goods/GoodSetEditContainer';

import AddCategoryModal from '../commons/modals/AddCategoryModal';
import RemoveCategoryModal from '../commons/modals/RemoveCategoryModal';
import EditCategoryModal from '../commons/modals/EditCategoryModal';
import TreeView from '../commons/TreeView';

import Modal from '../commons/modals/Modal';
import deepAssign from 'deep-assign';
import GoodsTable from './GoodsTable';

const $ = window.$;

const initialCategoryState = {
    id: '',
    name: ''
};

class Goods extends Component {
    constructor(props) {
        super(props);
        this.onChangeWarehouse = this.onChangeWarehouse.bind(this);
        this.onItemTreeClick = this.onItemTreeClick.bind(this);
        this.onScrollWindow = this.onScrollWindow.bind(this);
        this.state = {
            categories: [],
            goods: [],
            category_id: 0,
            categoryTemp: deepAssign({}, initialCategoryState),
            selected_warehouse: 2,
            loading: props.loading,
            info: props.page_info,
            table_sort: {},
            vendors: []
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollWindow);
        this.props.onLoad('product', 'sale');
        $('#ModalAddCategory').on('hide.bs.modal', () => {
            document.querySelector('#formAddCategory').reset();
        });
        if (this.props.units.length < 1) {
            this.props.onLoadUnits();
        }
    }

    componentWillReceiveProps() {
        $('body').removeClass('noscroll');
        let scroll = $('body').css('top');
        scroll = scroll.substring(0, scroll.length - 2);
        scroll = +scroll.substring(1);
        document.documentElement.scrollTop = scroll;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.categories || nextProps.category_id) {
            nextState.categories = this.mapToDataCategories(nextProps);
        }

        if (nextProps.page_info !== this.props.page_info) {
            nextState.info = nextProps.page_info;
        }

        if (nextProps.goods) {
            nextState.goods = nextProps.goods;
        }

        if (nextProps.category_id && nextProps.category_id !== 0 && nextProps.category_id !== 1) {
            nextState.category_id = nextProps.category_id;
        }

        if (nextProps.menu) {
            if (nextProps.menu.sections.length > 0) {
                nextState.menu = nextProps.menu.sections
                    .filter(section => +section.id === 2)[0]
                    .items.filter(item => +item.id === 6)[0];
            }
        }

        if (nextProps.loading !== this.props.loading) {
            nextState.loading = nextProps.loading;
            nextState.categories = this.mapToDataCategories(nextProps);
        }
        if (nextProps.vendors !== this.props.vendors) {
            nextState.vendors = nextProps.vendors.map(item => {
                return { id: item.legal_enity_id, text: item.short_name };
            });
            nextState.vendors.unshift({ id: 0, text: 'Все' });
        }
    }

    componentDidUpdate() {
        $('#vendors_select').select2({
            theme: 'bootstrap',
            placeholder: 'Выберите поставщика',
            data: this.state.vendors,
            tags: true,
            width: '180px',
            escapeMarkup: function(markup) {
                return markup;
            },
            templateResult: this.format
        });

        $('#vendors_select')
            .off('change')
            .on('change', e => this.onSelectVendor(e));
    }

    format = icon =>
        `<i class="fa fa-truck goods-vendor-select-icon" aria-hidden="true"></i>${icon.text}`;

    onScrollWindow = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (
            scrollHeight - clientHeight < document.documentElement.scrollTop + 1 &&
            scrollHeight - clientHeight !== 0 &&
            this.state.info.page < this.state.info.pages
        ) {
            const warehouseName = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

            const vendorId = '';
            const tableSort = this.state.table_sort;

            const page =
                this.state.info.page < this.state.info.pages
                    ? this.state.info.page + 1
                    : this.state.info.page;

            const asc_param = tableSort.order
                ? '&order=' + tableSort.order + '&asc=' + (tableSort.asc === 'asc' ? 1 : 0)
                : '';

            let params = '&page=' + page + vendorId;
            params = params + asc_param;
            this.props.onLoadGoodsWithParamsScroll(
                this.props.category_id,
                'product',
                warehouseName,
                params
            );
            $('body')
                .css('top', -document.documentElement.scrollTop + 'px')
                .addClass('noscroll');
        }
    };

    onSelectVendor = e => {
        const vendorId = e.target.value == 0 ? '' : `&vendor=${e.target.value}`;

        let params = `&page=${this.state.info.page}${vendorId}`;
        const asc_param = this.state.table_sort.order
            ? `&order=${this.state.table_sort.order}&asc=${
                  this.state.table_sort.asc === 'asc' ? 1 : 0
              }`
            : '';

        params = params + asc_param;
        const warehouseName = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

        this.props.onLoadGoodsWithParams(this.state.category_id, 'product', warehouseName, params);
    };

    mapToDataCategories = nextProps => {
        const categories = nextProps.categories;
        const category_id = nextProps.category_id;
        const openTree = nextProps.openTree;
        const closeNode = nextProps.closeNode;
        const loading = nextProps.loading;

        let i = 0;
        const loadNodes = items => {
            return items.map(item => {
                i++;

                if ((item.subgroup && item.subgroup.length > 0) || item.is_root) {
                    return {
                        item: item,
                        id: item.good_group_id,
                        text: item.good_group_name,
                        children: loadNodes(item.subgroup),
                        state:
                            item.good_group_id === category_id
                                ? {
                                      //opened: openTree ? true : false,//closeNode.find((i) => {return i == item.good_group_id})? false : true,
                                      opened:
                                          openTree === true
                                              ? true
                                              : openTree === false
                                                ? false
                                                : closeNode.find(i => {
                                                      return i == item.good_group_id;
                                                  })
                                                  ? false
                                                  : true,
                                      selected: true,
                                      disabled: loading
                                  }
                                : {
                                      opened:
                                          openTree === true
                                              ? true
                                              : openTree === false
                                                ? false
                                                : closeNode.find(i => {
                                                      return i == item.good_group_id;
                                                  })
                                                  ? false
                                                  : true,
                                      selected: false,
                                      disabled: loading
                                  }
                    };
                }

                return {
                    item: item,
                    id: item.good_group_id,
                    text: item.good_group_name,
                    type: 'file',
                    state:
                        item.good_group_id === category_id
                            ? {
                                  selected: true,
                                  disabled: loading
                              }
                            : {
                                  selected: false,
                                  disabled: loading
                              }
                };
            });
        };

        return loadNodes(categories);
    };

    // EVENTS

    onAddTopCategory = e => {
        e.preventDefault();
        this.onAddCategoryName();
    };

    onChangeWarehouse = e => {
        e.preventDefault();
        let selectedId = this.state.selected_warehouse;
        $(this.refs['toggle-button']).toggle('slide');

        if (this.state.selected_warehouse === 1) {
            selectedId++;
            this.props.onChangeWarehouse('product', 'sale');
        } else {
            selectedId = 1;
            this.props.onChangeWarehouse('product', 'pro');
        }

        this.setState({ selected_warehouse: selectedId });
    };

    tableSort = (order, asc) => {
        let params = '';

        this.setState({
            ...this.state,
            table_sort: {
                order: order,
                asc: asc
            }
        });
        if (this.state.info.page === this.state.info.pages) {
            params = '&page=1';
        } else {
            params = `&page=${this.state.info.page}`;
        }

        const asc_param = this.state.table_sort.order
            ? `&order=${this.state.table_sort.order}&asc=${
                  this.state.table_sort.asc === 'asc' ? 1 : 0
              }`
            : '';

        params = params + asc_param;

        let warehouse = this.state.selected_warehouse === 1 ? 'pro' : 'sale';
        this.props.onLoadGoodsWithParams(this.state.category_id, 'product', warehouse, params);
    };

    addCategory = e => {
        e.preventDefault();

        if (!this.state.categoryTemp.name) {
            this.props.onPushNotification('Введите название', 'error');
        } else {
            document.querySelector('#formAddCategory').reset();
            $('#ModalAddCategory').modal('hide');
            const warehouseName = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

            this.props.onAddCategory(
                {
                    parent_id: +this.state.categoryTemp.id,
                    group_name: this.state.categoryTemp.name,
                    warehouse: warehouseName,
                    goods_type: 'product'
                },
                'product',
                warehouseName
            );

            this.setState({ categoryTemp: deepAssign({}, initialCategoryState) });
        }
    };

    onAddCategoryName = id => {
        const temp = this.state.categoryTemp;
        temp.id = id;
        this.setState({ categoryTemp: temp });
        $('#ModalAddCategory').modal('show');
    };

    editCategory = e => {
        e.preventDefault();

        if (!this.state.categoryTemp.name) {
            this.props.onPushNotification('Введите название', 'error');
        } else {
            $('#ModalEditCategory').modal('hide');
            document.querySelector('#formEditCategory').reset();

            const warehouseName = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

            this.props.onEditCategory(
                this.state.categoryTemp.id,
                {
                    group_name: this.state.categoryTemp.name,
                    warehouse: warehouseName,
                    goods_type: 'product'
                },
                'product',
                warehouseName
            );

            this.setState({ categoryTemp: deepAssign({}, initialCategoryState) });
        }
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

    removeCategory = e => {
        e.preventDefault();
        const warehouse = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

        this.props.onDeleteCategory(this.state.categoryTemp.id, 'product', warehouse);
        this.setState({ categoryTemp: deepAssign({}, initialCategoryState) });
        window.$('#ModalRemoveCategory').modal('hide');
    };

    onRemoveCategory = id => {
        const temp = this.state.categoryTemp;
        temp.id = id;
        this.setState({ categoryTemp: temp });
        $('#ModalRemoveCategory').modal('show');
    };

    removeGood = () => {
        const warehouseName = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

        let availableQntGood = this.state.goods.filter(
            item => item.good_id === this.state.removingGood.id
        );

        if (availableQntGood[0].available_qnt !== 0) {
            this.props.onPushNotification('Количество товара не равно 0', 'error');
        } else {
            this.props.onRemoveGood(
                this.state.removingGood.id,
                'product',
                this.state.removingGood.category_id,
                warehouseName
            );
            this.setState({ removingGood: undefined });
            window.$('#ModalRemoveGood').modal('hide');
        }
    };

    onRemoveGood = (id, category_id) => {
        this.setState({
            removingGood: {
                id: id,
                category_id: category_id
            }
        });

        $('#ModalRemoveGood').modal('show');
    };

    inputChangeName = e => {
        const temp = this.state.categoryTemp;
        temp.name = e.target.value;
        this.setState({ categoryTemp: temp });
    };

    onItemTreeClick = category => {
        $('body').css('top', 0 + 'px');

        this.setState({
            ...this.state,
            table_sort: {}
        });

        const selectedWarehouseName = this.state.selected_warehouse === 1 ? 'pro' : 'sale';

        let params = '&page=1';

        const asc_param = this.state.table_sort.order
            ? `&order=${this.state.table_sort.order}&asc=${
                  this.state.table_sort.asc === 'asc' ? 1 : 0
              }`
            : '';

        params = params + asc_param;

        this.props.onLoadGoodsWithParams(category.id, 'product', selectedWarehouseName, params);
    };

    onItemEdit = (good_id, is_package, type, warehouse) => {
        if (is_package) {
            if (this.props.goods_tags.length < 1 || this.props.brands.length < 1) {
                this.props.onLoadData();
            }

            this.props.onLoadPackageDetails(good_id);
        } else {
            if (
                this.props.goods_tags.length < 1 ||
                this.props.brands.length < 1 ||
                this.props.units.length < 1
            ) {
                this.props.onLoadData();
            }

            this.props.onEditItemLoad(good_id, type, warehouse);
        }
    };

    searchChange = search => {
        this.setState({ search: search });
    };

    saveAddSaleForm = () => {
        document.getElementById('save-goods-add-sale-form').click();
    };

    saveAddProForm = () => {
        document.getElementById('save-goods-add-pro-form').click();
    };

    saveAddSetSaleForm = () => {
        document.getElementById('save-goods-add-set-sale-form').click();
    };

    saveAddSetProForm = () => {
        document.getElementById('save-goods-add-set-pro-form').click();
    };
    saveEditSaleForm = () => {
        document.getElementById('save-goods-edit-sale-form').click();
    };

    saveEditSetForm = () => {
        document.getElementById('save-goods-edit-set-form').click();
    };

    saveEditProForm = () => {
        document.getElementById('save-goods-edit-pro-form').click();
    };

    render() {
        return (
            <section className="content-with-menu">
                <Modal
                    id="ModalAddPro"
                    idForm="formAddPro"
                    customClass="modal-dialog"
                    title="Товар"
                    name="goodsPro"
                    fa="fa-plus-circle"
                    save={this.saveAddProForm}
                >
                    <GoodAddProContainer
                        category_id={this.state.category_id}
                        warehouse_id={+this.state.selected_warehouse}
                    />
                </Modal>

                <Modal
                    id="ModalAddSale"
                    idForm="formAddSale"
                    customClass="modal-dialog"
                    title="Товар"
                    name="goodsSale"
                    save={this.saveAddSaleForm}
                    fa="fa-plus-circle"
                >
                    <GoodAddSaleContainer />
                </Modal>

                <Modal
                    id="ModalAddSetSale"
                    idForm="formAddSetSale"
                    customClass="modal-block"
                    name="goodsSaleSet"
                    title="Набор"
                    fa="fa-plus-circle"
                    save={this.saveAddSetSaleForm}
                >
                    <GoodSetAddSaleContainer
                        category_id={this.state.category_id}
                        goods_list={this.props.goods_list}
                        warehouse_id={+this.state.selected_warehouse}
                    />
                </Modal>

                <Modal
                    id="ModalAddSetPro"
                    idForm="formAddSetPro"
                    name="goodsProSet"
                    customClass="modal-block"
                    title="Набор"
                    fa="fa-plus-circle"
                    save={this.saveAddSetProForm}
                >
                    <GoodSetAddProContainer
                        category_id={this.state.category_id}
                        goods_list={this.props.goods_list}
                        warehouse_id={+this.state.selected_warehouse}
                    />
                </Modal>

                <Modal id="ModalRemoveGood" customClass="modal-dialog" title="Удаление товара">
                    <h4 className="text-center">Вы уверены, что хотите удалить товар?</h4>
                    <div className="modal-footer row">
                        <div className="text-right">
                            <button
                                type="button"
                                className="btn btn-primary mr-sm"
                                onClick={this.removeGood}
                            >
                                <i className="fa fa-fw fa-trash" />
                                &nbsp;Удалить
                            </button>

                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                <i className="fa fa-fw fa-times" />
                                &nbsp;Отмена
                            </button>
                        </div>
                    </div>
                </Modal>

                <AddCategoryModal
                    inputChangeName={this.inputChangeName}
                    addCategory={this.addCategory}
                />

                <RemoveCategoryModal removeCategory={this.removeCategory} />

                <EditCategoryModal
                    categoryTemp={this.state.categoryTemp}
                    inputChangeName={this.inputChangeName}
                    editCategory={this.editCategory}
                />

                <div className="content-with-menu-container">
                    <div className="inner-menu-toggle">
                        <a href="#" className="inner-menu-expand" data-open="inner-menu">
                            Показать Меню
                            <i className="fa fa-chevron-right" />
                        </a>
                    </div>

                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content">
                                <div className="inner-menu-content">
                                    <div className="row">
                                        <div className="col-md-12 mb-lg">
                                            <div style={{ left: '10px' }}>
                                                <a
                                                    href="#ChangeWarehouse"
                                                    style={{
                                                        marginLeft: '10px',
                                                        marginRight: '10px'
                                                    }}
                                                    className={
                                                        this.state.selected_warehouse === 2
                                                            ? 'change-warehouse-button-focus'
                                                            : 'change-warehouse-button'
                                                    }
                                                    onClick={e => {
                                                        if (this.state.selected_warehouse === 1) {
                                                            this.onChangeWarehouse(e);
                                                        }
                                                    }}
                                                >
                                                    <i className="icon-Vitrina" />
                                                </a>

                                                <a
                                                    href="#ChangeWarehouse"
                                                    className={
                                                        this.state.selected_warehouse === 1
                                                            ? 'change-warehouse-button-focus'
                                                            : 'change-warehouse-button'
                                                    }
                                                    onClick={e => {
                                                        if (this.state.selected_warehouse === 2) {
                                                            this.onChangeWarehouse(e);
                                                        }
                                                    }}
                                                >
                                                    <i className="icon-Fen" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sidebar-widget m-none">
                                        <div className="widget-header">
                                            <a
                                                href="#"
                                                className="toggle-link"
                                                onClick={() => {
                                                    if (!this.props.openTree) {
                                                        this.props.onChangeOpenTree(true);
                                                    }
                                                    if (this.props.openTree) {
                                                        this.props.onChangeOpenTree(false);
                                                    }
                                                }}
                                            >
                                                {this.props.openTree ? (
                                                    <i
                                                        className="fa fa-caret-down"
                                                        aria-hidden="true"
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                ) : (
                                                    <i
                                                        className="fa fa-caret-right"
                                                        aria-hidden="true"
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                )}

                                                <h6
                                                    className="title"
                                                    style={{
                                                        paddingTop: 5,
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    КАТЕГОРИИ
                                                </h6>
                                            </a>
                                            <i
                                                className="fa fa-plus-circle "
                                                aria-hidden="true"
                                                onClick={e => this.onAddTopCategory(e)}
                                                style={{
                                                    marginLeft: '15px',
                                                    color: '#e58c8c',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                        <div className="widget-content">
                                            <TreeView
                                                items={this.state.categories}
                                                category_id={this.state.category_id}
                                                onItemSelect={this.onItemTreeClick}
                                                onAddCategory={this.onAddCategoryName}
                                                onRenameCategory={this.onEditCategoryName}
                                                onRemoveCategory={this.onRemoveCategory}
                                                closeNode={this.props.closeNode}
                                                onCloseNode={this.props.onCloseNode}
                                                onOpenNode={this.props.onOpenNode}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </menu>

                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <section className="panel">
                                    <header>
                                        <div className="goods-header-title">
                                            {this.state.selected_warehouse == 1
                                                ? 'Профка'
                                                : 'Витрина'}
                                        </div>
                                        <div className="goods-header-vendors">
                                            <div className="goods-vendors-select">
                                                <label className="goods-vendor-select-label">
                                                    Поставщик
                                                </label>
                                                <select id="vendors_select" />
                                            </div>
                                        </div>
                                        <div
                                            className="pull-right"
                                            style={{
                                                position: 'relative',
                                                top: '-6px'
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-md-12 text-center goods-header-search">
                                                    <div className="input-group mb-md searchCustom">
                                                        <input
                                                            id="q"
                                                            name="q"
                                                            type="text"
                                                            className="form-control goods-search border-right-none"
                                                            placeholder="Поиск..."
                                                            value={
                                                                this.props.search
                                                                    ? this.props.search
                                                                    : this.state.search
                                                            }
                                                            onChange={e => {
                                                                e.preventDefault();
                                                                this.searchChange(e.target.value);
                                                            }}
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
                                                        href={
                                                            this.state.selected_warehouse == 1
                                                                ? '#ModalAddPro'
                                                                : '#ModalAddSale'
                                                        }
                                                        className="btn btn-primary mr-md goods-add"
                                                        style={{
                                                            marginLeft: '20px'
                                                        }}
                                                        data-toggle="modal"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            if (
                                                                this.props.goods_tags.length < 1 ||
                                                                this.props.brands.length < 1
                                                            ) {
                                                                this.props.onLoadData();
                                                            }
                                                        }}
                                                    >
                                                        <i className="fa fa-plus-circle" />
                                                        &nbsp;
                                                        <i className="fa fa-archive" />
                                                    </a>
                                                    <a
                                                        href={
                                                            this.state.selected_warehouse == 1
                                                                ? '#ModalAddSetPro'
                                                                : '#ModalAddSetSale'
                                                        }
                                                        className="btn btn-custom goods-add"
                                                        data-toggle="modal"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            if (
                                                                this.props.goods_tags.length < 1 ||
                                                                this.props.brands.length < 1
                                                            ) {
                                                                this.props.onLoadData();
                                                            }
                                                        }}
                                                    >
                                                        <i className="fa fa-plus-circle" />
                                                        &nbsp;
                                                        <i className="fa fa-cubes" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </header>
                                    <div className="panel-body" style={{ paddingTop: '8px' }}>
                                        <div className="row">
                                            <div className="row">
                                                <div className="pull-right goods-legend">
                                                    <i
                                                        className="fa fa-map-pin"
                                                        style={{ color: 'rgb(227,228,231)' }}
                                                    />
                                                    &nbsp;
                                                    <span className="goods-table-legend-item">
                                                        не использовались > 3 мес
                                                    </span>
                                                    <i
                                                        className="fa fa-map-pin"
                                                        style={{ color: 'rgba(253,138,46,0.5)' }}
                                                    />
                                                    &nbsp;
                                                    <span className="goods-table-legend-item">
                                                        критическое кол-во
                                                    </span>
                                                    <i
                                                        className="fa fa-map-pin"
                                                        style={{
                                                            color: 'rgba(242, 129, 135, 0.2)'
                                                        }}
                                                    />
                                                    &nbsp;
                                                    <span className="goods-table-legend-item">
                                                        оба условия
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <GoodsTable
                                                    warehouse_id={this.state.selected_warehouse}
                                                    items={this.state.goods}
                                                    key={this.state.goods.group_id}
                                                    router={this.props.router}
                                                    category_id={this.state.category_id}
                                                    onRemoveGood={this.onRemoveGood}
                                                    onLoadUnits={this.props.onLoadUnits}
                                                    onItemEdit={this.onItemEdit}
                                                    menu={this.state.menu}
                                                    loading={this.state.loading}
                                                    table_sort={this.state.table_sort}
                                                    onTableSort={this.tableSort}
                                                    search={this.state.search}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Modal
                                    customClass="modal-dialog"
                                    id="ModalEditGoodSale"
                                    idForm="formEditGoodSale"
                                    title="Товар"
                                    name="goodsSale"
                                    fa="fa-pencil-square"
                                    save={this.saveEditSaleForm}
                                >
                                    <GoodEditSaleContainer
                                        good_id={this.state.good_id}
                                        warehouse_id={+this.state.selected_warehouse}
                                    />
                                </Modal>

                                <Modal
                                    customClass="modal-dialog"
                                    id="ModalEditGoodPro"
                                    idForm="formEditGoodPro"
                                    title="Товар"
                                    name="goodsPro"
                                    fa="fa-pencil-square"
                                    save={this.saveEditProForm}
                                >
                                    <GoodEditProContainer
                                        good_id={this.state.good_id}
                                        warehouse_id={+this.state.selected_warehouse}
                                    />
                                </Modal>

                                <Modal
                                    customClass="modal-block"
                                    name="goodsEditSet"
                                    id="ModalEditSet"
                                    idForm="formEditSet"
                                    title="Набор"
                                    fa="fa-pencil-square"
                                    save={this.saveEditSetForm}
                                >
                                    <GoodSetEditContainer
                                        good_id={+this.state.good_id}
                                        warehouse_id={+this.state.selected_warehouse}
                                        goods_list={this.props.goods_list}
                                    />
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
Goods.propTypes = {
    categories: PropTypes.array.isRequired,
    page_info: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onLoadGoodsWithParams: PropTypes.func.isRequired,
    onAddCategory: PropTypes.func.isRequired,
    onEditItemLoad: PropTypes.func.isRequired,
    onLoadData: PropTypes.func,
    onLoadGoodsList: PropTypes.func,
    onLoadPackageDetails: PropTypes.func
};

export default Goods;
