import React, {Component} from 'react';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';
import PropTypes from 'prop-types';
import {FORMAT_DATE_WITH_SLASH, FORMAT_TIME_WITHOUT_SECONDS} from '../../utils/index';

const operations = [
    {
        date: new Date(),
        time: new Date(),
        operation: 'Продажа',
        name: 'Маникюр',
        client: 'Дорош Аліна Сергіївна',
        master: 'Павленко Марина Олегівна',
        income: null,
        expenses: 200,
        type_denom: 'SERVICE_SALE'
    },
    {
        date: new Date(),
        time: new Date(),
        operation: 'Продажа',
        name: 'Маникюр',
        client: 'Дорош Аліна Сергіївна',
        master: 'Павленко Марина Олегівна',
        income: 100,
        expenses: null,
        type_denom: 'EXPENSES'
    },
    {
        date: new Date(),
        time: new Date(),
        operation: 'Продажа',
        name: 'Маникюр',
        client: 'Дорош Аліна Сергіївна',
        master: 'Павленко Марина Олегівна',
        income: 1200,
        expenses: null,
        type_denom: 'PROD_SALE'
    },
];

class IncomeAndExpencesReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.operationsToData(props.report),
            search: '',
            loading: false
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.report !== nextProps.report) {
            nextState.rows = this.operationsToData(nextProps.report);
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
                        text: 'Дата',
                        sortable: true,
                        searchable: true,
                        width: '12%'
                    },
                    {
                        text: 'Время',
                        sortable: true,
                        searchable: true,
                        width: '8%'
                    },
                    {
                        text: 'Тип',
                        sortable: true,
                        searchable: true,
                        width: '15%'
                    },
                    {
                        text: 'Операция',
                        sortable: true,
                        searchable: true,
                        width: '10%'
                    },
                    {
                        text: 'Название',
                        sortable: true,
                        searchable: true,
                        width: '10%'
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
                        width: '10%'
                    },
                    {
                        text: 'Доход',
                        sortable: true,
                        searchable: true,
                        width: '10%'
                    },
                    {
                        text: 'Затраты',
                        sortable: true,
                        searchable: true,
                        width: '10%',
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
                            oper.date,
                            oper.time,
                            'Расходы',
                            oper.operation,
                            oper.name,
                            '',
                            '',
                            +oper.income,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'TRANSFER':
                    data.push({
                        values: [
                            oper.date,
                            oper.time,
                            'Перемещение',
                            oper.operation,
                            oper.name,
                            '',
                            '',
                            +oper.payment,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'INVC_PAYMENT':
                    data.push({
                        values: [
                            oper.date,
                            oper.time,
                            'Поставщику',
                            oper.operation,
                            oper.name,
                            '',
                            '',
                            +oper.payment,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'REFUND':
                    data.push({
                        values: [
                            oper.date,
                            oper.time,
                            'Возврат',
                            oper.operation,
                            oper.name,
                            '',
                            '',
                            +oper.payment,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'PROD_SALE':
                    data.push({
                        values: [
                            oper.date,
                            oper.time,
                            'Товары',
                            oper.operation,
                            oper.name,
                            oper.client,
                            oper.master,
                            +oper.income,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                case 'SERVICE_SALE':
                    data.push({
                        values: [
                            oper.date,
                            oper.time,
                            'Услуги',
                            oper.operation,
                            oper.name,
                            oper.client,
                            oper.master,
                            +oper.income,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
                    break;
                default:
                    data.push({
                        values: [
                            oper.date,
                            oper.time,
                            'Оплаты',
                            oper.operation,
                            oper.name,
                            oper.client,
                            oper.master,
                            +oper.income,
                            +oper.expenses,
                        ],
                        details: oper,
                        expanded: false,
                        index_cat: idx
                    });
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
                    let date = val.replace(/-/g, '/');
                    data.push(
                        <td style={{width: '12%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {date}
                        </td>
                    );
                    break;
                case 1:
                    let split = val.split(':');
                    let new_time = '(' + split[0] + ':' + split[1] + ')';
                    data.push(
                        <td style={{width: '8%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {new_time}
                        </td>
                    );
                    break;
                case 2:
                    switch (category.details.type_denom) {
                        case 'INVC_PAYMENT':
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-truck nowrap"></i>{val}
                                </td>
                            );
                            break;
                        case 'TRANSFER':
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-retweet nowrap"></i>{val}
                                </td>
                            );
                            break;
                        case 'EXPENSES':
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-anchor nowrap"></i>{val}
                                </td>
                            );
                            break;
                        case 'REFUND':
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-undo nowrap"></i>{val}
                                </td>
                            );
                            break;
                        case 'PROD_SALE':
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-shopping-bag nowrap"></i>{val}
                                </td>
                            );
                            break;
                        case 'SERVICE_SALE':
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-scissors nowrap"></i>{val}
                                </td>
                            );
                            break;
                        default:
                            data.push(
                                <td style={{width: '15%'}} key={ci + category.details.type_denom + vid} className='borderless-left-right'>
                                    <i className="fa fa-fw fa-balance-scale nowrap"></i>{val}
                                </td>
                            );
                            break;
                    }
                    break;
                case 3:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 4:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
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
                        <td style={{width: '10%', color: 'rgb(45,139,209)'}} key={ci + '_details_' + vid}
                            className='borderless-left-right'>
                            {val}
                        </td>
                    );
                    break;
                case 7:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val ? parseFloat(val).toFixed(2) : ''}
                        </td>
                    );
                    break;
                case 8:
                    data.push(
                        <td style={{width: '10%'}} key={ci + '_details_' + vid} className='borderless-left-right'>
                            {val ? parseFloat(val).toFixed(2) : ''}
                        </td>
                    );
                    break;
                default:
                    break;
            }

        });
        return data;
    };

    renderItemsRows = (id, details) => {
        return (
            <tr key={'details_' + id}></tr>
        );
    };

    changeSearch = (val) => {
        this.setState({
            search: val,
        });
    };

}

IncomeAndExpencesReport.propTypes = {
    report: PropTypes.array.isRequired
};

export default IncomeAndExpencesReport;
