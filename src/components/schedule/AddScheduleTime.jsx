import React, {Component} from 'react';
import Modal from '../commons/modals/Modal';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';

const $ = window.$;

class CashBackModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal id="ModalAddTime"
                   idForm="formAddTime"
                   customClass="modal-dialog"
                   title="Добавить рабочее время">
                <label style={{fontWeight: 'bold', fontSize: '16px'}}>Выберите новое время работы</label>
                <div className="row">
                    <div className="col-md-6">
                        <label>С:</label>
                        <input
                            type="text"
                            className="form-control time"
                            name="time_from"
                            placeholder="Время начала рабоы"
                        />
                    </div>
                    <div className="col-md-6">
                        <label>ПО:</label>
                        <input
                            type="text"
                            className="form-control time"
                            name="time_to"
                            placeholder="Время окончания рабоы"
                        />
                    </div>
                </div>
                <div className="modal-footer row pb-none">
                    <div className="text-right">
                        <button type="button" className="btn btn-primary mr-sm" onClick={this.props.onSaveTime}>
                            <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
                        </button>
                        <button type="button" className="btn btn-default" data-dismiss="modal"
                                onClick={this.props.onCancelAddingTime}>
                            <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    componentDidMount() {
        $('.time').datetimepicker(
            {
                locale: 'ru',
                format: 'LT'
            }
        )
            .off('dp.change').on('dp.change', (e) => {
            this.props.changeWorkingTime(e.date._d, e.target.name);
        });
    }
}

CashBackModal.propTypes = {
    onSaveTime: PropTypes.func.isRequired,
    onCancelAddingTime: PropTypes.func.isRequired,
};

export default CashBackModal;