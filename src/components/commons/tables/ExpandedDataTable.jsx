import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ExpandedDataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: {
                direction: 'asc',
                column_idx: 1
            },
            search: props.search
        }
    }

    render() {
        return (
            <div className="dataTable mt-md">
                <div className="row datatables-header form-inline">
                    <div className="col-md-8">
                        {this.props.someData ? this.props.someData() : ''}
                    </div>
                    <div className="col-md-4">
                        <div className="input-group pull-right mb-md"
                             style={{width: '75%'}}>
                            <input
                                id="q"
                                name="q"
                                type="text"
                                className="form-control"
                                placeholder="Поиск..."
                                value={this.props.search}
                                onChange={(e) => {
                                    e.preventDefault();
                                    this.props.onSearchChange(e.target.value);
                                }}
                            />
                            <span className="input-group-btn" style={{width: '0'}}>
								<button className="btn btn-default text-free">
                                    <i className="fa fa-search"></i>
                                </button>
							</span>
                        </div>
                    </div>
                </div>

                <div style={{width: '100%', overflow: 'scroll', position: 'relative'}}>
                    <table className="table table-striped table-hover mb-none table-bordered">
                        <TableHeader
                            data={this.props.headers}
                            sort={this.state.sort}
                            onSort={this.sortingRows}
                            border={this.props.border}
                        />
                        <tbody>
                        {this.renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderRows = () => {
        let uiRows = [];

        let categories = this.props.categories;

        if (categories.length > 0) {
            categories = this.sortData(categories);
            categories.forEach((category, ci) => {
                uiRows.push(
                    this.props.renderCategories(category, ci)
                );

                if (category.expanded || this.state.search !== '') {
                    uiRows = uiRows.concat(this.renderItemsRows(ci, this.props.itemValues(category)));
                }
            });

            return uiRows;
        } else {
            if (this.props.loading) {
                return (
                    <tr>
                        <td colSpan={this.props.columnsNumber} style={{textAlign: 'center'}}>
                            <i className="fa fa-fw fa-spin fa-refresh"/> Загрузка...
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr key={'no_results'}>
                        {this.noDataRender()}
                    </tr>
                );
            }
        }
    };

    renderItemsRows = (cid, items) => {
        const searchTerm = this.props.search.toString().toLowerCase();

        if (searchTerm !== '') {
            items = items.filter((row) => {
                let found = false;

                row.values.forEach((value, idx) => {
                    if (value && this.props.headers[idx].searchable) {
                        if (value.toString().toLowerCase().indexOf(searchTerm) >= 0) {
                            found = true;
                        }

                    }
                });

                return found;
            });
            items = this.sortData(items);

            if (!items.length) {
                return (
                    <tr key={'no_results' + cid}>
                        {this.noDataRender()}
                    </tr>
                );
            } else {
                return this.renderItems(items, cid);
            }
        } else {
            items = this.sortData(items);
            return this.renderItems(items, cid);
        }
    };

    renderItems = (items, cid) => {
        return items.map((item, gi) => {
            return (
                <tr key={'category_' + cid + '_item_' + gi}>
                    {this.props.renderCell(item.values, gi, cid, item.details)}
                </tr>
            );
        });
    };

    noDataRender = () => {
        return (
            <td colSpan={this.props.columnsNumber} style={{textAlign: 'center'}}>
                Нет данных
            </td>
        );
    };

    // ACTIONS

    sortData = (data) => {
        return data.sort((a, b) => {

            const val1 = a.values[this.state.sort.column_idx];
            const val2 = b.values[this.state.sort.column_idx];

            return this.compare(val1, val2) * ((this.state.sort.direction === 'asc') ? 1 : -1);
        });
    };

    sortingRows = (data) => {
        this.props.onTableSortClick();

        let sort = this.state.sort;
        sort.direction = data.direction;
        sort.column_idx = data.column_idx;

        this.setState({sort: sort});

    };

    compare = (val1, val2) => {
        let type = typeof(val1);

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

ExpandedDataTable.propTypes = {
    search: PropTypes.string.isRequired,
    headers: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    itemValues: PropTypes.func.isRequired,
    onTableSortClick: PropTypes.func.isRequired,
    someData: PropTypes.func,
    loading: PropTypes.bool,
    onSearchChange: PropTypes.func.isRequired
};

class TableHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.mapToData(props),
        };
    }

    render() {
        return (
            <thead>
            <tr>
                {this.renderColumns(this.state.data)}
            </tr>
            </thead>
        );
    }

    mapToData = (props) => {
        const data = [...props.data];

        return data.map((val) => {
            return {
                sortable: false,
                searchable: false,
                ...val
            }
        });
    };

    renderColumns = (data) => {
        return data.map((column, idx) => {
            return (
                <th
                    key={idx}
                    className={(this.props.border ? '' : '') + (column.sortable ? ' sorting' : '') +
                    (this.props.sort.column_idx === idx ? ' sorting_' + this.props.sort.direction : '')}
                    onClick={(e) => this.onSortClick(e, idx)} style={{whiteSpace: 'nowrap', paddingLeft: 15}}>
                    {column.text}
                </th>
            )
        });
    };

    onSortClick = (e, index) => {
        const column = this.state.data[index];
        let data = {};

        if (!column.sortable) {
            return;
        }

        if (this.props.sort.column_idx !== index) {
            data = {
                column_idx: index,
                direction: 'asc'
            }
        } else {
            data = {
                column_idx: index,
                direction: this.props.sort.direction === 'asc' ? 'desc' : 'asc'
            }
        }

        this.props.onSort(data);
    };
}

TableHeader.propTypes = {
    data: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    border: PropTypes.bool
};

export default ExpandedDataTable;