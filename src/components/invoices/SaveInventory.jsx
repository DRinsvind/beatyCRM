import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from '../commons/modals/Modal';

class SaveInventory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal id="ModalConfirmSaveInventory"
                   idForm="formConfirmSaveInventory"
                   customClass="modal-dialog"
                   title="Сохранение Инвентаризации">
                <div className="row">
                    <h3 className="text-center">{'Не все поля инвентаризации заполнены'}</h3>
                </div>
                <div className="row">
                    <hr className="m-none p-none"/>
                </div>
                <div className="row mb-xlg">
                    <h5 className="text-center">Вы действительно хотите сохранить инвентаризацию?</h5>
                </div>

                <div className="modal-footer row pb-none">
                    <div className="text-right">
                        <button type="button" className="btn btn-default" data-dismiss="modal">
                            Отмена
                        </button>
                        <button type="button" className="btn btn-primary mr-sm" onClick={this.props.onSaveInventory}>
                            Сохранить
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }


}

SaveInventory.propTypes = {
    onSaveInventory: PropTypes.func.isRequired
};

export default SaveInventory;