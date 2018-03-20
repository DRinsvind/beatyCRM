import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';
import GoodsList from './GoodsList';
import PropTypes from 'prop-types';
import {TreeSelect} from 'antd';
import {FORMAT_DATE_WITH_SLASH, DEFINE_DOUBLE_NUMBER} from '../../utils/index';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const $ = window.jQuery;

class InventoryAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            goods_categories: this.categoriesToData(props.goods_categories),
            warehouses_list: props.warehouses_list,
            data: null,
            value: null,
            inventory: {
                warehouse: null,
                num_doc: props.docNum,
                period_beg: FORMAT_DATE_WITH_SLASH(new Date()),
                note: ''
            },
            view: false,
            rows: [],
            goods: []
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.goods !== nextProps.goods) {
            nextState.goods = this.state.goods.concat(nextProps.goods);
            if (nextProps.goods.length > 0) {
                nextState.rows = this.state.rows.concat(this.createRows(nextProps.goods, nextProps.category_name));
            }
        }

        if (this.props.goods_categories !== nextProps.goods_categories) {
            nextState.goods_categories = this.categoriesToData(nextProps.goods_categories);
        }

        if (this.props.docNum !== nextProps.docNum) {
            nextState.inventory = {
                ...this.state.inventory,
                num_doc: nextProps.docNum
            }
        }
    }

    componentDidMount() {
        this.createPickers();
    };

    render() {
        let treeData = this.state.goods_categories;
        const tProps = {
            treeData,
            value: this.state.value,
            onChange: this.onChange,
            multiple: true,
            treeCheckable: true,
            showSearch: false,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Выберите категории товаров',
            treeDefaultExpandAll: true,
            dropdownStyle: {width: '300px'},
            style: {
                width: '100%',
                height: '40px',
            }
        };
        return (
            <section className="panel panel-default" id="inventory">
                <header className="panel-heading custom-heading">
                    <h2 className="panel-title">
                        <div className="panel-title-name">
                            Создание инвентаризационного листа
                        </div>
                        <div style={{display: 'inline-block', float: 'right'}}>
                            <div className="mt-xs mr-sm pull-right" style={{display: 'inline-block'}}>
                                {/*<button type="reset" className="btn btn-primary mr-sm" onClick={this.onSave}>*/}
                                    {/*<i className="fa fa-fw fa-file-archive-o fs-14"/>*/}
                                {/*</button>*/}
                                <button
                                    type="reset"
                                    className="btn btn-primary mr-sm"
                                    onClick={this.onSave}
                                >
                                    <i className="fa fa-fw fa-save fs-14"/>
                                </button>
                                <button
                                    type="reset"
                                    className="btn btn-default"
                                    onClick={this.onCancelAdd}
                                >
                                    <i className="fa fa-fw fa-ban s-14"/>
                                </button>
                            </div>
                            {/*<div className="input-group pull-right searchCustom"*/}
                                 {/*style={{width: 300, marginTop: '5px'}}>*/}
                                {/*<input*/}
                                    {/*id="q"*/}
                                    {/*name="q"*/}
                                    {/*type="text"*/}
                                    {/*className="form-control fs-12"*/}
                                    {/*style={{borderRight: 'none'}}*/}
                                    {/*placeholder="Поиск..."*/}
                                    {/*value=""*/}
                                    {/*onChange={(e) => {*/}
                                        {/*e.preventDefault();*/}
                                        {/*// this.changeSearch(e.target.value);*/}
                                    {/*}}*/}
                                {/*/>*/}
                                {/*<span className="input-group-btn" style={{width: '0'}}>*/}
                                    {/*<button*/}
                                        {/*className="btn btn-default text-free btn-search"*/}
                                        {/*style={{borderLeft: 'none'}}*/}
                                    {/*>*/}
                                        {/*<i className="fa fa-fw fa-search"/>*/}
                                    {/*</button>*/}
                                {/*</span>*/}
                            {/*</div>*/}
                        </div>
                    </h2>
                </header>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-slack" />
                                                    </span>
                                <input type="text"
                                       className="form-control"
                                       name="num_doc"
                                       placeholder="Номер накладной"
                                       value={this.state.inventory.num_doc}
                                       onChange={(e) => {
                                           e.preventDefault();

                                           let inv = this.state.inventory;
                                           inv.num_doc = e.target.value;
                                           this.setState({
                                               inventory: inv,
                                           })
                                       }}
                                       onBlur={this.validateDocNum}
                                       required/>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="input-daterange input-group">
                            <span className="input-group-addon" style={{borderWidth: '1px'}}>
                            <i className="fa fa-fw fa-calendar"/>
                            </span>
                                <input
                                    id={this.props.id}
                                    style={{textAlign: 'left'}}
                                    name="period_beg"
                                    type="text"
                                    className="form-control dates"
                                    value={this.state.inventory.period_beg}
                                    onChange={() => {
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="input-group mb-md">
                                                <span className="input-group-addon">
                                                <i className="fa fa-fw fa-shopping-cart"/>
                                                </span>
                                <Select2 className="form-control straight-left-corners"
                                         options={{
                                             placeholder: 'Склад',
                                             theme: 'bootstrap'
                                         }}
                                         data={this.state.warehouses_list}
                                         value={this.state.inventory.warehouse}
                                         onSelect={(e) => {
                                             e.preventDefault();

                                             let obj = this.state.inventory;
                                             obj.warehouse = e.target.value;
                                             this.onCancel();
                                             this.setState({
                                                 inventory: obj,
                                             });
                                             this.props.onSelectWarehouse(+e.target.value === 0 ? 'sale' : 'pro');
                                         }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={this.state.view ? 'hide' : "row mt-md"}>
                        <div className="col-md-12">
                            <TreeSelect {...tProps}
                                        disabled={this.state.inventory.warehouse && this.state.inventory.period_beg !== '' ? false : true}/>
                        </div>
                    </div>
                    <div className={this.state.view ? 'hide' : "row mt-xlg"}>
                        <button type="button" className="btn btn-primary center-block"
                                disabled={this.state.inventory.warehouse && (this.state.data || this.state.value) ? "" : "disabled"}
                                onClick={this.addInventoryList}>
                            <i className="fa fa-fw fa-plus"></i>&nbsp; Создать накладную
                        </button>
                    </div>
                    <div className={this.state.view ? "row" : 'hide'}>
                        <div className="col-md-12">
                            <GoodsList
                                categories={this.state.rows}
                                inventory={this.state.inventory}
                                changeInputInventory={this.changeInputInventory}
                            />
                        </div>
                    </div>
                    <div
                        className={this.props.goods.length > 0 ? 'mt-md row' : 'hidden'}>
                        <div className="col-md-6">
                            <div>
                                        <textarea
                                            name="note"
                                            value={this.state.inventory.note}
                                            className="form-control mt-md"
                                            placeholder="Примечание"
                                            onChange={(e) => {
                                                let inv = this.state.inventory;
                                                inv.note = e.target.value;
                                                this.setState({inventory: inv});
                                            }}
                                        />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    validateDocNum = () => {
        this.props.onValidateDocNumber({"num_doc": this.state.inventory.num_doc});
    };

    changeInputInventory = (indx, id, val) => {
        let data = this.state.rows;
        if (val !== '-') {
            let data_i = data[indx].goods.filter((g) => g.good_id === id)[0];
            data_i.actual_quantity = DEFINE_DOUBLE_NUMBER(data_i.actual_quantity, val);
            data_i.variance_quantity = val - data_i.remained_quantity;
            data_i.variance_sum = data_i.variance_quantity * data_i.receipt_price;
        }
        this.setState({rows: data});
    };

    addInventoryList = () => {

        this.createCategoriesGoods();

        this.setState({
            view: true,
        });

    };

    createRows = (goods, category) => {
        return {
            values: [
                category,
            ],
            expanded: true,
            goods: goods,
        };
    };

    onCancel = () => {
        this.setState({
            view: false,
            rows: [],
            data: null,
            value: null
        });
        this.props.clearGoods();
    };

    onCancelAdd = () => {
        this.setState({
            view: false,
            rows: [],
            data: null,
            value: null
        });
        this.props.clearGoods();
        this.props.closeAddForm();
    };

    onSave = (e) => {
        e.preventDefault();

        let goods = [];

        let date = this.state.inventory.period_beg.split('/');

        this.state.rows.forEach((categor) => {
            categor.goods.forEach((good) => {
                goods.push({
                    good_id: good.good_id,
                    quantity: good.actual_quantity ? +good.actual_quantity : 0,
                    goods_transfer_forms_id: good.goods_transfer_forms_id
                })
            })
        });

        let data = {
            'num_doc': this.state.inventory.num_doc,
            'warehouse': +this.state.inventory.warehouse === 0 ? 'sale' : 'pro',
            'creation_date': `${date[2]}-${date[1]}-${date[0]}`,
            'note': this.state.inventory.note,
            'items': goods,
        };

        this.props.onAddInvoice(data);
    };

    createCategoriesGoods = () => {
        this.state.value.forEach((val, i) => {
            this.props.onGoodsLoad(+val, this.getGroupName(+val));
        });

    };

    getGroupName = (id) => {
        let data = '';
        const getCatName = (categories) => {
            categories.forEach((categorie, i) => {
                if (+categorie.value === id) {
                    data = categorie.label;
                }
                if (categorie.children && categorie.children.length > 0) {
                    getCatName(categorie.children);
                }
            });
        };
        getCatName(this.state.goods_categories);
        return data;
    };

    categoriesToData = (categories) => {
        let data = [];

        const categoriesData = (groups) => {
            groups.forEach((categorie, i) => {
                data.push({
                    label: categorie.good_group_name,
                    value: categorie.good_group_id.toString(),
                    key: categorie.good_group_id.toString(),
                });
                if (categorie.subgroup.length > 0) {
                    categoriesData(categorie.subgroup);
                }
            });
        };

        categoriesData(categories);
        return data;
    };

    onChange = (value, data) => {
        this.setState({value, data});
    };

    createPickers = () => {

        $('.dates').datepicker(
            {
                language: 'ru',
                weekStart: '1',
                format: 'dd/mm/yyy'
            }
        ).off('changeDate').on('changeDate', (e) => {
            let obj = this.state.inventory;

            switch (e.currentTarget.name) {
                case 'period_beg':
                    obj.period_beg = FORMAT_DATE_WITH_SLASH(e.date);
                    break;
                case 'period_end':
                    obj.period_end = FORMAT_DATE_WITH_SLASH(e.date);
            }

            this.setState({
                inventory: obj,
            });
        });
    };

    dateFormat = (inventoryDate) => {
        const date = new Date(inventoryDate);
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        const newDate = date.getFullYear() + '-' + mm + '-' + dd;

        return newDate;
    };
}

InventoryAdd.propTypes = {
    goods_categories: PropTypes.array.isRequired,
    warehouses_list: PropTypes.array.isRequired,
    goods: PropTypes.array.isRequired,
    onGoodsLoad: PropTypes.func.isRequired,
    onSelectWarehouse: PropTypes.func.isRequired,
    onValidateDocNumber: PropTypes.func.isRequired,
    onAddInvoice: PropTypes.func.isRequired,
    category_name: PropTypes.string.isRequired,
    docNum: PropTypes.string.isRequired,
};

export default InventoryAdd;
