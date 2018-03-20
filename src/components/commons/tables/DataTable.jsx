import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    render() {
        let data = null;
        const urlArr = document.URL.split('/');
        if (this.props.children) {
            data = this.props.children;
        } else {
            data = <div className="col-md-6" />;
        }

        return (
            <div className="dataTableCustom" style={this.props.data.length < 4 && this.props.openSel ? { height: 320 } : {}}>
                <div className="dataTable mt-md">
                    <div className={this.props.table || urlArr[urlArr.length - 2] === 'goods'
                    || this.props.table || urlArr[urlArr.length - 2] === 'invoices'
                        ? 'hide'
                        : 'row datatables-header form-inline'}>
                        {data}
                    </div>

                    <table className="table table-striped table-hover mb-none table-bordered">
                        <TableHeader
                            data={this.props.headers}
                            detailed={this.props.detailed}
                            onSort={this.sortingRows}
                            onServerSort={this.props.onServerSort}
                        />
                        {this.renderRows()}
                    </table>
                </div>
            </div>
        );
    }

    renderRows = () => {
        const col_span = this.props.headers.length + Number(this.props.detailed);

        if (!this.props.loading) {
            const searchTerm = (this.props.search && this.props.search.toString().toLowerCase()) || '';

            let dataFound = this.props.data;

            if (searchTerm) {
                dataFound = dataFound.filter(row => {
                    let found = false;

                    row.values.forEach((value, idx) => {
                        if (value && this.props.headers[idx].searchable) {
                            if (this.props.headers[idx].date_search || this.props.headers[idx].date_birth_search) {
                                const date = new Date(value);
                                let dd = date.getDate();
                                if (dd < 10) dd = '0' + dd;
                                let mm = date.getMonth() + 1;
                                if (mm < 10) mm = '0' + mm;
                                let min = date.getMinutes();
                                if (min < 10) min = '0' + min;
                                let start_date = dd + '.' + mm + '.' + date.getFullYear();
                                let date_str = this.props.headers[idx].date_search ? start_date + date_str + ' ' + date.getHours() + ':' + min : start_date;
                                if (
                                    date_str
                                        .toString()
                                        .toLowerCase()
                                        .indexOf(searchTerm) >= 0
                                ) {
                                    found = true;
                                }
                            } else {
                                if (this.props.headers[idx].phone_client_number) {
                                    let phones = row.details.contacts.filter(contact => contact.contact_type === 'MOBILE_PHONE');
                                    phones.forEach(contact => {
                                        if (
                                            contact.contact
                                                .toString()
                                                .toLowerCase()
                                                .indexOf(searchTerm) >= 0
                                        ) {
                                            found = true;
                                        }
                                    });
                                }
                                if (
                                    value
                                        .toString()
                                        .toLowerCase()
                                        .indexOf(searchTerm) >= 0
                                ) {
                                    found = true;
                                }
                            }
                        }
                    });

                    return found;
                });
            }

            if (!dataFound.length) {
                return (
                    <tbody>
                        <tr>
                            <td colSpan={col_span} style={{ textAlign: 'center' }}>
                                Нет данных
                            </td>
                        </tr>
                    </tbody>
                );
            }

            return dataFound.map((row, idx) => {
                return (
                    <TableContentRow
                        key={idx}
                        index={idx}
                        id={row.id}
                        good={row.good}
                        data={row.values}
                        details={row.details}
                        is_critical={row.is_critical}
                        is_demand={row.is_demand}
                        is_goods={this.props.goods}
                        detailed={this.props.detailed}
                        detailsRender={this.props.detailsRender}
                        cellRender={this.props.cellRender}
                        expanded={this.props.table ? true : false}
                        onCellValueChanged={(rIdx, cIdx, value) => {
                            this.props.onCellValueChanged(rIdx, cIdx, value);
                        }}
                    />
                );
            });
        }

        return (
            <tbody>
                <tr>
                    <td colSpan={col_span} style={{ textAlign: 'center' }}>
                        <i className="fa fa-fw fa-spin fa-refresh" /> Загрузка...
                    </td>
                </tr>
            </tbody>
        );
    };

    searchChange = search => {
        this.setState({
            search: search
        });
    };

    sortingRows = (col_idx, order) => {
        this.setState({
            data: this.props.data.sort((row1, row2) => {
                const val1 = row1.values[col_idx];
                const val2 = row2.values[col_idx];

                return this.compare(val1, val2) * (order === 'asc' ? 1 : -1);
            })
        });
    };

    /**
     * Compare values.
     *
     * @param val1 value A.
     * @param val2 value B
     * @returns {number} 1 if A gt B, -1 if A lt B otherwise 0.
     */
    compare = (val1, val2) => {
        let type = typeof val1;

        switch (type) {
            case 'string':
                return val1.localeCompare(val2);
            case 'boolean':
                if (val1 !== val2) {
                    return val1 ? 1 : -1;
                }

                return 0;
            case 'number':
                if (val1 !== val2) {
                    return val1 > val2 ? 1 : -1;
                }

                return 0;
            case 'object':
                if (val1 instanceof Date) {
                    if (val1 !== val2) {
                        return val1 > val2 ? 1 : -1;
                    }

                    return 0;
                }
                break;
        }

        return 1;
    };
}

