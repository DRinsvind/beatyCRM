import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FORMAT_DATE_WITH_POINTS, FORMAT_TIME_WITH_OUT_SEC, FORMAT_PHONE_NUMBER} from '../../utils/index';
import ExpandedDataTable from '../commons/tables/ExpandedDataTable';

const masters_bills_report = {
    masters_bills: [
        {
            master: 'Гордієнко Анна Петрівна',
            goods: 12000,
            services: 44780,
            sum: 56780,
            bills: [
                {
                    bill_date: new Date(),
                    client: 'Дорош Аліна Сергіївна',
                    phone: '380674523456',
                    goods: 5000,
                    services: 20780,
                    sum: 25780,
                },
                {
                    bill_date: new Date(),
                    client: 'Баран Леся Гаврилівна',
                    phone: '380674523456',
                    goods: 7000,
                    services: 24000,
                    sum: 31000,
                }
            ]
        },
        {
            master: 'Павленко Марина Олегівна',
            goods: 20000,
            services: 80000,
            sum: 100000,
            bills: [
                {
                    bill_date: new Date(),
                    client: 'Дорош Аліна Сергіївна',
                    phone: '380674523456',
                    goods: 5000,
                    services: 20780,
                    sum: 25780,
                },
            ]
        },
        {
            master: 'Кудько Валерія Віталівна',
            goods: 30000,
            services: 120000,
            sum: 150000,
            bills: [
                {
                    bill_date: new Date(),
                    client: 'Баран Леся Гаврилівна',
                    phone: '380674523456',
                    goods: 7000,
                    services: 24000,
                    sum: 31000,
                }
            ]
        }
    ],
};

class MastersBills extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            rows: this.createCategories(masters_bills_report),
        }
    }

    render() {
        return (
            <ExpandedDataTable
                headers={[
                    {
                        text: '',
                    },
                    {
                        text: 'Дата',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Время',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Клиент',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Телефон',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Услуги',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Товары',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Сумма',
                        sortable: true,
                        searchable: true
                    },
                ]}
                categories={this.state.rows}
                itemValues={this.mapToData}
                onTableSortClick={this.onSort}
                renderCategories={this.renderCategories}
                onSearchChange={this.searchChange}
                search={this.state.search}
                columnsNumber="8"
                renderCell={this.rendCells}
            />
        );
    }

    createCategories = (data) => {
        let categories = [];
        data.masters_bills.forEach((master) => {
            categories.push({
                values: [
                    master.master,
                    parseFloat(master.goods).toFixed(2),
                    parseFloat(master.services).toFixed(2),
                    parseFloat(master.sum).toFixed(2)
                ],
                bills: master.bills,
                expanded: false
            })
        });
        return categories;
    };

    mapToData = (master) => {
        let datas = [];
        master.bills.forEach((bill) => {
            datas.push({
                values: [
                    '',
                    FORMAT_DATE_WITH_POINTS(bill.bill_date),
                    FORMAT_TIME_WITH_OUT_SEC(bill.bill_date),
                    bill.client,
                    FORMAT_PHONE_NUMBER(bill.phone),
                    parseFloat(bill.goods).toFixed(2),
                    parseFloat(bill.services).toFixed(2),
                    parseFloat(bill.sum).toFixed(2),
                ],
            });
        });
        return datas;
    };

    rendCells = (values) => {
        return values.map((value, i) => {
            return (
                <td key={i} className='borderless-left-right'>{value}</td>
            );
        });
    };

    renderCategories = (category, ci) => {
        return (
            <tr key={'category_' + ci}
                style={{backgroundColor: 'rgb(252, 254, 180)'}}>
                <td style={{width: '5%'}} key={ci + '_icon'} className='borderless-left-right'>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();

                        this.expandCategoryItems(ci, category.expanded);
                    }}>
                        <i className={category.expanded || this.state.search !== '' ?
                            "fa fa-minus-square-o h5 m-none details-control" :
                            "fa fa-plus-square-o h5 m-none details-control"}
                           style={{color: "#0088cc"}}
                        />
                    </a>
                </td>
                {this.renderCategoryCells(category.values)}
            </tr>
        );
    };

    renderCategoryCells = (cells) => {
        return cells.map((cell, cid) => {
            if (cid === 0) {
                return (
                    <td key={cid} colSpan="4" className="borderless-left-right">{cell}</td>
                );
            } else {
                return (
                    <td key={cid} className="borderless-left-right">{cell}</td>
                );
            }
        });
    };

    onSort = () => {
        let operations = this.state.rows;
        operations.forEach((operation) => {
            operation.expanded = true;
        });
        this.setState({rows: operations});
    };

    expandCategoryItems = (idx, cat_expanded) => {
        let operations = this.state.rows;
        operations[idx].expanded = !cat_expanded;

        this.setState({
            rows: operations,
        });
    };

    searchChange = (data) => {
        let operations = this.state.rows;

        if (data !== '') {
            operations.forEach((operation) => {
                operation.expanded = true;
            });
        } else {
            operations.forEach((operation) => {
                operation.expanded = false;
            });
        }

        this.setState({
            rows: operations,
            search: data
        });
    };
}

MastersBills.propTypes = {};

export default MastersBills;