import React, {Component} from 'react';
import Modal from '../commons/modals/Modal';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';

class CashBackModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal id="ModalCashBack"
                   idForm="formCashBack"
                   customClass="modal-dialog"
                   title="Возврат"
                   name="middle">
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Клиенту</label>
                    <div className="col-sm-9">
                        {this.renderSelect('fa fa-fw fa-heart', 'client', 'Имя клиента', this.props.clients, this.props.cashBack.client_id)}
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-9 col-sm-offset-3">
                        {this.renderSelect(false, 'service', 'Услуга или товар', this.props.services, this.props.cashBack.doc_id)}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Сумма</label>
                    <div className="col-sm-9">
                        <input type="text"
                               className="form-control"
                               id="back_sum"
                               name="back_sum"
                               value={this.props.cashBack.sum}
                               placeholder="Введите сумму"
                               onChange={this.props.inputChangeName} required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-3 control-label text-right">Комментарий</label>
                    <div className="col-sm-9">
                        <textarea
                            name="back_note"
                            className="form-control"
                            placeholder="Комментарий"
                            value={this.props.cashBack.comment}
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
                                                    <span className={iclass ? "input-group-addon" : "hide"}>
                                                        <i className={iclass}></i>
                                                    </span>
                <Select2 className={iclass ? "form-control straight-left-corners" : "form-control"}
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

CashBackModal.propTypes = {
    inputChangeName: PropTypes.func.isRequired,
    onSaveOperation: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDataSelect: PropTypes.func.isRequired,
    clients: PropTypes.array.isRequired,
    services: PropTypes.array.isRequired,
    cashBack: PropTypes.object.isRequired,
};

export default CashBackModal;