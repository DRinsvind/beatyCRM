import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FORMAT_DATE_WITH_POINTS, FORMAT_TIME_WITH_OUT_SEC, FORMAT_PHONE_NUMBER} from '../../utils/index';
import ExpandedDataTable from '../commons/tables/ExpandedDataTable';

const other_income_expenses = {
    other_income_expenses: [
        {
            exp_income_nam: 'Закупка хоз. средств',
            sum: 56780,
            items: [
                {
                    date: new Date(),
                    admin: 'Дорош Аліна Сергіївна',
                    note: 'інші госп. товари',
                    sum: 25780,
                },
                {
                    date: new Date(),
                    admin: 'Баран Леся Гаврилівна',
                    note: 'побутова хімія',
                    sum: 31000,
                }
            ]
        },
        {
            exp_income_nam: 'Продажа сертификатов',
            sum: 100000,
            items: [
                {
                    date: new Date(),
                    admin: 'Дорош Аліна Сергіївна',
                    note: ' сертифікати подарункові',
                    sum: 25780,
                },
            ]
        },
        {
            exp_income_nam: 'Реклама',
            sum: 15000,
            items: [
                {
                    date: new Date(),
                    admin: 'Баран Леся Гаврилівна',
                    note: ' реклама в інтернеті',
                    sum: 15000,
                }
            ]
        }
    ],
};

class OtherIncomeExpensesReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            rows: this.createCategories(other_income_expenses),
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
                        text: 'Сумма',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Администратор',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Примечание',
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
                columnsNumber="5"
                renderCell={this.rendCells}
            />
        );
    }

    createCategories = (data) => {
        let categories = [];
        data.other_income_expenses.forEach((other) => {
            categories.push({
                values: [
                    other.exp_income_nam,
                    parseFloat(other.sum).toFixed(2),
                    '',
                    ''
                ],
                items: other.items,
                expanded: false
            })
        });
        return categories;
    };

    mapToData = (master) => {
        let datas = [];
        master.items.forEach((item) => {
            datas.push({
                values: [
                    '',
                    FORMAT_DATE_WITH_POINTS(item.date),
                    parseFloat(item.sum).toFixed(2),
                    item.admin,
                    item.note
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
                    <td key={cid} className="borderless-left-right">{cell}</td>
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

OtherIncomeExpensesReport.propTypes = {};

export default OtherIncomeExpensesReport;