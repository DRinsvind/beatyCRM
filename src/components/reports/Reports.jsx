import React, {Component} from 'react';
import PropTypes from 'prop-types';
import OperationsHistoryReport from './OperationsHistoryReport';
import ClientsIncomeReport from './ClientsIncomeReport';
import MastersIncomeReport from './MastersIncomeReport';
import ClientsCallsReport from './ClientsCallsReport';
import IncomeAndExpencesReport from './IncomeAndExpencesReport';
import OtherIncomeExpensesReport from './OtherIncomeExpensesReport';
import ClientCategoryChange from './ClientCategoryChange';
import TreeView from '../commons/TreeView';
import MastersBills from './MastersBills';
import {FORMAT_DATE} from '../../utils/index';
import deepAssign from 'deep-assign';

const $ = window.$;
const date = new Date();

const report_period = {
    date_beg: FORMAT_DATE(new Date(date.getFullYear(), date.getMonth(), 1)),
    date_end: FORMAT_DATE(new Date(date.getFullYear(), date.getMonth() + 1, 0))
};

const reports_list = [
    {
        "group_id": 1,
        "group_name": "История операций",
        "report": "operations"
    },
    {
        "group_id": 2,
        "group_name": "Статистика",
        "subcategory": [
            {
                "group_id": 3,
                "group_name": "Статистика о услугах и товарах",
                "report": ""
            },
            {
                "group_id": 45,
                "group_name": "Статистика по клиентам",
                "subcategory": [
                    {
                        "group_id": 5,
                        "group_name": "История посещений клиентов",
                        "report": ""
                    },
                    {
                        "group_id": 6,
                        "group_name": "Отчет о звонках клиентам",
                        "report": "calls"
                    },
                    {
                        "group_id": 7,
                        "group_name": "Переход из категории в категорию",
                        "report": ""
                    },
                    {
                        "group_id": 8,
                        "group_name": "Прибыльность по клиентам",
                        "report": ""
                    }
                ]
            },
            {
                "group_id": 9,
                "group_name": "Статистика по сотрудникам",
                "subcategory": [
                    {
                        "group_id": 10,
                        "group_name": "Логирование действий",
                        "report": ""
                    },
                    {
                        "group_id": 11,
                        "group_name": "Отчет по зарплатам",
                        "report": ""
                    },
                    {
                        "group_id": 12,
                        "group_name": "Прибыльность по мастерам",
                        "report": ""
                    }
                ]
            }
        ]
    },
    {
        "group_id": 13,
        "group_name": "Финансовые отчеты",
        "subcategory": [
            {
                "group_id": 14,
                "group_name": "Движение денежных средств",
                "report": "money"
            },
            {
                "group_id": 15,
                "group_name": "Другие доходы и расходы",
                "report": ""
            }
        ]
    }
];

