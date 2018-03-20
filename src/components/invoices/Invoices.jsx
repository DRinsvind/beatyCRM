import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DataTable from '../commons/tables/DataTable';
import InvoiceAdd from '././InvoiceAdd';
import InventoryAdd from './InventoryAdd';
import Pagination from '../commons/Pagination';
import SelectDate from '../commons/SelectDate';
import AddTransactionReturning from './AddTransactionReturning';
import TransactionView from './TransactionView';
import Select2 from 'react-select2-wrapper';
import {
  FORMAT_DATE_WITH_NO_TIME,
  FORMAT_FIRST_DAY_OF_MONTH,
  FORMAT_DATE_WITH_SLASH
} from '../../utils/index'

const ACTIONS_LIST = [
  {id: 0, name: 'Все', type: 'all', icon: 'icon-Asset-5'},
  {id: 1, name: 'Приходные', type: 'invoice', icon: 'icon-Asset-4'},
  {id: 2, name: 'Списание', type: 'production', icon: 'icon-Asset-6'},
  {id: 3, name: 'Перемещение', type: 'transaction', icon: 'icon-Asset-2'},
  {id: 5, name: 'Возврат', type: 'returning', icon: 'icon-Asset-3'},
  {id: 4, name: 'Инвентаризация', type: 'inventory', icon: 'icon-Asset-1'}
];

let NEW_WIN;

const $ = window.$;

