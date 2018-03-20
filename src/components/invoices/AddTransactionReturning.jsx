import React, {Component} from 'react';
import PropTypes from 'prop-types';
import deepAssign from 'deep-assign';
import Select2 from 'react-select2-wrapper';

import {DEFINE_DOUBLE_NUMBER, FORMAT_DATE_WITH_SLASH} from '../../utils/index';

const $ = window.$;

const itemInitialState = {
    num_doc: '',
    creation_date: FORMAT_DATE_WITH_SLASH(new Date()),
    from_warehouse: null,
    to_warehouse: null,
    production_item: null,
    invoice_item: null,
    quantityTo: '',
    quantityFrom: ''
};

class AddTransactionReturning extends Component {
    state = {
        transaction: deepAssign({}, itemInitialState),
        groupFrom: null,
        groupTo: null,
        quantityF: 0
    };

    componentWillUpdate(nextProps, nextState) {
        if (this.props.docNum !== nextProps.docNum || this.state.transaction.num_doc !== nextProps.docNum) {
            nextState.transaction = {
                ...this.state.transaction,
                num_doc: nextProps.docNum
            }
        }
    }

    render() {
        return (
            <section className="panel panel-default">
                <header className="panel-heading custom-heading">
                    <h2 className="panel-title">
                        <div className="panel-title-name">
                            {this.props.name}
                        </div>
                        <div
                            className="mt-xs"
                            style={{display: 'inline-block', float: 'right'}}>
                            <button
                                type="button"
                                className="btn btn-primary mr-sm"
                                onClick={this.saveInvoice}>
                                <i className="fa fa-fw fa-save fs-14" />
                            </button>
                            <button
                                type="button"
                                className="btn btn-default"
                                onClick={this.props.onCancel}
                            >
                                <i className="fa fa-fw fa-ban fs-14" />
                            </button>
                        </div>
                    </h2>
                </header>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-5">
                            <div
                                className={"form-group" + (this.props.errors['num_doc'] ? ' has-error' : '')}>
                                <label className="control-label">Номер накладной</label>
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-fw fa-slack" />
                                    </span>
                                    <input type="text"
                                           className="form-control"
                                           name="num_doc"
                                           value={this.state.transaction.num_doc}
                                           placeholder='Номер накладной'
                                           onChange={this.onChangeData}
                                           onBlur={this.validateTransDocNum}
                                           required/>
                                </div>
                                <label
                                    className={this.props.errors['num_doc'] ? 'control-label' : 'hidden'}>
                                    {this.props.errors['num_doc'] ? this.props.errors['num_doc'][0] : ''}
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2" />
                        <div className="col-md-5">
                            <label>Дата перемещения</label>
                            <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-slack" />
                                                    </span>
                                <input type="text"
                                       className="form-control transaction_date"
                                       name="creation_date"
                                       value={this.state.transaction.creation_date}
                                       placeholder='Дата перемещения'
                                       onChange={() => {
                                       }}
                                       required/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            {this.renderSelect("fa fa-fw fa-shopping-cart", "Со склада",
                                this.props.warehouses_list, this.state.transaction.from_warehouse, "from_warehouse")}
                        </div>
                        <div className="col-md-2" style={{textAlign: 'center', marginTop: '2.5%'}}>
                            <i className="fa fa-lg fa-arrow-right"></i>
                        </div>
                        <div className="col-md-5">
                            {this.renderSelect("fa fa-fw fa-shopping-cart", "На склад",
                                this.props.warehouses_list, this.state.transaction.to_warehouse, "to_warehouse")}
                        </div>
                    </div>
                    <div className="row mt-md">
                        <div className="col-md-5">
                            {this.renderSelectNoIcon("Групы товаров",
                                this.groupsToDataForSelect(this.props.groupsFrom),
                                this.state.groupFrom, "groupFrom", true, 'from',
                                this.props.groupsFrom.length > 0 ? false : true
                            )}
                        </div>
                        <div className="col-md-2" style={{textAlign: 'center', marginTop: '2.5%'}}>
                            <i className="fa fa-lg fa-arrow-right"></i>
                        </div>
                        <div className="col-md-5">
                            {this.renderSelectNoIcon("Групы товаров",
                                this.groupsToDataForSelect(this.props.groupsTo),
                                this.state.groupTo, "groupTo", true, 'to',
                                this.props.groupsTo.length > 0 ? false : true)}
                        </div>
                    </div>
                    <div className="row mt-md">
                        <div className="col-md-5">
                            {this.renderSelectGood("Выберите товар",
                                this.goodsToSelectData(this.props.goodsFrom),
                                this.state.transaction.production_item, "production_item",
                                '', '', this.props.goodsFrom.length > 0 ? false : true
                            )}
                        </div>
                        <div className="col-md-2" style={{textAlign: 'center', marginTop: '2.5%'}}>
                            <i className="fa fa-lg fa-arrow-right"></i>
                        </div>
                        <div className="col-md-5">
                            {this.renderSelectGood("Выберите товар",
                                this.goodsToSelectData(this.props.goodsTo),
                                this.state.transaction.invoice_item, "invoice_item",
                                '', '', this.props.goodsTo.length > 0 ? false : true)}
                        </div>
                    </div>
                    <div className="row mt-md">
                        <div className="col-md-5">
                            <label>Введите количество товара</label>
                            <div className="input-group">
                                <input type="text"
                                       className="form-control"
                                       name="quantityFrom"
                                       value={this.state.transaction.quantityFrom}
                                       onChange={this.onChangeData}
                                       required/>
                                <span className="input-group-addon">
                                    {this.state.transaction.from_warehouse === 0 ? 'шт' : this.findUnit(this.state.transaction.production_item, this.props.goodsFrom)}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-2" style={{textAlign: 'center', marginTop: '2.5%'}}>
                            <i className="fa fa-lg fa-arrow-right"></i>
                        </div>
                        <div className="col-md-5">
                            <label>Количество товара</label>
                            <div className="input-group">
                                <input type="text"
                                       className="form-control"
                                       name="quantityTo"
                                       value={this.state.transaction.quantityTo}
                                       onChange={this.onChangeData}
                                       required/>
                                <span className="input-group-addon">
                                    {this.state.transaction.to_warehouse === 0 ? 'шт' : this.findUnit(this.state.transaction.invoice_item, this.props.goodsTo)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    validateTransDocNum = () => {
        this.props.onValidateDocNumber({"num_doc": this.state.transaction.num_doc});
    };

    findUnit = (goodId, goods) => {
        let un = '';
        goods.forEach((g) => {
            if (g.good_id === goodId) {
                un = g.unit;
            }
        });

        return un;
    };

    goodsToSelectData = (goods) => {
        return goods.map((g) => {
            return {
                id: g.good_id,
                text: g.good_name
            }
        })
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

    renderSelect = (iclass, text, opt, val, name) => {
        return (
            <div>
                <label>{text}</label>
                <div className="input-group">
                    <span className="input-group-addon">
                                                        <i className={iclass}></i>
                                                    </span>
                    <Select2 className="form-control  straight-left-corners"
                             options={{
                                 placeholder: {text},
                                 theme: 'bootstrap'
                             }}
                             data={opt}
                             value={val}
                             onSelect={(e) => {

                                 let obj = this.state.transaction;
                                 this.props.onSelectWarehouse(+e.target.value === 0 ? 'sale' : 'pro', name === 'from_warehouse' ? 'from' : 'to');
                                 obj[name] = +e.target.value;
                                 if (name === 'from_warehouse') {
                                     obj.quantityFrom = '';
                                 } else {
                                     obj.quantityTo = '';
                                 }

                                 this.setState({
                                     transaction: obj
                                 });
                             }}
                    />
                </div>
            </div>
        );
    };

    renderSelectNoIcon = (text, opt, val, name, group, data, disabl) => {
        return (
            <div>
                <label>{text}</label>
                <Select2 className="form-control"
                         options={{
                             placeholder: {text},
                             theme: 'bootstrap'
                         }}
                         disabled={disabl}
                         data={opt}
                         value={val}
                         onSelect={(e) => {
                             if (group) {
                                 this.setState({[name]: +e.target.value});
                                 const fromW = this.state.transaction.from_warehouse === 0 ? 'sale' : 'pro';
                                 const toW = this.state.transaction.to_warehouse === 0 ? 'sale' : 'pro';

                                 this.props.loadGroupsGoods(+e.target.value, 'product', data === 'from' ? fromW : toW, '&paging=0', data);
                             } else {
                                 let obj = this.state.transaction;
                                 obj[name] = +e.target.value;

                                 this.setState({
                                     transaction: obj
                                 });
                             }
                         }}
                />
            </div>
        );
    };

    renderSelectGood = (text, opt, val, name, group, data, disabl) => {
        return (
            <div>
                <label>{text}</label>
                <Select2 className="form-control"
                         options={{
                             placeholder: {text},
                             theme: 'bootstrap'
                         }}
                         disabled={disabl}
                         data={opt}
                         value={val}
                         onSelect={(e) => {
                             let obj = this.state.transaction;
                             obj[name] = +e.target.value;

                             if (name === 'production_item') {
                                 obj.quantityFrom = this.props.goodsFrom.filter((good) => good.good_id === +e.target.value)[0].available_qnt;
                             } else {
                                 obj.quantityTo = this.props.goodsTo.filter((good) => good.good_id === +e.target.value)[0].available_qnt;
                             }

                             this.setState({
                                 transaction: obj,
                                 quantityF: obj.quantityFrom
                             });
                         }}
                />
            </div>
        );
    };

    componentDidMount() {
        $('.transaction_date').datepicker(
            {
                language: 'ru',
                weekStart: '1',
                format: 'dd/mm/yyyy'
            }
        )
            .off('changeDate').on('changeDate', (e) => {
            let obj = this.state.transaction;
            obj.creation_date = FORMAT_DATE_WITH_SLASH(e.date);
            this.setState({
                transaction: obj,
            });
        })
    }

    componentWillUnmount() {
        this.setState({transaction: itemInitialState});
    }

    saveInvoice = () => {
        const date = this.state.transaction.creation_date.split('/');
        const data = {
            "num_doc": this.state.transaction.num_doc,
            'from_warehouse': this.state.transaction.from_warehouse === 0 ? 'sale' : 'pro',
            'to_warehouse': this.state.transaction.to_warehouse === 0 ? 'sale' : 'pro',
            'creation_date': `${date[2]}-${date[1]}-${date[0]}`,
            'production_item': {
                "good_id": this.state.transaction.production_item,
                'quantity': +this.state.transaction.quantityFrom,
                'price': this.getGoodPrice(this.state.transaction.production_item, this.props.goodsFrom),
                'goods_transfer_forms_id': this.getGoodForm(this.state.transaction.production_item, this.props.goodsFrom)

            },
            'invoice_item': {
                "good_id": this.state.transaction.invoice_item,
                'quantity': +this.state.transaction.quantityTo,
                'price': this.getGoodPrice(this.state.transaction.invoice_item, this.props.goodsTo),
                'goods_transfer_forms_id': this.getGoodForm(this.state.transaction.production_item, this.props.goodsFrom)
            }
        };
        this.props.onSaveTransactionDocument(data);
    };

    getGoodForm = (goodId, goods) => {
        let form = 0;
        goods.map((g) => {
            if (g.good_id === goodId) {
                form = g.goods_transfer_forms_id;
            }
        });
        return form;
    };

    getGoodPrice = (goodId, goods) => {
        let price = 0;
        goods.map((g) => {
            if (g.good_id === goodId) {
                price = g.sale_price;
            }
        });
        return price;
    };

    onChangeData = (e) => {
        let data = this.state.transaction;
        if (e.target.name === 'quantityFrom' || e.target.name === 'quantityTo') {
            if (e.target.name === 'quantityFrom' && e.target.value > this.state.quantityF) {
                data[e.target.name] = data[e.target.name];
            } else  {
                data[e.target.name] = DEFINE_DOUBLE_NUMBER(data[e.target.name], e.target.value);
            }
        } else {
            data[e.target.name] = e.target.value;
        }
        this.setState({transaction: data});
    }
}

AddTransactionReturning.propTypes = {
    name: PropTypes.string.isRequired,
    onSaveTransactionDocument: PropTypes.func.isRequired,
    loadGroupsGoods: PropTypes.func.isRequired,
    onValidateDocNumber: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    docNum: PropTypes.string.isRequired
};

export default AddTransactionReturning;
