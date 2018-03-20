import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FORMAT_DATE} from '../../utils/index';
import ExpandedDataTable from '../commons/tables/ExpandedDataTable';



const operations_history_report = {
    operations: [
        {
            date: '07/11/2017',
            appointments: [
                {
                    client: 'Марина Головко',
                    time: '12:30',
                    total: 3000,
                    check_number: '35',
                    employee: 'Дария Петрова',
                    employee_admin: 'Елена Душегуб',
                    discount: '20%',
                    bill: 'Каса',
                    manipulations: [
                        {
                            name: 'Депиляция',
                            time: '10:00',
                            employee: 'Дария Петрова',
                            employee_admin: 'Елена Душегуб',
                            amount: 1,
                            price: 1000,
                            type: 'Услуги',
                            check_number: '35',
                            bill: 'Каса',
                            discount: '20%'
                        },
                        {
                            name: 'Чистка лица',
                            time: '10:00',
                            employee: 'Дария Петрова',
                            employee_admin: 'Елена Душегуб',
                            amount: 1,
                            price: 2000,
                            type: 'Услуги',
                            check_number: '35',
                            bill: 'Каса',
                            discount: '20%'
                        }
                    ],
                }
            ]
        },
        {
            date: '08/11/2017',
            appointments: [
                {
                    client: 'Андрей Семенов',
                    time: '12:30',
                    total: 2000,
                    check_number: '40',
                    employee: 'Петр Маров',
                    employee_admin: 'Елена Душегуб',
                    discount: '0%',
                    bill: 'Терминал',
                    manipulations: [
                        {
                            name: 'Стрижка',
                            time: '16:00',
                            employee: 'Петр Маров',
                            employee_admin: 'Елена Душегуб',
                            amount: 1,
                            price: 2000,
                            type: 'Услуги',
                            check_number: '40',
                            bill: 'Терминал',
                            discount: '0%'
                        }
                    ],
                }
            ]
        }
    ],
};

class OperationsHistoryReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            rows: this.createCategories(operations_history_report),
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
                        text: 'Номер чека',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Тип',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Название',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Клиент',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Мастер',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Администратор',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Количество',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Цена',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Счет',
                        sortable: true,
                        searchable: true
                    },
                    {
                        text: 'Скидка',
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
                columnsNumber="13"
                renderCell={this.rendCells}
            />
        );
    }

    createCategories = (data) => {
        let categories = [];
        data.operations.forEach((operation) => {
            operation.appointments.forEach((appointment) => {
                categories.push({
                    values: [
                        operation.date,
                        appointment.time,
                        appointment.check_number,
                        '',
                        '',
                        appointment.client,
                        appointment.employee,
                        appointment.employee_admin,
                        '',
                        appointment.total,
                        appointment.bill,
                        appointment.discount,
                    ],
                    manipulations: appointment.manipulations,
                    expanded: false,
                });
            });
        });
        return categories;
    };

    mapToData = (appointment) => {
        let datas = [];
        appointment.manipulations.forEach((oper, opid) => {
            datas.push({
                values: [
                    '',
                    appointment.values[0],
                    appointment.values[1],
                    oper.check_number,
                    oper.type,
                    oper.time + ' ' + oper.name,
                    appointment.values[5],
                    oper.employee,
                    oper.employee_admin,
                    oper.amount,
                    oper.price,
                    oper.bill,
                    oper.discount,
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
            return (
                <td key={cid} className="borderless-left-right">{cell}</td>
            );
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

OperationsHistoryReport.propTypes = {};

export default OperationsHistoryReport;