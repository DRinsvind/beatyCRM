import React, {Component} from 'react';
import Modal from './Modal';
import PropTypes from 'prop-types';

class AddCategoryModal extends Component {

    render() {
        return (
            <Modal id="ModalAddCategory"
                   idForm="formAddCategory"
                   customClass="modal-dialog"
                   save={this.props.addCategory}
                   title="Создание категории">
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-4 control-label">Название категории</label>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" id="name" name="name"
                               placeholder="Название категории"
                               onChange={this.props.inputChangeName} required
                        />
                    </div>
                </div>
                <div className="modal-footer row display-none">
                    <div className="text-right">
                        <button id="add-category-button" type="button" className="btn btn-primary mr-sm" onClick={this.props.addCategory}>
                            <i className="fa fa-fw fa-save" />&nbsp;Сохранить
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

AddCategoryModal.propTypes = {
    inputChangeName: PropTypes.func.isRequired,
    addCategory: PropTypes.func.isRequired,
};

export default AddCategoryModal;