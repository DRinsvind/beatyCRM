import React, {Component} from 'react';
import Modal from '../commons/modals/Modal';
import Select2 from 'react-select2-wrapper';
import DataTable from '../commons/tables/DataTable';
import {FORMAT_DATE_WITH_POINTS} from '../../utils/index';
import PropTypes from 'prop-types';

class PayVendorModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            invoices: props.invoices,
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.invoices !== nextProps.invoices) {
            nextState.invoices = nextProps.invoices;
        }
    }

    render() {
        return (
            <Modal id="ModalVendorPay"
                   idForm="formPayVendor"
                   customClass="modal-dialog"
                   title="Оплата поставщику"
                   name="middle">
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Поставщику</label>
                    <div className="col-sm-7">
                        {this.renderSelect('fa fa-fw fa-truck', 'vendor', 'Поставщик', this.vendorsToData(this.props), this.props.vendor.vendor)}
                    </div>
                    <div className="col-sm-2">
                        <div className="row" style={{fontSize: '12px', height: '14px'}}>ЗАДОЛЖЕНОСТЬ</div>
                        <div className="row" style={{fontSize: '16px', fontWeight: 'bold'}}>{this.props.vendor.debt}</div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Платеж со счета</label>
                    <div className="col-sm-9">
                        {this.renderSelect('fa fa-fw fa-money', 'vend_account', 'Счет', this.props.accounts, this.props.vendor.account)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Сумма</label>
                    <div className="col-sm-9">
                        <input type="text"
                               className="form-control"
                               id="vend_sum"
                               value={this.props.vendor.sum}
                               name="vend_sum"
                               placeholder="Введите сумму платежа"
                               onChange={this.props.inputChangeName} required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Комментарий</label>
                    <div className="col-sm-9">
                        <textarea
                            name="vend_note"
                            className="form-control"
                            value={this.props.vendor.comment}
                            placeholder="Комментарий"
                            onChange={this.props.inputChangeName}
                        />
                    </div>
                </div>
                <div className="row" style={{backgroundColor: 'rgb(249,249,250'}}>
                    <div className="row mt-md ml-xlg">ПРИВЯЗАТЬ ПЛАТЕЖ К НАКЛАДНЫМ</div>
                    <div className="row m-md">
                        <DataTable
                            headers={[
                                {
                                    text: ''
                                },
                                {
                                    text: 'Номер',
                                    sortable: true,
                                },
                                {
                                    text: 'Дата',
                                    sortable: true,
                                },
                                {
                                    text: 'Сумма',
                                    sortable: true,
                                },
                                {
                                    text: 'Оплачено',
                                    sortable: true,
                                },
                                {
                                    text: 'Оплатить',
                                    sortable: true,
                                }
                            ]}
                            data={this.createFormatForDataTable(this.state.invoices)}
                            detailed={false}
                            table={true}
                            cellRender={this.cellRender}
                        />
                    </div>
                </div>
                <div className="modal-footer row pb-none">
                    <div className="text-right">
                        <button type="button" className="btn btn-primary mr-sm" onClick={this.props.onSaveOperation}>
                            <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
                        </button>
                        <button type="button" className="btn btn-default" data-dismiss="modal"
                                onClick={this.props.onCancel}>
                            <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    renderSelect = (iclass, name, text, selData, val) => {
        return (
            <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className={iclass}></i>
                                                    </span>
                <Select2 className="form-control straight-left-corners"
                         options={{
                             placeholder: {text},
                             theme: 'bootstrap',
                             width: '100%'
                         }}
                         name={name}
                         data={selData.length > 0 ? selData : [{id: null, text: 'Нет данных'}]}
                         value={val}
                         onSelect={this.props.onDataSelect}
                />
            </div>
        );
    };

    createFormatForDataTable = (invoices) => {
        return invoices.map((invoice) => {
            return {
                values: [
                    invoice.checked,
                    invoice.number,
                    FORMAT_DATE_WITH_POINTS(invoice.date),
                    invoice.sum,
                    invoice.paid,
                    invoice.topay
                ],
                details: invoice
            }
        });
    };

    cellRender = (data, cell_index, value, details, changeCallback) => {
        switch (cell_index) {
            case 0:
                return (
                    <div className="checkbox-custom checkbox-primary center-block">
                        <input
                            id={cell_index}
                            type="checkbox"
                            name="check"
                            value={details.id}
                            checked={value}
                            onChange={this.props.inputChangeName}
                        />
                        <label/>
                    </div>
                );
            default:
                return value;
        }
    };

    vendorsToData = (props) => {
        return props.vendors.map((item) => {
            return {
                id: item.id,
                text: item.name
            };
        });
    };
}

PayVendorModal.propTypes = {
    inputChangeName: PropTypes.func.isRequired,
    onSaveOperation: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDataSelect: PropTypes.func.isRequired,
    vendors: PropTypes.array.isRequired,
    accounts: PropTypes.array.isRequired,
    invoices: PropTypes.array.isRequired,
    vendor: PropTypes.object.isRequired,
};

export default PayVendorModal;