import React, { Component } from "react";
import Modal from "../commons/modals/Modal";
import PropTypes from "prop-types";

class AddEmployeeGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    render() {
        return (
            <Modal
                id="ModalAddEmployeeCategory"
                idForm="formAddEmployeeCategory"
                customClass="modal-dialog"
                title="Создать группу"
            >
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className={
                                "form-group" +
                                (this.props.errors && this.props.errors["name"]
                                    ? " has-error"
                                    : "")
                            }
                            style={{
                                marginBottom: "0px"
                            }}
                        >
                            <label className="control-label">Имя группы</label>
                            <div
                                style={{
                                    textAlign: "right"
                                }}
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    onBlur={this.focusLos}
                                    value={this.props.newGroup.name}
                                    onChange={this.props.inputNewGroupChanged}
                                />
                                <label
                                    className={
                                        this.props.errors &&
                                        this.props.errors["name"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.props.errors &&
                                    this.props.errors["name"]
                                        ? this.props.errors["name"].message
                                        : ""}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer row">
                    <div className="text-right">
                        <button
                            type="button"
                            className="btn btn-primary mr-sm"
                            onClick={Object.keys(this.props.errors).length === 0 ? this.props.addEmployeeCategory : ''}
                        >
                            <i className="fa fa-fw fa-save" />&nbsp;Сохранить
                        </button>
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={this.props.cancelAddingEmplGroup}
                        >
                            <i className="fa fa-fw fa-times" />&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

AddEmployeeGroup.propTypes = {
    newGroup: PropTypes.object.isRequired,
    addEmployeeCategory: PropTypes.func.isRequired,
    cancelAddingEmplGroup: PropTypes.func.isRequired,
    inputNewGroupChanged: PropTypes.func.isRequired
};

export default AddEmployeeGroup;
