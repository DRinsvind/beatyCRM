import React, {Component} from 'react';
import Modal from './Modal';
import PropTypes from 'prop-types';

class EditCategoryModal extends Component {

    render() {
        return (
            <Modal id="ModalEditCategory"
                   idForm="formEditCategory"
                   customClass="modal-dialog"
                   title="Редактирование категории"
                   save={this.props.editCategory}>
                <div className="form-group">
                    <label htmlFor="name"
                           className="col-sm-4 control-label">
                        Название категории
                    </label>
                    <div className="col-sm-8">
                        <input type="text"
                               className="form-control"
                               name="name"
                               placeholder="Новое название категории"
                               value={this.props.categoryTemp.name}
                               onChange={this.props.inputChangeName}
                               required/>
                    </div>
                </div>
                <div className="modal-footer row display-none">
                    <div className="text-right">
                        <button type="button"
                                className="btn btn-primary mr-sm"
                                onClick={this.props.editCategory}>
                            <i className="fa fa-fw fa-save"/>&nbsp;Сохранить
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

EditCategoryModal.propTypes = {
    categoryTemp: PropTypes.object.isRequired,
    inputChangeName: PropTypes.func.isRequired,
    editCategory: PropTypes.func.isRequired,
};

export default EditCategoryModal;