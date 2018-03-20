import React, {Component} from 'react';
import Modal from '../commons/modals/Modal';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';

class AccountsTransferModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal id="ModalAccountsTransfer"
                   idForm="formAccountsTransfer"
                   customClass="modal-dialog"
                   title="Перемещение между счетами"
                   name="middle">
                <div className="form-group">
                    <div className="col-sm-4 col-sm-offset-3">
                        <label>CО СЧЕТА</label>
                        {this.renderSelect('fa fa-fw fa-money', 'account_from', 'Co счета', this.props.accounts, this.props.transfer.account_from)}
                    </div>
                    <div className="col-sm-1 text-center">
                        <i className="fa fa-fw fa-exchange arrowStyle"></i>
                    </div>
                    <div className="col-sm-4">
                        <label>НА СЧЕТ</label>
                        {this.renderSelect('fa fa-fw fa-money', 'account_to', 'На счет', this.props.accounts, this.props.transfer.account_to)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Сумма</label>
                    <div className="col-sm-9">
                        <input type="text"
                               className="form-control"
                               id="transfer_sum"
                               name="transfer_sum"
                               placeholder="Введите сумму"
                               value={this.props.transfer.sum}
                               onChange={this.props.inputChangeName} required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Комментарий</label>
                    <div className="col-sm-9">
                        <textarea
                            name="transfer_note"
                            value={this.props.transfer.comment}
                            className="form-control"
                            placeholder="Комментарий"
                            onChange={this.props.inputChangeName}
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
}

AccountsTransferModal.propTypes = {
    inputChangeName: PropTypes.func.isRequired,
    onSaveOperation: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDataSelect: PropTypes.func.isRequired,
    accounts: PropTypes.array.isRequired,
    transfer: PropTypes.object.isRequired
};

export default AccountsTransferModal;