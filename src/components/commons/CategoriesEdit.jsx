import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Modal from './modals/Modal';

const $ = window.$;

class CategoriesEdit extends Component {
    render () {
        switch(this.props.modal) {
            case 'ModalAddCategory':
                return ( <Modal id="ModalAddCategory"
                                idForm="formAddCategory"
                                customClass="modal-dialog"
                                title="Создание категории">
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-4 control-label">Название категории</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="name" name="name"
                                   placeholder="Название категории"
                                   // onChange={this.inputChangeName} required
                            />
                        </div>
                    </div>
                    <div className="modal-footer row">
                        <div className="text-right">
                            <button type="button" className="btn btn-primary mr-sm"
                                    // onClick={this.addCategory}
                            >
                                <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
                            </button>
                            <button type="button" className="btn btn-default" data-dismiss="modal">
                                <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
                            </button>
                        </div>
                    </div>
                </Modal>);
            default: return <div />

        }

        // return (
        //     <section>
        //         <Modal id="ModalAddCategory"
        //                idForm="formAddCategory"
        //                customClass="modal-dialog"
        //                title="Создание категории">
        //             <div className="form-group">
        //                 <label htmlFor="name" className="col-sm-4 control-label">Название категории</label>
        //                 <div className="col-sm-8">
        //                     <input type="text" className="form-control" id="name" name="name"
        //                            placeholder="Название категории"
        //                            onChange={this.inputChangeName} required
        //                     />
        //                 </div>
        //             </div>
        //             <div className="modal-footer row">
        //                 <div className="text-right">
        //                     <button type="button" className="btn btn-primary mr-sm" onClick={this.addCategory}>
        //                         <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
        //                     </button>
        //                     <button type="button" className="btn btn-default" data-dismiss="modal">
        //                         <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
        //                     </button>
        //                 </div>
        //             </div>
        //         </Modal>
        //
        //         <Modal id="ModalEditCategory"
        //                idForm="formEditCategory"
        //                customClass="modal-dialog"
        //                title="Редактирование категории">
        //             <div className="form-group">
        //                 <label htmlFor="name" className="col-sm-4 control-label">Название категории</label>
        //                 <div className="col-sm-8">
        //                     <input type="text"
        //                            className="form-control"
        //                            name="name"
        //                            placeholder="Новое название категории"
        //                            value={this.state.categoryTemp.name}
        //                            onChange={this.inputChangeName}
        //                            required
        //                     />
        //                 </div>
        //             </div>
        //             <div className="modal-footer row">
        //                 <div className="text-right">
        //                     <button type="button" className="btn btn-primary mr-sm" onClick={this.editCategory}>
        //                         <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
        //                     </button>
        //                     <button type="button" className="btn btn-default" data-dismiss="modal">
        //                         <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
        //                     </button>
        //                 </div>
        //             </div>
        //         </Modal>
        //
        //         <Modal id="ModalRemoveCategory"
        //                customClass="modal-dialog"
        //                title="Удаление категории">
        //             <h4 className="text-center">Вы уверены, что хотите удалить категорию?</h4>
        //             <div className="modal-footer row">
        //                 <div className="text-right">
        //                     <button type="button" className="btn btn-primary mr-sm" onClick={this.removeCategory}>
        //                         <i className="fa fa-fw fa-trash"></i>&nbsp;Удалить
        //                     </button>
        //                     <button type="button" className="btn btn-default" data-dismiss="modal">
        //                         <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
        //                     </button>
        //                 </div>
        //             </div>
        //         </Modal>
        //     </section>
        // )
    }
}

export default CategoriesEdit;
