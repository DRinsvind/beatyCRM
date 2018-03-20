import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ExpandedDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: {
        direction: 'asc',
        column_idx: 0
      },
      search: props.search,
      loading: props.loading,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.loading !== nextProps.loading) {
      nextState.loading = nextProps.loading;
    }
  }

  render() {
    let data_rows = this.renderRows();
    return (
      <div className="dataTable mt-md">
        <div className="row datatables-header form-inline">
          <div className="col-md-8">
            {this.props.someData ? this.props.someData() : ''}
          </div>
          {/*<div className="col-md-4">*/}
            {/*<div className="input-group pull-right mb-lg searchCustom"*/}
                 {/*style={{width: '75%'}}>*/}
              {/*<input*/}
                {/*id="q"*/}
                {/*name="q"*/}
                {/*type="text"*/}
                {/*className="form-control"*/}
                {/*placeholder="Поиск..."*/}
                {/*value={this.props.search}*/}
                {/*onChange={(e) => {*/}
                  {/*e.preventDefault();*/}
                  {/*this.props.onSearchChange(e.target.value);*/}
                {/*}}*/}
              {/*/>*/}
              {/*<span className="input-group-btn" style={{width: '0'}}>*/}
								{/*<button className="btn btn-default text-free">*/}
                  {/*<i className="fa fa-fw fa-search"/>*/}
                {/*</button>*/}
							{/*</span>*/}
            {/*</div>*/}
          {/*</div>*/}
        </div>
        <table className="table table-striped table-hover mb-none table-bordered tableSection">
          <TableHeader
            data={this.props.headers}
            sort={this.state.sort}
            onSort={this.sortingRows}
          />
          {/*<tbody style={data_rows.length > 9 ? {height: '350px'} : {}}>*/}
          <tbody>
          {data_rows}
          </tbody>
        </table>
      </div>
    );
  }

  renderRows = () => {
    let uiRows = [];

    let categories = this.props.categories;

    const searchTerm = this.props.search.toString().toLowerCase();

    if (!this.state.loading) {
      uiRows = [];
      if (searchTerm !== '') {
        categories = categories.filter((row) => {
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
        categories = this.sortData(categories);

        if (!categories.length) {
          return (
            <tr key={'no_results'}>
              {this.noDataRender()}
            </tr>
          );
        } else {
          this.cat(categories, uiRows);
        }
      } else {
        categories = this.sortData(categories);
        if (!categories.length) {
          return (
            <tr key={'no_results'}>
              {this.noDataRender()}
            </tr>
          );
        } else {
          this.cat(categories, uiRows);
        }
      }
    } else {
      uiRows.push(
        <tr key={'loading_results'}>
          <td colSpan={this.props.columnsNumber} style={{textAlign: 'center'}}>
            <i className="fa fa-fw fa-spin fa-refresh"/> Загрузка...
          </td>
        </tr>
      );
    }

    return uiRows;
  };

  cat = (categories, uiRows) => {
    categories.forEach((category, ci) => {
      uiRows.push(this.props.renderCategories(category, category.index_cat));

      if (category.expanded) {
        uiRows.push(this.props.renderItemsRowsF(ci, category.details));
      }

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
  renderCategories: PropTypes.func.isRequired,
  renderItemsRowsF: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  columnsNumber: PropTypes.string.isRequired,
  loading: PropTypes.any.isRequired
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
          style={{width: `${column.width}`, whiteSpace: `${column.no}`, paddingLeft: '25px'}}
          className={'pl' + (column.sortable ? ' sorting' : '') +
          (this.props.sort.column_idx === idx ? ' sorting_' + this.props.sort.direction : '')}
          onClick={(e) => this.onSortClick(e, idx)}>
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
};

export default ExpandedDataTable;