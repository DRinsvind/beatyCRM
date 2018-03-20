import React, {Component} from 'react';
import {FORMAT_DATE_WITH_POINTS, FORMAT_FIRST_DAY_OF_MONTH, FORMAT_DATE_WITH_SLASH, DEFINE_DOUBLE_NUMBER} from '../../utils/index';
import PropTypes from 'prop-types';
import SaveInventory from './SaveInventory';
import ExpandedDataTable from '../commons/tables/ExpandedDataTable';

const $ = window.$;

class InvoiceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice: {
                vendor: '',
                groups: [],
                date_doc: '',
                num_doc: '',
                warehouse: '',
                note: '',
                doc_id: null,
                document_sum: 0,
                document_payment: 0
            },
            categories: [],
            search: '',
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.invoice !== this.props.invoice) {
            nextState.invoice = nextProps.invoice;
            nextState.categories = this.groupsToData(nextProps.invoice)
        }
    }

    render() {
        return (
            <section className="panel panel-default viewInvoiceBlock" id="inputInvoice">
                <SaveInventory onSaveInventory={this.saveInventory}/>
                <header className="panel-heading custom-heading">
                    <h2 className="panel-title">
                        <div className="panel-title-name">
                            {this.state.invoice.type}
                        </div>
                    </h2>
                </header>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-12">
                            <ExpandedDataTable
                                headers={this.dataForTable()}
                                categories={this.state.categories}
                                itemValues={this.mapToDataRows}
                                onTableSortClick={this.onSort}
                                search={this.state.search}
                                onSearchChange={this.searchChange}
                                renderCategories={this.renderCategories}
                                columnsNumber={this.columnsNumber()}
                                someData={this.renderInvoiceData}
                                renderCell={this.rendCells}
                                order={false}
                                loading={this.props.loading}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-md-12">

                            <div className="mt-md row">
                                <div className="col-md-6">
                                    <div className={this.props.params.type === 'invoice' ? "input-group" : "hide"} style={{width: '60%'}}>
                                        <span className="input-group-addon">
                                        <i className="fa fa-fw fa-money" />
                                        </span>
                                        <input type="text"
                                               className="form-control"
                                               name="paid_form"
                                               value={this.state.invoice.type_payment ? this.state.invoice.type_payment.type_payment_name : ''}
                                               disabled/>

                                    </div>
                                    <div>
                                        <textarea
                                            name="note"
                                            className={this.props.params.type === 'invoice' ? "form-control mt-md" : "hide"}
                                            value={this.state.invoice.note ? this.state.invoice.note : ''}
                                            disabled
                                        />
                                    </div>
                                    {/*<div className="mt-md mb-md">*/}
                                        {/*Сальдо по поставщику: +456,00 грн.*/}
                                    {/*</div>*/}
                                </div>
                                <div className="col-md-6 text-right">
                                    <div className={this.props.params.type === 'invoice' ? "form-group" : "hide"}>
                                        <label className="col-md-7 control-label">Скидка</label>
                                        <div className="col-md-5 text-left">
                                            <input className="form-control mr-sm"
                                                   style={{width: '50%', display: 'inline-block'}}
                                                   name="discount"
                                                   value={this.state.invoice.amnt_discount ? this.state.invoice.amnt_discount : ''}
                                                   disabled
                                            />
                                            <label className="control-label" style={{verticalAlign: 'bottom'}}>%</label>
                                        </div>
                                    </div>
                                    <div className={this.props.params.type === 'invoice' ? "form-group" : "hide"}>
                                        <label className="col-md-7 control-label">Транспортные расходы</label>
                                        <div className="col-md-5 text-left">
                                            <input className="form-control mr-sm"
                                                   style={{width: '50%', display: 'inline-block'}}
                                                   name="fare"
                                                   value={this.state.invoice.amnt_transportation_costs ? this.state.invoice.amnt_transportation_costs : ''}
                                                   disabled
                                            />
                                            <label className="control-label" style={{
                                                verticalAlign: 'bottom',
                                                display: 'inline-block'
                                            }}>грн.</label>
                                        </div>
                                    </div>
                                    <div className={this.props.params.type === 'inventory' ? "hide" : "form-group"}
                                         style={{weight: 900, fontSize: '1.5em', color: 'black'}}>
                                        <span className="col-md-7 text-right">СУММА</span>
                                        <span
                                            className="col-md-5 text-left">{parseFloat(this.state.invoice.doc_sum).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={!this.props.invoice.is_processed ? "panel-footer" : "hide"}>
                    <div className="row">
                        <div className="col-md-6" />
                        <div className="col-md-6 text-right">
                            <button type="button" className="btn btn-primary mr-sm" onClick={() => {
                                let field = true;
                                this.state.categories.map((cat) => {
                                    cat.goods.map((good) => {
                                        if (good.actual_quantity === 0) {
                                            field = false;
                                        }
                                    });
                                });
                                if (field) {
                                    this.saveInventory();
                                } else {
                                    $('#ModalConfirmSaveInventory').modal('show');
                                }
                            }}>
                                <i className="fa fa-fw fa-save" />
                                Сохранить
                            </button>
                            <button type="reset" className="btn btn-default" onClick={() => this.props.router.goBack()}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    rendCells = (values, gi, cid, details) => {
        return values.map((value, i) => {
            if (!this.props.invoice.is_processed && i === 9) {
                return (
                    <td key={i} className=''>
                        <div className="center-block">
                            <input
                                style={{width: '100%'}}
                                className="form-control text-right"
                                name='actual_quantity'
                                type="text"
                                value={value}
                                onChange={(e) => {
                                    let data = this.state.categories;
                                    if (e.target.value !== '-') {
                                        let quantity = data[cid].goods.filter((g) => g.good_id === details.good_id)[0];
                                        quantity.actual_quantity = DEFINE_DOUBLE_NUMBER(quantity.actual_quantity, e.target.value);
                                        quantity.variance_quantity = e.target.value - quantity.remained_quantity;
                                        quantity.variance_sum = quantity.variance_quantity * quantity.receipt_price;
                                    }
                                    this.setState({categories: data});
                                }}
                            />
                        </div>
                    </td>
                )
            } else {
                return (
                    <td key={i} className=''>{value}</td>
                );
            }
        });
    };

    renderInvoiceData = () => {
        const date = this.state.invoice.date_doc ? FORMAT_DATE_WITH_POINTS(this.state.invoice.date_doc) : '';
        switch (this.props.params.type) {
            case 'invoice':
                return (
                    <div>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-tag"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.num_doc}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-calendar"
                               style={{color: 'rgb(170,181,191)'}} /> {date}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-truck"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.legal_enity}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-shopping-cart"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.warehouse}
                        </label>
                    </div>
                );
            case 'production':
                return (
                    <div>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-tag"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.num_doc}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-calendar"
                               style={{color: 'rgb(170,181,191)'}} /> {date}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-shopping-cart"
                               style={{color: 'rgb(170,181,191)'}} />
                            {this.state.invoice.warehouse}
                        </label>
                    </div>
                );
            case 'inventory':
                return (
                    <div>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-tag"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.num_doc}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-calendar"
                               style={{color: 'rgb(170,181,191)'}} /> {date}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-shopping-cart"
                               style={{color: 'rgb(170,181,191)'}} />
                            {this.state.invoice.warehouse}
                        </label>
                    </div>
                );
            default:
                return (
                    <div>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-tag"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.num_doc}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-calendar"
                               style={{color: 'rgb(170,181,191)'}} /> {date}
                        </label>
                        <label className="inventoryLabels">
                            <i className="fa fa-fw fa-truck"
                               style={{color: 'rgb(170,181,191)'}} /> {this.state.invoice.legal_enity}
                        </label>
                    </div>
                );
        }
    };

    columnsNumber = () => {
        switch (this.props.params.type) {
            case 'production':
            case 'returning':
            case 'invoice':
                return 6;
            case 'inventory':
                return 15;
            default:
                break;
        }
    };

    dataForTable = () => {
        let header = [
            {
                text: 'Артикул',
                sortable: true,
                searchable: true
            },
            {
                text: 'Название',
                sortable: true,
                searchable: true
            },
        ];
        switch (this.props.params.type) {
            case 'invoice':
            case 'production':
            case 'returning':
                header = header.concat([
                    {
                        text: 'Количество',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Цена за единицу',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Сумма',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: '',
                    },
                ]);
                break;
            case 'inventory':
                header = [
                    {
                        text: 'Артикул',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Наименование',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Кол-во на начало периода',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Приход',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Перемещение',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Списание',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Возврат',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Расход',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Кол-во на конец периода',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Кол-во на конец периода (факт)',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Сумма остатков (грн.)',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Расхождение',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Цена за единицу',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Расхождение (грн.)',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: ''
                    }
                ];
                break;
            default:
                break;
        }

        return header;
    };

    componentDidMount() {
        this.props.onLoad(this.props.params.invoice_id, this.props.params.type);
    }

    renderCategories = (category, ci) => {
        return (
            <tr key={'category_' + ci}
                style={{backgroundColor: 'rgb(252, 254, 180)'}}>
                <td className='' colSpan={this.columnsNumber() - 1}>
                    {category.values[0]}
                </td>
                <td className=''>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();

                        this.expandCategoryItems(ci, category.expanded);
                    }}>
                        <i className={"fa fw fa-caret-" + (category.expanded || this.state.search !== '' ? 'up' : 'down')} />
                    </a>
                </td>
            </tr>
        );
    };

    groupsToData = (invoice) => {
        let categories = [];

        invoice.groups.forEach((category) => {
            categories.push({
                values: [
                    category.group_name,
                ],
                expanded: true,
                goods: category.items,
            })
        });

        return categories;
    };

    mapToDataRows = (category) => {
        let data = [];

        switch (this.props.params.type) {
            case 'invoice':
            case 'production':
            case 'returning':
                category.goods.forEach((good) => {
                    data.push({
                        values: [
                            good.article,
                            good.good_name,
                            good.good_cnt + ' ' + good.unit,
                            good.good_price + ' грн',
                            parseFloat(good.good_amnt).toFixed(2) + ' ' + 'грн',
                            ''
                        ]
                    })
                });
                break;
            case 'inventory':
                category.goods.forEach((good) => {
                    data.push({
                        values: [
                            good.article,
                            good.good_name,
                            good.initial_quantity + ' ' + good.unit,
                            good.invoice,
                            good.transition,
                            good.production,
                            good.returning,
                            good.consumption,
                            good.remained_quantity + ' ' + good.unit,
                            good.actual_quantity,
                            good.remained_sum,
                            (good.actual_quantity - good.remained_quantity) + ' ' + good.unit,
                            good.receipt_price,
                            good.variance_sum,
                            ''
                        ],
                        details: good
                    })
                });
                break;
            default:
                break;
        }

        return data;
    };

    onSort = () => {
        let categories = this.state.categories;
        categories.forEach((category) => {
            category.expanded = true;
        });
        this.setState({categories: categories});
    };

    expandCategoryItems = (idx, cat_expanded) => {
        let categories = this.state.categories;
        categories[idx].expanded = !cat_expanded;

        this.setState({
            categories: categories,
        });
    };

    saveInventory = () => {
        let goods = [];
            this.state.categories.map((cat) => {
                cat.goods.map((good) => {
                    goods.push({
                        good_id: good.good_id,
                        quantity: +good.actual_quantity,
                        goods_transfer_forms_id: good.goods_transfer_forms_id
                });
            });
        });
        let dateStart = FORMAT_FIRST_DAY_OF_MONTH(new Date()).split('/');
        let dateEnd = FORMAT_DATE_WITH_SLASH(new Date()).split('/');
        let data = {
            "items": goods
        };
        this.props.onEditInventory(this.props.params.invoice_id, data,
            `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, this.props.router);
    };

    searchChange = (data) => {
        let categories = this.state.categories;

        if (data !== '') {
            categories.forEach((category) => {
                category.expanded = true;
            });
        } else {
            categories.forEach((category) => {
                category.expanded = false;
            });
        }

        this.setState({
            categories: categories,
            search: data
        });
    };
}

InvoiceView.propTypes = {
    invoice: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onEditInventory: PropTypes.func.isRequired
};

export default InvoiceView;