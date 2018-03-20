import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DataTable from '../commons/tables/DataTable';

class ClientCategoryChange extends Component {
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
                        text: 'Предыдущая категория',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Новая категория',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Дата перехода',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Количество посещений',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Потраченная сумма',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Сумма за последний месяц',
                        searchable: true,
                        sortable: true
                    },
                    {
                        text: 'Последний визит',
                        searchable: true,
                        sortable: true
                    }
                ]}
                data={this.mapToDataClientsCategoryChange([])}
                detailed={false}
                cellRender={this.renderClinetsCategoryChange}
            />
        )
    }

    mapToDataClientsCategoryChange = (clients_category_change) => {
        return clients_category_change.map((report) => {
            return {
                values: [
                ],
                details: report
            };
        });
    };

    renderClinetsCategoryChange = (row_index, cell_index, data, details) => {
        switch (cell_index) {
            case 0:
                return (
                    <div style={{color: 'rgb(45,139,209)'}}>{data}</div>
                );
            default: return data;
        }
    };
}

ClientCategoryChange.propTypes = {

};

export default ClientCategoryChange;