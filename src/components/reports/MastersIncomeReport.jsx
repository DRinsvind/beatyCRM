import React, {Component} from 'react';
import DataTable from '../commons/tables/DataTable';
import PropTypes from 'prop-types';

class MastersIncomeReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            masters_income: [
                {
                    master: 'Гордієнко Анна Петрівна',
                    income: 56780,
                    salary: 11300,
                    salary_percent: '20%',
                    materials: 5678,
                    materials_percent: '10%',
                    profit: 40000,
                    profit_percent: '70%'
                },
                {
                    master: 'Павленко Марина Олегівна',
                    income: 100000,
                    salary: 20000,
                    salary_percent: '20%',
                    materials: 10000,
                    materials_percent: '10%',
                    profit: 70000,
                    profit_percent: '70%'
                },
                {
                    master: 'Кудько Валерія Віталівна',
                    income: 150000,
                    salary: 30000,
                    salary_percent: '20%',
                    materials: 15000,
                    materials_percent: '10%',
                    profit: 105000,
                    profit_percent: '70%'
                },
            ]
        }

    }

    render() {
        return (
            <DataTable
                headers={[
                    {
                        text: 'Мастер',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Доход',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Зарплата',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: '%',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Материалы',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: '%',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Прибыль',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: '%',
                        searchable: true,
                        sortable: true
                    }
                ]}
                data={this.mapToDataClientsReport(this.state.masters_income)}
                detailed={false}
                cellRender={this.renderClinetsIncomeReportCells}
            />
        )
    }

    mapToDataClientsReport = (masters_income) => {
        return masters_income.map((report) => {
            return {
                values: [
                    report.master,
                    report.income,
                    report.salary,
                    report.salary_percent,
                    report.materials,
                    report.materials_percent,
                    report.profit,
                    report.profit_percent,
                ],
                details: report
            };
        });
    };

    renderClinetsIncomeReportCells = (row_index, cell_index, data, details) => {
        switch (cell_index) {
            case 0:
                return (
                    <div style={{color: 'rgb(45,139,209)'}}>{data}</div>
                );
            case 1:
                return parseFloat(data).toFixed(2);
            case 2:
                return parseFloat(data).toFixed(2);
            case 4:
                return parseFloat(data).toFixed(2);
            case 6:
                return parseFloat(data).toFixed(2);
            default: return data;
        }
    };
}

MastersIncomeReport.propTypes = {

};

export default MastersIncomeReport;