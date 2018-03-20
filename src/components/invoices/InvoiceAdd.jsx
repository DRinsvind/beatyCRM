import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DEFINE_DOUBLE_NUMBER, FORMAT_DATE_WITH_SLASH} from '../../utils/index';
import DataTable from '../commons/tables/DataTable';
import Select2 from 'react-select2-wrapper';
import deepAssign from 'deep-assign';
import Modal from '../commons/modals/Modal';
import InvoiceAddGoods from '././InvoiceAddGoods';
import ReturningAddGoods from '././ReturningAddGoods';

const $ = window.$;

const FORM_PAID_LIST = [{id: 0, name: 'Касса'}, {id: 1, name: 'Банк'}, {id: 2, name: 'Сейф'}, {
    id: 3,
    name: 'Оплатить позже'
}, {id: 4, name: 'Под реализацию'}];

const itemInitialState = {
    article: '',
    date: FORMAT_DATE_WITH_SLASH(new Date()),
    vendor: null,
    from_warehouse: null,
    to_warehouse: null,
    paid_form: 0,
    discount: '',
    fare: '',
    note: '',
    type_payment_id: 0,
    goods: [],
    isAddGoods: false
};

class InvoiceAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAction: props.sel_action,
            vendors_list: this.makeList(props.vendors_list),
            warehouses_list: props.warehouses_list,
            selected_goods: [],
            selected_goods_state: [],
            removed_id: undefined,
            able: true,
            new_invoice: deepAssign({}, itemInitialState),
            errors: {}
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.vendors_list = this.makeList(nextProps.vendors_list);
            nextState.warehouses_list = nextProps.warehouses_list;
        }

        if (this.props.sel_action !== nextProps.sel_action) {
            nextState.selectedAction = nextProps.sel_action;
            nextState.new_invoice = deepAssign({}, itemInitialState);
            nextState.able = true;
            nextState.selected_goods = [];
            nextState.selected_goods_state = [];
        }

        if ((this.props.docNum !== nextProps.docNum
                || this.state.new_invoice.article !== nextProps.docNum)
            && (this.state.selectedAction !== 1)) {
            nextState.new_invoice = {
                ...this.state.new_invoice,
                article: nextProps.docNum
            }
        }
    }

    render() {
        let head = this.dataForTable();
        let disabledSave = true;
        let disabledAddGood = true;
        if (this.state.new_invoice.vendor !== null && this.state.new_invoice.article !== '' &&
            this.state.new_invoice.from_warehouse !== null && this.state.selected_goods_state.length > 0) {
            disabledSave = false;
        }

        if (this.state.new_invoice.vendor !== null && this.state.new_invoice.article !== '' &&
            this.state.new_invoice.from_warehouse !== null && this.state.new_invoice.date !== '') {
            disabledAddGood = false;
        }

        return (
            <section className="panel panel-default" id="inputInvoice">
                {this.renderInvoiceHeader(disabledSave)}
                <div className="panel-body">
                    {this.renderPanelBody()}
                    <div className="row mt-lg">
                        <div className="col-md-12">
                            <div
                                className={this.state.selected_goods_state.length > 0 ? "mb-md" : 'hidden'}>
                                <DataTable
                                    headers={head}
                                    data={this.mapToDataRows(this.state.selected_goods_state)}
                                    detailed={false}
                                    cellRender={this.cellRender}
                                    onCellValueChanged={(data, id, value) => {
                                        let goods = this.state.selected_goods_state;
                                        goods.map((item) => {
                                            if (item.id === id) {
                                                if (value === '') {
                                                    item[data] = value;
                                                } else {
                                                    item[data] = value;
                                                }
                                            }
                                        });
                                        this.setState({selected_goods_state: goods});
                                    }}
                                />
                            </div>
                            {this.renderGoodsAddButton(disabledAddGood)}
                            <div
                                className={this.state.selected_goods_state.length > 0 ? 'mt-md row' : 'hidden'}>
                                <div className="col-md-6">
                                    <div className={this.state.selectedAction === 1 ? "input-group" : "hide"}
                                         style={{width: '60%'}}>
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-fw fa-money"/>
                                                    </span>
                                        <Select2 className="form-control  straight-left-corners"
                                                 options={{
                                                     placeholder: 'Форма оплаты',
                                                     theme: 'bootstrap'
                                                 }}
                                                 name="paid_form"
                                                 data={this.props.makeList(FORM_PAID_LIST)}
                                                 value={this.state.new_invoice.type_payment_id}
                                                 onSelect={(e) => {
                                                     e.preventDefault();
                                                     this.setState({
                                                         new_invoice: {
                                                             ...this.state.new_invoice,
                                                             type_payment_id: +e.target.value
                                                         }
                                                     });
                                                 }}
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            name="note"
                                            value={this.state.new_invoice.note}
                                            className="form-control mt-md"
                                            placeholder="Примечание"
                                            onChange={this.inputChanged}
                                        />
                                    </div>
                                    {/*<div className="mt-md mb-md">*/}
                                    {/*Сальдо по поставщику: +456,00 грн.*/}
                                    {/*</div>*/}
                                </div>
                                <div className="col-md-6 text-right">
                                    <div className={this.state.selectedAction === 1 ? "form-group" : "hide"}>
                                        <label className="col-md-7 control-label">Скидка</label>
                                        <div className="col-md-5 text-left">
                                            <input className="form-control mr-sm"
                                                   style={{width: '50%', display: 'inline-block'}}
                                                   name="discount"
                                                   value={this.state.new_invoice.discount}
                                                   placeholder="0"
                                                   onChange={this.inputChanged}
                                            />
                                            <label className="control-label" style={{verticalAlign: 'bottom'}}>%</label>
                                        </div>
                                    </div>
                                    <div className={this.state.selectedAction === 1 ? "form-group" : "hide"}>
                                        <label className="col-md-7 control-label">Транспортные расходы</label>
                                        <div className="col-md-5 text-left">
                                            <input className="form-control mr-sm"
                                                   style={{width: '50%', display: 'inline-block'}}
                                                   name="fare"
                                                   value={this.state.new_invoice.fare}
                                                   placeholder="0"
                                                   onChange={this.inputChanged}
                                            />
                                            <label className="control-label" style={{
                                                verticalAlign: 'bottom',
                                                display: 'inline-block'
                                            }}>грн.</label>
                                        </div>
                                    </div>
                                    <div className={this.state.selectedAction === 1 ? "form-group" : "hide"}
                                         style={{weight: 900, fontSize: '1.5em', color: 'black'}}>
                                        <span className="col-md-7 text-right">СУММА</span>
                                        <span
                                            className="col-md-5 text-left">{this.countCost(this.state.selected_goods_state) + ' грн.'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    dataForTable = () => {
        let header = [
            {
                text: '#',
                sortable: true,
                searchable: true
            },
            {
                text: 'Название',
                sortable: true,
                searchable: true
            },
        ];
        switch (this.state.selectedAction) {
            case 1:
                header = header.concat([
                    {
                        text: 'Цена, грн',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Количество',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Ед. измер.'
                    },
                    {
                        text: 'Стоимость, грн',
                        sortable: true,
                        searchable: true,
                        style: {textAlign: 'center'}
                    },
                    {
                        text: ''
                    }
                ]);
                break;
            case 2:
                header = header.concat([
                    {
                        text: 'Остатки',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Списать',
                        sortable: true,
                        searchable: true,
                    },
                    {
                        text: 'Форма'
                    },
                    {
                        text: ''
                    }
                ]);
                break;
            case 3:
                header = header.concat([
                    {
                        text: 'Количество',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Ед. измер.'
                    },
                    {
                        text: ''
                    }
                ]);
                break;
            case 5:
                header = [
                    {
                        text: 'Склад',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Категория',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Товар',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Количество',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Ед. измер.'
                    },
                    {
                        text: 'Накладная',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: ''
                    }
                ]
        }
        return header;
    };

    renderInvoiceHeader = (disabledSave) => {
        switch (this.state.selectedAction) {
            case 1:
                return (
                    <div>
                        {this.renderModal()}
                        {this.renderHeader('Создание приходной накладной', disabledSave)}
                    </div>
                );
            case 2:
                return (
                    <div>
                        {this.renderModal()}
                        {this.renderHeader('Создание накладной списания товаров', disabledSave)}
                    </div>
                );
            case 3:
                return (
                    <div>
                        {this.renderModal()}
                        {this.renderHeader('Создание накладной перемещения товаров', disabledSave)}
                    </div>
                );
            case 5:
                return (
                    <div>
                        {this.renderReturnModal()}
                        {this.renderHeader('Создание накладной возврата товаров', disabledSave)}
                    </div>
                )

        }
    };

    renderPanelBody = () => {
        switch (this.state.selectedAction) {
            case 1:
                return this.renderInvoiceAndChange();
            case 2:
                return this.renderWriteOffAndInventory();
            case 3:
                return (
                    <div className="row">
                        <div className="col-md-3">
                            {this.rederArticleInput('article', 'Номер накладной', "fa fa-fw fa-slack", this.inputChanged, "form-control fs-12", this.state.new_invoice.article)}
                        </div>
                        <div className="col-md-3">
                            {this.renderInput('date', 'Дата перемещения', "fa fa-fw fa-calendar", () => {
                            }, "form-control date fs-12", this.state.new_invoice.date)}
                        </div>
                        <div className="col-md-3">
                            {this.renderSelect("fa fa-fw fa-shopping-cart", 'Со склада', this.state.warehouses_list, this.state.new_invoice.from_warehouse)}
                        </div>
                        <div className="col-md-3">
                            {this.renderSelect("fa fa-fw fa-shopping-cart", 'На склад', this.state.warehouses_list, this.state.new_invoice.to_warehouse)}
                        </div>
                    </div>
                );
            case 5:
                return this.rederReturnAddInvoice();
        }
    };

    renderWriteOffAndInventory = () => {
        return (
            <div className="row">
                <div className="col-md-4">
                    {this.rederArticleInput('article', 'Номер накладной', "fa fa-fw fa-slack", this.inputChanged, "form-control fs-12", this.state.new_invoice.article)}
                </div>
                <div className="col-md-4">
                    {this.renderInput('date', 'Дата списания', "fa fa-fw fa-calendar", () => {
                    }, "form-control date fs-12", this.state.new_invoice.date)}
                </div>
                <div className="col-md-4">
                    {this.renderSelect("fa fa-fw fa-shopping-cart", 'Склад', this.state.warehouses_list, this.state.new_invoice.from_warehouse)}
                </div>
            </div>
        );
    };

    rederReturnAddInvoice = () => {
        return (
            <div className="row">
                <div className="col-md-4">
                    {this.rederArticleInput('article', 'Номер накладной', "fa fa-fw fa-slack", this.inputChanged, "form-control fs-12", this.state.new_invoice.article)}
                </div>
                <div className="col-md-4">
                    {this.renderInput('date', 'Дата списания', "fa fa-fw fa-calendar", () => {
                    }, "form-control date fs-12", this.state.new_invoice.date)}
                </div>
                <div className="col-md-4">
                    {this.renderSelect("fa fa-fw fa-truck", 'Поставщик', this.state.vendors_list, this.state.new_invoice.vendor, 'returning')}
                </div>
            </div>
        )
    };

    renderInvoiceAndChange = () => {
        return (
            <div className="row">
                <div className="col-md-3">
                    {this.rederArticleInput('article', 'Номер накладной', "fa fa-fw fa-slack", this.inputChanged, "form-control fs-12", this.state.new_invoice.article)}
                </div>
                <div className="col-md-3">
                    {this.renderInput('date', 'Дата поступления', "fa fa-fw fa-calendar", () => {
                    }, "form-control date fs-12", this.state.new_invoice.date)}
                </div>
                <div className="col-md-3">
                    {this.renderSelect("fa fa-fw fa-truck", 'Поставщик', this.state.vendors_list, this.state.new_invoice.vendor)}
                </div>
                <div className="col-md-3">
                    {this.renderSelect("fa fa-fw fa-shopping-cart", 'Склад', this.state.warehouses_list, this.state.new_invoice.from_warehouse)}
                </div>
            </div>
        );
    };

    renderSelect = (iclass, text, opt, val, returning) => {
        return (
            <div className="input-group">
                <span className="input-group-addon">
                    <i className={iclass}/>
                </span>
                <Select2 className="form-control  straight-left-corners"
                         options={{
                             placeholder: {text},
                             theme: 'bootstrap'
                         }}
                         data={opt}
                         value={val}
                         onSelect={(e) => {
                             e.preventDefault();

                             let obj = this.state.new_invoice;
                             if (text === 'Поставщик') {
                                 obj.vendor = +e.target.value;
                             } else {
                                 if (text === 'На склад') {
                                     obj.to_warehouse = +e.target.value;
                                 } else {
                                     this.props.onSelectWarehouse(+e.target.value === 0 ? 'sale' : 'pro');
                                     obj.from_warehouse = +e.target.value;
                                 }
                             }

                             this.setState({
                                 new_invoice: obj,
                                 selected_goods: [],
                                 selected_goods_state: [],
                                 able: (text !== 'Поставщик' || text === 'Поставщик' && returning) ? false : true
                             });
                         }}
                />
            </div>
        );
    };

    renderInput = (name, text, iclass, changeFunc, inputClass, val) => {
        return (
            <div className="input-group">
                    <span className="input-group-addon">
                        <i className={iclass}/>
                    </span>
                <input type="text"
                       className={inputClass}
                       name={name}
                       value={val ? val : ''}
                       placeholder={text}
                       onChange={changeFunc}
                       required/>
            </div>
        );
    };

    rederArticleInput = (name, text, iclass, changeFunc, inputClass, val) => {
        return (
            <div
                className={"form-group" + (this.props.errors['num_doc'] ? ' has-error' : '')}>
                <div className="input-group">
                    <span className="input-group-addon">
                        <i className={iclass}/>
                    </span>
                    <input type="text"
                           className={inputClass}
                           name={name}
                           value={val ? val : ''}
                           placeholder={text}
                           onChange={changeFunc}
                           onBlur={() => {
                               if (name === 'article') {
                                   this.props.onValidateDocNumber({"num_doc": this.state.new_invoice.article});
                               }
                           }}
                           required/>
                </div>
                <label
                    className={this.props.errors['num_doc'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['num_doc'] ? this.props.errors['num_doc'][0] : ''}
                </label>
            </div>
        )
    };

    onSaveAddingGoodsClick = () => {
        this.setState({
            isAddGoods: true
        });
    };

    renderModal = () => {
        return (
            <Modal id="ModalAddGoods"
                   idForm="formAddGoods"
                   customClass="modal-block invoices-modal-add-good"
                   save={this.onSaveAddingGoodsClick}
                   onCancel={() => {this.setState({isAddGoods: false})}}
                   title="Добавить товар в накладную">
                <InvoiceAddGoods
                    removed_id={this.state.removed_id}
                    categories={this.props.goods_categories}
                    onCategorySelect={this.props.onCategorySelect}
                    goods={this.props.goods}
                    sel_action={this.state.selectedAction}
                    category_id={this.props.category_id}
                    werhouse_id={this.state.new_invoice.from_warehouse}
                    onGoodsSelect={this.goodsSelection}
                    isAddGoods={this.state.isAddGoods}
                />
            </Modal>
        );
    };

    renderReturnModal = () => {
        return (
            <Modal id="ModalAddGoodsReturn"
                   idForm="formAddGoodsReturn"
                   customClass="modal-block modal-block-full"
                   title="Добавить товар">
                <ReturningAddGoods
                    warehouses={this.state.warehouses_list}
                    onSelectWarehouse={this.props.onSelectWarehouse}
                    categories={this.props.goods_categories}
                    onCategorySelect={this.props.onCategorySelect}
                    onLoadInvoices={this.props.onLoadInvoices}
                    goods={this.props.goods}
                    invoices={this.props.returnInvoices}
                    vedor_id={this.state.new_invoice.vendor ? this.state.new_invoice.vendor : 0}
                    onSelectReturningGoods={this.onSelectReturningGoods}
                    returnLoad={this.props.returnLoad}
                    clearAllReturnData={() => {
                        $('#ModalAddGoodsReturn').modal('hide');
                        this.props.clearAllReturnData();
                    }}
                />
            </Modal>
        );
    };

    renderHeader = (name, disabledSave) => {
        return (
            <header className="panel-heading custom-heading">
                <h2 className="panel-title">
                    <div className="panel-title-name">
                        {name}
                    </div>
                    <div className="pull-right mt-xs" style={{display: 'inline-block'}}>
                        <button
                            type="button"
                            className="btn btn-primary mr-sm"
                            disabled={disabledSave}
                            onClick={this.saveInvoice}>
                            <i className="fa fa-fw fa-save fs-14"/>
                        </button>
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={this.props.onCancel}
                        >
                            <i className="fa fa-fw fa-ban fs-14"/>
                        </button>
                    </div>
                    {/*<div style={{display: 'inline-block', float: 'right'}}>*/}
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
                    {/*</div>*/}
                </h2>
            </header>
        );
    };

    renderGoodsAddButton = (disabledAddGood) => {
        switch (this.state.selectedAction) {
            default:
                return this.addGoodsRender(disabledAddGood);
        }
    };

    addGoodsRender = (disabledAddGood) => {
        return (
            <button type="button" className="btn btn-primary center-block" disabled={disabledAddGood}
                    onClick={() => this.addGoods(this.state.selectedAction)}>
                <i className="fa fa-fw fa-plus"/>&nbsp;Товар
            </button>
        );
    };

    componentDidMount() {
        $('.date').datepicker(
            {
                language: 'ru',
                weekStart: '1',
                format: 'dd/mm/yyyy'
            }
        )
            .off('changeDate').on('changeDate', (e) => {
            let obj = this.state.new_invoice;
            obj.date = FORMAT_DATE_WITH_SLASH(e.date);
            this.setState({
                new_invoice: obj,
            });
        })
    }

    mapToDataRows = (selected_goods_state) => {
        switch (this.state.selectedAction) {
            case 2:
                return selected_goods_state.map((item) => {
                    return {
                        good: item,
                        values: [
                            item.article,
                            item.name,
                            +item.available_qnt,
                            item.quantity,
                            item.form,
                            ''
                        ]
                    }
                });
            case 3:
                return selected_goods_state.map((item) => {
                    return {
                        good: item,
                        values: [
                            item.article,
                            item.name,
                            item.quantity,
                            item.form,
                            ''
                        ]
                    }
                });
            case 5:
                return selected_goods_state.map((item) => {
                    return {
                        good: item,
                        values: [
                            item.warehouse_name,
                            item.category_name,
                            item.good_name,
                            item.good_quantity,
                            item.good_form,
                            item.invoice_date,
                            ''
                        ]
                    }
                });
            default:
                return selected_goods_state.map((item) => {
                    return {
                        good: item,
                        values: [
                            item.article,
                            item.name,
                            item.price,
                            item.quantity,
                            item.form,
                            0,
                            ''
                        ]
                    }
                })
        }
    };

    cellRender = (data, cell_index, value, details, changeCallback) => {
        if (this.state.selectedAction === 5) {
            switch (cell_index) {
                case 3:
                    return this.renderCellInput(cell_index, "good_quantity", value, data);
                case 6:
                    return this.renderTrachButton(data.good, 'return');
                default:
                    return (
                        <div>
                            <span>{value}</span>
                        </div>
                    );
            }
        } else {
            switch (cell_index) {
                case 2:
                    switch (this.state.selectedAction) {
                        case 1:
                            return this.renderCellInput(cell_index, "price", data.price, data);
                        case 2:
                            return <div className="text-center">
                                <span className="text-weight-bold">{value}</span>
                            </div>;
                        case 3:
                            return this.renderCellInput(cell_index, "quantity", data.quantity, data);
                        default:
                            break;
                    }
                case 3:
                    if (this.state.selectedAction === 3) {
                        return this.renderUnitsOptions(data, changeCallback);
                    } else {
                        return this.renderCellInput(cell_index, "quantity", data.quantity, data);
                    }
                case 4:
                    if (this.state.selectedAction === 3) {
                        return this.renderTrachButton(data.id);
                    } else if (this.state.selectedAction === 1) {
                        return (
                            <div className="text-right">
                            <span
                                className="text-weight-bold">{(+data.quantityMl) * (+data.quantity) + ' ' + data.form}</span>
                            </div>
                        );
                    } else {
                        return (
                            <div className="text-right">
                            <span
                                className="text-weight-bold">{data.form}</span>
                            </div>
                        );
                    }
                case 5:
                    if (this.state.selectedAction === 2) {
                        return this.renderTrachButton(data.id);
                    } else {
                        return <div className="text-right">
                            <span
                                className="text-weight-bold">{parseFloat((+data.price) * (+data.quantity)).toFixed(2)}</span>
                        </div>;
                    }
                case 6:
                    return this.renderTrachButton(data.id);
                default:
                    return value;
                    break;
            }
        }
    };

    renderCellInput = (idx, name, val, data) => {
        return (
            <div
                className={"form-group" + (this.state.errors['good_'] ? ' has-error' : '')}>
                <div className="center-block">
                    <input
                        style={{width: '60%'}}
                        id={data.id + idx}
                        className="form-control text-right"
                        name={name}
                        type="text"
                        value={val}
                        onChange={(e) => {
                            if (name === 'good_quantity') {
                                this.inputInvoiceReturnChange(data.good, e.target.name, e.target.value);
                            } else {
                                this.inputInvoiceChange(data.id, e.target.name, e.target.value);
                            }
                        }}
                    />
                </div>
                <label
                    className={this.state.errors['good_'] ? 'control-label' : 'hidden'}>
                    {this.state.errors['good_'] ? this.state.errors['good_'] : ''}
                </label>
            </div>
        );
    };

    makeList = (list) => {
        return list.map((item) => {
            return {
                id: item.legal_enity_id,
                text: item.short_name
            };
        });
    };

    renderUnitsOptions = (data) => {
        return (
            <div>
                {data.available_forms}
            </div>
        );
    };

    renderTrachButton = (id, type) => {
        return (
            <span>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        if (type) {
                            this.removeGoodReturn(id);
                        } else {
                            this.removeGood(id);
                        }
                    }}>
                        <i className="fa fa-fw fa-trash text-danger"/>
                    </a>
                </span>);
    };

    inputInvoiceChange = (id, input_name, val) => {
        let goods = this.state.selected_goods_state;
        goods.forEach((good, idx) => {
            if (good.id === id) {
                if (this.state.selectedAction === 2) {
                    if (good.available_qnt >= val) {
                        goods[idx][input_name] = DEFINE_DOUBLE_NUMBER(goods[idx][input_name], val);
                    }
                } else {
                    goods[idx][input_name] = DEFINE_DOUBLE_NUMBER(goods[idx][input_name], val);
                }
            }
        });

        this.setState({selected_goods_state: goods});
    };

    inputInvoiceReturnChange = (id, input_name, val) => {
        let goods = this.state.selected_goods_state;
        let err = {};
        goods.forEach((good, idx) => {
            if (good.good === id) {
                let prev = goods[idx][input_name];
                goods[idx][input_name] = DEFINE_DOUBLE_NUMBER(prev, val);
                if (this.state.selected_goods[idx].quantity < goods[idx][input_name]) {
                    goods[idx][input_name] = prev;
                    // err = {'good_': 'Количество больше имеющегося'};
                }
            }
        });

        this.setState({selected_goods_state: goods, errors: err});
    };

    countCost = (selected_goods) => {
        let cost = 0;
        selected_goods.forEach((elem) => {
            cost = cost + ((+elem.price) * (+elem.quantity))
        });

        cost = cost * ((100 - this.state.new_invoice.discount) / 100) + (+this.state.new_invoice.fare);
        return parseFloat(cost).toFixed(2);
    };

    saveInvoice = (e) => {
        e.preventDefault();
        let data = {};

        let goods = this.state.selected_goods_state.map((good) => {
            switch (this.state.selectedAction) {
                case 1:
                    return {
                        good_id: good.id,
                        price: (+good.price * +good.quantity) / (+good.quantity * good.quantityMl),
                        quantity: +good.quantity * good.quantityMl,
                        goods_transfer_forms_id: good.goods_transfer_forms_id
                    };
                case 2:
                    return {
                        good_id: good.id,
                        quantity: +good.quantity,
                        goods_transfer_forms_id: good.goods_transfer_forms_id
                    };
                case 5:
                    return {
                        doc_id: good.invoice,
                        good_id: good.good,
                        quantity: +good.good_quantity,
                        goods_transfer_forms_id: good.goods_transfer_forms_id
                    };
                default:
                    return {
                        good_id: good.id,
                        price: +good.price,
                        quantity: +good.quantity,
                        goods_transfer_forms_id: good.goods_transfer_forms_id
                    }
            }
        });

        const date = this.state.new_invoice.date.split('/');

        switch (this.state.selectedAction) {
            case 1:
                data = {
                    'num_doc': this.state.new_invoice.article,
                    'creation_date': `${date[2]}-${date[1]}-${date[0]}`,
                    'legal_enity_id': this.state.new_invoice.vendor,
                    'discount': this.state.new_invoice.discount === '' ? 0 : this.state.new_invoice.discount,
                    'fare': this.state.new_invoice.fare === '' ? 0 : this.state.new_invoice.fare,
                    'note': this.state.new_invoice.note,
                    'type_payment_id': this.state.new_invoice.type_payment_id,
                    'warehouse': this.state.new_invoice.from_warehouse === 0 ? 'sale' : 'pro',
                    'items': goods,
                };
                break;
            case 2:
                data = {
                    'num_doc': this.state.new_invoice.article,
                    'creation_date': `${date[2]}-${date[1]}-${date[0]}`,
                    'note': this.state.new_invoice.note,
                    'warehouse': this.state.new_invoice.from_warehouse === 0 ? 'sale' : 'pro',
                    'items': goods,
                };
                break;
            case 3:
                data = {
                    'num_doc': this.state.new_invoice.article,
                    'creation_date': this.state.new_invoice.date,
                    'note': this.state.new_invoice.note,
                    'from_warehouse': this.state.new_invoice.from_warehouse,
                    'to_warehouse': this.state.new_invoice.to_warehouse,
                    'items': goods,
                };
                break;
            case 5:
                data = {
                    'num_doc': this.state.new_invoice.article,
                    'creation_date': `${date[2]}-${date[1]}-${date[0]}`,
                    'note': this.state.new_invoice.note,
                    'legal_enity_id': this.state.new_invoice.vendor,
                    'warehouse': this.state.new_invoice.from_warehouse === 0 ? 'sale' : 'pro',
                    'items': goods
                }
        }

        this.props.onAddInvoice(data);

        this.setState({
            new_invoice: deepAssign({}, itemInitialState),
        });
    };

    addGoods = (selectedAction) => {
        if (selectedAction === 5) {
            $('#ModalAddGoodsReturn').modal('show');
        } else {
            $('#ModalAddGoods').modal('show');
        }
    };

    removeGood = (id) => {
        this.setState({
            removed_id: id,
            selected_goods_state: this.state.selected_goods_state.filter((item) => (+item.id !== +id)),
            selected_goods: this.state.selected_goods.filter((item) => (+item.good_id !== +id))
        });
    };

    removeGoodReturn = (id) => {
        this.setState({
            removed_id: id,
            selected_goods_state: this.state.selected_goods_state.filter((item) => (+item.good !== +id)),
            selected_goods: this.state.selected_goods.filter((item) => (+item.id !== +id))
        });
    };

    inputChanged = (e) => {

        let obj = this.state.new_invoice;

        if (e.target.name === 'discount' || e.target.name === 'fare') {
            obj[e.target.name] = DEFINE_DOUBLE_NUMBER(this.state.new_invoice[e.target.name], e.target.value);
        } else {
            obj[e.target.name] = e.target.value;
        }

        this.setState({
            new_invoice: obj,
        });
    };

    goodsSelection = (goods) => {
        let goods_sel = this.state.selected_goods;
        let goods_sel_state = this.state.selected_goods_state;

        const new_goods = goods.filter((element) => (!this.state.selected_goods.includes(element)));
        goods_sel.push(...new_goods);

        const new_goods_state = new_goods.map((item) => {
            return {
                id: item.good_id,
                article: item.article,
                name: item.good_name,
                price: '',
                quantity: '',
                quantityMl: item.quantity,
                available_qnt: item.available_qnt,
                goods_transfer_forms_id: item.goods_transfer_forms_id,
                form: item.available_forms ? item.available_forms[0].id : item.unit,
                available_forms: item.available_forms ? item.available_forms : item.unit
            }
        });
        goods_sel_state.push(...new_goods_state);
        this.setState({
            selected_goods: goods_sel,
            selected_goods_state: goods_sel_state,
            isAddGoods: false
        });

        // -------------------------------------------------------------------------------------

        this.setState({
            selected_goods: this.state.selected_goods.filter((element) => (this.contains(goods, element, false))),
            selected_goods_state: this.state.selected_goods_state.filter((element) => (this.contains(goods, element, true)))
        });
    };

    onSelectReturningGoods = (good) => {
        let selGoods = this.state.selected_goods_state;
        let selDataGoods = this.state.selected_goods;
        if (!selGoods.includes(good)) {
            selGoods = [...selGoods, good];
        }
        if (!selDataGoods.includes(good)) {
            selDataGoods = [...selDataGoods, {quantity: good.good_quantity, id: good.good}];
        }

        $('#ModalAddGoodsReturn').modal('hide');

        this.setState({
            selected_goods_state: selGoods,
            selected_goods: selDataGoods,
            new_invoice: {...this.state.new_invoice, from_warehouse: good.warehouse}
        });
    };

    contains = (a, obj, state) => {
        for (let i = 0; i < a.length; i++) {

            if (state) {
                if (a[i].good_id === obj.id) {
                    return true;
                }
            } else {
                if (a[i].good_id === obj.good_id) {
                    return true;
                }
            }
        }
        return false;
    };
}

InvoiceAdd.propTypes = {
    selectedAction: PropTypes.number,
    vendors_list: PropTypes.array.isRequired,
    warehouses_list: PropTypes.array.isRequired,
    onValidateDocNumber: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    docNum: PropTypes.string.isRequired
};

export default InvoiceAdd;