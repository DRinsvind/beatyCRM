import React, {Component} from 'react';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';
import PropTypes from 'prop-types';
import {FORMAT_TIME_WITH_OUT_SEC} from '../../utils/index';

class FinancesDataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: props.items,
            search: '',
            loading: props.loading
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.rows = this.operationsToData(nextProps.items);
        }

        if (this.props.loading !== nextProps.loading) {
            nextState.loading = nextProps.loading;
        }
    }

    render() {
        return (
            <ExpandedDataTableNew
                headers={[
                    {
                        text: '',
                        width: '5%'
                    },
                    {
                        text: <i className="fa fa-fw fa-clock-o"></i>,
                        sortable: true,
                        searchable: true,
                        width: '10%'
                    },
                    {
                        text: 'Тип',
                        sortable: true,
                        searchable: true,
                        width: '15%'
                    },
                    {
                        text: 'Описание',
                        sortable: true,
                        searchable: true,
                        width: '20%'
                    },
                    {
                        text: 'Клиент',
                        sortable: true,
                        searchable: true,
                        width: '15%'
                    },
                    {
                        text: 'Мастер',
                        sortable: true,
                        searchable: true,
                        width: '15%'
                    },
                    {
                        text: 'Кол-во',
                        sortable: true,
                        searchable: true,
                        width: '10%'
                    },
                    {
                        text: 'Цена, грн.',
                        sortable: true,
                        searchable: true,
                        width: '10%',
                        no: 'nowrap'
                    }
                ]}
                categories={this.state.rows}
                search={this.state.search}
                renderCategories={this.renderCategories}
                renderItemsRowsF={this.renderItemsRows}
                onSearchChange={this.changeSearch}
                columnsNumber="7"
                loading={this.state.loading}
            />
        )
    }

    operationsToData = (operations) => {
        let data = [];
        operations.map((oper, idx) => {
            switch (oper.type_denom) {
                case 'EXPENSES':
                    data.push({
                        values: [
                            '',
                            FORMAT_TIME_WITH_OUT_SEC(oper.date_created),
                            'Расходы',
                            oper.expenses_item,
                            '',
                            '',
                            '',
                            +oper.payment,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'TRANSFER':
                    data.push({
                        values: [
                            '',
                            FORMAT_TIME_WITH_OUT_SEC(oper.date_created),
                            'Перемещение',
                            oper.info,
                            '',
                            '',
                            '',
                            +oper.payment,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'INVC_PAYMENT':
                    data.push({
                        values: [
                            '',
                            FORMAT_TIME_WITH_OUT_SEC(oper.date_created),
                            'Поставщику',
                            oper.vendor.name,
                            '',
                            '',
                            '',
                            +oper.payment,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'REFUND':
                    data.push({
                        values: [
                            '',
                            FORMAT_TIME_WITH_OUT_SEC(oper.date_created),
                            'Возврат',
                            oper.type_doc,
                            oper.client,
                            '',
                            '',
                            +oper.payment,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'PROD_SALE':
                    data.push({
                        values: [
                            '',
                            FORMAT_TIME_WITH_OUT_SEC(oper.date_created),
                            'Товары',
                            oper.type_doc,
                            oper.client,
                            oper.details[0].master,
                            '',
                            +oper.payment,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'SERVICE_SALE':
                    data.push({
                        values: [
                            '',
                            FORMAT_TIME_WITH_OUT_SEC(oper.date_created),
                            'Услуги',
                            oper.type_doc,
                            oper.client,
                            oper.details[0].master,
                            '',
                            +oper.payment,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                default:
                    break;
            }
        });
        return data;
    };

    renderCategories = (category, ci) => {
        return (
            <tr key={'category_' + ci}>
                {this.renderCellsFi(category, ci)}
            </tr>
        );
    };

    renderCellsFi = (category, ci) => {
        let data = [];
        category.values.forEach((val, vid) => {
            switch (vid) {
                case 0:
                    data.push(
                        <td style={{width: '5%'}} key={ci + '_icon_' + vid} className='borderless-left-right'>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();

                                this.expandCategoryItems(ci, category.expanded);
                            }}>
                                <i className={category.expanded ?
                                    "fa fa-minus-square-o h5 m-none details-control" :
                                    "fa fa-plus-square-o h5 m-none details-control"}
                                   style={{color: "#0088cc"}}
                                />
                            </a>
                        </td>
                    );
                    break;
                case 1:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 2:
                    switch (category.details.type_denom) {
                        case 'INVC_PAYMENT':
                            data.push(
                                <td key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-truck nowrap"> {val}</i>
                                </td>
                            );
                            break;
                        case 'TRANSFER':
                            data.push(
                                <td key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-retweet nowrap"> {val}</i>
                                </td>
                            );
                            break;
                        case 'EXPENSES':
                            data.push(
                                <td key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-anchor nowrap"> {val}</i>
                                </td>
                            );
                            break;
                        case 'REFUND':
                            data.push(
                                <td key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-undo nowrap"> {val}</i>
                                </td>
                            );
                            break;
                        case 'PROD_SALE':
                            data.push(
                                <td key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-shopping-bag nowrap"> {val}</i>
                                </td>
                            );
                            break;
                        case 'SERVICE_SALE':
                            data.push(
                                <td key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-scissors nowrap"> {val}</i>
                                </td>
                            );
                            break;
                        default:
                            break;
                    }
                    break;
                case 3:
                    data.push(
                        <td style={{width: '20%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 4:
                    data.push(
                        <td style={{width: '15%', color: 'rgb(45,139,209)'}} key={ci + '_details_' + vid}
                            className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 5:
                    data.push(
                        <td style={{width: '15%', color: 'rgb(45,139,209)'}} key={ci + '_details_' + vid}
                            className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 6:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 7:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {parseFloat(val).toFixed(2)}
                        </td>
                    );
                    break;
                default:
                    data.push(
                        <td key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
            }

        });
        return data;
    };

    renderItemsRows = (id, details) => {
        return (
            <tr key={'details_' + id}>
                <td style={{width: '30%'}} className="borderless-left-right" colSpan="3">
                    {this.renderMasters(id, details, 'time')}
                    <div className="row mt-md ml-none">
                        <label style={{color: 'rgb(170,180,193)'}}>Со счета</label>
                        <label style={{color: 'rgb(45,139,209)', marginLeft: '10px'}}>{details.type_payment}</label>
                    </div>
                </td>
                <td style={{width: '35%'}} className="borderless-left-right" colSpan="2">
                    {this.renderOperationInformation(details, id)}
                    <div className="row mt-md ml-none">
                        <label style={{color: 'rgb(170,180,193)'}}>Администратор</label>
                        <label style={{color: 'rgb(45,139,209)', marginLeft: '10px'}}>{details.user_created}</label>
                    </div>
                </td>
                <td style={{width: '15%'}} className="borderless-left-right">
                    {this.renderMasters(id, details, 'master')}
                </td>
                <td style={{width: '10%'}} className="borderless-left-right">
                    {this.renderMasters(id, details, 'amount')}
                </td>
                <td style={{width: '10%'}} className="borderless-left-right">
                    {this.renderMasters(id, details, 'price')}
                </td>
            </tr>
        );
    };

    renderOperationInformation = (details, id) => {
        let data = details.details.map((item, idx) => {
            return (
                <div key={idx + '_time_' + id} className="row">
                    <label className="ml-md">{item.product_name ? item.product_name : ''}</label>
                </div>
            );
        });
        switch (details.type_denom) {
            case 'PROD_SALE':
                return data;
            case 'SERVICE_SALE':
                return data;
            default:
                return (
                    <div className="row ml-none">
                        {details.info ? details.info : 'Информация отсутствует'}
                    </div>
                );
        }
    };

    renderMasters = (id, operation, name) => {
        return operation.details.map((item, idx) => {
            switch (name) {
                case 'master':
                    return (
                        <div key={idx + '_master_' + id} className="row">
                            <label className="ml-md">{item.master}</label>
                        </div>
                    );
                case 'amount':
                    return (
                        <div key={idx + '_amount_' + id} className="row">
                            <label className="ml-md">{item.count + ' шт'}</label>
                        </div>
                    );
                case 'price':
                    return (
                        <div key={idx + '_price_' + id} className="row">
                            <label className="ml-md">{parseFloat(item.position_total_cost).toFixed(2)}</label>
                        </div>
                    );
                case 'time':
                    return (
                        <div key={idx + '_time_' + id} className="row">
                            <label className="ml-md">{item.service_time ? item.service_time : ''}</label>
                        </div>
                    );
                default:
                    return (
                        <div key={idx + '_time_' + id} className="row">
                            <label className="ml-md"></label>
                        </div>
                    );
            }
        });
    };

    expandCategoryItems = (idx, cat_expanded) => {
        let categories = this.state.rows;
        categories = categories.map((cat) => {
            if (cat.index_cat === idx) {
                return {
                    ...cat,
                    expanded: !cat_expanded
                }
            }
            return cat;
        });

        this.setState({
            rows: categories,
        });
    };

    changeSearch = (val) => {
        this.setState({
            search: val,
        });
    };

}

FinancesDataTable.propTypes = {
    items: PropTypes.array.isRequired
};

export default FinancesDataTable;