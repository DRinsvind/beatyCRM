import React, {Component} from 'react';
import Modal from '../commons/modals/Modal';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';

const $ = window.$;

class PayVendorModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            add_expense: false,
            expenses: this.mapToDataExp(props.expenses),
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.expenses = this.mapToDataExp(nextProps.expenses);
        }
    }

    componentDidUpdate() {
        $('.exp').select2({
            width: '100%',
            options: {
                placeholder: 'Выберите теги',
                theme: 'bootstrap',
            },
            data: this.props.expenses.map((exp) => {
                if (exp.items.length > 0) {
                    return {
                        text: exp.name,
                        children: exp.items.map((item) => {
                            return {
                                id: item.id,
                                text: item.name
                            }
                        }),
                        element: HTMLOptGroupElement
                    };
                } else {
                    return {
                        id: exp.id,
                        text: exp.name,
                    };
                }
            })
        }).off('select2:select').on('select2:select', this.props.onDataSelect);
    }

    render() {
        return (
            <div>
                <Modal id="ModalExpenses"
                       idForm="formExpenses"
                       customClass="modal-dialog"
                       title={this.state.add_expense ? "Редактирование перечня затрат" : "Отчисления на расходы"}
                       name="middle">
                    {this.renderContent(this.state.add_expense)}
                    <div className="modal-footer row pb-none">
                        {this.renderCancelButton(this.state.add_expense)}
                    </div>
                </Modal>

            </div>
        );
    }

    renderCancelButton = (expenseAdd) => {
        if (expenseAdd) {
            return (
                <div className="text-right">
                    <button type="button" className="btn btn-primary mr-sm"
                            onClick={this.onSaveExpense}>
                        OK
                    </button>
                    <button type="button" className="btn btn-default"
                            onClick={this.onCancelAdding}>
                        Отмена
                    </button>
                </div>
            );
        } else {
            return (
                <div className="text-right">
                    <button type="button" className="btn btn-primary mr-sm"
                            onClick={this.props.onSaveOperation}>
                        <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
                    </button>
                    <button type="button" className="btn btn-default" data-dismiss="modal"
                            onClick={this.props.onCancel}>
                        <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
                    </button>
                </div>
            );
        }
    };

    expensesToData = () => {
        let data = [];
        let categories = this.state.expenses;
        if (categories.length > 0) {
            categories.forEach((category, ci) => {
                data.push(
                    this.renderExpensesCategories(category, ci)
                );

                if (category.expanded) {
                    data = data.concat(this.renderExpensesItemsRows(category.items, ci, category.id));
                }

            });
            return data;
        } else {
            return (
                <tr key={'no_results'}>
                    {this.noDataRender()}
                </tr>
            );
        }

        return data;
    };

    mapToDataExp = (expenses) => {
        let data = [];
        expenses.map((exp) => {
            data.push({
                id: exp.id,
                category: exp.name,
                expanded: true,
                edit: false,
                items: exp.items.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        edit: false
                    }
                })
            });
        });
        return data;
    };

    noDataRender = () => {
        return (
            <td className="borderless-left-top" colSpan="4" style={{textAlign: 'center'}}>
                Нет данных
            </td>
        );
    };

    renderContent = (expenseAdd) => {
        if (expenseAdd) {
            return (
                <div className="row m-xlg">
                    <div style={{height: '300px', overflow: 'scroll'}}>
                        <table className="table">
                            <tbody>
                            {this.expensesToData()}
                            </tbody>
                        </table>
                    </div>
                    <a href="#" className="btn btn-primary" onClick={(e) => {
                        e.preventDefault();
                        let exp = this.state.expenses;
                        exp.unshift({
                            category: '',
                            expanded: true,
                            edit: true,
                            items: []
                        });
                        this.setState({expenses: exp});
                    }}>
                        <i className="fa fa-fw fa-plus"></i> Пункт
                    </a>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="form-group">
                        <label htmlFor="expense" className="col-sm-3 control-label text-right">Затрата</label>
                        <div className="col-sm-8">
                            <select className="form-control exp" name="expense"></select>
                        </div>
                        <div className="col-sm-1 pl-none">
                            <button className="btn btn-primary pull-right" onClick={this.showAddExpenseForm}><i
                                className="fa fa-fw fa-pencil"></i></button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-3 control-label text-right">Платеж со счета</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className='fa fa-fw fa-money'></i>
                                </span>
                                <Select2 className="form-control straight-left-corners"
                                         options={{
                                             placeholder: 'Счет',
                                             theme: 'bootstrap',
                                             width: '100%'
                                         }}
                                         name="exp_account"
                                         value={this.props.expense.account}
                                         data={this.props.accounts}
                                         onSelect={this.props.onDataSelect}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-3 control-label text-right">Сумма</label>
                        <div className="col-sm-9">
                            <input type="text"
                                   className="form-control"
                                   id="exp_sum"
                                   name="exp_sum"
                                   value={this.props.expense.sum}
                                   placeholder="Введите сумму платежа"
                                   onChange={this.props.inputChangeName} required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-3 control-label text-right">Комментарий</label>
                        <div className="col-sm-9">
                        <textarea
                            name="exp_note"
                            className="form-control"
                            placeholder="Комментарий"
                            value={this.props.expense.comment}
                            onChange={this.props.inputChangeName}
                        />
                        </div>
                    </div>
                </div>
            )
        }
    };

    renderExpensesCategories = (expense, id) => {
        return (
            <tr key={id}>
                {this.renderCatName(expense, expense.edit, id)}
                <td className='borderless-left-right borderless-left-top' style={{width: '20%'}}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        let exp = this.state.expenses;
                        exp[id].expanded = !exp[id].expanded;
                        this.setState({expenses: exp});
                    }}>
                        <i className={"fa fw fa-caret-" + (expense.expanded ? 'up' : 'down')}></i>
                    </a>
                </td>
                <td className='borderless-left-right borderless-left-top' style={{width: '5%'}}>
                    <a className="p-xs mr-xs"
                       href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           let exp = this.state.expenses;
                           exp[id].items.push({
                               name: '',
                               edit: true
                           });
                           this.setState({expenses: exp});
                       }}>
                        <i className="text-default fa fa-fw fa-plus-square-o"/>
                    </a>
                </td>
                <td className='borderless-left-right borderless-left-top' style={{width: '5%'}}>
                    <a className="p-xs mr-xs"
                       href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           let exp = this.state.expenses;
                           if (exp[id].edit) {
                               exp[id].edit = false;
                               this.props.addNewExpense(exp[id], exp[id].id, 'cat');
                           } else {
                               exp[id].edit = true;
                           }
                           this.setState({expenses: exp});
                       }}>
                        <i className={"text-default fa fa-fw fa-" + (expense.edit ? "save" : "pencil")}/>
                    </a>
                </td>
                <td className='borderless-left-right borderless-left-top' style={{width: '5%'}}>
                    <a className="p-xs mr-xs"
                       href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           if (window.confirm('Вы действительно хотите удалить затрату ' + expense.category + '?')) {
                               this.props.deleteExpense(expense.id);
                               this.setState({expenses: this.state.expenses.filter((exp) => exp !== expense)});
                           }
                       }}>
                        <i className="fa fa-fw fa-trash text-default"/>
                    </a>
                </td>
            </tr>
        );
    };

    renderCatName = (cat, edit, id) => {
        if (edit) {
            return (
                <td className="borderless-left-right borderless-left-top exp_add_parent">
                    <input type="text"
                           style={{width: '75%'}}
                           className="form-control"
                           id={id}
                           name="category"
                           value={cat.category}
                           onChange={this.inputChange}
                    />
                </td>
            );
        } else {
            return (
                <td className="borderless-left-right borderless-left-top exp_add_parent">
                    {cat.category}
                </td>
            );
        }
    };

    renderItemName = (item, edit, iid, cid) => {
        if (edit) {
            return (
                <td className="borderless-left-right borderless-left-top exp_add_child" colSpan="3">
                    <input type="text"
                           id={iid}
                           style={{width: '53.5%'}}
                           className="form-control"
                           name="name"
                           value={item.name}
                           onChange={(e) => {
                               let exp = this.state.expenses;
                               exp[cid].items[iid].name = e.target.value;
                               this.setState({expenses: exp});
                           }}
                    />
                </td>
            );
        } else {
            return (
                <td className="borderless-left-right borderless-left-top exp_add_child" colSpan="3">
                    <label style={{marginLeft: '15px'}}>{item.name}</label>
                </td>
            );
        }
    };

    renderExpensesItemsRows = (items, ci, catId) => {
        return items.map((item, iid) => {
            return (
                <tr key={ci + 'child_item' + iid}>
                    {this.renderItemName(item, item.edit, iid, ci)}
                    <td className='borderless-left-right borderless-left-top' style={{width: '5%'}}>
                        <a className="p-xs mr-xs"
                           href="#"
                           onClick={(e) => {
                               e.preventDefault();
                               let exp = this.state.expenses;
                               if (item.edit) {
                                   item.edit = false;
                                   this.props.addNewExpense(item, catId, 'item');
                               } else {
                                   item.edit = true;
                               }
                               this.setState({expenses: exp});
                           }}>
                            <i className={"text-default fa fa-fw fa-" + (item.edit ? "save" : "pencil")}/>
                        </a>
                    </td>
                    <td className='borderless-left-right borderless-left-top' style={{width: '5%'}}>
                        <a className="p-xs mr-xs"
                           href="#"
                           onClick={(e) => {
                               e.preventDefault();
                               if (confirm('Вы действительно хотите удалить затрату ' + item.name + '?')) {
                                   this.props.deleteExpense(item.id);
                                   let exp = this.state.expenses;
                                   exp[ci].items = items.filter((expense) => expense !== item);
                                   this.setState({expenses: exp});
                               }
                           }}>
                            <i className="fa fa-fw fa-trash text-default"/>
                        </a>
                    </td>
                </tr>
            );
        });
    };

    inputChange = (e) => {
        let exp = this.state.expenses;
        exp[e.target.id].category = e.target.value;
        this.setState({expenses: exp});

    };

    showAddExpenseForm = () => {
        this.setState({add_expense: true});
    };

    onSaveExpense = () => {
        this.setState({
            add_expense: false,
        })
    };

    onCancelAdding = () => {
        this.setState({
            add_expense: false,
            expenses: this.mapToDataExp(this.props.expenses),
        })
    };
}

PayVendorModal.propTypes = {
    inputChangeName: PropTypes.func.isRequired,
    onSaveOperation: PropTypes.func.isRequired,
    deleteExpense: PropTypes.func.isRequired,
    addNewExpense: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDataSelect: PropTypes.func.isRequired,
    accounts: PropTypes.array.isRequired,
    expenses: PropTypes.array.isRequired
};

export default PayVendorModal;