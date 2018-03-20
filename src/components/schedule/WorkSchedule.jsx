import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TreeView from '../commons/TreeView';
import AddScheduleTime from './AddScheduleTime';
import PHOTO_EMPLOYEE_DEFAULT from '../../../public/assets/images/dummy/employee.jpg';
import {API_HOST} from '../../constants';
import {FORMAT_DATE, FORMAT_TIME_WITHOUT_SECONDS} from '../../utils/index';

const $ = window.$;

class WorkSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            work_schedule: [],
            employees_groups: [],
            selected_key: 0,
            month: new Date(),
            selected_date_num: 0,
            schedule: {
                employee_id: '',
                time_from: '',
                time_to: ''
            },
            load: props.load
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.employees_groups !== nextProps.employees_groups || this.state.selected_key !== nextState.selected_key) {
            nextState.employees_groups = this.mapToDataCategories(nextProps.employees_groups, nextState.selected_key);
        }

        if (this.props.work_schedule !== nextProps.work_schedule) {
            nextState.work_schedule = this.dataToEmployees(nextProps.work_schedule);
        }

        if (nextProps.work_schedule_post !== this.props.work_schedule_post && nextProps.work_schedule_post !== {}) {
            nextState.work_schedule_post = this.onePostEmployees(nextProps.work_schedule_post);
        }

        if (this.props.load !== nextProps.load) {
            nextState.load = nextProps.load;
            nextState.employees_groups = this.mapToDataCategories(nextProps.employees_groups, nextState.selected_key);
        }
    }

    render() {
        return (
            <section className="content-with-menu">
                <div className="content-with-menu-container">
                    <AddScheduleTime
                        onSaveTime={this.saveTime}
                        onCancelAddingTime={this.cancelAdding}
                        changeWorkingTime={this.onChangeWorkingTime}
                    />
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content">
                                <div className="inner-menu-content">
                                    <div className='sidebar-widget m-none'>
                                        <div className="widget-header">
                                            <h6 className="title" style={{paddingTop: 5}}>
                                                ВЫБЕРИТЕ МЕСЯЦ
                                            </h6>
                                        </div>
                                        <div className="widget-content">
                                            <input type="text"
                                                   className="form-control date"
                                                   name="month"
                                                   value={this.formatMonth(this.state.month)}
                                                   placeholder="Дата начала периода"
                                                   onChange={(e) => {
                                                   }}
                                            />
                                        </div>
                                    </div>
                                    <div className='sidebar-widget ml-none mr-none mt-md'>
                                        <div className="widget-header mt-md">
                                            <h6 className="title" style={{paddingTop: 5}}>
                                                КАТЕГОРИИ
                                            </h6>
                                        </div>
                                        <div className="widget-content">
                                            <TreeView items={this.state.employees_groups}
                                                      onItemSelect={this.onItemSelect}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </menu>
                    <div className="inner-body mg-main">
                        <div className="row">
                            <div className="col-md-12">
                                <section className="panel panel-default">
                                    <header className="panel-heading">
                                        <h2 className="panel-title">График работы сотрудников</h2>
                                    </header>
                                    <div className="panel-body pr-xlg">
                                        <div className="row">
                                            <div className="col-md-4 pr-none">
                                                <table className="table table-hover mb-none table-bordered"
                                                       style={{borderRight: '0px'}}>
                                                    <thead>
                                                    <tr className="schedule-header-tr">
                                                        <th key={'full_name'} style={{
                                                            width: '38%',
                                                            textAlign: 'center',
                                                            padding: '20px'
                                                        }}>Ф.И.О
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {this.state.load ? this.renderLoadingRow() : this.state.selected_key === 0 ?
                                                            this.renderTableBodyAll(this.daysInMonth()) :
                                                            this.renderTableBody(this.state.work_schedule_post ?
                                                                this.state.work_schedule_post[0].group_employees : [])}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-8 p-none"
                                                 style={{overflow: 'scroll', position: 'relative'}}>
                                                <table className="table table-hover mb-none table-bordered"
                                                       style={{borderLeft: '0px'}}>
                                                    <thead>
                                                    <tr className="schedule-header-tr">
                                                        {this.renderDaysHeader(this.daysInMonth())}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {this.state.load ? this.renderLoadingRowDays(this.daysInMonth()) : this.state.selected_key === 0 ?
                                                            this.renderDaysBodyAll(this.daysInMonth()) :
                                                            this.renderDaysBody(this.state.work_schedule_post ?
                                                                this.state.work_schedule_post[0].group_employees : [], this.daysInMonth())}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-footer">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button className="btn btn-default" onClick={(e) => {
                                                }}>
                                                    <i className="fa fa-fw fa-print"></i>
                                                    Распечатать
                                                </button>
                                            </div>
                                            <div className="col-md-6">
                                                <button className="btn btn-default pull-right" onClick={(e) => {
                                                }}>
                                                    <i className="fa fa-fw fa-file-excel-o"></i>
                                                    Excel
                                                </button>
                                                {/*<button className="btn btn-default pull-right" onClick={(e) => {*/}
                                                {/*}}>*/}
                                                {/*<i className="fa fa-fw fa-file-pdf-o"></i>*/}
                                                {/*PDF*/}
                                                {/*</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    renderLoadingRow = () => {
        return (
            <tr className="schedule-body-category-tr">
                <td style={{fontWeight: 'bold', marginLeft: '20px', borderRight: '0px'}}>
                </td>
            </tr>
        )
    };

    renderLoadingRowDays = (datesInMonth) => {
        return (
            <tr className="schedule-body-category-tr">
                <td colSpan={datesInMonth + 1} style={{borderLeft: '0px'}}>
                    <i className="fa fa-fw fa-spin fa-refresh" style={{marginLeft: '30%'}}/> Загрузка...
                </td>
            </tr>
        )
    };

    renderFullName = (employee) => {
        const img = employee.photo ? (API_HOST + employee.photo) : PHOTO_EMPLOYEE_DEFAULT;
        let columns = [];
        columns.push(
            <td className="emplName" key={0} onClick={(e) => {
                e.preventDefault();
                this.setState({
                    selected_date_num: +e.target.id,
                    schedule: {
                        ...this.state.schedule,
                        employee_id: employee.staff_id
                    }
                });
                $('#ModalAddTime').modal('show');
            }}>
                <div className="col-md-4 img-rounded schedules_employee_photo"
                     style={{backgroundImage: 'url(' + img + ')'}}
                     title={'Master: #' + employee.id + ' ' + employee.name}
                />
                <div className="col-md-8 schedule_employee_name mt-xs">{employee.name}</div>
            </td>
        );
        return columns;
    };

    renderDaysHeader = (datesInMonth) => {
        let headers = [];

        for (let i = 1; i <= datesInMonth; i++) {
            let date = new Date();
            date.setDate(i);
            let dateNum = i;
            if (i < 10) {
                dateNum = '0' + i;
            }

            let dateHead = dateNum + ' ' + date.toLocaleString('Ru-ru', {weekday: 'short'});
            headers.push(
                <th key={'dates_' + i} style={{width: '2%'}}>{dateHead}</th>
            )
        }

        return headers;
    };

    renderDaysBodyAll = (datesInMonth) => {
        let data = [];
        this.state.work_schedule.map((post, idx) => {
            if (idx > 0 && post.group_employees.length > 0) {
                data.push(
                    <tr className="schedule-body-category-tr" key={'post_' + idx}>
                        <td colSpan={datesInMonth + 1} style={{borderLeft: '0px'}}></td>
                    </tr>
                );
            }

            post.group_employees.map((empl, empl_id) => {
                data.push(
                    <tr className="schedule-body-tr" key={idx + '_employee_' + empl_id}>
                        {this.renderEmployeeRow(empl.employee, datesInMonth, idx, empl_id, empl.days, empl.working_time, 'all')}
                    </tr>
                );
            });
        });

        return data;
    };

    renderDaysBody = (employees, datesInMonth) => {
        return employees.map((empl, empl_id) => {
            return (
                <tr className="schedule-body-tr" key={empl_id}>
                    {this.renderEmployeeRow(empl.employee, datesInMonth, 0, empl_id, empl.days, empl.working_time, 'other')}
                </tr>
            )
        })
    };

    formatMonth = (date) => {
        return date.toLocaleString('Ru-ru', {month: 'long'}) + '/' + date.getFullYear();
    };

    daysInMonth = () => {
        let date = this.state.month;
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    renderTableBodyAll = (datesInMonth) => {
        let data = [];
        this.state.work_schedule.map((post, idx) => {
            if (idx > 0 && post.group_employees.length > 0) {
                data.push(
                    <tr className="schedule-body-category-tr" key={'post_' + idx}>
                        <td colSpan={datesInMonth + 1}
                            style={{fontWeight: 'bold', marginLeft: '20px', borderRight: '0px'}}>
                            {post.group_name}
                        </td>
                    </tr>
                );
            }

            post.group_employees.map((empl, empl_id) => {
                data.push(
                    <tr className="schedule-body-tr" key={idx + '_employee_' + empl_id}>
                        {this.renderFullName(empl.employee)}
                    </tr>
                );
            });
        });

        return data;
    };

    renderTableBody = (employees) => {
        return employees.map((empl, empl_id) => {
            return (
                <tr className="schedule-body-tr" key={empl_id}>
                    {this.renderFullName(empl.employee)}
                </tr>
            )
        })
    };

    renderEmployeeRow = (employee, datesInMonth, post_idx, empl_idx, days, time, type) => {
        let columns = [];
        let i = 1;
        let date = this.state.month;

        let classN = '';
        while (datesInMonth >= i) {
            let time_w = 'Не работает';
            time.map((t) => {
                if (t.day === i) {
                   time_w = 'Время работы: c ' + t.begin + ' по ' + t.end;
                }
            });

            if (days.includes(i)) {
                classN = 'schedule_active';
            } else {
                classN = '';
            }
            date.setDate(i);
            let weekDay = date.toLocaleString('Ru-ru', {weekday: 'short'});
            columns.push(
                <td className={"schedule " + classN} id={i} key={i} title={time_w}
                    style={weekDay === 'Сб' || weekDay === 'Вс' ? {backgroundColor: 'rgb(235,235,235)'} : {}}
                    onClick={(e) => {
                        date.setDate(+e.target.id);
                        let data = {
                            'employee_id': employee.staff_id,
                            'working_day': FORMAT_DATE(date)
                        };

                        let schedule;

                        switch (type) {
                            case 'all':
                                schedule = this.state.work_schedule;
                                break;
                            case 'other':
                                schedule = this.state.work_schedule_post;
                            default: break;
                        }

                        if (!days.includes(+e.target.id)) {
                            schedule[post_idx].group_employees[empl_idx].days.push(+e.target.id);
                        } else {
                            schedule[post_idx].group_employees[empl_idx].days = schedule[post_idx].group_employees[empl_idx].days.filter((d) => (d !== +e.target.id));
                        }

                        switch (type) {
                            case 'all':
                                this.setState({work_schedule: schedule});
                                break;
                            case 'other':
                                this.setState({work_schedule_post: schedule});
                            default: break;
                        }

                        this.props.onAddWorkingDay(data);
                    }}></td>
            );
            i++;
        }

        return columns;
    };

    saveTime = () => {
        let data = {
            'employee_id': this.state.schedule.employee_id,
            'time_from': this.state.schedule.time_from,
            'time_to': this.state.schedule.time_to,
        };

        this.props.onChangeWorkingHours(data);
        $('#ModalAddTime').modal('hide');
    };

    cancelAdding = () => {

    };

    onChangeWorkingTime = (date, name) => {
        let schedule = this.state.schedule;
        switch (name) {
            case 'time_from':
                schedule.time_from = FORMAT_TIME_WITHOUT_SECONDS(date);
                this.setState({
                    schedule: schedule
                });
                break;
            case 'time_to':
                schedule.time_to = FORMAT_TIME_WITHOUT_SECONDS(date);
                this.setState({
                    schedule: schedule
                });
                break;
            default:
                break;
        }
    };

    onItemSelect = (selected) => {
        this.setState({selected_key: selected.id});
        let date = this.state.month;
        date.setDate(1);
        selected.id !== 0 ? this.props.onSelectCategory(selected.item.path, FORMAT_DATE(date)) : this.props.onLoadSchedule(FORMAT_DATE(date));
    };

    dataToEmployees = (employees_grops) => {
        return employees_grops.map((group) => {
            return {
                group_name: group.post_name,
                group_employees: group.employees.map((empl) => {
                    return {
                        employee: empl,
                        days: empl.schedule.map((day) => {
                            return day.date;
                        }),
                        working_time: empl.schedule.map((day) => {
                            return {
                                day: day.date,
                                begin: day.begin,
                                end: day.end
                            };
                        })
                    }
                })
            }
        });
    };

    onePostEmployees = (post) => {
        let data = [];
        data.push({
            group_name: post.post_name,
            group_employees: post.employees.map((empl) => {
                return {
                    employee: empl,
                    days: empl.schedule.map((day) => {
                        return day.date;
                    }),
                    working_time: empl.schedule.map((day) => {
                        return {
                            day: day.date,
                            begin: day.begin,
                            end: day.end
                        };
                    })
                }
            })
        });

        return data;
    };

    mapToDataCategories = (categories, category_id) => {
        const loadNodes = (items) => {
            return items.map((item, idx) => {
                if (item.items) {
                    return {
                        item: item,
                        id: idx,
                        text: item.post_name,
                        children: loadNodes(item.items),
                        state: idx === category_id ? {
                                opened: true,
                                selected: true,
                                disabled: this.state.load
                            } : {
                                opened: true,
                                selected: false,
                                disabled: this.state.load
                            }

                    };
                }
                return {
                    item: item,
                    id: idx,
                    text: item.post_name,
                    type: 'file',
                    state: idx === category_id ? {
                            selected: true,
                            disabled: this.state.load
                        } : {
                            selected: false,
                            disabled: this.state.load
                        }
                };
            });
        };
        return loadNodes(categories);
    };

    componentDidMount() {
        let date = new Date();
        date.setDate(1);
        this.props.onLoadSchedule(FORMAT_DATE(date));
        $('.date').datetimepicker(
            {
                locale: 'ru',
                viewMode: 'years',
                format: 'MMMM/YYYY'
            }
        )
            .off('dp.change').on('dp.change', (e) => {
            this.props.onLoadSchedule(FORMAT_DATE(e.date._d));
            this.setState({
                month: e.date._d,
            });
        });
    }
}

WorkSchedule.propTypes = {
    onLoadSchedule: PropTypes.func.isRequired,
    onSelectCategory: PropTypes.func.isRequired,
    onAddWorkingDay: PropTypes.func.isRequired,
    onChangeWorkingHours: PropTypes.func.isRequired,
    work_schedule: PropTypes.array.isRequired,
    employees_groups: PropTypes.array.isRequired,
};

export default WorkSchedule;
