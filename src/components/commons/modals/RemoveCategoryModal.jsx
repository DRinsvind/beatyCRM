import React, {Component} from 'react';
import Modal from './Modal';
import PropTypes from 'prop-types';

class RemoveCategoryModal extends Component {

    render() {
        return (
            <Modal id="ModalRemoveCategory"
                   customClass="modal-dialog"
                   title="Удаление категории"
                   save={this.props.removeCategory}>
                <h4 className="text-center">
                    Вы уверены, что хотите удалить категорию?
                </h4>
                <div className="modal-footer row display-none">
                    <div className="text-right">
                        <button type="button"
                                className="btn btn-primary mr-sm"
                                onClick={this.props.removeCategory}>
                            <i className="fa fa-fw fa-trash"/>&nbsp;Удалить
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

RemoveCategoryModal.propTypes = {
    removeCategory: PropTypes.func.isRequired
};

export default RemoveCategoryModal;