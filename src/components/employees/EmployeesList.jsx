import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepAssign from 'deep-assign';
import TreeView from '../commons/TreeView';
import EmployeesEdit from './EmployeesEdit';
import EmployeeGorupEdit from './EmployeeGorupEdit';
import AddEmployeeGroup from './AddEmployeeGroup';
import EmployeesSchedule from './EmployeesSchedule';
import PaymentSchemeModal from './PaymentSchemeModal';
import CumSchemeModal from './CumSchemeModal';
import PercentSchemeModal from './PercentSchemeModal';

import { Dropdown, Menu } from 'antd';

const $ = window.$;

const groupInitial = {
    name: ''
};
const selectedGroupAllInitial = {
    view: false,
    export: false,
    create: false,
    delete: false,
    edit: false
};

const defPercentSchemeForm = {
    name: { value: undefined },
    shortName: { value: undefined },
    isCalculFromCardCost: { value: undefined },
    isSaleToClient: { value: undefined },
    isBonusSum: { value: undefined },
    isSertificateSum: { value: undefined },
    isPersFromSum: { value: undefined },
    persFromSum: { value: undefined },
    costKindId: { value: undefined },
    isPersFromPrice: { value: undefined },
    persFromPrice: { value: undefined },
    isPersFromCost: { value: undefined },
    persFromCost: { value: undefined },
    isPersFromFactCost: { value: undefined },
    persFromFactCost: { value: undefined },
    persFromPlanCost: { value: undefined },
    isPersFromPlanCost: { value: undefined },
    additUAH: { value: undefined },
    isAdditUAH: { value: undefined },
    additHour: { value: undefined },
    isAdditHour: { value: undefined },
    isAdditMinute: { value: undefined },
    additMinute: { value: undefined }
};

class EmployeesList extends Component {
    state = {
        openTree: true,
        selected_group: {
            role_name: '',
            role_id: ''
        },
        selected_group_all: selectedGroupAllInitial,
        newGroup: deepAssign({}, groupInitial),
        errors: {},
        selectMenu: false,
        showPaySchemes: false,
        showCumScheme: false,
        showPerScheme: false,
        percentSchemeForm: { ...defPercentSchemeForm }
    };

    componentDidMount() {
        this.props.onLoad();
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.selected_group !== nextProps.selected_group) {
            nextState.selected_group = nextProps.selected_group;
        }

