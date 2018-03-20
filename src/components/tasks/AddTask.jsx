import React, {Component} from 'react';
import Modal from '../commons/modals/Modal';
import {API_HOST} from '../../constants';
import PropTypes from 'prop-types';

const $ = window.jQuery;

class AddTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employees: [],
            employee_selected: null,
            selectedPriority: 0,
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.employees = this.employeesToData(nextProps.employees);
        }

        if (this.props.task.attendee_id !== nextProps.task.attendee_id) {
            nextState.employee_selected = nextProps.task.attendee_id;
        }

        if (this.props.task.attendee !== nextProps.task.attendee) {
            nextState.employee_selected = nextProps.task.attendee.staff_id;
        }

        if (this.props.task.task_priority !== nextProps.task.task_priority || this.props.form === 'Edit') {
            nextState.selectedPriority = nextProps.task.task_priority;
        }

    }

    componentDidUpdate() {
        $('#employee_select').select2({
            width: '100%',
            data: this.state.employees.map((empl) => {
                if (empl.id === this.state.employee_selected) {
                    return {
                        ...empl,
                        selected: true
                    };
                }

                return empl;
            }),
            templateSelection: this.empoyeeSelect,
            templateResult: this.empoyeeSelect,
        }).off('change').on('change', (e) => {
            this.setState({
                employee_selected: e.target.value
            });

            this.props.changeEmployee(e.target.value, 'attendee_id');
        });
    }

    componentDidMount() {
        $('#priority_select').select2({
            width: '100%',
            templateResult: (val) => {
                return $('<div>' + '<span class="fa-stack">' +
                    '<i class="fa fa-fw fa-' + (val.icon || '') + ' taskIncon">' + '</i>' +
                    '<i class="fa' + val.iconClass + '">' + val.data + '</i>' + '</span>' + val.text + '</div>');
            },
            data: this.priorityData().map((p) => {
                if (p.id === this.state.selectedPriority) {
                    return {
                        ...p,
                        selected: true
                    };
                }

                return p;
            }),
            templateSelection: this.prioritySelect,
        }).off('change').on('change', (e) => {
            this.setState({
                selectedPriority: e.target.value
            });
            this.props.changePriority(e.target.value);
        });

        $('.date').datetimepicker({
            format: 'YYYY/MM/DD HH:mm',
            locale: 'ru',
            useCurrent: true,
        }).off('dp.change').on('dp.change', this.props.changeInput);
    };

    render() {
        return (
            <Modal handlePressButt={this.onAddButtonClick} customClass="modal-block"
                   id="ModalAdd"
                   idForm="formAdd"
                   title={this.props.form === 'Edit' ? "Редактировать задачу" : "Добавить задачу"}
                   name="middle">
                <div
                    className={"form-group" + (this.props.errors['attendee_id'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label text-right">Кому</label>
                    <div className="col-md-8" style={{textAlign: 'right'}}>
                        <div className="input-daterange input-group">
                            <select className="form-control" id="employee_select"></select>
                        </div>
                        <label
                            className={this.props.errors['attendee_id'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['attendee_id'] ? this.props.errors['attendee_id'].message : ''}
                        </label>
                    </div>
                </div>
                <div
                    className={"form-group" + (this.props.errors['task_title'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label text-right">Название задачи</label>
                    <div className="col-md-8" style={{textAlign: 'right'}}>
                        <input
                            className="form-control"
                            name="task_title"
                            value={this.props.task ? this.props.task.task_title : ''}
                            onChange={this.props.changeInput}
                        />
                        <label
                            className={this.props.errors['task_title'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['task_title'] ? this.props.errors['task_title'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['note'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label text-right">Описание задачи</label>
                    <div className="col-md-8" style={{textAlign: 'right'}}>
                                                <textarea
                                                    className="form-control"
                                                    name="note"
                                                    value={this.props.task ? this.props.task.note : ''}
                                                    rows="3"
                                                    onChange={this.props.changeInput}
                                                ></textarea>
                        <label
                            className={this.props.errors['note'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['note'] ? this.props.errors['note'].message : ''}
                        </label>
                    </div>
                </div>
                <div
                    className={"form-group" + (this.props.errors['task_begin'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label text-right">Срок выполнения</label>
                    <div className="col-md-8" style={{textAlign: 'right'}}>
                        <div className="input-daterange input-group">
															<span className="input-group-addon">
																<i className="fa fa-fw fa-calendar"></i>
															</span>
                            <input type="text"
                                   className="form-control date"
                                   name="task_begin"
                                   value={this.props.task.task_begin ? this.dateFormat(this.props.task.task_begin) : this.dateFormat(new Date())}
                                   placeholder="Дата создания"
                                   onChange={(e) => {}}
                            />
                            <span className="input-group-addon">до</span>
                            <input type="text"
                                   className="form-control date"
                                   name="task_end"
                                   value={this.props.task.task_end ? this.dateFormat(this.props.task.task_end) : this.dateFormat(new Date())}
                                   placeholder="Выполнить до"
                                   onChange={(e) => {}}
                            />
                        </div>
                        <label
                            className={this.props.errors['task_begin'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['task_begin'] ? this.props.errors['task_begin'].message : ''}
                        </label>
                    </div>
                </div>
                <div
                    className="form-group">
                    <label className="col-md-3 control-label text-right">Приоритет</label>
                    <div className="col-md-8">
                        <div className="input-daterange input-group">
                            <select className="form-control" id="priority_select"></select>
                        </div>
                    </div>
                </div>

                <div className="modal-footer row">
                    <div className="text-right">
                        <button type="button" className={this.props.form === 'Edit' ? "btn btn-default mr-sm" : 'hide'}
                                onClick={this.props.onDelete} style={{backgroundColor: 'rgb(117,117,117)'}}>
                            Удалить
                        </button>
                        <button type="button" className="btn btn-primary mr-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.savingTask();
                                }}>
                            <i className="fa fa-fw fa-save"></i>&nbsp;Сохранить
                        </button>
                        <button type="button" className="btn btn-default" data-dismiss="modal"
                                onClick={this.props.cancel}>
                            <i className="fa fa-fw fa-times"></i>&nbsp;Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }

    priorityData = () => {
        return [
            {
                id: 0,
                text: 'Важная',
                icon: 'certificate fa-stack-1x text-success',
                iconClass: '-stack-1x fa-inverse',
                data: '&#8226;'
            },
            {
                id: 1,
                text: 'Очень важная',
                icon: 'certificate fa-stack-1x text-warning',
                iconClass: '-stack-1x fa-inverse',
                data: '&#8226;&#8226;'
            },
            {
                id: 2,
                text: 'На вчера',
                icon: 'certificate fa-stack-1x text-danger',
                iconClass: ' fa-exclamation fa-stack-1x fa-inverse',
                data: ''
            }
        ]
    };

    prioritySelect = (val) => {
        return $('<div>' + '<span class="fa-stack">' +
            '<i class="fa fa-fw fa-' + (val.icon || '') + ' taskIncon">' + '</i>' +
            '<i class="fa' + val.iconClass + '">' + val.data + '</i>' + '</span>' + val.text + '</div>');
    };

    empoyeeSelect = (item) => {
        return $('<div class="row">' +
            '<div class="col-md-2 photoEmployeeSelect">' +
            '<img src="' + API_HOST + item.photo + '" alt="..." class="img-rounded employee-image employeeSelect"/></div>' +
            '<div class="col-md-5 mt-md text-left">' + item.text +
            '</div><div class="col-md-5 mt-md text-left">' + ' (' + item.post + ') ' +
            '</div></div>');
    };

    employeesToData = (employeesList) => {
        let employees = [];

        employeesList.forEach((employee) => {
            employees.push({
                id: employee.staff_id,
                text: employee.staff_identifier,
                photo: employee.staff_photo,
                post: employee.staff_post
            })
        });

        return employees;
    };

    dateFormat = (taskDate) => {
        const date = new Date(taskDate);
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        let min = date.getMinutes();
        if (min < 10) min = '0' + min;

        const newDate = date.getFullYear() + '/' + mm + '/' + dd + ' ' + date.getHours() + ':' + min + '';

        return newDate;
    };

    savingTask = () => {
        if (this.props.form === 'Add' && Object.keys(this.props.errors).length === 0) {
            this.setState({
                employee_selected: null,
            });
        }

        this.props.onSave();
    };
}

AddTask.propTypes = {
    errors: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    priority: PropTypes.number.isRequired,
    employees: PropTypes.array.isRequired,
    changeInput: PropTypes.func.isRequired,
    focusLos: PropTypes.func,
    changePriority: PropTypes.func.isRequired,
    changeEmployee: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    cancel: PropTypes.func,
};

export default AddTask;