class Reports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            report: [],
            selected_report: {
                id: 6,
                type: 'calls'
            },
            period: deepAssign({}, report_period)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.report !== nextProps.report) {
            nextState.report = nextProps.report;
        }
    }

    toggleTree(e){
      e.preventDefault();
      $('.fa-caret-down').toggleClass('fa-caret-right');
      if($( "li" ).hasClass( "jstree-open" )){
        $( "li" ).removeClass("jstree-open");
        $( "li" ).addClass('jstree-closed');
      } else {
        $( "li" ).removeClass('jstree-closed');
        $( "li" ).addClass('jstree-open');
      }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content">
                                <div className="inner-menu-content">
                                    <div className='sidebar-widget m-none'>
                                        <div className="widget-header">
                                            <h6 className="title" style={{paddingTop: 5}}>
                                                ВЫБЕРИТЕ ПЕРИОД
                                            </h6>
                                        </div>
                                        <div className="widget-content">
                                            <label>C</label>
                                            <input type="text"
                                                   className="form-control date"
                                                   name="date_beg"
                                                   value={this.state.period.date_beg}
                                                   placeholder="Дата начала периода"
                                                   onChange={(e) => {
                                                   }}
                                            />
                                            <label>ПО</label>
                                            <input type="text"
                                                   className="form-control date"
                                                   name="date_end"
                                                   value={this.state.period.date_end}
                                                   placeholder="Дата окончания периода"
                                                   onChange={(e) => {
                                                   }}
                                            />
                                        </div>
                                    </div>
                                    <div className='sidebar-widget ml-none mr-none mt-md'>
                                        <div className="widget-header">
                                            <a href="#" className="toggle-link" onClick={this.toggleTree}>
                                            <i className="fa fa-caret-down" aria-hidden="true" style={{'margin-right':'5px'}}></i>
                                                <h6 className="title" style={{paddingTop: 5, 'display': 'inline-block'}}>
                                                    ВЫБЕРИТЕ ОТЧЕТ
                                                </h6>
                                            </a>
                                        </div>
                                        <div className="widget-content" style={{width: '110%', overflowX: 'scroll'}}>
                                            <TreeView
                                                items={this.mapToDataCategories(reports_list, this.state.selected_report.id)}
                                                onItemSelect={this.onItemSelect}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </menu>
                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <section className="panel panel-default">
                                    <header className="panel-heading">
                                        {this.renderPanelHeader(this.state.selected_report.id)}
                                    </header>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                {this.renderReport(this.state.selected_report.id)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-footer">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button className="btn btn-default" onClick={(e) => {
                                                }}>
                                                    <i className="fa fa-fw fa-print"></i>
                                                    Распечатать
                                                </button>
                                            </div>
                                            <div className="col-md-6">
                                                <button className="btn btn-default pull-right" onClick={(e) => {
                                                }}>
                                                    <i className="fa fa-fw fa-file-excel-o"></i>
                                                    Excel
                                                </button>
                                                {/*<button className="btn btn-default pull-right" onClick={(e) => {*/}
                                                {/*}}>*/}
                                                    {/*<i className="fa fa-fw fa-file-pdf-o"></i>*/}
                                                    {/*PDF*/}
                                                {/*</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    mapToDataCategories = (categories, category_id) => {
        const loadNodes = (items) => {
            return items.map((item) => {
                if (item.subcategory && item.subcategory.length > 0) {
                    return {
                        item: item,
                        id: item.group_id,
                        text: item.group_name,
                        children: loadNodes(item.subcategory),
                        state: item.group_id === category_id ? {
                                opened: true,
                                selected: true,
                                disabled: this.state.loading
                            } : {
                                opened: true,
                                selected: false,
                                disabled: this.state.loading,
                            }
                    };
                }

                return {
                    item: item,
                    id: item.group_id,
                    text: item.group_name,
                    report: item.report,
                    type: 'file',
                    state: item.group_id === category_id ? {
                            selected: true,
                            disabled: this.state.loading
                        } : {
                            selected: false,
                            disabled: this.state.loading
                        }
                };
            });
        };

        return loadNodes(categories);
    };

    onItemSelect = (selected) => {
        if (selected.report !== '') {
            this.setState({
                report: [],
            });
            this.props.onLoadReport(selected.report, this.state.period);
            let obj = this.state.selected_report;
            obj.id = selected.id;
            obj.type = selected.report;
            this.setState({
                selected_report: obj,
            });
        }
    };

    renderPanelHeader = (id) => {
        switch (id) {
            case 1:
                return (
                    <h2 className="panel-title">История операций</h2>
                );
            case 14:
                return (
                    <h2 className="panel-title">Доходы и расходы</h2>
                );
            case 15:
                return (
                    <h2 className="panel-title">Другие доходы и расходы</h2>
                );
            case 8:
                return (
                    <h2 className="panel-title">Прибыльность по клиентам</h2>
                );
            case 12:
                return (
                    <h2 className="panel-title">Прибыльность по мастерам</h2>
                );
            case 16:
                return (
                    <h2 className="panel-title">Чеки по мастерам</h2>
                );
            case 6:
                return (
                    <h2 className="panel-title">Отчет о звонках клиентам</h2>
                );
            case 7:
                return (
                    <h2 className="panel-title">Переход из категории в категорию</h2>
                );
            default:
                return (
                    <h2 className="panel-title">Отчет о звонках клиентам</h2>
                );
        }

    };

    renderReport = (id) => {
        switch (id) {
            case 1:
                return (
                    <OperationsHistoryReport/>
                );
            case 14:
                return (
                    <IncomeAndExpencesReport report={this.state.report}/>
                );
            case 15:
                return (
                    <OtherIncomeExpensesReport/>
                );
            case 8:
                return (
                    <ClientsIncomeReport/>
                );
            case 12:
                return (
                    <MastersIncomeReport/>
                );
            case 16:
                return (
                    <MastersBills/>
                );
            case 6:
                return (
                   <ClientsCallsReport report={this.state.report}/>
                );
            case 7:
                return (
                    <ClientsCallsReport/>
                );
            default:
                return (
                    <ClientsCallsReport report={this.state.report}/>
                )
                    ;
        }
    };

    componentDidMount() {
        this.props.onLoadReport('calls', report_period);

        $('.date').datepicker(
            {
                language: 'ru',
                weekStart: '1',
                format: 'yyyy-mm-dd'
            }
        )
            .off('changeDate').on('changeDate', (e) => {
            let obj = this.state.period;
            switch (e.target.name) {
                case 'date_beg':
                    obj.date_beg = FORMAT_DATE(e.date);
                    break;
                case 'date_end':
                    obj.date_end = FORMAT_DATE(e.date);
                    break;
                default:
                    break;
            }

            this.props.onLoadReport(this.state.selected_report.type, obj);

            this.setState({
                period: obj,
            });

        });
    }
}

Reports.propTypes = {
    onLoadReport: PropTypes.func.isRequired
};

export default Reports;