        if (nextProps.categories) {
            nextState.categories = this.mapToDataCategories(nextProps, nextState);
        }
    }
    componentDidUpdate(prevProps){
        if (this.props.categories.length !== 0
            && prevProps.categories.length === 0) {
            setTimeout(()=>{document.getElementById(`${this.props.categories[0]
                .staff[0].employee_id}_employee_anchor`)
                .click()}, 300)
        }
    }

    componentWillUnmount() {
        this.props.clearEmployeesInitialState();
    }

    checkAllTable = obj => {
        this.setState({
            selected_group_all: {
                ...this.state.selected_group_all,
                ...obj
            }
        });
    };

    renderContentData = () => {
        if (this.props.showForm === 0) {
            return (
                <EmployeesEdit
                    employee={this.props.employee}
                    salons={this.props.salons}
                    posts={this.props.posts}
                    roles={this.props.roles}
                    payments={this.props.payments}
                    tags={this.props.tags_list}
                    tags_bad={this.props.tags_bad}
                    tags_good={this.props.tags_good}
                    status_family={this.props.status_family}
                    errors={this.props.errors}
                    photo={this.props.photo}
                    router={this.props.router}
                    cancelEmployeeEdit={this.cancelEmployeeEdit}
                    onEditEmployee={this.props.onEditEmployee}
                    onEditSalary={this.props.onEditSalary}
                    onLoadDataForEdit={this.props.onLoadDataForEdit}
                    onUploadImage={this.props.onUploadImage}
                    onCheckData={this.props.onCheckData}
                    onNotifyShow={this.props.onNotifyShow}
                    onShowSchemeModal={() => {
                        this.setState({ showPaySchemes: true });
                    }}
                />
            );
        }

        if (this.props.showForm === 1) {
            const categories = this.props.categories.map(item => {
                return { id: item.role_id, name: item.role_name };
            });
            return (
                <EmployeeGorupEdit
                    selected_group={this.state.selected_group}
                    selected_group_all={this.state.selected_group_all}
                    inputGroupChanged={this.inputGroupChanged}
                    saveEmplGroup={this.saveEmplGroup}
                    onDeleteGorup={this.onDeleteGorup}
                    router={this.props.router}
                    groupEmoloyees={this.getGroupEmployees()}
                    onLoadModules={this.props.onLoadModules}
                    modules={this.props.modules}
                    onAddEmployee={this.props.onAddNewEmployee}
                    categories={categories}
                    onLoadEmployee={this.props.onLoadEmployee}
                    onSelectGroup={this.onItemTreeClick}
                    checkAllTable={this.checkAllTable}
                    onLoadSchedule={this.props.onLoadSchedule}
                />
            );
        }

        if (this.props.showForm === 2) {
            return (
                <EmployeesSchedule
                    onUpdateEmployeeShedule={this.props.onUpdateEmployeeShedule}
                    schedule={this.props.schedule}
                    types={this.props.types}
                    groupEmoloyees={this.getScheduleEmployees()}
                    onLoadScheduleData={this.onLoadScheduleData}
                />
            );
        }
    };

    //EVENTS//
    cancelEmployeeEdit = () => {
        this.setState({ showForm: '' });
    };

    addEmployeeCategory = () => {
        this.props.onAddEmployeesGroup(this.state.newGroup);
        $('#ModalAddEmployeeCategory').modal('hide');
    };

    cancelAddingEmplGroup = () => {
        this.setState({ newGroup: groupInitial });
        $('#ModalAddEmployeeCategory').modal('hide');
    };

    inputNewGroupChanged = e => {
        this.setState({
            newGroup: {
                name: e.target.value
            }
        });
        if (this.props.categories.some(item => item.role_name === e.target.value)) {
            const errors = {};
            errors[e.target.name] = {};
            errors[e.target.name].message = 'Такое имя уже используется';
            this.setState({ errors });
        } else {
            this.setState({ errors: {} });
        }
    };

    getGroupEmployees = () => {
        let employees = [];
        this.props.categories.map(group => {
            if (group.role_id === this.state.selected_group.role_id) {
                employees = group.staff;
            }
        });
        return employees;
    };

    getScheduleEmployees = () => {
        let employees = [];
        this.props.categories.forEach(group => {
            if (group.staff && group.staff.length !== 0) {
                employees = [...employees, ...group.staff];
            }
        });
        return employees;
    };

    saveEmplGroup = data => {
        const res = data.map(item => {
            let act = item.actions.map(action => {
                return { action_id: action.action_id, is_active: action.is_active };
            });
            if (item.subModules && item.subModules.actions) {
                let items = item.subModules.map(sub => {
                    let actions = sub.actions.map(action => {
                        return { action_id: action.action_id, is_active: action.is_active };
                    });
                    return { component_id: sub.id, actions: actions };
                });

                return { component_id: item.id, actions: act, items: items };
            } else {
                return { component_id: item.id, actions: act, items: [] };
            }
        });

        const result = {
            name: this.state.selected_group.role_name,
            permissions: res
        };
        this.props.onEditEmployeesGroup(result, this.state.selected_group.role_id);
    };

    onDeleteGorup = () => {
        this.setState({
            selected_group: {
                role_name: '',
                role_id: ''
            }
        });
    };

    inputGroupChanged = e => {
        this.setState({
            selected_group: {
                ...this.state.selected_group,
                role_name: e.target.value
            }
        });
    };

    mapToDataCategories = (props, state) => {
        const { categories, loading } = props;
        const { selected_group, openTree } = state;
        const loadNodes = items => {
            return items.map(item => {
                if (item.role_id) {
                    return {
                        id: item.role_id,
                        item: item,
                        text: item.role_name,
                        children: loadNodes(item.staff),
                        state:
                            item.role_id === selected_group.role_id
                                ? {
                                      opened: (item.state && item.state.opened) || (openTree ? true : false),
                                      selected: true,
                                      disabled: loading
                                  }
                                : {
                                      opened: (item.state && item.state.opened) || (openTree ? true : false),
                                      selected: false,
                                      disabled: loading
                                  }
                    };
                }

                return {
                    item: item,
                    id: item.employee_id + '_employee',
                    empl_id: item.employee_id,
                    text: item.employee_name,
                    type: 'file',
                    state:
                        item.employee_id === selected_group.role_id
                            ? {
                                  selected: true,
                                  disabled: loading
                              }
                            : {
                                  selected: false,
                                  disabled: loading
                              }
                };
            });
        };

        return loadNodes(categories);
    };

    onItemTreeClickFirst = (category, role_id) => {
        this.props.onLoadEmployee(category.employee_id);
        this.setState({
            selected_group_all: selectedGroupAllInitial,
            selected_group: {
                role_id: `${role_id}_employee`,
                role_name: category.employee_name,
                edit: false
            }
        });
    };

    onItemTreeClick = category => {
        if (category.type) {
            this.props.onLoadEmployee(category.empl_id);
        } else if (category.id) {
            this.props.onEmployeesGroupSelect(category.id);
        }
        this.setState({
            selected_group_all: selectedGroupAllInitial,
            selected_group: {
                role_id: +category.id || category.role_id || category.empl_id,
                role_name: category.text || category.role_name,
                permissions: this.state.selected_group.permissions,
                edit: false
            }
        });
    };

    onEditCategory = category => {
        this.setState({
            selected_group: {
                role_id: +category.id || category.role_id,
                role_name: category.text || category.role_name,
                permissions: this.state.selected_group.permissions,
                edit: true
            }
        });
    };

    changeFields = (changedFields, formName) => {
        this.setState({
            [formName]: {
                ...this.state[formName],
                ...changedFields
            }
        });
    };

    onLoadScheduleData = date => {
        const firstDay = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + 1;
        this.props.onLoadScheduleTypes();
        this.props.onLoadEmployeeSchedule(firstDay);
    };

    render() {
        console.log('RENDER', this.state);
        const { showPaySchemes, showCumScheme, showPerScheme, percentSchemeForm } = this.state;
        const menu = (
            <Menu className="payment-scheme-dropdown">
                <Menu.Item>
                    <a href="#">Премии за продажу</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="#">Оплата за услуги</a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            this.setState({ showPaySchemes: true });
                        }}
                    >
                        Схемы оплаты
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <section className="content-with-menu">
                <menu className="modal fade">
                    <ul>
                        <li>Премии за продажу</li>
                        <li>Оплата за услуги</li>
                        <li>Схемы оплаты</li>
                    </ul>
                </menu>
                <AddEmployeeGroup
                    newGroup={this.state.newGroup}
                    addEmployeeCategory={this.addEmployeeCategory}
                    cancelAddingEmplGroup={this.cancelAddingEmplGroup}
                    inputNewGroupChanged={this.inputNewGroupChanged}
                    errors={this.state.errors}
                />

                {showPaySchemes && (
                    <PaymentSchemeModal
                        onModalClose={() => {
                            this.setState({ showPaySchemes: false });
                        }}
                        onSelectScheme={schemeNum => {
                            this.setState({ showPaySchemes: false });
                            switch (schemeNum) {
                                case 1:
                                    this.setState({ showPerScheme: true });
                                    break;
                                case 2:
                                    this.setState({ showCumScheme: true });
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                )}

                {showCumScheme && (
                    <CumSchemeModal
                        onModalClose={() => {
                            this.setState({ showCumScheme: false });
                        }}
                    />
                )}

                {showPerScheme && (
                    <PercentSchemeModal
                        onModalClose={() => {
                            this.setState({
                                showPerScheme: false,
                                percentSchemeForm: { ...defPercentSchemeForm }
                            });
                        }}
                        onSave={() => {}}
                        fields={percentSchemeForm}
                        onChange={value => {
                            this.changeFields(value, 'percentSchemeForm');
                        }}
                    />
                )}

                <div className="content-with-menu-container">
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content pt-lg">
                                <div className="inner-menu-content">
                                    <div className="row margin-none">
                                        <div className="col-md-12 text-center">
                                            <a
                                                className="btn btn-primary employee-schedule-button"
                                                href=""
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.onLoadScheduleData(new Date());
                                                }}
                                            >
                                                <span>
                                                    <i className="fa fa-calendar" aria-hidden="true" />
                                                </span>
                                                &nbsp;&nbsp;График работы
                                            </a>
                                            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
                                                <a
                                                    className="employee-shedule-menu-btn text-free"
                                                    href=""
                                                    onClick={e => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                    <span>
                                                        <i className="fa fa-cog employee-list-cog-icon" aria-hidden="true" />
                                                    </span>
                                                </a>
                                            </Dropdown>
                                        </div>
                                    </div>

                <div className="sidebar-widget m-none">
                  <div className="widget-header">
                    <a href="#" className="toggle-link" onClick={e => {
                      e.preventDefault();
                      this.setState({
                        openTree: !this.state.openTree
                      });
                    }}>
                      {
                        this.state.openTree
                          ? (<i className="fa fa-caret-down" aria-hidden="true" style={{
                          marginRight: 5
                        }}/>)
                          : (<i className="fa fa-caret-right" aria-hidden="true" style={{
                          marginRight: 5
                        }}/>)
                      }
                      <h6 className="title" style={{
                        paddingTop: 5,
                        display: "inline-block"
                      }}>
                        КАТЕГОРИИ
                      </h6>
                    </a>
                    <i className="fa fa-plus-circle " aria-hidden="true" onClick={() => {
                      $("#ModalAddEmployeeCategory").modal("show");
                    }} style={{
                      marginLeft: 15,
                      color: "#e58c8c",
                      cursor: "pointer"
                    }}/>
                  </div>
                  <div className="widget-content">
                    <TreeView
                        first = {true}
                        items={this.state.categories}
                        onItemSelect={this.onItemTreeClick}
                        closeNode={() => {}}
                        onCloseNode={() => {}}
                        onOpenNode={() => {}}
                        onEditCategory={this.onEditCategory}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </menu>
        <div className="inner-body mg-main">
          {this.renderContentData()}
        </div>
      </div>
    </section>);
  }
}

EmployeesList.propTypes = {
    onLoad: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    employee: PropTypes.object.isRequired,
    salons: PropTypes.array.isRequired,
    posts: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    payments: PropTypes.array.isRequired,
    tags_list: PropTypes.array.isRequired,
    tags_bad: PropTypes.array.isRequired,
    modules: PropTypes.array.isRequired,
    tags_good: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    onEditEmployee: PropTypes.func.isRequired,
    onCheckData: PropTypes.func.isRequired,
    onUploadImage: PropTypes.func.isRequired,
    onLoadEmployee: PropTypes.func.isRequired,
    onLoadModules: PropTypes.func.isRequired,
    onLoadDataForEdit: PropTypes.func.isRequired,
    onAddEmployeesGroup: PropTypes.func.isRequired,
    onEmployeesGroupSelect: PropTypes.func.isRequired,
    onEditEmployeesGroup: PropTypes.func.isRequired,
    clearEmployeesInitialState: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onEditSalary: PropTypes.func.isRequired
};

export default EmployeesList;
