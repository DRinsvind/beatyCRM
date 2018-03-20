import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpandedDataTableNew from '../commons/tables/ExpandedDataTableNew';
import Pagination from '../commons/Pagination';

import {FORMAT_PHONE_NUMBER} from '../../utils/index';

/**
 *
 */
class VendorsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendors: props.vendors,
      selected_key: 0,
      loading: props.loading,
      search: '',
      table_sort: {
        order: '',
        asc: ''
      },
      page_info: props.page_info
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      nextState.vendors = nextProps.vendors;
    }

    if (this.props.loading !== nextProps.loading) {
      nextState.loading = nextProps.loading;
    }

    if (this.props.page_info !== nextProps.page_info) {
      nextState.page_info = nextProps.page_info;
    }
  }

  render() {
    return (
      <div className="row" style={{margin: '-90px -45px 0px -45px'}}>
        <div className="col-md-12">
          <section className="panel panel-default">
            <header className="panel-heading custom-heading">
              <div className="pull-right" style={{'position': 'relative'}}>
                <button className="btn btn-primary mr-xs mt-xs pull-right" onClick={this.onAddClick}>
                  <i className="fa fa-fw fa-plus"/>&nbsp;
                  <i className="fa fa-fw fa-truck"/>
                </button>
              </div>
              <h2 className="panel-title">
                <div className="panel-title-name">
                  Поставщики
                </div>
                <div style={{display: 'inline-block', float: 'right'}}>
                  <div className="input-group pull-right searchCustom"
                       style={{width: 300, marginTop: '5px'}}>
                    <input
                      id="q"
                      name="q"
                      type="text"
                      className="form-control fs-12"
                      style={{borderRight: 'none'}}
                      placeholder="Поиск..."
                      value={this.state.search}
                      onChange={(e) => {
                        e.preventDefault();
                        this.changeSearch(e.target.value);
                      }}
                    />
                    <span className="input-group-btn" style={{width: '0'}}>
                    <button
                      className="btn btn-default text-free btn-search"
                      style={{borderLeft: 'none'}}
                    >
                      <i className="fa fa-fw fa-search"/>
                    </button>
							</span>
                  </div>
                </div>
              </h2>
            </header>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-12">
                  <VendorsTable vendors={this.state.vendors}
                                onDeleteRow={this.onDeleteRow}
                                router={this.props.router}
                                search={this.state.search}
                                changeSearch={this.changeSearch}
                                loading={this.state.loading}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 text-right mt-md">
                  <Pagination
                    active={this.state.page_info.page}
                    total={this.state.page_info.pages}
                    loading={this.state.loading}
                    onChangeActivePage={this.changeActivePage}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.onLoad('');
  }

  // EVENTS
  changeActivePage = (active_page) => {
    if (active_page !== this.state.page_info.page) {
      this.setState({
        ...this.state,
        page_info: {
          ...this.state.page_info,
          page: active_page
        }
      });
      let params = '?page=' + active_page;
      const asc_param = (this.state.table_sort.order ?
        ('&order=' + this.state.table_sort.order + '&asc=' +
          (this.state.table_sort.asc === 'asc' ? 1 : 0)
        ) : '');
      params = params + asc_param;
      this.props.onLoad(params);
    }
  };

  changeSearch = (val) => {
    this.setState({
      search: val,
    });
  };

  onAddClick = (e) => {
    e.preventDefault();
    this.props.router.push('/vendors/add/');
  };

  onDeleteRow = (e, vendor_id, vendor) => {
    e.preventDefault();

    if (window.confirm('Вы действительно хотите удалить поставщика ' + vendor.short_name + '?')) {
      this.props.onDeleteItem(this.props.router, vendor_id);
    } else {
      // Do nothing!
    }
  };
}

VendorsList.propTypes = {
  vendors: PropTypes.array.isRequired,
  // EVENTS
  onLoad: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDeleteItem: PropTypes.func,
  loading: PropTypes.any.isRequired
};


class VendorsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: this.mapToData(props)
    };
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.rows = this.mapToData(nextProps);
  }

  render() {
    return (
      <ExpandedDataTableNew
        headers={[
          {
            text: 'Поставщик',
            sortable: true,
            searchable: true,
            width: '30%'
          },
          {
            text: 'Номер телефона',
            searchable: true,
            width: '30%'
          },
          {
            text: 'Задолженность',
            sortable: true,
            searchable: true,
            width: '30%'
          },
          {
            text: 'Функции',
            width: '10%'
          }
        ]}
        categories={this.state.rows}
        search={this.props.search}
        renderCategories={this.renderCalls}
        renderItemsRowsF={(e) => null}
        onSearchChange={this.props.changeSearch}
        columnsNumber="4"
        loading={this.props.loading}
      />
    );
  }

  mapToData = (props) => {
    return props.vendors.map((vendor, vid) => {
      return {
        values: [
          vendor.short_name,
          vendor.contacts,
          vendor.debt,
          vendor.legal_enity_id,
        ],
        details: vendor,
        index_cat: vid
      };
    });
  };

  // EVENTS
  onEditClick = (e, vendor_id) => {
    e.preventDefault();
    this.props.router.push('/vendors/edit/' + vendor_id);
  };

  onItemClick = (e, vendor_id) => {
    e.preventDefault();
    this.props.router.push('/vendors/profile/' + vendor_id);
  };

  renderCalls = (vendor, ci) => {
    return (
      <tr key={'category_' + ci}>
        {this.renderVendortCells(vendor, ci)}
      </tr>
    );
  };

  renderVendortCells = (vendor, id) => {
    let data = [];
    vendor.values.map((val, vid) => {
      switch (vid) {
        case 0:
          data.push(
            <td style={{width: '30%'}} key={'data' + vid} className=''>
              <a href="#" style={{color: '#33353F', fontWeight: '700'}}
                 onClick={(e) => this.onItemClick(e, vendor.details.legal_enity_id)}>
                {val}
              </a>
            </td>
          );
          break;
        case 1:
          data.push(
            <td style={{width: '30%'}} key={'data' + vid} className=''>
              {FORMAT_PHONE_NUMBER(val)}
            </td>
          );
          break;
        case 2:
          data.push(
            <td style={{width: '30%'}} key={'data' + vid} className=''>
              {parseFloat(val).toFixed(2)}
            </td>
          );
          break;
        case 3:
          data.push(
            <td style={{width: '10%'}} key={'data' + vid} className=''>
                            <span>
                                <a className="p-xs mr-xs" href="#" onClick={(e) => this.onEditClick(e, val)}>
                                    <i className="fa fa-fw fa-pencil-square-o" style={{color: '#777'}}/>
                                </a>
                                <a className="p-xs mr-xs" href="#"
                                   onClick={(e) => this.props.onDeleteRow(e, val, vendor.details)}>
                                    <i className="fa fa-fw fa-trash" style={{color: '#f3989a'}}/>
                                </a>
                            </span>
            </td>
          );
          break;
        default:
          break;
      }
    });
    return data;
  };
}

VendorsTable.propTypes = {
  vendors: PropTypes.array.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  changeSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  loading: PropTypes.any.isRequired,
  router: PropTypes.object.isRequired
};

export default VendorsList;