class Invoices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_action: 0,
      invoices: props.invoices,
      loading: props.loading,
      table_sort: {
        order: '',
        asc: ''
      },
      page_info: props.page_info,
      show_form: false,
      view_return: false,
      requested_date: this.getPeriod(props.period),
      selected_period: this.getSelectedPeriod(props.period),
      invoice: {
        article: '',
        date: '',
        vendor: null,
        from_warehouse: null,
        to_warehouse: null,
        paid_form: 0,
        discount: '',
        fare: '',
        note: '',
        type_payment_id: 0,
        goods: []
      },
      search: '',
      openSel: false
    };

    this.onScrollWindow = this.onScrollWindow.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.invoices !== nextProps.invoices) {
      nextState.invoices = nextProps.invoices;
    }

    if (this.props.loading !== nextProps.loading) {
      nextState.loading = nextProps.loading;
    }

    if (this.props.page_info !== nextProps.page_info) {
      nextState.page_info = nextProps.page_info;
    }

    if (this.props.invoice !== nextProps.invoice) {
      nextState.invoice = {};
    }

    if (this.props.period !== nextProps.pediod) {
      nextState.requested_date = this.getPeriod(nextProps.period);
      nextState.selected_period = this.getSelectedPeriod(nextProps.period);
    }

    if (this.props.requested_date !== nextProps.requested_date) {
      nextState.requested_date = {
        from: nextProps.requested_date.from,
        to: nextProps.requested_date.to
      };
    }

    if (nextProps.html_inventory) {
      setTimeout(() => {
        NEW_WIN.document.write(nextProps.html_inventory);
        NEW_WIN.print();
      }, 100);
      this.props.clearInventoryHTML();
    }
  }

  componentWillReceiveProps(nextProps) {
    $('body').removeClass('noscroll');
    let scroll = $('body').css('top');
    scroll = scroll.substring(0, scroll.length - 2);
    scroll = +scroll.substring(1);
    document.documentElement.scrollTop = scroll;
  }

  componentDidMount() {
    const period = this.getPeriod(this.props.period);
    const dateStart = period.from.split('/');
    const dateEnd = period.to.split('/');
    this.props.onLoad('all', "", `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, true);
    this.props.onLoadVendorsList('');

    window.addEventListener('scroll', this.onScrollWindow);
  };

  onScrollWindow = () => {

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - clientHeight < document.documentElement.scrollTop + 1 &&
      scrollHeight - clientHeight !== 0 &&
      this.state.page_info.page < this.state.page_info.pages) {

      const tableSort = this.state.table_sort;

      const page = this.state.page_info.page < this.state.page_info.pages
        ? this.state.page_info.page + 1
        : this.state.page_info.page;

      const asc_param = tableSort.order
        ? '&order=' + tableSort.order + '&asc=' + (tableSort.asc === 'asc' ? 1 : 0)
        : '';

      this.setState({
        ...this.state,
        page_info: {
          ...this.state.page_info,
          page: page
        }
      });

      let params = '?page=' + page;

      params = params + asc_param;
      const dateStart = this.state.requested_date.from.split('/');
      const dateEnd = this.state.requested_date.to.split('/');

      this.props.onLoad(this.getType(), params, `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, false);

      $('body')
        .css('top', -document.documentElement.scrollTop + 'px')
        .addClass('noscroll');
    }
  };

  render() {

    return (
      <section className="content-with-menu">
        <div className="content-with-menu-container">
          <div className="inner-menu-toggle">
            <a href="#" className="inner-menu-expand" data-open="inner-menu">
              Show Menu <i className="fa fa-chevron-right"/>
            </a>
          </div>
          <menu id="content-menu" className="inner-menu invoices" role="menu">
            <div className="nano">
              <div className="nano-content p-none">
                <div className="inner-menu-content">
                  <div style={{marginTop: 20}}>
                    {/*<div className="widget-header m-lg">*/}
                    {/*<div className="title" style={{paddingTop: 5}}>*/}
                    {/*КАТЕГОРИИ*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <div className="widget-content">
                      <nav id="menu" className="nav-main invoices" role="navigation">
                        <ul className="nav nav-main">
                          {this.renderFilterItems(ACTIONS_LIST)}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </menu>
          <div className="inner-body invoices p-sm">
            <div className="row">
              <div className="col-md-12">
                {this.renderContent()}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  renderFilterItems = (selected_group) => {
    return selected_group.map((item) => {
      return (
        <li className={this.state.selected_action === +item.id ? "nav nav-active" : "nav"} key={item.id}>
          <a href="#"
             className="text-center"
             onClick={(e) => {
               e.preventDefault();
               this.setState({
                 selected_action: +item.id,
                 show_form: false,
                 view_return: false,
                 invoices: []
               });
               const dateStart = this.state.requested_date.from.split('/');
               const dateEnd = this.state.requested_date.to.split('/');
               this.props.onLoad(item.type, this.createParams(), `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, true);
             }}>
            <i className={item.icon}/>
          </a>
        </li>
      )
    });
  };

  makeList = (list) => {
    return list.map((item) => {
      return {
        id: item.id,
        text: item.name
      };
    });
  };

  makeVendorslist = (list) => {
    return list.map((item) => {
      return {
        id: item.legal_enity_id,
        text: item.short_name
      };
    });
  };

  selectedPeriod = (selected) => {
    switch (selected) {
      case 0:
        return 'Текущий день';
      case 1:
        return 'Текущий месяц';
      case 3:
        return 'Текущее полугодие';
      case 4:
        return 'Текущий год';
      case 2:
        return 'Другой период';
    }
  };

  onSelecPeriod = () => {
    this.onSelectPeriod();
    this.setState({openSel: false});
  };

  renderContent = () => {
    if (this.state.show_form) {
      if (this.state.view_return) {
        return (
          <TransactionView invoice={this.props.invoice}/>
        );
      } else {
        switch (+this.state.selected_action) {
          case 4:
            return (
              <InventoryAdd
                goods_categories={this.props.goods_categories}
                category_id={this.props.category_id}
                category_name={this.props.category_name}
                warehouses_list={this.props.warehouses_list}
                makeList={this.makeList}
                onGoodsLoad={this.props.onInventorySelCategory}
                goods={this.props.goods}
                sel_action={+this.state.selected_action}
                onAddInvoice={this.onAddInvoice}
                clearGoods={this.clearGoods}
                searchable="false"
                onSelectWarehouse={this.selectWarehouse}
                onValidateDocNumber={this.props.onValidateDocNumber}
                errors={this.props.errors}
                docNum={this.props.docNum}
                closeAddForm={this.closeAddForm}
              />
            );
          case 3:
            return (
              <AddTransactionReturning
                name="Создание накладной перемещения товаров"
                onSaveTransactionDocument={this.onAddInvoice}
                onCancel={this.onCancel}
                warehouses_list={this.props.warehouses_list}
                onSelectWarehouse={this.selectTransactionWarehouse}
                groupsFrom={this.props.groupsFrom}
                groupsTo={this.props.groupsTo}
                goodsFrom={this.props.goodsFrom}
                goodsTo={this.props.goodsTo}
                loadGroupsGoods={this.props.onLoadGroupsGoods}
                onValidateDocNumber={this.props.onValidateDocNumber}
                errors={this.props.errors}
                docNum={this.props.docNum}
              />
            );
          default:
            return (
              <InvoiceAdd
                vendors_list={this.props.vendors_list}
                warehouses_list={this.props.warehouses_list}
                makeList={this.makeList}
                goods_categories={this.props.goods_categories}
                onCategorySelect={this.props.onSelCategory}
                goods={this.props.goods}
                sel_action={+this.state.selected_action}
                category_id={this.props.category_id}
                onAddInvoice={this.onAddInvoice}
                onCancel={this.onCancel}
                onSelectWarehouse={this.selectWarehouse}
                invoice={this.state.invoice}
                onLoadInvoices={this.props.onLoadInvoices}
                returnInvoices={this.props.returnInvoices}
                returnLoad={this.props.returnLoad}
                clearAllReturnData={this.props.clearAllReturnData}
                onValidateDocNumber={this.props.onValidateDocNumber}
                errors={this.props.errors}
                docNum={this.props.docNum}
              />
            );
        }
      }
    } else {
      let headerName = '';
      let warehouse = false;
      switch (+this.state.selected_action) {
        case 0:
          headerName = 'Все накладные';
          break;
        case 1:
          headerName = 'Приходные накладные';
          warehouse = true;
          break;
        case 2:
          headerName = 'Накладные списания';
          break;
        case 3:
          headerName = 'Накладные перемещения';
          break;
        case 4:
          headerName = 'Накладные инвентаризации';
          break;
        case 5:
          headerName = 'Накладные возврата';
        default:
          break;
      }
      return (
        <section className="panel panel-default" id="InvoicesList">
          <header className="panel-heading custom-heading">
            <div className={this.state.selected_action !== 0 ? "pull-right" : "hide"}
                 style={{'position': 'relative', 'top': '-5px'}}>
              <a href="#"
                 className="btn btn-primary mt-sm"
                 style={{padding: '6px'}}
                 onClick={(e) => {
                   e.preventDefault();
                   this.setState({show_form: true});
                   if (+this.state.selected_action !== 1) {
                     this.props.generateDocumentNumber(this.getType());
                   }
                   if (warehouse) {
                     this.props.onAddSelect('product', 'sale');
                   }
                 }}>
                <i className="fa fa-fw fa-plus-circle"/>
                <i className="fa fa-fw fa-file-text-o"/>
              </a>
            </div>
            <h2 className="panel-title" style={{display: 'inline-block'}}>
              <div className="panel-title-name">
                {headerName}
              </div>
            </h2>
            <div className={+this.state.selected_action === 1 ? 'block-subtitle' : 'hide'}>
              Поставщик:
              <div
                className="input-group"
                style={{display: 'inline-block', marginLeft: 20, marginBottom: '-10px'}}
              >
                <Select2 className="form-control"
                         style={{display: 'inline-block', width: '200px'}}
                         options={{
                           placeholder: 'Выберите поставщика',
                           theme: 'bootstrap'
                         }}
                         data={this.makeVendorslist(this.props.vendors_list)}
                         value={this.state.selected_vendor}
                         onSelect={(e) => {
                           e.preventDefault();
                           this.setState({
                             selected_vendor: e.target.value
                           });
                         }}
                />
              </div>
            </div>

            <div
              className="popoverDiv ml-sm"
              ref="cont"
              style={{display: 'inline-block'}}>
              <button
                className="btn btn-cardee mr-xs"
                ref="target"
                onClick={(e) => {
                  this.setState({openSel: !this.state.openSel})
                }}>
                Выберите дату <i className="fa fa-fw fa-calendar"/>
              </button>
              <label className="ml-md" ref="target">
                {this.selectedPeriod(this.state.selected_period)}
              </label>
              <SelectDate
                onCancelSelecting={this.onCancelSelectDate}
                onSelecPeriod={this.onSelecPeriod}
                periodChanged={this.periodChanged}
                changeDate={this.onChangeDate}
                selected_period={this.state.selected_period}
                period={this.state.requested_date}
                open={this.state.openSel}
                closePopover={() => {
                  this.setState({openSel: false})
                }}
                refs={this.refs}
              />
            </div>

            <div style={{display: 'inline-block', float: 'right'}}>
              <div
                className="input-group searchCustom"
                style={{width: 300, marginTop: '5px'}}
              >
                <input
                  id="q"
                  name="q"
                  type="text"
                  className="form-control fs-12"
                  placeholder="Поиск..."
                  style={{borderRight: 'none'}}
                  value={this.state.search}
                  onChange={e => {
                    e.preventDefault();
                    this.searchChanged(e.target.value);
                  }}
                />
                <span
                  className="input-group-btn"
                  style={{width: 0}}
                >
                  <button
                    className="btn btn-default text-free btn-search"
                    style={{borderLeft: 'none'}}>
                      <i className="fa fa-search"/>
                  </button>
                </span>
              </div>
            </div>

          </header>
          <div className="panel-body pt-none">
            <div className="row">
              <div className="col-md-12">
                <div className="invoicesTable">
                  <InvoicesTable items={this.state.invoices}
                                 router={this.props.router}
                                 selected_categ={+this.state.selected_action}
                                 loading={this.state.loading}
                                 onTableSort={this.tableSort}
                                 table_sort={this.state.table_sort}
                                 requested_date={this.state.requested_date}
                                 selected_period={this.state.selected_period}
                                 onChangeDate={this.onChangeDate}
                                 onPeriodChanged={this.periodChanged}
                                 onCancelSelectDate={this.onCancelSelectDate}
                                 onSelectPeriod={this.onSelectPeriod}
                                 getType={this.getType}
                                 viewTransactionForm={this.viewTransactionForm}
                                 onLoadInvoice={this.props.onLoadInvoice}
                                 searchChanged={this.searchChanged}
                                 search={this.state.search}
                                 openSelectDate={() => this.setState({openSel: !this.state.openSel})}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  };


  // EVENTS
  viewTransactionForm = () => {
    this.setState({view_return: true, show_form: true});
  };

  selectWarehouse = (warehouse) => {
    if (this.state.view_return) {
      this.props.clearReturnFormWarehouse();
    }
    this.props.onAddSelect('product', warehouse);
  };

  selectTransactionWarehouse = (warehouse, dir) => {
    this.props.selectTransactionWarehouse(warehouse, 'product', dir);
  };

  createParams = () => {
    let params = '?page=' + 1;
    const asc_param = (this.state.table_sort.order ?
      ('&order=' + this.state.table_sort.order + '&asc=' +
        (this.state.table_sort.asc === 'asc' ? 1 : 0)
      ) : '');
    return params + asc_param;
  };

  searchChanged = (search) => {
    this.setState({search: search});
    let params = '?page=' + 1 + '&search=' + search;
    const asc_param = (this.state.table_sort.order ?
      ('&order=' + this.state.table_sort.order + '&asc=' +
        (this.state.table_sort.asc === 'asc' ? 1 : 0)
      ) : '');
    params = params + asc_param;
    const dateStart = this.state.requested_date.from.split('/');
    const dateEnd = this.state.requested_date.to.split('/');
    this.props.onLoad(this.getType(), params, `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, true);
  };

  clearGoods = () => {
    this.setState({goods: []});
  };

  closeAddForm = () => {
    this.setState({show_form: false});
  };

  onAddInvoice = (data) => {
    let type = this.getType();
    const dateStart = this.state.requested_date.from.split('/');
    const dateEnd = this.state.requested_date.to.split('/');
    this.props.onAddInvoice(data, type, `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`);
    this.setState({
      show_form: false
    });
    if (type === 'inventory') {
      NEW_WIN = window.open("about:blank");
    }
  };

  getType = () => {
    let type = '';
    switch (+this.state.selected_action) {
      case 0:
        type = 'all';
        break;
      case 1:
        type = 'invoice';
        break;
      case 2:
        type = 'production';
        break;
      case 3:
        type = 'transaction';
        break;
      case 4:
        type = 'inventory';
        break;
      case 5:
        type = 'returning';
      default:
        break;
    }
    return type;
  };

  onCancelSelectDate = () => {
    this.props.onChangePeriod('date');
    this.setState({
      selected_period: 1,
      openSel: false
    });
  };

  onCancel = () => {
    this.setState({
      show_form: false
    });
    this.props.onCancel();
  };

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
      const dateStart = this.state.requested_date.from.split('/');
      const dateEnd = this.state.requested_date.to.split('/');
      this.props.onLoad(this.getType(), params, `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`);
    }
  };

  onSelectPeriod = () => {
    this.setState({
      openSel: false
    });
    const dateStart = this.state.requested_date.from.split('/');
    const dateEnd = this.state.requested_date.to.split('/');
    this.props.onLoad(this.getType(), this.createParams(), `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, true);
  };

  tableSort = (order, asc) => {
    this.setState({
      table_sort: {
        order: order,
        asc: asc
      }
    });
    const asc_par = (asc === 'asc' ? 1 : 0);
    const par = '?page=' + 1 + '&order=' + order + '&asc=' + asc_par;
    const dateStart = this.state.requested_date.from.split('/');
    const dateEnd = this.state.requested_date.to.split('/');
    this.props.onLoad(this.getType(), par, `${dateStart[2]}-${dateStart[1]}-${dateStart[0]}`, `${dateEnd[2]}-${dateEnd[1]}-${dateEnd[0]}`, true);
  };

  onChangeDate = (e) => {
    e.preventDefault();
    this.props.onChangePeriodDate(e.target.name, e.target.value);
  };

  getSelectedPeriod = (period) => {
    switch (period) {
      case 'date':
        return 0;
      case 'month':
        return 1;
      case 'hyear':
        return 3;
      case 'year':
        return 4;
      default:
        return 2;
    }
  };

  getPeriod = (period) => {
    let date = new Date();
    switch (period) {
      case 'date':
        return {
          from: FORMAT_DATE_WITH_SLASH(new Date()),
          to: FORMAT_DATE_WITH_SLASH(new Date())
        };
      case 'month':
        return {
          from: FORMAT_FIRST_DAY_OF_MONTH(new Date()),
          to: FORMAT_DATE_WITH_SLASH(new Date())
        };
      case 'hyear':
        console.log('date', );
        if (new Date().getMonth() <= 6) {
            date.setMonth(0);
        } else {
            date.setMonth(6);
        }
        date.setDate(1);
        return {
          from: FORMAT_DATE_WITH_SLASH(date),
          to: FORMAT_DATE_WITH_SLASH(new Date())
        };
      case 'year':
        date.setMonth(0);
        date.setDate(1);
        return {
          from: FORMAT_DATE_WITH_SLASH(date),
          to: FORMAT_DATE_WITH_SLASH(new Date())
        };
      default:
        return {
          from: this.props.requested_date.from,
          to: this.props.requested_date.to
        };
    }
  };

  periodChanged = (e) => {
    e.preventDefault();
    switch (+e.target.value) {
      case 0:
        this.props.onChangePeriod('date');
        break;
      case 3:
        this.props.onChangePeriod('hyear');
        break;
      case 4:
        this.props.onChangePeriod('year');
        break;
      case 2:
        this.props.onChangePeriod('other');
        break;
      default:
        this.props.onChangePeriod('month');
        break;

    }

  };
}

Invoices.propTypes = {
  invoices: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  goods: PropTypes.array.isRequired,
  goods_categories: PropTypes.array.isRequired,
  warehouses_list: PropTypes.array.isRequired,
  vendors_list: PropTypes.array.isRequired,
  onLoad: PropTypes.func.isRequired,
  onSelCategory: PropTypes.func.isRequired,
  onLoadInvoice: PropTypes.func.isRequired,
  onLoadVendorsList: PropTypes.func.isRequired,
  onValidateDocNumber: PropTypes.func.isRequired,
  onChangePeriod: PropTypes.func.isRequired,
  generateDocumentNumber: PropTypes.func.isRequired,
  selectTransactionWarehouse: PropTypes.func.isRequired,
  onAddSelect: PropTypes.func.isRequired
};

class InvoicesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: props.items,
      rows: this.mapToData(props.items),
      open: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    nextState.items = nextProps.items;
    nextState.rows = this.mapToData(nextProps.items);
  }

  render() {
    return (
      <DataTable
        headers={this.createTable()}
        data={this.state.rows}
        detailed={false}
        cellRender={this.cellRender}
        loading={this.props.loading}
        onServerSort={this.props.onTableSort}
        goods={true}
        searchChanged={this.props.searchChanged}
        search={this.props.search}
        openSel={this.state.open}
      />
    );
  }

  selectedPeriod = (selected) => {
    switch (selected) {
      case 0:
        return 'Текущий день';
      case 1:
        return 'Текущий месяц';
      case 3:
        return 'Текущее полугодие';
      case 4:
        return 'Текущий год';
      case 2:
        return 'Другой период';
    }
  };

  createTable = () => {
    return [
      {
        text: 'Тип',
        sortable: true,
        searchable: true,
        sorted: (this.props.table_sort.order === 'type' ? this.props.table_sort.asc : ''),
        name: 'type'
      },
      {
        text: 'Номер накладной',
        sortable: true,
        searchable: true,
        sorted: (this.props.table_sort.order === 'num_doc' ? this.props.table_sort.asc : ''),
        name: 'num_doc'
      },
      {
        text: 'Дата',
        sortable: true,
        searchable: true,
        sorted: (this.props.table_sort.order === 'date_doc' ? this.props.table_sort.asc : ''),
        name: 'date_doc'
      },
      {
        text: 'Откуда',
        searchable: true,
        sortable: true,
        sorted: (this.props.table_sort.order === 'whence' ? this.props.table_sort.asc : ''),
        name: 'whence'
      },
      {
        text: 'Куда',
        searchable: true,
        sortable: true,
        sorted: (this.props.table_sort.order === 'destination' ? this.props.table_sort.asc : ''),
        name: 'destination'
      },
      {
        text: 'Сумма, грн',
        sortable: true,
        searchable: true,
        sorted: (this.props.table_sort.order === 'doc_sum' ? this.props.table_sort.asc : ''),
        name: 'doc_sum'
      },
      {
        text: 'Оплачено, грн',
        sortable: true,
        searchable: true,
        sorted: (this.props.table_sort.order === 'payment' ? this.props.table_sort.asc : ''),
        name: 'payment'
      }
    ];
  };

  mapToData = (items) => {
    return items.map((invoice) => {
      return {
        values: [
          invoice.type,
          invoice.num_doc,
          invoice.date_doc,
          invoice.whence,
          invoice.destination,
          invoice.doc_sum ? parseFloat(invoice.doc_sum).toFixed(2) : parseFloat(0).toFixed(2),
          invoice.payment ? parseFloat(invoice.payment).toFixed(2) : parseFloat(0).toFixed(2),
        ],
        details: {
          ...invoice,
          invoice: true
        }
      };
    });
  };

  // EVENTS
  onCancelSelecting = () => {
    this.props.onCancelSelectDate();
    this.setState({open: false});
  };

  onSelecPeriod = () => {
    this.props.onSelectPeriod();
    this.setState({open: false});
  };

  closePopover = () => {
    this.setState({open: false});
  };

  onItemClick = (e, details) => {
    e.preventDefault();
    let type = '';
    switch (details.type_denom) {
      case 'INVOICE':
        type = 'invoice';
        this.pushToView(type, details.doc_id);
        break;
      case 'PRODUCTION':
        type = 'production';
        this.pushToView(type, details.doc_id);
        break;
      case 'TRANSACTION':
        this.props.onLoadInvoice(details.doc_id, 'transaction');
        this.props.viewTransactionForm();
        break;
      case 'RETURNING':
        this.pushToView('returning', details.doc_id);
        break;
      case 'INVENTORY':
        this.pushToView('inventory', details.doc_id);
        break;
      default:
        type = 'invoice';
        this.pushToView(type, details.doc_id);
        break;

    }
  };

  pushToView = (type, id) => {
    this.props.router.push(`/invoices/${type}/${id}`);
  };

  cellRender = (row_index, cell_index, data, details) => {
    switch (cell_index) {
      case 1:
        return <a href="#" style={{color: '#33353F', fontWeight: '500'}}
                  onClick={(e) => this.onItemClick(e, details)}>
          {data}
        </a>;
      case 2:
        if (data) {
          return FORMAT_DATE_WITH_NO_TIME(data);
        }
        else return <span>&mdash;</span>;
      default:
        return data;
        break;
    }
  };
}

InvoicesTable.propTypes = {
  items: PropTypes.array.isRequired,
  onPeriodChanged: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onCancelSelectDate: PropTypes.func.isRequired,
  onSelectPeriod: PropTypes.func.isRequired,
  onLoadInvoice: PropTypes.func.isRequired,
  viewTransactionForm: PropTypes.func.isRequired,
  selected_categ: PropTypes.number.isRequired,
  selected_period: PropTypes.number.isRequired,
  requested_date: PropTypes.object.isRequired
};

export default Invoices;