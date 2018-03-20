import React, {Component} from 'react';
import {
    FORMAT_DATE,
    FORMAT_TIME
} from '../../utils/index';
import AddTask from './AddTask'
import PropTypes from 'prop-types';

const $ = window.jQuery;

class ShowTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: this.mapToData(props),
            action_selected: 'NEW',
            employees: props.employees,
            errors: {},
            comment: '',
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.comment = this.createCommentSection(nextProps.task);
        }

        if (this.props.task !== nextProps.task) {
            nextState.task = this.mapToData(nextProps);
        }

        if (this.state.task.state) {
            nextState.action_selected = this.state.task.state;
        }
    }

    componentDidUpdate() {
        if (this.state.action_selected === 'DONE' || this.state.action_selected === 'CANCELED') {

        } else {
            $('#state_select').select2({
                width: '100%',
                templateResult: this.renderState,
                data: this.actionsToData().map((a) => {
                    if (a.id === this.state.action_selected) {
                        return {
                            ...a,
                            selected: true
                        };
                    }

                    return a;
                }),
                templateSelection: this.renderState,
            }).off('change').on('change', (e) => {
                this.setState({action_selected: e.target.value});

                let data = {
                    'state_denom': e.target.value,
                };
                this.props.onEditTaskState(this.state.task.task_id, data);
            });
        }
    };

    renderState = (val) => {
        return $('<div class="simple-value"><i class="' + (val.class) + '"></i> ' + val.text + '</div>');
    };

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <section className="panel panel-default">
                        <header className="panel-heading pb-lg">
                            <h2 className="panel-title">{this.typeToData()}</h2>
                        </header>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-3" style={{borderRight: '1px solid lightgray'}}>
                                    <h5 className='row' style={{height: '28px'}}>
                                        <div className="col-md-4 pr-sm">
                                            <label
                                                className="taskStyle">{this.state.task.type === 'sent' ? 'Кому' : 'От'}</label>
                                        </div>
                                        <div className="col-md-8 pl-sm taskStyle" style={{color: 'rgb(0,138,209)'}}>
                                            {this.state.task.attendee.staff_name}
                                        </div>
                                    </h5>
                                    <h5 className='row'>
                                        <div className="col-md-4 pr-sm">
                                            <label>Создана</label>
                                        </div>
                                        <div className="col-md-8 pl-sm">
                                            {this.dateFormat(this.state.task.task_begin)}
                                        </div>
                                    </h5>
                                </div>
                                <div className="col-md-4" style={{borderRight: '1px solid lightgray'}}>
                                    <h5 className='row'>
                                        <div className="col-md-4 pr-sm">
                                            <label className="taskStyle">Приоритет</label>
                                        </div>
                                        <div className="col-md-8 pl-sm" style={{color: 'rgb(0,138,209)'}}>
                                            {this.priorityToData(+this.state.task.task_priority)}
                                        </div>
                                    </h5>
                                    <h5 className='row'>
                                        <div className="col-md-4 pr-sm">
                                            <label>Срок до</label>
                                        </div>
                                        <div className="col-md-8 pl-md">
                                            {this.dateFormat(this.state.task.task_end)}
                                        </div>
                                    </h5>
                                </div>
                                <div className="col-md-3">
                                    <div className="col-md-12 pr-sm">
                                        {this.stateToData()}
                                    </div>
                                </div>
                                <div
                                    className={this.state.task.type === 'sent' || this.state.task.type === 'self' ? "col-md-2 pr-sm mt-xlg" : "hide"}>
                                    <a href="#ModalAdd" className="btn btn-default mr-sm" data-toggle="modal">
                                        <i className="fa fa-fw fa-pencil" style={{color: 'gray'}}></i>
                                    </a>
                                    <AddTask
                                        task={this.state.task}
                                        errors={this.state.errors}
                                        priority={this.state.task.task_priority}
                                        employees={this.props.employees}
                                        changeInput={this.onInputChanged}
                                        changePriority={this.onChangePriority}
                                        changeEmployee={this.onChangeEmployee}
                                        onSave={this.editTask}
                                        cancel={this.onCancel}
                                        form="Edit"
                                        onDelete={this.deleteSelectedTask}
                                    />
                                    <button className="btn btn-default" onClick={this.deleteSelectedTask}>
                                        <i className="fa fa-fw fa-trash" style={{color: 'gray'}}></i>
                                    </button>
                                </div>
                            </div>
                            <hr/>
                            <div className="row mb-md">
                                <div className="col-md-12">
                                    <h3 className="panel-title">{this.state.task.title}</h3>
                                </div>
                            </div>
                            <div className="row mb-xlg">
                                <div className="col-md-12">
                                    {this.state.task.note}
                                </div>
                            </div>
                            {this.renderCommentSection()}
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-md-12 text-right">
                                    <button type="button"
                                            className={this.state.task.type === 'sent' || this.state.comment === 'yes' || this.state.task.type === 'self' ? 'hide' : "btn btn-primary mr-sm"}
                                            onClick={this.onSaveTaskState}>
                                        <i className="fa fa-fw fa-save"></i>
                                        Сохранить
                                    </button>
                                    <button type="reset" className="btn btn-default" onClick={this.onBackClick}>
                                        Назад
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }

    mapToData = (props) => {
        return (
            props.task.data ? {
                    task_title: props.task.data.task_title || '',
                    note: props.task.data.note || '',
                    task_begin: props.task.data.task_begin || '',
                    task_end: props.task.data.task_end || '',
                    attendee: props.task.data.attendee || {},
                    task_priority: props.task.data.task_priority || 0,
                    comment: props.task.data.comment || '',
                    state: props.task.data.state || {},
                    type: props.task.data.type || '',
                    user_created: props.task.data.user_created || '',
                    task_id: props.task.data.task_id || null
                } : {
                    task_title: '',
                    note: '',
                    task_begin: '',
                    task_end: '',
                    attendee: {},
                    task_priority: 0,
                    comment: '',
                    state: {},
                    type: '',
                    user_created: '',
                    task_id: null
                }
        );
    };

    createCommentSection = (task) => {
        if (task) {
            if (task.data.type === 'inbox' && task.data.comment === '') {
                this.setState({
                    comment: 'no'
                });
            }

            if (task.type === 'self') {
                this.setState({
                    comment: 'none'
                });

            }
            if ((task.data.type === 'inbox' && task.data.comment !== '') || task.data.type === 'sent') {
                this.setState({
                    comment: 'yes'
                });
            }
        }
    };

    renderCommentSection = () => {
        switch (this.state.comment) {
            case 'yes':
                return <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-default pb-xlg"
                             style={{
                                 borderRadius: '0px',
                                 backgroundColor: 'rgb(249,249,249)', borderTop: '1px solid lightgray'
                             }}>
                            <div className="row mt-xlg">
                                <div className="col-md-6" style={{borderRight: '1px solid white'}}>
                                    <h5 className='row mb-md'>
                                        <div className="col-md-1 pr-sm" style={{textAlign: 'right'}}>
                                            <i className="fa fa-comment" style={{fontSize: '1.3em'}}></i>
                                        </div>
                                        <div className="col-md-11 pl-sm">
                                            <div className="row" style={{marginLeft: '2px'}}>
                                                <label>Комментарий</label>
                                                <label className="ml-xs mr-xs"
                                                       style={{color: 'rgb(0,138,209)'}}>{this.state.task.attendee.staff_name}</label>
                                            </div>
                                            <div className="row" style={{marginLeft: '2px'}}>
                                                {this.state.task.comment}
                                            </div>
                                        </div>
                                    </h5>
                                    {this.stateToData()}
                                </div>
                                <div className="col-md-4" style={{borderRight: '1px solid white'}}>
                                    <select
                                        className={this.state.action_selected === 'DONE' || 'CANCELED' ? "hide" : "form-control"}
                                        id="state_select"></select>
                                </div>
                                <div className={this.state.task.type === 'inbox' ? "col-md-2 pr-sm" : 'hide'}>
                                    <button className="btn btn-default mr-sm"
                                            onClick={this.onEditComment}>
                                        <i className="fa fa-fw fa-pencil" style={{color: 'gray'}}></i>
                                    </button>
                                    <button className={this.state.task.comment !== '' ? "btn btn-default" : "hide"}
                                            onClick={this.onDeleteComment}>
                                        <i className="fa fa-fw fa-trash" style={{color: 'gray'}}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
            case 'no':
                return <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-default pb-xlg"
                             style={{
                                 borderRadius: '0px',
                                 backgroundColor: 'rgb(249,249,249)', borderTop: '1px solid lightgray'
                             }}>
                            <div className="row mt-xlg">
                                <div className={"form-group" + (this.state.errors['comment'] ? ' has-error' : '')}>
                                    <label className="col-md-1 col-md-offset-1 control-label"
                                           style={{textAlign: 'right'}}>
                                        <i className="fa fa-comment" style={{fontSize: '1.3em'}}></i>
                                    </label>
                                    <div className="col-md-8" style={{textAlign: 'right'}}>
                                                <textarea
                                                    className="form-control"
                                                    name="comment"
                                                    value={this.state.task.comment}
                                                    onChange={this.onInputChanged}
                                                    rows="3"
                                                ></textarea>
                                        <label
                                            className={this.state.errors['comment'] ? 'control-label' : 'hidden'}>
                                            {this.state.errors['comment'] ? this.state.errors['comment'].message : ''}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
            case 'none':
                return <div></div>;
            default:
                return <div></div>;
                break;
        }
    };


    actionsToData = () => {
        return [{
            text: 'Новая задача',
            id: 'NEW',
            class: 'fa fa-plus-circle text-success stateStyle'
        }, {
            text: 'Отметить задачу как выполненую',
            id: 'DONE',
            class: 'fa fa-check-circle state_done stateStyle'
        }, {
            text: 'Отказаться от задачи',
            id: 'CANCELED',
            class: 'fa fa-times-circle state_canceled stateStyle'
        }, {
            text: 'Отметить задачу как просмотренную',
            id: 'READED',
            class: 'fa fa-eye stateStyle'
        }]
    };

    typeToData = () => {
        switch (this.state.task.type) {
            case 'sent':
                return <label>Исходящая задача</label>;
            case 'inbox':
                return <label>Входящая задача</label>;
            default:
                break;
        }
    };

    stateToData = () => {
        switch (this.state.task.state) {
            case 'NEW':
                return this.stateRender('Новая', 'fa fa-plus-circle text-success');
            case 'READED':
                return this.stateRender('Прочитана', 'fa fa-eye');
            case 'CANCELED':
                return this.stateRender('Отклонена', 'fa fa-times-circle state_canceled');
            case 'DONE':
                return this.stateRender('Выполнена', 'fa fa-check-circle state_done');
            default:
                break;
        }
    };

    stateRender = (name, cl) => {
        return (
            <h5 className='row'>
                <div className="col-md-1 pr-sm" style={{textAlign: 'right'}}>
                    <i className={cl + " stateStyle"}></i>
                </div>
                <div className="col-md-8 pl-sm mt-xs">
                    {name}
                </div>
            </h5>
        );
    };

    priorityToData = (priority) => {
        switch (priority) {
            case 0:
                return <div>
                    <span className="fa-stack">
  <i className="fa fa-certificate fa-stack-1x text-success" style={{fontSize: '1.5em'}}></i>
                        <i className="fa-stack-1x fa-inverse">&#8226;</i>
</span> Важная
                </div>;
            case 1:
                return <div>
                    <span className="fa-stack">
  <i className="fa fa-certificate fa-stack-1x text-warning" style={{fontSize: '1.5em'}}></i>
                        <i className="fa-stack-1x fa-inverse">&#8226;&#8226;</i>
</span> Очень важная
                </div>;
            case 2:
                return (
                    <div>
                        <span className="fa-stack">
                            <i className="fa fa-fw fa-certificate fa-stack-1x text-danger"
                               style={{fontSize: '1.5em'}}></i>
                            <i className="fa fa-fw fa-exclamation fa-stack-1x fa-inverse"
                               style={{fontSize: '10px'}}></i>
                        </span> На вчера
                    </div>
                );
            default:
                break;
        }
    };

    onEditComment = () => {
        this.setState({
            comment: 'no'
        });
    };

    dateFormat = (dateCreated) => {
        const date = new Date(dateCreated);
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        let min = date.getMinutes();
        if (min < 10) min = '0' + min;

        const newDate = dd + '.' + mm + '.' + date.getFullYear() + ' (' + date.getHours() + ':' + min + ')';

        return newDate;
    };

    checkForErrors = (name) => {
        this.state.errors[name] ? delete this.state.errors[name] : '';
    };

    onInputChanged = (e) => {
        this.checkForErrors(e.target.name);

        let state = this.state.task;

        state[e.target.name] = e.target.value;

        this.setState({task: state});
    };

    onChangePriority = (e) => {

        let t = this.state.task;

        t.task_priority = +e;

        this.setState({
            task: t,
        });
    };

    onChangeEmployee = (e) => {
        let attendee = {
            staff_id: +e,
        };

        let t = this.state.task;

        t.attendee = attendee;

        this.setState({
            task: t,
        });
    };

    onBackClick = () => {
        let date = new Date(this.state.task.task_begin);
        this.props.onBackClick(FORMAT_DATE(date), this.props.router);
    };

    deleteSelectedTask = (e) => {
        e.preventDefault();

        if (window.confirm('Вы действительно хотите удалить задачу ' + this.props.task.data.task_title + '?')) {
            this.props.onDeleteTask(this.props.router, this.props.task.data.task_id, FORMAT_DATE(new Date()));
            window.$('#ModalAdd').modal('hide');
        }
    };

    checkTaskFormForEmptiness = () => {
        let err = this.state.errors;

        if (this.state.task.title === '') {
            err['task_title'] = {message: 'Укажите название'};
        }

        if (this.state.task.attendee_id === '') {
            err['attendee_id'] = {message: 'Укажите сотрудника'};
        }

        this.setState({
            errors: err,
        });
    };

    checkComment = () => {
        if (this.state.action_selected === null) {
            this.state.errors['state_denom'] = {message: 'Укажите состояние'};
        }
    };

    editTask = () => {
        this.checkTaskFormForEmptiness();

        let date_start = new Date(this.state.task.task_begin);
        let date_end = new Date(this.state.task.task_end);

        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!',
                title: 'ОШИБКА'
            };
            this.props.onNotifyShow(error);
        } else {

            let data = {
                'title': this.state.task.task_title,
                'note': this.state.task.note,
                'task_begin': FORMAT_DATE(new Date(date_start)) + ' ' + FORMAT_TIME(new Date(date_start)),
                'task_end': FORMAT_DATE(new Date(date_end)) + ' ' + FORMAT_TIME(new Date(date_end)),
                'attendee_id': this.state.task.attendee.staff_id,
                'task_priority': +this.state.task.task_priority
            };

            this.props.onEdit(data, this.state.task.task_id);
            window.$('#ModalAdd').modal('hide');
        }
    };

    onSaveTaskState = () => {
        this.checkComment();

        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!',
                title: 'ОШИБКА'
            };
            this.props.onNotifyShow(error);
        } else {

            let data = {
                'note_performer': this.state.task.comment
            };

            this.props.onAddEditTaskNote(this.state.task.task_id, data);
        }
    };

    onDeleteComment = (e) => {
        e.preventDefault();

        if (window.confirm('Вы действительно хотите удалить коментарий?')) {
            this.props.onDeleteComment(this.state.task.task_id);
        }
    };

    onCancel = () => {
        this.setState({task: this.props.task.data});
        window.$('#ModalAdd').modal('hide');
    };

    componentDidMount() {
        this.props.onItem(this.props.params.task_id);
    };
}

ShowTask.propTypes = {
    employees: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    task: PropTypes.object,
};

export default ShowTask;