DataTable.propTypes = {
    headers: PropTypes.array,
    data: PropTypes.array,
    detailed: PropTypes.bool,
    detailsRender: PropTypes.func,
    cellRender: PropTypes.func,
    onCellValueChanged: PropTypes.func,
    onServerSort: PropTypes.func
};

DataTable.defaultProps = {
    headers: [],
    data: [],
    detailed: false
};

/**
 * Header for table.
 */
class TableHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.mapToData(props)
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.data !== this.props.data) {
            nextState.data = this.mapToData(nextProps);
        }
    }

    render() {
        return (
            <thead>
                <tr>{this.renderColumns(this.state.data)}</tr>
            </thead>
        );
    }

    // MAPPER
    mapToData = props => {
        const data = [...props.data];

        if (props.detailed) {
            data.unshift({ text: '' });
        }

        return data.map(val => {
            return {
                sortable: false,
                searchable: false,
                ...val
            };
        });
    };

    // RENDER
    renderColumns = data => {
        let headers = data;
        return headers.map((column, idx) => {
            return (
                <th
                    key={idx}
                    className={'pl-md' + (column.sortable ? ' sorting' : '') + (column.sorted ? ' sorting_' + column.sorted : '')}
                    style={column.style ? column.style : {}}
                    onClick={e => this.onSortClick(e, idx)}
                >
                    <label
                        style={{
                            fontWeight: 'bold',
                            marginLeft: 5,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {column.text}
                    </label>
                </th>
            );
        });
    };

    // EVENT
    onSortClick = (e, index) => {
        const column = this.state.data[index];

        if (!column.sortable) {
            return;
        }

        if (column.sorted === 'asc') {
            column.sorted = 'desc';
        } else if (column.sorted === 'desc') {
            column.sorted = '';
        } else {
            column.sorted = 'asc';
        }

        const freshData = this.mapToData(this.props);
        freshData.splice(index, 1, column);

        this.setState({
            data: freshData
        });

        if (column.name) {
            if (column.sorted !== '') {
                this.props.onServerSort(column.name, column.sorted);
            }
        } else {
            this.props.onSort(index - (this.props.detailed ? 1 : 0), column.sorted);
        }
    };
}

TableHeader.propTypes = {
    onSort: PropTypes.func.isRequired,
    onServerSort: PropTypes.func
};

/**
 *
 */
class TableContentRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: props.expanded
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            nextState.expanded = nextProps.expanded;
        }
    }

    render() {
        return <tbody className={this.props.scroll ? 'scroll-table' : ''}>{this.renderRow()}</tbody>;
    }

    // RENDERS
    renderRow = () => {
        let row;

        let color = '';

        if (this.props.is_goods) {
            if (!this.props.is_demand && this.props.is_critical) {
                color = 'rgba(242, 129, 135, 0.2)';
            } else if (!this.props.is_demand && !this.props.is_critical && !this.props.details.invoice) {
                color = 'rgba(227,228,231,0.9)';
            } else if (this.props.is_critical && this.props.is_demand) {
                color = 'rgba(253,138,46,0.5)';
            } else if (this.props.details.is_processed) {
                color = '';
            } else if (!this.props.details.is_processed && this.props.details.invoice) {
                color = 'rgba(227,228,231,0.9)';
            }
        }

        row = [
            <tr style={{ backgroundColor: color }} key="origin">
                {this.renderCells(this.props.data, this.props.index)}
            </tr>
        ];

        if (this.props.detailed && this.state.expanded) {
            let details = null;

            if (this.props.detailsRender) {
                details = this.props.detailsRender(this.props.details);
            }

            row.push(
                <tr style={this.props.is_unused ? { backgroundColor: 'rgba(242, 129, 135, 0.3)' } : {}} key="details">
                    <td colSpan={(this.props.data.length + 1).toString()} style={{ borderTop: '0px', padding: '0px' }}>
                        {details}
                    </td>
                </tr>
            );
        }

        return row;
    };

    renderCells = (values, row_index) => {
        console.log('DATATABLE', values);
        const cells = values.map((cell, cell_index) => {
            if (this.props.cellRender) {
                return (
                    <td
                        key={'cell_' + cell_index}
                        style={
                            this.state.expanded
                                ? {
                                      borderBottom: '0px',
                                      verticalAlign: 'middle'
                                  }
                                : {
                                      borderBottom: '5px',
                                      verticalAlign: 'middle'
                                  }
                        }
                    >
                        {this.props.good
                            ? this.props.cellRender(this.props.good, cell_index, cell, this.props.details, this.props.onCellValueChanged)
                            : this.props.cellRender(row_index, cell_index, cell, this.props.details, this.props.onCellValueChanged)}
                    </td>
                );
            }

            return (
                <td key={'cell_' + cell_index}>
                    {cell}
                </td>
            );
        });

        if (this.props.detailed) {
            cells.unshift(
                <td key={'cell_details'} className="borderless-left-right">
                    <a href="#" onClick={this.expandClick}>
                        <i
                            className={this.state.expanded ? 'fa fa-minus-square-o h5 m-none details-control' : 'fa fa-plus-square-o h5 m-none details-control'}
                            style={{ color: '#0088cc' }}
                        />
                    </a>
                </td>
            );
        }

        return cells;
    };

    expandClick = e => {
        e.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });
    };
}

TableContentRow.propTypes = {
    values: PropTypes.array.isRequired,
    cellRender: PropTypes.func,
    onCellValueChanged: PropTypes.func
};

TableContentRow.defaultProps = {
    values: []
};

export default DataTable;
