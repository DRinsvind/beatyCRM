import React, { Component } from "react";
import PropTypes from "prop-types";

const initialCategories = [
    {
        name: "Руководители",
        permissions: [
            {
                items: [],
                component_id: 1,
                component_name: "Login",
                actions: [
                    { action_id: 2, is_active: true },
                    { action_id: 4, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            },
            {
                items: [],
                component_id: 26,
                component_name: "Товары",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            },
            {
                items: [],
                component_id: 28,
                component_name: "Поставщики",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            },
            {
                items: [],
                component_id: 27,
                component_name: "Склад",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            }
        ]
    },

    {
        name: "Администраторы",
        permissions: [
            {
                items: [],
                component_id: 1,
                component_name: "Login",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            },
            {
                items: [],
                component_id: 26,
                component_name: "Товары",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 28,
                component_name: "Поставщики",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 27,
                component_name: "Склад",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            }
        ]
    },

    {
        name: "Мастера",
        permissions: [
            {
                items: [],
                component_id: 1,
                component_name: "Login",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 26,
                component_name: "Товары",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            },
            {
                items: [],
                component_id: 28,
                component_name: "Поставщики",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 27,
                component_name: "Склад",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            }
        ]
    },

    {
        name: "Ассистенты",
        permissions: [
            {
                items: [],
                component_id: 1,
                component_name: "Login",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 26,
                component_name: "Товары",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 28,
                component_name: "Поставщики",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            },
            {
                items: [],
                component_id: 27,
                component_name: "Склад",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            }
        ]
    },

    {
        name: "Технический персонал",
        permissions: [
            {
                items: [],
                component_id: 1,
                component_name: "Login",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 26,
                component_name: "Товары",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 28,
                component_name: "Поставщики",
                actions: [
                    { action_id: 4, is_active: false },
                    { action_id: 2, is_active: false },
                    { action_id: 3, is_active: false },
                    { action_id: 7, is_active: false },
                    { action_id: 1, is_active: false }
                ]
            },
            {
                items: [],
                component_id: 27,
                component_name: "Склад",
                actions: [
                    { action_id: 4, is_active: true },
                    { action_id: 2, is_active: true },
                    { action_id: 3, is_active: true },
                    { action_id: 7, is_active: true },
                    { action_id: 1, is_active: true }
                ]
            }
        ]
    }
];

class EmployeeGorupEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: this.props.selected_group_all.view,
            //export: this.props.selected_group_all.export,
            create: this.props.selected_group_all.create,
            delete: this.props.selected_group_all.delete,
            edit: this.props.selected_group_all.edit,
            editable: this.props.selected_group.edit,
            modules: this.modulesToData(this.props.selected_group.permissions),
            categories: initialCategories
        };
    }

    componentDidMount() {
        this.props.onLoadModules();
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            this.props.selected_group.permissions !==
            nextProps.selected_group.permissions
        ) {
            nextState.modules = this.modulesToData(
                nextProps.selected_group.permissions
            );
        }
        if (this.props.selected_group.edit !== nextProps.selected_group.edit) {
            nextState.editable = nextProps.selected_group.edit;
        }
        if (this.props.selected_group_all !== nextProps.selected_group_all) {
            nextState.view = nextProps.selected_group_all.view;
            nextState.edit = nextProps.selected_group_all.edit;
            //nextState.export = nextProps.selected_group_all.export;
            nextState.create = nextProps.selected_group_all.create;
            nextState.delete = nextProps.selected_group_all.delete;
        }
    }

    getSubModules = subModules => {
        return subModules.map(sub => {
            return {
                id: sub.component_id,
                module: sub.component_name,
                view: sub.actions[0].is_active,
                edit: sub.actions[1].is_active,
                delete: sub.actions[2].is_active,
                //export: sub.actions[3].is_active,
                create: sub.actions[4].is_active
            };
        });
    };

    modulesToData = modules => {
        let newModules = [];

        modules &&
            modules.map(item => {
                let newItem = {
                    id: item.component_id,
                    module: item.component_name,
                    actions: item.actions
                };
                if (item.items && item.items.length > 0) {
                    newItem = {
                        ...newItem,
                        subModules: this.getSubModules(item.items)
                    };
                }

                newModules = [...newModules, newItem];
            });

        return newModules;
    };

    renderCheckbox = (label, id, checked, all, name) => {
        return (
            <div className="checkbox-custom-employee checkbox-primary-employee">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={() => {
                        let modules = this.state.modules;
                        if (all === "all") {
                            this.checkAll(modules, id, checked, name);
                        } else {
                            this.checkOne(modules, id, checked, all, name);
                        }
                    }}
                />
                <label style={{ fontSize: "14px" }}>{label}</label>
            </div>
        );
    };

    categoryRadioBox = (item, key) => {
        return (
            <div key={key} className="employee-radio-container">
                <label style={{ fontSize: "13px", fontWeight: "700" }}>
                    {item.name}
                    <input
                        type="radio"
                        name="radioEmployee"
                        key={key}
                        value={item.name}
                        onClick={e => {
                            this.state.categories.forEach(item => {
                                item.name === e.target.value &&
                                    this.setState({
                                        modules: this.modulesToData(
                                            item.permissions
                                        )
                                    });
                            });
                        }}
                    />
                    <span className="employee-radio-checkmark" />
                </label>
            </div>
        );
    };

    checkAll = (modules, action_id, checked, name) => {
        modules = modules.map(module => {
            let actions = module.actions.map(action => {
                if (action.action_id === action_id) {
                    return {
                        ...action,
                        is_active: !checked
                    };
                } else {
                    return action;
                }
            });

            if (
                module.subModules &&
                module.subModules.length > 0 &&
                module.subModules.actions
            ) {
                module.subModules = module.subModules.map(sub => {
                    let actions = module.actions.map(action => {
                        if (action.action_id === action_id) {
                            return {
                                ...action,
                                is_active: !checked
                            };
                        } else {
                            return action;
                        }
                    });
                });
            }

            module = { ...module, actions };
            return module;
        });
        this.props.checkAllTable({
            //modules: modules,
            [name]: !checked
        });
        this.setState({
            modules: modules
            //[name]: !checked
        });
    };

    checkOne = (modules, action_id, checked, id, name) => {
        modules = modules.map(module => {
            let mod = { ...module };
            if (id === module.id) {
                let actions = module.actions.map(action => {
                    if (action.action_id === action_id) {
                        return {
                            ...action,
                            is_active: !checked
                        };
                    } else {
                        return action;
                    }
                });
                return {
                    ...module,
                    actions
                };
            } else if (
                module.subModules &&
                module.subModules.length > 0 &&
                module.subModules.actions
            ) {
                mod.subModules = module.subModules.map(sub => {
                    if (id === sub.id) {
                        let actions = module.actions.map(action => {
                            if (action.action_id === action_id) {
                                return {
                                    ...action,
                                    is_active: !checked
                                };
                            } else {
                                return action;
                            }
                        });
                    }
                });
            } else {
                return module;
            }
        });
        this.setState({
            modules: modules
        });
    };

    renderTableRows = () => {
        let uiRows = [];
        const getRows = (modules, type) => {
            modules.forEach(module => {
                if (type === "module") {
                    uiRows = [...uiRows, this.rederModule(module)];
                    if (
                        module.subModules &&
                        module.subModules.length > 0 &&
                        module.subModules.actions
                    ) {
                        getRows(module.subModules, "sub");
                    }
                } else {
                    uiRows = [...uiRows, this.rederSubModule(module)];
                }
            });
        };
        getRows(this.state.modules, "module");
        return uiRows;
    };

    rederModule = module => {
        return (
            <tr
                key={"module_" + module.id}
                style={{ backgroundColor: "rgb(240, 240, 240)" }}
            >
                <td className="borderless-left-right">
                    <label className="empl-access-label">{module.module}</label>
                </td>
                <td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        4,
                        module.actions[0].is_active,
                        module.id,
                        "view"
                    )}
                </td>
                <td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        2,
                        module.actions[1].is_active,
                        module.id,
                        "edit"
                    )}
                </td>
                {/*<td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        7,
                        module.actions[3].is_active,
                        module.id,
                        "export"
                    )}
                </td>*/}
                <td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        1,
                        module.actions[4].is_active,
                        module.id,
                        "create"
                    )}
                </td>
                <td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        3,
                        module.actions[2].is_active,
                        module.id,
                        "delete"
                    )}
                </td>
            </tr>
        );
    };

    rederSubModule = module => {
        return (
            <tr key={"module_" + module.id}>
                <td className="borderless-left-right">
                    <label className="ml-md">{module.module}</label>
                </td>
                <td className="borderless-left-right">
                    {this.renderCheckbox("", 4, module.view, module.id, "view")}
                </td>
                <td className="borderless-left-right">
                    {this.renderCheckbox("", 2, module.edit, module.id, "edit")}
                </td>
                {/*<td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        7,
                        module.export,
                        module.id,
                        "export"
                    )}
                </td>*/}
                <td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        1,
                        module.create,
                        module.id,
                        "create"
                    )}
                </td>
                <td className="borderless-left-right">
                    {this.renderCheckbox(
                        "",
                        3,
                        module.delete,
                        module.id,
                        "delete"
                    )}
                </td>
            </tr>
        );
    };

    clearForm = () => {
        const initialState = {
            view: false,
            //export: false,
            create: false,
            delete: false,
            edit: false,
            editable: this.props.selected_group.edit,
            modules: this.modulesToData(this.props.selected_group.permissions),
            categories: initialCategories
        };
        this.setState(initialState);
        const ele = document.getElementsByName("radioEmployee");
        for (var i = 0; i < ele.length; i++) ele[i].checked = false;
    };

    renderCategories = () => {
        const x = this.state.categories.map((item, key) => {
            return this.categoryRadioBox(item, key);
        });
        return x;
    };

    render() {
        const table_rows = this.renderTableRows();
        const disablCont = !this.props.selected_group.edit
            ? { pointerEvents: "none" }
            : {};
        const displayNone = !this.props.selected_group.edit
            ? { display: "none" }
            : {};
        const displayNoneCancelButton = !this.props.selected_group.edit
            ? { display: "none" }
            : { backgroundColor: "rgba(211, 211, 211, 0.7)", color: "white" };
        return (
            <div className="row">
                <div className="col-md-12">
                    <section style={disablCont}>
                        <header className="panel-heading">
                            <div
                                className="pull-right"
                                style={{ position: "relative", top: "-6px" }}
                            >
                                <button
                                    className="btn btn-primary mr-xs pull-right"
                                    onClick={e => {
                                        this.props.onAddEmployee(
                                            this.props.selected_group.role_id
                                        );
                                        this.props.router.push(
                                            "/employees/add/"
                                        );
                                    }}
                                    style={displayNone}
                                >
                                    <i className="fa fa-fw fa-plus" />&nbsp;Добавить
                                </button>
                                {/*<a style={{marginRight: "5px"}}
                                    className="btn btn-primary"
                                    href=""
                                    onClick={e => {
                                        e.preventDefault();
                                        this.props.onLoadSchedule();
                                    }}
                                >
                                    График работы
                                </a>*/}
                            </div>
                            <h2
                                className="panel-title"
                                style={{
                                    display: "inline-block",
                                    width: "20%",
                                    fontWeight: "600"
                                }}
                            >
                                Права доступа
                            </h2>
                            <h2
                                className="panel-title"
                                style={{
                                    display: "inline-block",
                                    fontWeight: "600"
                                }}
                            >
                                {this.props.selected_group.role_name}
                            </h2>
                        </header>
                        <div
                            className="panel-body"
                            style={{ padding: "0px 0px 7px 0px" }}
                        >
                            <div
                                className="row"
                                style={{ display: "table-row" }}
                            >
                                <div
                                    className="col-md-2 no-float"
                                    style={{
                                        backgroundColor: "rgb(240, 240, 240)",
                                        position: "relative",
                                        top: "1px"
                                    }}
                                >
                                    <div style={{position:"relative", top:"23px"}}>
                                        <div className="form-group">
                                            {this.renderCategories()}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8 empl-group no-float">
                                    <table className="table mb-none">
                                        <thead>
                                            <tr
                                                style={{
                                                    backgroundColor:
                                                        "rgba(211,211,211, 0.1)",
                                                    borderStyle: "hidden"
                                                }}
                                            >
                                                <td className="borderless-left-right" />
                                                <td className="borderless-left-right">
                                                    <i
                                                        className="fa fa-search"
                                                        aria-hidden="true"
                                                    />
                                                </td>
                                                <td className="borderless-left-right">
                                                    <i
                                                        className="fa fa-pencil-square-o"
                                                        aria-hidden="true"
                                                    />
                                                </td>
                                                {/*<td className="borderless-left-right">
                                                    <i
                                                        className="fa fa-files-o"
                                                        aria-hidden="true"
                                                    />
                                                </td>*/}
                                                <td className="borderless-left-right">
                                                    <i
                                                        className="fa fa-pencil"
                                                        aria-hidden="true"
                                                    />
                                                </td>
                                                <td className="borderless-left-right">
                                                    <i
                                                        className="fa fa-trash-o"
                                                        aria-hidden="true"
                                                    />
                                                </td>
                                            </tr>
                                            <tr
                                                style={{
                                                    backgroundColor:
                                                        "rgba(211,211,211, 0.1)"
                                                }}
                                            >
                                                <td className="borderless-left-right">
                                                    <label
                                                        className="empl-access-label"
                                                        style={{
                                                            fontWeight: "bold",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        Модули
                                                    </label>
                                                </td>
                                                <td className="borderless-left-right">
                                                    {this.renderCheckbox(
                                                        "",
                                                        4,
                                                        this.props
                                                            .selected_group_all
                                                            .view,
                                                        "all",
                                                        "view"
                                                    )}
                                                </td>
                                                <td className="borderless-left-right">
                                                    {this.renderCheckbox(
                                                        "",
                                                        2,
                                                        this.props
                                                            .selected_group_all
                                                            .edit,
                                                        "all",
                                                        "edit"
                                                    )}
                                                </td>
                                                {/*<td className="borderless-left-right">
                                                    {this.renderCheckbox(
                                                        "",
                                                        7,
                                                        this.props
                                                            .selected_group_all
                                                            .export,
                                                        "all",
                                                        "export"
                                                    )}
                                                </td>*/}
                                                <td className="borderless-left-right">
                                                    {this.renderCheckbox(
                                                        "",
                                                        1,
                                                        this.props
                                                            .selected_group_all
                                                            .create,
                                                        "all",
                                                        "create"
                                                    )}
                                                </td>
                                                <td className="borderless-left-right">
                                                    {this.renderCheckbox(
                                                        "",
                                                        3,
                                                        this.props
                                                            .selected_group_all
                                                            .delete,
                                                        "all",
                                                        "delete"
                                                    )}
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>{table_rows}</tbody>
                                    </table>
                                </div>
                                <div className="col-md-2 no-float">
                                    <div className="form-group">
                                        <label className="control-label empl-access-label">
                                            Имя групы
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={
                                                this.props.selected_group
                                                    .role_name
                                            }
                                            onChange={
                                                this.props.inputGroupChanged
                                            }
                                        />
                                    </div>
                                    <div className="form-group mt-md">
                                        <label className="control-label empl-access-label">
                                            Сотрудники в группе
                                        </label>
                                    </div>
                                    {this.props.groupEmoloyees.map(
                                        (empl, eid) => {
                                            return (
                                                <div
                                                    className="row"
                                                    key={`employee_${eid}`}
                                                >
                                                    <div
                                                        className="col-md-12"
                                                        style={{
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        <label
                                                            style={{
                                                                color:
                                                                    "#e59f9f",
                                                                fontSize: 16
                                                            }}
                                                        >
                                                            {empl.employee_name}
                                                        </label>
                                                        <i
                                                            className="fa fa-pencil"
                                                            aria-hidden="true"
                                                            style={{
                                                                marginLeft:
                                                                    "10px",
                                                                opacity: "0.5",
                                                                cursor:
                                                                    "pointer"
                                                            }}
                                                            onClick={eid =>
                                                                this.props.onLoadEmployee(
                                                                    empl.employee_id
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="panel-footer">
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="btn btn-default mr-sm"
                                    onClick={() => {
                                        this.props.onSelectGroup(
                                            this.props.selected_group
                                        );
                                        this.clearForm();
                                    }}
                                    style={displayNoneCancelButton}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        this.props.saveEmplGroup(
                                            this.state.modules
                                        );
                                        this.clearForm();
                                    }}
                                    style={displayNone}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

EmployeeGorupEdit.propType = {
    selected_group: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    inputGroupChanged: PropTypes.func.isRequired,
    saveEmplGroup: PropTypes.func.isRequired,
    onDeleteGorup: PropTypes.func.isRequired,
    onLoadModules: PropTypes.func.isRequired,
    onAddEmployee: PropTypes.func.isRequired,
    groupEmoloyees: PropTypes.array.isRequired,
    modules: PropTypes.array.isRequired
};

export default EmployeeGorupEdit;
