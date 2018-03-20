import React, {Component} from 'react';
import DataTable from '../commons/tables/DataTable';
import {FORMAT_PHONE_NUMBER} from '../../utils/index';
import PropTypes from 'prop-types';

class ClientsIncomeReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clients_income: [
                {
                    client: 'Гордієнко Анна Петрівна',
                    phone_number: '380965674576',
                    visits_number: 10,
                    sum: 16700
                },
                {
                    client: 'Павленко Марина Олегівна',
                    phone_number: '380975671234',
                    visits_number: 20,
                    sum: 12000
                },
                {
                    client: 'Кудько Валерія Віталівна',
                    phone_number: '380664679977',
                    visits_number: 34,
                    sum: 34890
                },
            ]
        }

    }

    render() {
        return (
            <DataTable
                headers={[
                    {
                        text: 'Клиент',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Телефон',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Посещения',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Сумма',
                        searchable: true,
                        sortable: true
                    }
                ]}
                data={this.mapToDataClientsReport(this.state.clients_income)}
                detailed={false}
                cellRender={this.renderClinetsIncomeReportCells}
            />
        )
    }

    mapToDataClientsReport = (clients_income) => {
        return clients_income.map((report) => {
            return {
                values: [
                    report.client,
                    FORMAT_PHONE_NUMBER(report.phone_number),
                    report.visits_number,
                    parseFloat(report.sum).toFixed(2)
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
            default: return data;
        }
    };
}

ClientsIncomeReport.propTypes = {

};

export default ClientsIncomeReport;