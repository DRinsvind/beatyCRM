import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PayVendorModal from './PayVendorModal';
import AccountsTransferModal from './AccountsTransferModal';
import CashBackModal from './CashBackModal';
import ExpensesModal from './ExpensesModal';
import deepAssign from 'deep-assign';
import {FORMAT_DATE, DEFINE_DOUBLE_NUMBER} from '../../utils/index';
import SideMenu from './SideMenu';
import FinancesDataTable from './FinancesDataTable';

const $ = window.$;

const expenseInitialState = {
    expense: null,
    account: null,
    sum: '',
    comment: ''
};

const vendorPayInitialState = {
    vendor: null,
    account: null,
    sum: '',
    comment: '',
    invoice: null,
    debt: 0
};

const moneyTransferInitialState = {
    account_from: null,
    account_to: null,
    sum: '',
    comment: ''
};

const cashBackInitialState = {
    client_id: null,
    doc_id: null,
    sum: '',
    comment: ''
};

class CashOffice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vendors: [],
            accounts: [],
            invoices: [],
            clients: [],
            services: [],
            expenses: [],
            finances: {},
            expense: deepAssign({}, expenseInitialState),
            vendorPay: deepAssign({}, vendorPayInitialState),
            moneyTransfer: deepAssign({}, moneyTransferInitialState),
            cashBack: deepAssign({}, cashBackInitialState),
            currentDate: new Date(),
            load: props.load
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.vendors = nextProps.vendors;
            nextState.finances = nextProps.finances;
            nextState.accounts = this.accountsToData(nextProps);
            nextState.clients = this.clientsToData(nextProps);
        }

        if (this.props.load !== nextProps.load) {
            nextState.load = nextProps.load;
        }

        if (this.props.expenses !== nextProps.expenses) {
            nextState.expenses = nextProps.expenses;
            nextProps.expenses.forEach((exp, idx) => {
                if (idx === 0) {
                    nextState.expense.expense = exp.id;
                }
            })
        }

        if (this.props.services !== nextProps.services) {
            nextState.services = this.servicesToData(nextProps);
        }

        // if (!this.props.vendors.length) {
        //     $('#overlay').fadeIn(300);
        // } else {
        //     $('#overlay').fadeOut(300);
        // }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <SideMenu
                        currentDate={this.state.currentDate}
                        onCurrentDateChange={this.currentDateChange}
                        details={this.state.finances.summary}
                    />
                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <PayVendorModal
                                    inputChangeName={this.inputChange}
                                    onSaveOperation={this.addPayVendor}
                                    onCancel={this.onCancel}
                                    onDataSelect={this.dataSelect}
                                    vendors={this.state.vendors}
                                    accounts={this.state.accounts}
                                    invoices={this.state.invoices}
                                    vendor={this.state.vendorPay}
                                />
                                <ExpensesModal
                                    inputChangeName={this.inputChange}
                                    onSaveOperation={this.addExpense}
                                    addNewExpense={this.addNewExpense}
                                    deleteExpense={this.deleteExpense}
                                    onCancel={this.onCancel}
                                    onDataSelect={this.dataSelect}
                                    accounts={this.state.accounts}
                                    expenses={this.state.expenses}
                                    expense={this.state.expense}
                                />
                                <AccountsTransferModal
                                    inputChangeName={this.inputChange}
                                    onSaveOperation={this.transferMoney}
                                    onCancel={this.onCancel}
                                    onDataSelect={this.dataSelect}
                                    accounts={this.state.accounts}
                                    transfer={this.state.moneyTransfer}
                                />
                                <CashBackModal
                                    inputChangeName={this.inputChange}
                                    onSaveOperation={this.cashBackCreate}
                                    onCancel={this.onCancel}
                                    onDataSelect={this.dataSelect}
                                    clients={this.state.clients}
                                    services={this.state.services}
                                    cashBack={this.state.cashBack}
                                />
                                <div className="panel panel-default">
                                    <header className="panel-heading pb-lg">
                                      <div style={{'position':'relative', 'top':'-6px'}}>
                                        <button className="btn btn-primary pull-right" onClick={this.vendorPay}>
                                            <i className="fa fa-fw fa-truck"></i> Поставщику
                                        </button>
                                        <button className="btn btn-primary pull-right mr-xs"
                                                onClick={this.accountsTransfer}>
                                            <i className="fa fa-fw fa-retweet"></i> Перемещение
                                        </button>
                                        <button className="btn btn-primary pull-right mr-xs" onClick={this.cashBack}>
                                            <i className="fa fa-fw fa-undo"></i> Возврат
                                        </button>
                                        <button className="btn btn-primary pull-right mr-xs" onClick={this.expenses}>
                                            <i className="fa fa-fw fa-anchor"></i> Расходы
                                        </button>
                                      </div>
                                      <h2 className="panel-title">Операции</h2>
                                    </header>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FinancesDataTable
                                                    items={this.state.finances.details ? this.state.finances.details : []}
                                                    loading={this.state.load}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-footer">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button className="btn btn-default" onClick={(e) => {}}>
                                                    <i className="fa fa-fw fa-print"></i>
                                                    Распечатать
                                                </button>
                                            </div>
                                            <div className="col-md-6">
                                                <button className="btn btn-default pull-right" onClick={(e) => {}}>
                                                    <i className="fa fa-fw fa-file-excel-o"></i>
                                                    Excel
                                                </button>
                                                <button className="btn btn-default pull-right" onClick={(e) => {}}>
                                                    <i className="fa fa-fw fa-file-pdf-o"></i>
                                                    PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    accountsToData = (props) => {
        return props.accounts.map((item) => {
            return {
                id: item.id,
                text: item.name
            };
        });
    };

    servicesToData = (props) => {
        return props.services.map((item) => {
            return {
                id: item.doc_id,
                text: item.details.product_name + ' (' + parseFloat(item.payment).toFixed(2) + ')'
            };
        });
    };

    clientsToData = (props) => {
        return props.clients.map((item) => {
            return {
                id: item.id,
                text: item.name
            };
        });
    };

    vendorPay = () => {
        $('#ModalVendorPay').modal('show');
    };

    accountsTransfer = () => {
        $('#ModalAccountsTransfer').modal('show');
    };

    cashBack = () => {
        $('#ModalCashBack').modal('show');
    };

    expenses = () => {
        $('#ModalExpenses').modal('show');
    };

    inputChange = (e) => {
        let exp = this.state.expense;
        let back = this.state.cashBack;
        let transfer = this.state.moneyTransfer;
        let vend = this.state.vendorPay;
        switch (e.target.name) {
            case 'exp_sum':
                exp.sum = DEFINE_DOUBLE_NUMBER(exp.sum, e.target.value);
                this.setState({expense: exp});
                break;
            case 'exp_note':
                exp.comment = e.target.value;
                this.setState({expense: exp});
                break;
            case 'back_sum':
                back.sum = DEFINE_DOUBLE_NUMBER(back.sum, e.target.value);
                this.setState({cashBack: back});
                break;
            case 'back_note':
                back.comment = e.target.value;
                this.setState({cashBack: back});
                break;
            case 'transfer_sum':
                transfer.sum = DEFINE_DOUBLE_NUMBER(transfer.sum, e.target.value);
                this.setState({moneyTransfer: transfer});
                break;
            case 'transfer_note':
                transfer.comment = e.target.value;
                this.setState({moneyTransfer: transfer});
                break;
            case 'vend_sum':
                vend.sum = DEFINE_DOUBLE_NUMBER(vend.sum, e.target.value);
                this.setState({vendorPay: vend});
                break;
            case 'vend_note':
                vend.comment = e.target.value;
                this.setState({vendorPay: vend});
                break;
            case 'check':
                let inv = this.state.invoices;
                inv.forEach((invoice, idx) => {
                    if (invoice.id === +e.target.value) {
                        inv[idx].checked = !inv[idx].checked;
                    }
                });

                if (inv[e.target.id].checked) {
                    vend.invoice = +e.target.value;
                } else {
                    vend.invoice = null;
                }

                this.setState({
                    invoices: inv,
                    vendorPay: vend
                });
                break;
            default:
                break;
        }
    };

    addPayVendor = () => {
        let data = {
            ...this.state.vendorPay,
            'sum': +this.state.vendorPay.sum
        };
        this.props.onAddVendorPay(data, FORMAT_DATE(new Date()));
        this.setState({
            vendorPay: vendorPayInitialState,
            invoices: []
        });
        $('#ModalVendorPay').modal('hide');
    };

    cashBackCreate = () => {
        let data = {
            ...this.state.cashBack,
            'sum': this.state.cashBack.sum
        };
        this.props.onCashBack(data, FORMAT_DATE(new Date()));
        this.setState({
            cashBack: cashBackInitialState,
            services: []
        });
        $('#ModalCashBack').modal('hide');
    };

    transferMoney = () => {
        let data = {
            'account_from': this.state.moneyTransfer.account_from,
            'account_to': this.state.moneyTransfer.account_to,
            'sum': +this.state.moneyTransfer.sum,
            'comment': this.state.moneyTransfer.comment
        };
        this.props.onAddTransfer(data, FORMAT_DATE(new Date()));
        this.setState({moneyTransfer: moneyTransferInitialState});
        $('#ModalAccountsTransfer').modal('hide');
    };

    addNewExpense = (exp, id, cat) => {
        if (cat === 'cat') {
            let data = {name: exp.category};
            if (id) {
                this.props.onEditExpense(data, id);
            } else {
                this.props.onCreateExpense(data);
            }
        } else {
            let data = {};
            if (exp.id) {
                data = {name: exp.name};
                this.props.onEditExpense(data, exp.id);
            } else {
                data = {parent_id: id, name: exp.name};
                this.props.onCreateExpense(data);
            }
        }

    };

    deleteExpense = (id) => {
        this.props.onDeleteExpense(id);
    };

    addExpense = () => {
        let data = {
            ...this.state.expense,
            'sum': +this.state.expense.sum
        };
        this.props.onAddExpense(data, FORMAT_DATE(new Date()));
        this.setState({expense: expenseInitialState});
        $('#ModalExpenses').modal('hide');
    };

    onCancel = () => {
        this.setState({
            expense: expenseInitialState,
            moneyTransfer: moneyTransferInitialState,
            vendorPay: vendorPayInitialState,
            cashBack: cashBackInitialState,
            services: [],
            invoices: []
        });
    };

    dataSelect = (e) => {
        let exp = this.state.expense;
        let back = this.state.cashBack;
        let transfer = this.state.moneyTransfer;
        let vend = this.state.vendorPay;
        switch (e.target.name) {
            case 'expense':
                exp.expense = +e.target.value;
                this.setState({expense: exp});
                break;
            case 'exp_account':
                exp.account = +e.target.value;
                this.setState({expense: exp});
                break;
            case 'client':
                back.client_id = +e.target.value;
                this.setState({cashBack: back});
                this.props.onServicesLoad(+e.target.value);
                break;
            case 'service':
                back.doc_id = +e.target.value;
                this.setState({cashBack: back});
                break;
            case 'account_from':
                transfer.account_from = +e.target.value;
                this.setState({moneyTransfer: transfer});
                break;
            case 'account_to':
                transfer.account_to = +e.target.value;
                this.setState({moneyTransfer: transfer});
                break;
            case 'vendor':
                vend.vendor = +e.target.value;
                this.state.vendors.map((vendor) => {
                    if (vendor.id === +e.target.value) {
                        vend.debt = vendor.debt;
                        let inv = vendor.invoices.map((invoice) => {
                            return {
                                ...invoice,
                                checked: false,
                            }
                        });
                        this.setState({
                            invoices: inv,
                            vendorPay: vend
                        });
                    }
                });
            case 'vend_account':
                vend.account = +e.target.value;
                this.setState({vendorPay: vend});
                break;
            default:
                back[e.target.name] = +e.target.value;
                this.setState({cashBack: back});
                break;
        }
    };

    currentDateChange = (nextDate) => {
        this.setState({
            currentDate: nextDate,
        });

        this.props.onClearState();
        this.props.onLoadFinancesList(FORMAT_DATE(nextDate));
    };

    componentDidMount() {
        this.props.onLoadFinances(FORMAT_DATE(new Date()));
    };
}

CashOffice.propTypes = {
    onLoadFinances: PropTypes.func.isRequired,
    onCreateExpense: PropTypes.func.isRequired,
    onClearState: PropTypes.func.isRequired,
    onLoadFinancesList: PropTypes.func.isRequired,
    onEditExpense: PropTypes.func.isRequired,
    onDeleteExpense: PropTypes.func.isRequired,
    onAddVendorPay: PropTypes.func.isRequired,
    onAddTransfer: PropTypes.func.isRequired,
    onAddExpense: PropTypes.func.isRequired,
    onCashBack: PropTypes.func.isRequired,
    onServicesLoad: PropTypes.func.isRequired,
    vendors: PropTypes.array.isRequired,
    accounts: PropTypes.array.isRequired,
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    services: PropTypes.array.isRequired,
    expenses: PropTypes.array.isRequired,
    finances: PropTypes.object.isRequired,
};

export default CashOffice;
