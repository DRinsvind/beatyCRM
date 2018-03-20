import React, {Component} from "react";
import PropTypes from "prop-types";
import Select2 from "react-select2-wrapper";
import GeneralInfoBlock from "../commons/inputsForms/GeneralInfoBlock";
import OtherInfoBlock from "../commons/inputsForms/OtherInfoBlock";
import EmployeePosition from "../commons/inputsForms/EmployeePosition";
import AuthorizationInfoBlock from "../commons/inputsForms/AuthorizationInfoBlock";
import ContactInput from "../commons/inputsForms/ContactInput";
import {FORMAT_DATE, DEFINE_INT_NUMBER} from "../../utils/index";
import jQuery from "jquery";

const $ = window && window.jQuery
    ? window.jQuery
    : jQuery;

class EmployeeTabEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employee: props.employee,
            contacts: props.employee.contacts,
            tags_good: [],
            tags_bad: [],
            tags: [],
            employee_good_tags: [],
            employee_bad_tags: [],
            photo: props.photo,

            phones: [],
            emails: [],
            errors: props.errors,

            posts: [],
            changed: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.errors !== nextProps.errors) {
            nextState.errors = nextProps.errors;
        }

        if (this.state.employee !== nextProps.employee) {
            nextState.employee = nextProps.employee;
        }
        if (this.state.contacts !== nextProps.employee.contacts) {
            nextState.contacts = nextProps.employee.contacts;
        }
        if (this.state.tags !== nextProps.tags) {
            nextState.tags = nextProps.tags;
        }
        if (this.state.tags_bad !== nextProps.tags_bad) {
            nextState.tags_bad = nextProps.tags_bad;
        }
        if (this.state.tags_good !== nextProps.tags_good) {
            nextState.tags_good = nextProps.tags_good;
        }
    }

    componentDidUpdate(prevProps) {
        this.createPickers();
        if(this.props !== prevProps){
                this.updateTags(this.props);
        }
    }

    componentDidMount() {
        this.props.onLoadDataForEdit();
    }

    updateTags = (state) => {
        const basic = state.employee.basic.map(i=>{
            return i.tag_id || i;
        });
        const positive = state.employee.positive.map(i=>{
            return i.tag_id || i;
        });
        const negative = state.employee.negative.map(i=>{
            return i.tag_id || i;
        });
        $('#tags_select').val(basic);
        $('#tags_select').trigger("change");
        $('#good_tags_select').val(positive);
        $('#good_tags_select').trigger("change");
        $('#bad_tags_select').val(negative);
        $('#bad_tags_select').trigger("change");
    };

    render() {
        return (<div id="edit" className="tab-pane">
            <div className="form-horizontal">
                <div className="mb-xlg text-weight-bold">Персональная информация</div>
                <GeneralInfoBlock person={this.state.employee} errors={this.state.errors} inputChanged={this.onInputChanged} onFocusLos={this.onFocusLos} changeBirthday={this.onDateChange} clearBirthDay={this.clearDateData}/>
                <hr className="dotted tall"/> {this.renderTags("Заметки", "tags_select")}
                {this.renderTags("Сильные стороны", "good_tags_select")}
                {this.renderTags("Слабые стороны", "bad_tags_select")}
                <hr className="dotted tall"/>
                <div className="mb-xlg text-weight-bold">Контакты</div>
                <fieldset className="mb-xl fs-12">
                    {this.mapToDataPhones(this.state.contacts)}
                    {this.contactsButtonAdd(this.onPhoneAddClick, "Телефон")}
                    {this.mapToDataEmails(this.state.contacts)}
                    {this.contactsButtonAdd(this.onEmailAddClick, "Email")}
                </fieldset>
                <hr className="dotted tall"/>
                <div className="mb-xlg text-weight-bold">Занимаемые должности</div>
                <EmployeePosition posts={this.props.posts} salons={this.props.salons} selected_post={this.state.employee.post_id} selected_salon={this.state.employee.salon_id} errors={this.state.errors} date_beg={this.state.employee.date_beg
                        ? this.state.employee.date_beg.replace(/-/g, "/")
                        : ""
} date_end={this.state.employee.date_end
                        ? this.state.employee.date_end.replace(/-/g, "/")
                        : ""
} onPositionChanged={this.onPositionChanged} onClearDate={this.onClearDate}/>
                <hr className="dotted tall mb-md"/>
                <div className="mb-xlg text-weight-bold">Реквизиты</div>

                <OtherInfoBlock
                    person={this.state.employee}
                    errors={this.state.errors}
                    inputChanged={this.onInputChanged}
                    onFocusLos={this.onFocusLos}
                    onNumberInputChange={this.onNumberInputChange}
                    clearDateData={this.clearDateData}
                    changeDate={this.onDateChange}
                />

                <hr className="dotted tall mb-md"/>
                <div className="mb-xlg text-weight-bold">Дополнительно</div>
                <div className={"form-group fs-12" + (
                        this.state.errors["status_family"]
                        ? " has-error"
                        : "")}>
                    <label className="col-md-3 control-label">
                        Семейный статус
                    </label>
                    <div className="col-md-7">
                        <Select2 className="form-control fs-12" options={{
                                placeholder: "Семейный статус",
                                theme: "bootstrap"
                            }} name="status_family" value={(this.state.employee.status_family && this.state.employee.status_family.status_family_id) || this.state.employee.status_family
} data={this.props.status_family && this.props.status_family.map(item => {
                                return {id: item.status_family_id, text: item.status_family_name};
                            })
} onSelect={e => {
                                e.preventDefault();
                                this.setState({
                                    employee: {
                                        ...this.state.employee,
                                        status_family: e.target.value
                                    }
                                });
                            }}/>
                        <label className={this.state.errors["status_family"]
                                ? "control-label"
                                : "hidden"
}>
                            {
                                this.state.errors["status_family"]
                                    ? this.state.errors["status_family"].message
                                    : ""
                            }
                        </label>
                    </div>
                </div>

                <div className="form-group fs-12">
                    <label className="col-md-3 control-label">
                        Описание
                    </label>
                    <div className="col-md-7" style={{
                            textAlign: "right"
                        }}>
                        <textarea className="form-control fs-12" name="note" rows="4" onChange={this.onInputChanged} style={{
                                overflow: "hidden"
                            }} value={this.state.employee.note || ""}/>
                    </div>
                </div>

                <hr className="dotted tall mb-md"/>
                <div className="form-group mb-lg fs-12">
                    <label className="col-md-6 control-label pt-none">
                        Разрешить вход в систему
                    </label>
                    <div className="col-md-6" style={{
                            textAlign: "right"
                        }}>
                        <div className="checkbox-custom checkbox-primary center-block">
                            <input
                              type="checkbox"
                              name="access_allowed"
                              className="fs-12"
                              checked={this.state.employee.access_allowed} onChange={e => {
                                    let empl = this.state.employee;
                                    empl.access_allowed = e.target.checked;
                                    this.setState({employee: empl});
                                }}/>
                            <label/>
                        </div>
                    </div>
                </div>
                <div className={this.state.employee.access_allowed
                        ? ""
                        : "hidden"
}>
                    <div className="mb-xlg text-weight-bold">Авторизационная информация</div>
                    <AuthorizationInfoBlock employee={this.state.employee} errors={this.state.errors} roles_list={this.rolesToData(this.props.roles)} role_val={this.state.employee.role_id} onInputChanged={this.onInputChanged} onFocusLos={this.onFocusLos} onRoleSelect={this.onRoleSelect}/>
                </div>

                <div className="panel-footer">
                    <div className="row">
                        <div className="col-md-12 text-right">
                            <button type="button" className="btn btn-primary mr-sm" onClick={this.onSaveClick}>
                                <i className="fa fa-fw fa-save"/>
                                Сохранить
                            </button>
                            <button type="reset" className="btn btn-default" onClick={this.props.cancelEmployeeEdit}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }

    renderTags = (dataLabel, dataId) => {
        return (<fieldset className="mt-md">
            <div className="form-group">
                <label className="col-md-3 control-label">
                    {dataLabel}
                </label>
                <div className="col-md-7">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-fw fa-tags"/>
                        </span>
                        <select className="form-control" id={dataId}/>
                    </div>
                </div>
            </div>
        </fieldset>);
    };

    mapToDataPhones = contacts => {
        return (<ContactInput errors={this.state.errors} contacts={contacts} contact_type="PHONE" text="+380 (67) 123-12-34" label="Телефон" mask="+38 (099) 999-99-99" iclass="fa fa-fw fa-phone" id="phone_number" contactChanged={this.onContactChanged} onFocusLoss={this.onFocusLos} onContactTrashClick={this.onContactTrashClick}/>);
    };

    mapToDataEmails = contacts => {
        return (<ContactInput errors={this.state.errors} contacts={contacts} contact_type="EMAIL" text="email@com.ua" label="Email" mask="" iclass="fa fa-fw fa-envelope" id="email" contactChanged={this.onContactChanged} onFocusLoss={this.onFocusLos} onContactTrashClick={this.onContactTrashClick}/>);
    };

    contactsButtonAdd = (func, name) => {
        return (<div className="form-group mt-md">
            <div className="col-md-3"/>
            <div className="col-md-9">
                <button className="btn btn-primary" style={{
                        width: "30%"
                    }} onClick={func}>
                    <i className="fa fa-fw fa-plus"/> {name}
                </button>
            </div>
        </div>);
    };

    dataForTagsSelect = (tags, employee_tags) => {
        const data = [];

        tags.filter(tag => {
            let found = true;
            employee_tags.forEach(t => {
                if (tag.tag_id === t.tag_id) {
                    found = false;
                    data.push({id: tag.tag_id, text: tag.tag_name, selected: true});

                }
            });

            if (found) {
                data.push({id: tag.tag_id, text: tag.tag_name});
            }
        });

        return data;
    };

    rolesToData = roles => {
        if (roles) {
            return roles.map(role => {
                return {id: role.role_id, text: role.role_name};
            });
        }
    };

    createPickers = () => {
        $("#tags_select").select2({
            width: "100%",
            multiple: true,
            tags: true,
            options: {
                placeholder: "Выберите теги",
                theme: "bootstrap"
            },
            data: this.props.tags.length > 0
                ? this.dataForTagsSelect(this.state.tags, this.state.employee.basic)
                : [
                    {
                        id: 1,
                        text: "Нет данных"
                    }
                ]
        }).off("select2:select").on("select2:select", this.tagChanged).off("select2:unselect").on("select2:unselect", this.delTag);

        $("#good_tags_select").select2({
            width: "100%",
            multiple: true,
            tags: true,
            options: {
                placeholder: "Выберите сильные стороны",
                theme: "bootstrap"
            },
            data: this.props.tags_good.length > 0
                ? this.dataForTagsSelect(this.props.tags_good, this.state.employee.positive)
                : [
                    {
                        id: null,
                        text: "Нет данных"
                    }
                ]
        }).off("select2:select").on("select2:select", this.tagChanged).off("select2:unselect").on("select2:unselect", this.delTag);

        $("#bad_tags_select").select2({
            width: "100%",
            multiple: true,
            tags: true,
            options: {
                placeholder: "Выберите слабые стороны",
                theme: "bootstrap"
            },
            data: this.props.tags_bad.length > 0
                ? this.dataForTagsSelect(this.props.tags_bad, this.state.employee.negative)
                : [
                    {
                        id: null,
                        text: "Нет данных"
                    }
                ]
        }).off("select2:select").on("select2:select", this.tagChanged).off("select2:unselect").on("select2:unselect", this.delTag);

        $(".dates").datepicker({language: "ru", weekStart: "1", format: "yyyy/mm/dd"}).off("changeDate").on("changeDate", e => {
            let obj = this.state.employee;

            switch (e.currentTarget.name) {
                case "date_beg":
                    obj.date_beg = FORMAT_DATE(e.date);
                    break;
                case "date_end":
                    obj.date_end = FORMAT_DATE(e.date);
            }

            this.setState({posts: obj});
        });
    };

    tagChanged = e => {
        const employee = this.state.employee;
        switch (e.target.id) {
            case "tags_select":
                let basic = $("#tags_select").val();
                employee.basic = basic.map(item => {
                    if (isNaN(+ item)) {
                        return item;
                    } else {
                        return + item;
                    }
                });
                this.setState({employee: employee});
                break;
            case "good_tags_select":

                let good = $("#good_tags_select").val();
                employee.positive = good.map(item => {
                    if (isNaN(+ item)) {
                        return item;
                    } else {
                        return + item;
                    }
                });
                this.setState({employee: employee});
                break;
            case "bad_tags_select":
                let bad = $("#bad_tags_select").val();
                employee.negative = bad.map(item => {
                    if (isNaN(+ item)) {
                        return item;
                    } else {
                        return + item;
                    }
                });
                this.setState({employee: employee});
                break;
            default:
                break;
        }
    };

    delTag = e => {
        switch (e.target.id) {
            case "tags_select":
                let tags = this.state.tags;
                tags = this.tagDel(e, tags);
                this.setState({tags: tags});
                break;
            case "good_tags_select":
                let tags_good = this.state.employee_good_tags;
                tags_good = this.tagDel(e, tags_good);
                this.setState({employee_good_tags: tags_good});
                break;
            case "bad_tags_select":
                let tags_bad = this.state.employee_bad_tags;
                tags_bad = this.tagDel(e, tags_bad);
                this.setState({employee_bad_tags: tags_bad});
                break;
            default:
                break;
        }
    };

    tagDel = (event, tags) => {
        tags = tags.filter(tag => {
            let found = true;
            if (tag.toString() === event.params.data.id) {
                found = false;
            }
            return found;
        });
        return tags;
    };

    onClearDate = name => {
        let obj = this.state.employee;
        switch (name) {
            case "date_beg":
                obj.date_beg = "";
                break;
            case "date_end":
                obj.date_end = "";
        }

        this.setState({posts: obj});
    };

    onFocusLos = e => {
        let value;
        switch (e.target.name) {
            case "phone":
                value = e.target.value.replace(/[\+\(\)\-" "]/g, "");
                break;
            case "date_birth":
                value = e.target.value.replace(/\//g, "-");
                break;
            default:
                value = e.target.value;
        }
        const data = {
            employee_id: this.state.employee.employee_id,
            role_id: this.state.employee.role_id,
            person_id: this.state.employee.person_id
        };
        data[e.target.name] = value;

        this.props.onCheckEmployee(data);
    };

    onPositionChanged = (id, data) => {
        let obj = this.state.employee;

        switch (data) {
            case "post":
                obj.post_id = id;
                break;
            case "salon":
                obj.salon_id = id;
                break;
            default:
                break;
        }

        this.setState({posts: obj});
    };

    onInputChanged = e => {
        let name = e.target.name;
        if (name === "password" || name === "password_rep") {
            this.state.errors["password"]
                ? delete this.state.errors["password"]
                : "";
            this.state.errors["password_rep"]
                ? delete this.state.errors["password_rep"]
                : "";
        } else {
            this.state.errors[name]
                ? delete this.state.errors[name]
                : "";
        }

        if (name === "password_rep" || name === "password") {
            this.setState({changed: true});
        }
        let state = this.state.employee;

        state[name] = e.target.value;

        this.setState({employee: state});
    };

    onNumberInputChange = e => {
        let state = this.state.employee;
        state[e.target.name] = DEFINE_INT_NUMBER(state[e.target.name], e.target.value);
        this.setState({employee: state});
    };

    onDateChange = e => {
        let obj = this.state.employee;
        obj[e.target.name] = FORMAT_DATE(e.date);
        this.setState({employee: obj});
    };

    clearDateData = type => {
        let obj = this.state.employee;
        if (type === "date_birth") {
            obj.date_birth = "";
        } else {
            obj.passDate = "";
        }

        this.setState({employee: obj});
    };

    onContactChanged = e => {
        if (e.target.name === "phone") {
            this.state.errors["phone"]
                ? delete this.state.errors["phone"]
                : "";
        }
        if (e.target.name === "email") {
            this.state.errors["email"]
                ? delete this.state.errors["email"]
                : "";
        }

        let state = this.state.contacts;
        state[+ e.target.id].contact = e.target.value;

        this.setState({contacts: state});
    };

    onRoleSelect = e => {
        let state = this.state.employee;
        state.role_id = e.target.value;
        this.setState({employee: state});
    };

    onContactTrashClick = e => {
        e.preventDefault();
        let state = this.state.contacts;
        state.splice(+ e.target.parentNode.name, 1);
        this.setState({contacts: state});
    };

    onPhoneAddClick = e => {
        e.preventDefault();
        let state = this.state.contacts;

        state.push({contact_type: "PHONE", contact: ""});

        this.setState({contacts: state});
    };

    onEmailAddClick = e => {
        e.preventDefault();
        let state = this.state.contacts;

        state.push({contact_type: "EMAIL", contact: ""});

        this.setState({contacts: state});
    };

    onSaveClick = e => {
        e.preventDefault();
        const err = this.state.errors || {};
        const empl = this.state.employee;
        if (empl.password !== empl.password_rep) {
            err["password"] = {
                message: "Пароли не совпадают"
            };
            err["password_rep"] = {
                message: "Пароли не совпадают"
            };
        }
        this.setState({errors: err});

        if (Object.keys(this.state.errors).length === 0) {
            let temp = this.state.contacts.map(contact => {
                if (contact.contact_type === "PHONE") {
                    let phone = contact.contact.replace(/[\+\(\)\-" "]/g, "");
                    return {contact: phone, contact_type: contact.contact_type};
                }
                return {contact: contact.contact, contact_type: contact.contact_type};
            });
            const basic = this.state.employee.basic.map(item => item.tag_id || item);
            const positive = this.state.employee.positive.map(item => item.tag_id || item);
            const negative = this.state.employee.negative.map(item => item.tag_id || item);

            let data = this.state.changed
                ? {
                    first_name: this.state.employee.first_name,
                    last_name: this.state.employee.last_name,
                    sex: this.state.employee.sex,
                    contacts: temp,
                    basic: basic,
                    positive: positive,
                    negative: negative,
                    photo_id: this.props.photo || 0,
                    post_id: this.state.employee.post_id,
                    salon_id: this.state.employee.salon_id,
                    date_beg: this.state.employee.date_beg.replace(/\//g, "-"),
                    date_end: this.state.employee.date_end
                        ? this.state.employee.date_end.replace(/\//g, "-")
                        : "",
                    //"username": this.state.employee.username,
                    access_allowed: this.state.employee.access_allowed,
                    role_id: + this.state.employee.role_id
                }
                : {
                    first_name: this.state.employee.first_name,
                    last_name: this.state.employee.last_name,
                    sex: this.state.employee.sex,
                    contacts: temp,
                    basic: basic,
                    positive: positive,
                    negative: negative,
                    photo_id: this.props.photo || 0,
                    post_id: this.state.employee.post_id,
                    salon_id: this.state.employee.salon_id,
                    date_beg: this.state.employee.date_beg.replace(/\//g, "-"),
                    date_end: this.state.employee.date_end
                        ? this.state.employee.date_end.replace(/\//g, "-")
                        : "",
                    //"username": this.state.employee.username,
                    access_allowed: this.state.employee.access_allowed,
                    role_id: + this.state.employee.role_id
                };

            if (empl.access_allowed) {
                data.username = empl.username;
                data.password = empl.password;
            }
            if (empl.second_name && empl.second_name !== "") {
                data.second_name = empl.second_name;
            }

            if (empl.date_birth && empl.date_birth !== "") {
                data.date_birth = empl.date_birth.replace(/\//g, "-");
            }

            if (empl.note && empl.note !== "") {
                data.note = empl.note;
            }

            if (empl.tax_number && empl.tax_number !== "") {
                data.tax_number = empl.tax_number;
            }

            if (empl.pasp_num && empl.pasp_num !== "") {
                data.pasp_num = empl.pasp_num;
            }

            if (empl.pasp_ser && empl.pasp_ser !== "") {
                data.pasp_ser = empl.pasp_ser;
            }

            if (empl.pasp_date && empl.pasp_date !== "") {
                data.pasp_date = empl.pasp_date;
            }

            if (empl.pasp_whom && empl.pasp_whom !== "") {
                data.pasp_whom = empl.pasp_whom;
            }

            if (empl.adr_zip && empl.adr_zip !== "") {
                data.adr_zip = empl.adr_zip;
            }

            if (empl.adr_city && empl.adr_city !== "") {
                data.adr_city = empl.adr_city;
            }

            if (empl.adr_street && empl.adr_street !== "") {
                data.adr_street = empl.adr_street;
            }

            if (empl.adr_house && empl.adr_house !== "") {
                data.adr_house = empl.adr_house;
            }

            if (empl.adr_apartment && empl.adr_apartment !== "") {
                data.adr_apartment = empl.adr_apartment;
            }

            if (empl.status_family && empl.status_family !== "") {
                data.status_family_id = + empl.status_family.status_family_id || + empl.status_family;
            }

            this.props.onEditEmployee(data, this.state.employee.employee_id);

            window.$("#profile_tab").addClass("active");
            window.$("#profile").addClass("active");
            window.$("#edit_tab").removeClass("active");
            window.$("#edit").removeClass("active");
            window.$("#button-photo").removeClass("show");
            window.$("#salary").removeClass("active");
            window.$("#history").removeClass("active");
        } else {
            let error = {
                type: "error",
                text: "Ошибки при заполнении формы",
                title: "ОШИБКА"
            };
            this.props.onNotifyShow(error);
        }
    };
}

EmployeeTabEdit.propTypes = {
    employee: PropTypes.object.isRequired,
    salons: PropTypes.array.isRequired,
    posts: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onLoadDataForEdit: PropTypes.func.isRequired
};

export default EmployeeTabEdit;
