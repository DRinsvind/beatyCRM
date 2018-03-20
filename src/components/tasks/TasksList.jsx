import React, {Component} from 'react';
import AddTask from './AddTask'
import DatePicker from '../commons/DatePicker';
import DataTable from '../commons/tables/DataTable';
import PropTypes from 'prop-types';
import {
    FORMAT_DATE,
    FORMAT_TIME
} from '../../utils/index';

class TasksList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: this.mapToData(props),
            employees: props.employees,
            errors: {},
            showCalendar: true,
            currentDate: new Date(),
            task: {
                task_title: '',
                note: '',
                task_begin: '',
                task_end: '',
                attendee_id: '',
                task_priority: 0
            },
            selected_group: props.selected_group,
            selected_priority: 'Все приоритеты',
            tasks_state: 'Все задачи',
            loading: props.loading,
            filters: this.renderTasksMenu(props.all_tasks.length,
                props.all_tasks.filter((task) => (task.type === 'inbox')).length,
                props.all_tasks.filter((task) => (task.type === 'sent')).length,
                props.loading,
                props.selected_group)
        };
    }

    componentWillUpdate(nextProps, nextState) {

        if (this.props.employees !== nextProps.employees) {
            nextState.employees = nextProps.employees;
            nextState.task.attendee_id = nextProps.employees[0].staff_id;
        }

        if (this.props.tasks !== nextProps.tasks) {
            nextState.tasks = this.mapToData(nextProps);
            nextState.all_tasks = nextProps.all_tasks.length;
        }

        if (nextProps.errors) {
            if (nextProps.errors.status === 'error') {
                nextState.errors[nextProps.errors.message.field + nextProps.errors.message.index] = {
                    message: nextProps.errors.message.error
                }
            }
            if (nextProps.errors.status === 'success') {
                delete nextState.errors[nextProps.errors.message + nextProps.errors.index]
            }
        }

        if ((nextProps.loading !== this.props.loading) || (nextProps.selected_group !== this.props.selected_group)) {

            nextState.loading = nextProps.loading;
            nextState.selected_group = nextProps.selected_group;
            nextState.filters = this.renderTasksMenu(nextProps.all_tasks.length,
                nextProps.all_tasks.filter((task) => (task.type === 'inbox')).length,
                nextProps.all_tasks.filter((task) => (task.type === 'sent')).length,
                nextProps.loading,
                nextProps.selected_group);
        }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano" style={{height: '100%'}}>
                            <div className="nano-content p-none" style={{height: '100%'}}>
                                <div className="inner-menu-content" style={{height: '100%'}}>
                                    <div className="sidebar-widget m-none">
                                        <div className="widget-header mt-xlg ml-xlg">
                                            <h6 className="title">
                                                КАЛЕНДАРЬ
                                            </h6>
                                        </div>
                                        <div id="smallCalendar"
                                             className="widget-content ml-xlg mr-xlg mb-lg"
                                             style={{display: this.state.showCalendar ? 'block' : 'none'}}>
                                            <DatePicker
                                                date={this.state.currentDate}
                                                onDateChanged={this.currentDateChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row m-md">
                                        <a href="#ModalAdd" className="btn btn-primary mr-md" data-toggle="modal"
                                           style={{width: '100%'}}>
                                            <i className="fa fa-fw fa-plus mr-xs"/>
                                            Задача
                                        </a>
                                    </div>
                                    <nav id="menu" className="nav-main" role="navigation">
                                        <ul className="nav nav-main">
                                            {this.state.filters}
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div style={{backgroundColor: 'red', height: '20px'}}/>
                    </menu>
                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <section className="panel panel-default">
                                    <AddTask
                                        task={this.state.task}
                                        errors={this.state.errors}
                                        priority={this.state.task.task_priority}
                                        employees={this.props.employees}
                                        changeInput={this.onInputChanged}
                                        changePriority={this.onChangePriority}
                                        changeEmployee={this.onChangeEmployee}
                                        onSave={this.addTask}
                                        cancel={this.onCancel}
                                        form="Add"
                                    />
                                    <header className="panel-heading pb-lg">
                                        <div className="dropdown pull-right">
                                            <a href="#" className="dropdown-toggle"
                                               data-toggle="dropdown" role="button" aria-haspopup="true"
                                               aria-expanded="false"
                                               style={{textDecoration: 'none'}}>{this.state.tasks_state} <span
                                                className="caret"/></a>
                                            <ul className="dropdown-menu">
                                                {this.renderSortingItems()}
                                            </ul>
                                        </div>
                                        <div className="dropdown pull-right mr-md">
                                            <a href="#" className="dropdown-toggle"
                                               data-toggle="dropdown" role="button" aria-haspopup="true"
                                               aria-expanded="false"
                                               style={{textDecoration: 'none'}}>{this.state.selected_priority} <span
                                                className="caret"/></a>
                                            <ul className="dropdown-menu">
                                                {this.renderPrioritySorting()}
                                            </ul>
                                        </div>
                                        <h2 className="panel-title">{this.state.selected_group}</h2>
                                    </header>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <DataTable
                                                    headers={[
                                                        {
                                                            text: '',
                                                            width: true
                                                        },
                                                        {
                                                            text: 'Ф. И. О.',
                                                            sortable: true,
                                                            searchable: true
                                                        },
                                                        {
                                                            text: 'Задача',
                                                            sortable: true,
                                                            searchable: true
                                                        },
                                                        {
                                                            text: 'Начало',
                                                            sortable: true,
                                                            searchable: true
                                                        },
                                                        {
                                                            text: 'Конец',
                                                            sortable: true,
                                                            searchable: true
                                                        },
                                                        {
                                                            text: <i className="fa fa-fw fa-certificate"
                                                                     style={{fontSize: '1.5em'}}/>,
                                                            sortable: true,
                                                            width: true
                                                        },
                                                        {
                                                            text: '',
                                                            width: true
                                                        },
                                                        {
                                                            text: <i className="fa fa-fw fa-comment"
                                                                     style={{fontSize: '1.3em'}}/>,
                                                            sortable: true,
                                                            width: true
                                                        }
                                                    ]}
                                                    data={this.state.tasks}
                                                    cellRender={this.cellRender}
                                                    scroll="true"
                                                    loading={this.state.loading}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-xlg">
                                            <div className="col-md-3 col-md-offset-2">
                                                <label>Приоритет</label>
                                                <ul className="listStyle">
                                                    <li>
                                                            <span className="fa-stack">
  <i className="fa fa-certificate fa-stack-1x text-success" style={{fontSize: '1.5em'}}/>
                        <i className="fa-stack-1x fa-inverse">&#8226;</i>
</span> важная
                                                    </li>
                                                    <li>
                                                        <span className="fa-stack">
  <i className="fa fa-certificate fa-stack-1x text-warning" style={{fontSize: '1.5em'}}/>
                        <i className="fa-stack-1x fa-inverse">&#8226;&#8226;</i>
</span> очень важная
                                                    </li>
                                                    <li>
                                                        <span className="fa-stack">
  <i className="fa fa-certificate fa-stack-1x text-danger" style={{fontSize: '1.5em'}}/>
  <i className="fa fa-exclamation fa-stack-1x fa-inverse" style={{fontSize: '10px'}}/>
</span> на вчера
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-3">
                                                <label>Состояние</label>
                                                <ul className="listStyle">
                                                    <li>
                                                        <i className="fa fa-plus-circle text-success stateStyle"/> новая
                                                    </li>
                                                    <li>
                                                        <i className="fa fa-eye stateStyle"/> прочитана
                                                    </li>
                                                    <li>
                                                        <i className="fa fa-times-circle stateStyle"
                                                           style={{color: 'black'}}/> отклонена
                                                    </li>
                                                    <li>
                                                        <i className="fa fa-check-circle stateStyle"
                                                           style={{color: 'rgb(87,87,176'}}/> выполнена
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-3">
                                                <label>
                                                    <i className="fa fa-comment stateStyle"/> Наличие комментария
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    renderTasksMenu = (all, inbox, sent, loading, selected_group) => {
        let items = [
            {name: 'Все задачи', text: 'all', amount: all},
            {name: 'Входящие', text: 'inbox', amount: inbox},
            {name: 'Исходящие', text: 'sent', amount: sent}
        ];

        return items.map((item, iid) => {
            let class_name = selected_group === item.name ? "nav nav-active" : "nav" + (loading ? ' disabled' : '');
            return (
                <li key={iid} className={class_name}>
                    <a href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           if (!loading) {
                               this.createTasksList(item.name, item.text);
                           }
                       }}>{item.name}
                        <span
                            className="badge pull-right badgeStyle">{item.amount}</span>
                    </a>
                </li>
            );
        });
    };

    renderSortingItems = () => {
        let items = [
            {name: 'Все задачи', text: 'ALL'},
            {name: 'Прочитанные', text: 'READED'},
            {name: 'Отклонены', text: 'CANCELED'},
            {name: 'Выполнены', text: 'DONE'},
            {name: 'Новые', text: 'NEW'},
        ];

        return items.map((item, iid) => {
            return (
                <li key={iid}><a href="#" onClick={(e) => {
                    e.preventDefault();

                    this.sortByState(item.name, item.text)
                }}>
                    {item.name}
                </a></li>
            );
        });
    };

    renderPrioritySorting = () => {
        let items = [
            {name: 'Все приоритеты', id: 'ALL'},
            {name: 'Важные', id: 0},
            {name: 'Очень важные', id: 1},
            {name: 'На вчера', id: 2},
        ];

        return items.map((item, iid) => {
            return (
                <li key={iid}><a href="#" onClick={(e) => {
                    e.preventDefault();

                    this.sortByPriority(item.name, item.id);
                }}>
                    {item.name}
                </a></li>
            );
        });
    };

    mapToData = (props) => {
        return props.tasks.map((task) => {
            return this.createFormatForDataTable(task);
        });
    };

    cellRender = (row_index, cell_index, cell, details) => {
        switch (cell_index) {
            case 0:
                switch (cell) {
                    case 'sent':
                        return <span><i className="fa fa-user fa-lg mr-none" style={{fontSize: '12px'}}/>
                        <i className="fa fa-arrow-right fa-lg" style={{fontSize: '12px'}}/></span>
                    case 'inbox':
                        return <span>
                        <i className="fa fa-arrow-right fa-lg mr-none" style={{fontSize: '12px'}}/>
                        <i className="fa fa-user fa-lg" style={{fontSize: '12px'}}/>
                    </span>
                    case 'self':
                        return <i className="fa fa-user fa-lg" style={{fontSize: '12px'}}/>
                    default:
                        break;
                }
            case 1:
                return <a href="#" style={{color: '#33353F', fontWeight: '700'}} onClick={(e) => {
                    e.preventDefault();
                    this.onItemClick(details.task_id)
                }}>
                    {cell}
                </a>;
            case 2:
                return cell;
            case 3:
                return this.dateFormat(cell);
            case 4:
                return this.dateFormat(cell);
            case 5:
                switch (cell) {
                    case 0:
                        return <span className="fa-stack">
                                    <i className="fa fa-certificate fa-stack-1x text-success"
                                       style={{fontSize: '1.5em'}}/>
                                    <i className="fa-stack-1x fa-inverse">&#8226;</i>
                                </span>;
                    case 1:
                        return <span className="fa-stack">
                                    <i className="fa fa-certificate fa-stack-1x text-warning"
                                       style={{fontSize: '1.5em'}}/>
                                    <i className="fa-stack-1x fa-inverse">&#8226;&#8226;</i>
                                </span>;
                    case 2:
                        return <span className="fa-stack">
                                    <i className="fa fa-certificate fa-stack-1x text-danger"
                                       style={{fontSize: '1.5em'}}/>
                                    <i className="fa fa-exclamation fa-stack-1x fa-inverse" style={{fontSize: '10px'}}/>
                                </span>

                }
            case 6:

                switch (cell) {
                    case 'NEW':
                        return <i className="fa fa-plus-circle text-success stateStyle"/>
                    case 'READED':
                        return <i className="fa fa-eye stateStyle"/>
                    case 'CANCELED':
                        return <i className="fa fa-times-circle stateStyle" style={{color: 'black'}}/>
                    case 'DONE':
                        return <i className="fa fa-check-circle stateStyle" style={{color: 'rgb(87,87,176'}}/>
                    default:
                        break;
                }


            case 7:
                if (cell !== '' && cell !== ' ') {
                    return <i className="fa fa-comment" style={{fontSize: '1.3em'}}/>
                }

            default:
                break;
        }
    };

    onCancel = () => {
        window.$('#ModalAdd').modal('hide');
        this.clearCreateTaskForm();
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

    //EVENTS

    onItemClick = (task_id) => {
        this.props.onSelectTask(task_id);
    };

    createTasksList = (task_group, group_name) => {
        this.props.onTasksSelect(task_group, group_name);
    };

    createFormatForDataTable = (task) => {
        return {
            values: [
                task.type,
                task.attendee.staff_name,
                task.task_title,
                task.task_begin,
                task.task_end,
                task.task_priority,
                task.state,
                task.comment,
            ],
            details: task
        }
    };

    sortByState = (sortState, state) => {
        let tasks = [];

        this.props.tasks.forEach((task) => {
            if (state === 'ALL') {
                tasks.push(this.createFormatForDataTable(task));
            }
            if (task.state === state) {
                tasks.push(this.createFormatForDataTable(task));
            }
        });

        this.setState({
            tasks_state: sortState,
            tasks: tasks,
            selected_priority: 'Все приоритеты'
        });
    };

    sortByPriority = (sortPriority, priority) => {
        let tasks = [];

        this.props.tasks.forEach((task) => {
            if (priority === 'ALL') {
                tasks.push(this.createFormatForDataTable(task));
            }
            if (task.task_priority === priority) {
                tasks.push(this.createFormatForDataTable(task));
            }
        });

        this.setState({
            selected_priority: sortPriority,
            tasks: tasks,
            tasks_state: 'Все задачи'
        });
    };

    getInboxTasks = () => {
        let inbox = [];

        this.props.all_tasks.forEach((task) => {
            if (task.type === 'inbox') {
                inbox.push(this.createFormatForDataTable(task));
            }
        });

        return inbox;
    };

    getSentTasks = () => {
        let sent = [];

        this.props.all_tasks.forEach((task) => {
            if (task.type === 'sent') {
                sent.push(this.createFormatForDataTable(task));
            }
        });

        return sent;
    };

    currentDateChange = (nextDate) => {
        this.setState({
            currentDate: nextDate
        });

        this.props.onLoad(FORMAT_DATE(this.state.currentDate));
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

    onChangeEmployee = (e, name) => {
        this.checkForErrors(name);
        let t = this.state.task;

        t.attendee_id = +e;

        this.setState({
            task: t,
        });
    };

    onAddButtonClick = (e) => {
        e.preventDefault();
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

    addTask = () => {
        this.checkTaskFormForEmptiness();

        let date_start = new Date(this.state.task.task_begin ? this.state.task.task_begin : new Date());
        let date_end = new Date(this.state.task.task_end ? this.state.task.task_end : new Date());


        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: 'error',
                text: 'Заполнены не все поля!'
            };
            this.props.onNotifyShow(error);
        } else {
            let data = {
                'title': this.state.task.task_title,
                'note': this.state.task.note,
                'task_begin': FORMAT_DATE(new Date(date_start)) + ' ' + FORMAT_TIME(new Date(date_start)),
                'task_end': FORMAT_DATE(new Date(date_end)) + ' ' + FORMAT_TIME(new Date(date_end)),
                'attendee_id': this.state.task.attendee_id,
                'task_priority': this.state.task.task_priority
            };

            this.props.onAdd(data, FORMAT_DATE(this.state.currentDate));
            window.$('#ModalAdd').modal('hide');
            this.clearCreateTaskForm();
        }
    };

    clearCreateTaskForm = () => {
        this.setState({
            task: {
                task_title: '',
                note: '',
                task_begin: '',
                task_end: '',
                task_priority: 0,
                attendee_id: this.state.task.attendee_id
            },
            errors: {}
        });
    };

    componentDidMount() {
        this.props.onLoad(FORMAT_DATE(this.state.currentDate));
    };
}

TasksList.propTypes = {
    employees: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onSelectTask: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default TasksList;
