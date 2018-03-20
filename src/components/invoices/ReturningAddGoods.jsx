import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FORMAT_DATE_WITH_SLASH} from '../../utils/index';

const $ = window.$;

class ReturningAddGoods extends Component {
    state = {
        goodNew: {
            warehouse: null,
            category: null,
            good: null,
            invoice: null,
            warehouse_name: '',
            category_name: '',
            good_name: '',
            good_quantity: '',
            good_form: '',
            goods_transfer_forms_id: '',
            invoice_date: '',
        }
    };

    render() {
        console.log('ReturningAddGoods');
        let disable = '';
        if (this.state.goodNew.warehouse === null ||
            this.state.goodNew.category === null ||
            this.state.goodNew.good === null ||
            this.state.goodNew.invoice === null) {
            disable = true;
        }
        return (
            <div className="content-with-menu-container">
                <div className="row">
                    <div className="col-md-3">
                        <div>
                            <label className="return-label-head p-md">
                                Склад
                            </label>
                            {this.props.warehouses.map((warehouse, idx) => {
                                return (
                                    <div className="pl-md" key={`warehouse_${idx}`}>
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            this.props.onSelectWarehouse(warehouse.id === 0 ? 'sale' : 'pro');
                                            this.onItemClick(warehouse.id, 'warehouse', warehouse.text, 'warehouse_name');
                                        }}>
                                            <label className="return-label-name"
                                                   style={this.state.goodNew.warehouse === warehouse.id ? {color: '#e58c8c'} : {}}>
                                                {warehouse.text}
                                            </label>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={this.props.categories.length > 0 ? 'returning' : 'hide'}>
                            <label className="return-label-head p-md">
                                Категория
                            </label>
                            {this.props.returnLoad === 'groups' ? this.rederLoading() : this.rederGroups()}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={this.props.goods.length > 0 || this.props.returnLoad === 'goods' ? 'returning' : 'hide'}>
                            <label className="return-label-head p-md">
                                Товар
                            </label>
                            {this.props.returnLoad === 'goods' ? this.rederLoading() : this.rederGoods()}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={this.props.invoices.length > 0 || this.props.returnLoad === 'invoices' ? 'returning' : 'hide'}>
                            <label className="return-label-head p-md">
                                Накладная
                            </label>
                            {this.props.returnLoad === 'invoices' ? this.rederLoading() : this.rederInvoices()}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="text-right">
                        <button type="button" className="btn btn-primary mr-sm" disabled={disable} onClick={() => {
                            this.props.onSelectReturningGoods(this.state.goodNew);
                            this.clearState();
                        }}>
                            <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
                        </button>
                        <button type="button" className="btn btn-default" onClick={() => {
                            this.clearState();
                        }}>
                            <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    rederLoading = () => {
        return (
            <div>
                <i className="fa fa-fw fa-spin fa-refresh"/> Загрузка...
            </div>
        )
    };

    rederInvoices = () => {
        return this.props.invoices.map((invoice, iid) => {
            return (
                <div className="pl-md" key={`invoice_${iid}`}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        let good_form = '';
                        invoice.groups.map((g) => {
                            g.items.map((i) => {
                                if (i.good_id === this.state.goodNew.good) {
                                    good_form = i.unit;
                                }
                            })
                        });
                        const data = this.state.goodNew;
                        data.invoice = invoice.doc_id;
                        data.invoice_date = invoice.num_doc;

                        data.good_form = good_form;
                        this.setState({goodNew: data});
                    }}>
                        <label className="return-label-name"
                               style={this.state.goodNew.invoice === invoice.doc_id ? {color: '#e58c8c'} : {}}>
                            {invoice.num_doc}
                        </label>
                    </a>
                </div>
            )
        })
    };

    rederGoods = () => {
        return this.props.goods.map((good, idx) => {
            return (
                <div className="pl-md" key={`good_${idx}`}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        this.props.onLoadInvoices(this.props.vedor_id, good.good_id);
                        const data = this.state.goodNew;
                        data.goods_transfer_forms_id = good.goods_transfer_forms_id;
                        data.good = good.good_id;
                        data.good_name = good.good_name;
                        data.good_quantity = good.available_qnt;
                        this.setState({goodNew: data});
                    }}>
                        <label className="return-label-name"
                               style={this.state.goodNew.good === good.good_id ? {color: '#e58c8c'} : {}}>
                            {good.good_name}
                        </label>
                    </a>
                </div>
            )
        })
    };

    rederGroups = () => {
        return this.groupsToDataForSelect(this.props.categories).map((category, idx) => {
            return (
                <div className="pl-md" key={`category_${idx}`}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        this.props.onCategorySelect(category.id, 'product', category.id === 0 ? 'sale' : 'pro', '');
                        this.onItemClick(category.id, 'category', category.text, 'category_name');
                    }}>
                        <label className="return-label-name"
                               style={this.state.goodNew.category === category.id ? {color: '#e58c8c'} : {}}>
                            {category.text}
                        </label>
                    </a>
                </div>
            )
        })
    };

    onItemClick = (id, name, val, field) => {
        const data = this.state.goodNew;
        data[name] = id;
        data[field] = val;
        switch (name) {
            case 'warehouse':
                data.category = null;
                data.good = null;
                data.invoice = null;
                break;
            case 'category':
                data.good = null;
                data.invoice = null;
                break;
            case 'good':
                data.invoice = null;
                break;
            default:
                break;
        }
        this.setState({goodNew: data});
    };

    groupsToDataForSelect = (groups) => {
        let data = [];
        const loadData = (groupsData) => {
            groupsData.map((item) => {
                data.push({
                    id: item.good_group_id,
                    text: item.good_group_name
                });

                if (item.subgroup && item.subgroup.length !== 0) {
                    loadData(item.subgroup);
                }
            })
        };

        loadData(groups);

        return data;
    };

    clearState = () => {
        this.setState({
            goodNew: {
                warehouse: null,
                category: null,
                good: null,
                invoice: null,
                warehouse_name: '',
                category_name: '',
                good_name: '',
                good_quantity: '',
                good_form: '',
                goods_transfer_forms_id: '',
                invoice_date: '',
            }
        });
        this.props.clearAllReturnData();
    }
}

ReturningAddGoods.propTypes = {
    vedor_id: PropTypes.number.isRequired,
    warehouses: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    goods: PropTypes.array.isRequired,
    invoices: PropTypes.array.isRequired,
    returnLoad: PropTypes.string.isRequired,
    onSelectWarehouse: PropTypes.func.isRequired,
    onSelectReturningGoods: PropTypes.func.isRequired,
    onLoadInvoices: PropTypes.func.isRequired,
    onCategorySelect: PropTypes.func.isRequired
};

export default ReturningAddGoods;