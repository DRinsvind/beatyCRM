import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FORMAT_DATE} from '../../utils/index';
import DataTable from '../commons/tables/DataTable';

class ClientsCallsReport extends Component {
    render() {
        return (
            <DataTable
                headers={[
                    {
                        text: 'Дата',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Время',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Администратор',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Клиент',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Повод',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Статус',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Комментарий',
                        searchable: true,
                        sortable: true
                    }
                ]}
                data={this.mapToDataClientsReport(this.props.report)}
                detailed={false}
                cellRender={this.renderClinetsIncomeReportCells}
            />
        );
    }

    mapToDataClientsReport = (clients_calls) => {
        return clients_calls.map((report) => {
            return {
                values: [
                    report.date_task,
                    report.time_task,
                    report.person_name,
                    report.client_name,
                    report.note,
                    report.state_task_name,
                    report.note_performer,
                ],
                details: report
            };
        });
    };

    renderClinetsIncomeReportCells = (row_index, cell_index, data, details) => {
        switch (cell_index) {
            case 0:
                return (
                    <div className="calls-note">{data}</div>
                );
            case 4:
                switch (data) {
                    case "День рождения":
                        return (
                            <div className="calls-note" style={{color: 'orange'}}>{data}</div>
                        );
                    case "Утеряный клиент":
                        return (
                            <div className="calls-note" style={{color: 'red'}}>{data}</div>
                        );
                    case "Разовый клиент":
                        return (
                            <div className="calls-note" style={{color: 'gray'}}>{data}</div>
                        );
                    case "Не был месяц":
                        return (
                            <div className="calls-note" style={{color: '#e58c8c'}}>{data}</div>
                        );
                    default: return data;
                }
            case 5:
                switch (data) {
                    case "Выполнена":
                        return (
                            <span className="calls-status-done">{data}</span>
                        );
                    case "Новая":
                        return (
                            <span className="calls-status-new">{data}</span>
                        );
                    case "Не выполнена":
                        return (
                            <span className="calls-status-not-done">{data}</span>
                        );
                    default: return data;
                }
            default: return data;
        }
    };
}

ClientsCallsReport.propTypes = {
    report: PropTypes.array.isRequired
};

export default ClientsCallsReport;