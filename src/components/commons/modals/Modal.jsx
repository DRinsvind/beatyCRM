import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * Modal component.
 **/
class Modal extends Component {
    render() {
        return (
            <div id={this.props.id} className="modal fade">
                <form id={this.props.idForm} onSubmit={this.props.handlePressButt} encType="multipart/form-data">
                    <div className={this.props.customClass} id="modalHeaderColor">
                        <div
                            className="modal-content"
                            style={
                                this.props.name === 'middle' ||
                                this.props.name === 'goodsSale' ||
                                this.props.name === 'goodsPro' ||
                                this.props.name === 'goodsSaleSet' ||
                                this.props.name === 'goodsProSet' ||
                                this.props.name === 'goodsEditSet'
                                    ? { width: '735px' }
                                    :this.props.name === 'settingSmsAdd'||
                                    this.props.name === 'modalAddMail'
                                    ? { width: '488px' }
                                    : { width: '964px', margin: '30px auto' }
                            }
                        >
                            <div className="panel-heading">
                                <button
                                    type="button"
                                    className="close-modal pull-right"
                                    data-dismiss="modal"
                                    onClick={this.props.onCancel}
                                    aria-hidden="true"
                                >
                                    <i className="fa fa-ban" />
                                </button>
                                <button
                                    type="button"
                                    className="save-modal pull-right"
                                    onClick={this.props.save}
                                    aria-hidden="true"
                                >
                                    {this.props.title === 'Удаление категории' ? (
                                        <i className="fa fa-trash" />
                                    ) : (
                                        <i className="fa fa-save" />
                                    )}
                                </button>
                                <h4 className="panel-title-modal white">
                                    {this.props.fa && (
                                        <i
                                            style={{ marginRight: 5 }}
                                            className={`fa fa-fw ${this.props.fa}`}
                                        />
                                    )}
                                    {this.props.title}
                                </h4>
                            </div>
                            <div className="modal-body" style={{ marginTop: 20 }}>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Modal.propTypes = {
    fa: PropTypes.string,
    customClass: PropTypes.string,
    title: PropTypes.string.isRequired,
    save: PropTypes.func,
    onCancel: PropTypes.func,
    name: PropTypes.string,
    idForm: PropTypes.string,
    id: PropTypes.string.isRequired
};

export default Modal;
