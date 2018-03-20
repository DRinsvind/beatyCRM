import React, { Component } from "react";
import PropTypes from "prop-types";
import Select2 from "react-select2-wrapper";
import GeneralInfoBlock from "../commons/inputsForms/GeneralInfoBlock";
import OtherInfoBlock from "../commons/inputsForms/OtherInfoBlock";
import EmployeePosition from "../commons/inputsForms/EmployeePosition";
import AuthorizationInfoBlock from "../commons/inputsForms/AuthorizationInfoBlock";
import ContactInput from "../commons/inputsForms/ContactInput";
import picture from "../../../public/assets/images/dummy/employee.jpg";
import { FORMAT_DATE, DEFINE_INT_NUMBER } from "../../utils/index";

const $ = window.jQuery;

class EmployeesAdd extends Component {
    constructor(props) {
        super(props);
        const contacts = [
            {
                contact: "",
                contact_type: "PHONE"
            },
            {
                contact: "",
                contact_type: "EMAIL"
            }
        ];

        const posts = [
            {
                post: {
                    post_id: null
                },
                salon: {
                    salon_id: null
                },
                date_beg: "",
                date_end: ""
            }
        ];

        this.state = {
            employee: {
                ...props.employee,
                posts: posts
            },
            contacts: contacts,
            image: {
                name: "",
                file: "",
                data: "",
                imagePreviewUrl: picture
            },
            posts: posts,
            employee_good_tags: [],
            employee_bad_tags: [],
            errors: {},
            tags: [],
            pickers_ids: [{ start: "#workDateStart", end: "#workDateEnd" }]
        };
    }

    componentDidMount() {
        this.props.onLoad();
        $("#birthdaySelect")
            .datepicker({
                language: "ru",
                weekStart: "1",
                format: "yyyy/mm/dd"
            })
            .on("changeDate", e => {
                let obj = this.state.employee;
                obj.date_birth = FORMAT_DATE(e.date);
                this.setState({ employee: obj });
            });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.errors !== nextProps.errors) {
            nextState.errors = nextProps.errors;
        }
    }

    componentDidUpdate() {
        this.createPickers();
    }

    renderTags = (dataLabel, dataId) => {
        return (
            <fieldset className="mt-md">
                <div className="form-group">
                    <label className="col-md-3 control-label">
                        {dataLabel}
                    </label>
                    <div className="col-md-7">
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-fw fa-tags" />
                            </span>
                            <select className="form-control" id={dataId} />
                        </div>
                    </div>
                </div>
            </fieldset>
        );
    };

    mapToDataPhones = contacts => {
        console.log('contacts', contacts);
        return (
            <ContactInput
                errors={this.state.errors}
                contacts={contacts}
                contact_type="PHONE"
                text="+380 (67) 123-12-34"
                label="Телефон"
                mask="+38 (099) 999-99-99"
                iclass="fa fa-fw fa-phone"
                id="phone_number"
                contactChanged={this.onContactChanged}
                onFocusLoss={this.onFocusLos}
                onContactTrashClick={this.onContactTrashClick}
            />
        );
    };

    mapToDataEmails = contacts => {
        return (
            <ContactInput
                errors={this.state.errors}
                contacts={contacts}
                contact_type="EMAIL"
                text="email@com.ua"
                label="Email"
                mask=""
                iclass="fa fa-fw fa-envelope"
                id="email"
                contactChanged={this.onContactChanged}
                onFocusLoss={this.onFocusLos}
                onContactTrashClick={this.onContactTrashClick}
            />
        );
    };

    rolesToData = roles => {
        return roles.map(role => {
            return {
                id: role.role_id,
                text: role.role_name
            };
        });
    };

    dataForTagsSelect = tags => {
        return tags.map(tag => {
            return {
                id: tag.tag_id,
                text: tag.tag_name
            };
        });
    };

    contactsButtonAdd = (func, name) => {
        return (
            <div className="form-group mt-md">
                <div className="col-md-3" />
                <div className="col-md-9">
                    <button
                        className="btn btn-primary"
                        style={{ width: "30%" }}
                        onClick={func}
                    >
                        <i className="fa fa-fw fa-plus" /> {name}
                    </button>
                </div>
            </div>
        );
    };

    mapToDataPosts = posts => {
        return posts.map((item, pIndex) => {
            return (
                <EmployeePosition
                    key={pIndex}
                    id={pIndex}
                    posts={this.props.posts}
                    salons={this.props.salons}
                    selected_post={item.post.post_id}
                    selected_salon={item.salon.salon_id}
                    date_beg={item.date_beg}
                    date_end={item.date_end}
                    errors={this.state.errors}
                    onPositionChanged={this.onPositionChanged}
                    onPositionRemoved={this.onPositionRemoved}
                    onCheck={this.onFocusLos}
                    posts_ids={item.pickers_ids}
                    onClearDate={this.onClearDate}
                />
            );
        });
    };

    createPickers = () => {
        $("#tags_select")
            .select2({
                width: "100%",
                multiple: true,
                tags: true,
                options: {
                    placeholder: "Выберите теги",
                    theme: "bootstrap"
                },
                data: this.dataForTagsSelect(this.props.tags_list),
                value: this.state.tags
            })
            .off("select2:select")
            .on("select2:select", this.tagChanged)
            .off("select2:unselect")
            .on("select2:unselect", this.delTag);

        $("#good_tags_select")
            .select2({
                width: "100%",
                multiple: true,
                tags: true,
                options: {
                    placeholder: "Выберите сильные стороны",
                    theme: "bootstrap"
                },
                data: this.dataForTagsSelect(this.props.tags_good)
            })
            .off("select2:select")
            .on("select2:select", this.tagChanged)
            .off("select2:unselect")
            .on("select2:unselect", this.delTag);

        $("#bad_tags_select")
            .select2({
                width: "100%",
                multiple: true,
                tags: true,
                options: {
                    placeholder: "Выберите слабые стороны",
                    theme: "bootstrap"
                },
                data: this.dataForTagsSelect(this.props.tags_bad)
            })
            .off("select2:select")
            .on("select2:select", this.tagChanged)
            .off("select2:unselect")
            .on("select2:unselect", this.delTag);

        $(".dates")
            .datepicker({
                language: "ru",
                weekStart: "1",
                format: "yyyy/mm/dd"
            })
            .off("changeDate")
            .on("changeDate", e => {
                let obj = this.state.posts;

                switch (e.currentTarget.name) {
                    case "date_beg":
                        obj[+e.target.id].date_beg = FORMAT_DATE(e.date);
                        break;
                    case "date_end":
                        obj[+e.target.id].date_end = FORMAT_DATE(e.date);
                }

                this.setState({ posts: obj });
            });
    };

    tagChanged = e => {
        switch (e.target.id) {
            case "tags_select":
                let tags = this.state.tags;
                this.chageTag(e, tags);
                this.setState({ tags: tags });
                break;
            case "good_tags_select":
                let tags_good = this.state.employee_good_tags;
                this.chageTag(e, tags_good);
                this.setState({ employee_good_tags: tags_good });
                break;
            case "bad_tags_select":
                let tags_bad = this.state.employee_bad_tags;
                this.chageTag(e, tags_bad);
                this.setState({ employee_bad_tags: tags_bad });
                break;
            default:
                break;
        }
    };

    chageTag = (event, tags) => {
        if (event.params.originalEvent) {
            tags.push(+event.params.data.id);
        } else {
            tags.push(event.params.data.id);
        }
    };

    delTag = e => {
        switch (e.target.id) {
            case "tags_select":
                let tags = this.state.tags;
                tags = this.tagDel(e, tags);
                this.setState({ tags: tags });
                break;
            case "good_tags_select":
                let tags_good = this.state.employee_good_tags;
                tags_good = this.tagDel(e, tags_good);
                this.setState({ employee_good_tags: tags_good });
                break;
            case "bad_tags_select":
                let tags_bad = this.state.employee_bad_tags;
                tags_bad = this.tagDel(e, tags_bad);
                this.setState({ employee_bad_tags: tags_bad });
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

    onClearDate = (name, index) => {
        this.state.errors[name] ? delete this.state.errors[name] : "";
        let obj = this.state.posts;
        obj[index] = {};
        switch (name) {
            case "c":
                obj[index].date_beg = "";
                break;
            case "date_end":
                obj[index].date_end = "";
        }

        this.setState({ posts: obj });
    };

    onPositionChanged = (index, id, data) => {
        let obj = this.state.posts[index];
        let name;
        switch (data) {
            case "salon":
                obj.salon.salon_id = +id;
                name = "salon_id";
                break;
            case "post":
                obj.post.post_id = +id;
                name = "post_id";
                break;
            default:
                break;
        }
        this.state.errors[name] ? delete this.state.errors[name] : "";

        this.setState(obj);
    };

    onPositionRemoved = id => {
        this.setState({
            posts: this.state.posts.filter((item, index) => {
                return index !== id;
            })
        });
    };

    onImageChange = e => {
        e.preventDefault();
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({
                image: {
                    name: file.name,
                    data: reader.result.replace("data:;base64,", ""),
                    imagePreviewUrl: reader.result
                }
            });
        };
        reader.readAsDataURL(new Blob([file]));

        const formData = new FormData();
        formData.append("image", file);

        this.props.onUploadImage(formData);
    };

    onPositionAddClick = e => {
        e.preventDefault();
        this.setState({
            posts: this.state.posts.concat([
                {
                    post: {
                        post_id: null
                    },
                    salon: {
                        salon_id: null
                    },
                    date_beg: "",
                    date_end: ""
                }
            ]),
            pickers_ids: this.state.pickers_ids.concat([
                {
                    start: "#workDateStart",
                    end: "#workDateEnd"
                }
            ])
        });
    };

    onFocusLos = e => {
        const data = {};
        if(e.target.name === "phone"){
                data[e.target.name] = e.target.value.replace(/[\+\(\)\-" "]/g, "");
        } else {
                data[e.target.name] = e.target.value;
        }
        this.props.onCheck(data);
    };

    onInputChanged = e => {
        this.state.errors[e.target.name]
            ? delete this.state.errors[e.target.name]
            : "";
        const valueArr = e.target.value.split('');
        if(valueArr[valueArr.length-1] !== '_'){
            let state = this.state.employee;
            state[e.target.name] = e.target.value;
            this.setState({ employee: state });
        }
    };

    onNumberInputChange = e => {
        this.state.errors[e.target.name]
            ? delete this.state.errors[e.target.name]
            : "";
        let state = this.state.employee;
        state[e.target.name] = DEFINE_INT_NUMBER(
            state[e.target.name],
            e.target.value
        );
        this.setState({ employee: state });
    };

    onDateChange = e => {
        let obj = this.state.employee;
        obj[e.target.name] = FORMAT_DATE(e.date);
        this.setState({ employee: obj });
    };

    clearDateData = type => {
        let obj = this.state.employee;
        if (type === "date_birth") {
            obj.date_birth = "";
        } else {
            obj.passDate = "";
        }

        this.setState({ employee: obj });
    };

    onContactChanged = e => {
        let contacts = this.state.contacts;
        this.state.errors[e.target.name] ? delete this.state.errors[e.target.name] : "";
        if(e.target.name === "phone"){
            contacts[0].contact = e.target.value
        } else {
            contacts[1].contact = e.target.value
        }
        this.setState({ contacts: contacts });
    };

    onRoleSelect = e => {
        let empl = this.state.employee;
        empl.role_id = e.target.value;

        this.setState({
            employee: empl
        });
    };

    onClick = e => {
        e.preventDefault();

        let temp = this.state.employee;

        temp.posts.map(post => {
            post.salons.map(salon => {
                if (salon.salon_id === +e.target.id) {
                    salon.address = e.target.value;
                }
            });
        });

        this.setState({ employee: temp });
    };

    onContactTrashClick = e => {
        e.preventDefault();
        let state = this.state.contacts;

        state.splice(+e.target.parentNode.name, 1);
        this.setState({ contacts: state });
    };

    onPhoneAddClick = () => {
        let state = this.state.contacts;

        state = [
            ...state,
            {
                contact_type: "PHONE",
                contact: ""
            }
        ];

        this.setState({ contacts: state });
    };

    onEmailAddClick = () => {
        let state = this.state.contacts;

        state = [
            ...state,
            {
                contact_type: "EMAIL",
                contact: ""
            }
        ];

        this.setState({ contacts: state });
    };

    onCancelClick = () => {
        this.props.router.push("/employees/");
    };

    onSaveClick = () => {
        const err = this.state.errors || {};
        const empl = this.state.employee;
        if (
            !this.state.employee.first_name ||
            this.state.employee.first_name === ""
        ) {
            err["first_name"] = {
                message: "Укажите имя"
            };
        }

        if (
            !this.state.employee.last_name ||
            this.state.employee.last_name === ""
        ) {
            err["last_name"] = {
                message: "Укажите фамилию"
            };
        }

        if (
            !this.state.posts[0].post.post_id ||
            this.state.posts[0].post.post_id === ""
        ) {
            err["post_id"] = {
                message: "Укажите должность"
            };
        }

        if (
            !this.state.posts[0].salon.salon_id ||
            this.state.posts[0].salon.salon_id === ""
        ) {
            err["salon_id"] = {
                message: "Укажите салон"
            };
        }

        if (
            !this.state.posts[0].date_beg ||
            this.state.posts[0].date_beg === ""
        ) {
            err["date_beg"] = {
                message: "Укажите стаж"
            };
        }

        this.setState({ errors: err });

        if (Object.keys(this.state.errors).length > 0) {
            let error = {
                type: "error",
                text: "Заполнены не все поля!"
            };
            this.props.onNotifyShow(error);
        } else {
            let temp = this.state.contacts.map(contact => {
                if (contact.contact_type === "PHONE") {
                    let phone = contact.contact.replace(/[\+\(\)\-" "]/g, "");
                    return {
                        contact: phone,
                        contact_type: contact.contact_type
                    };
                }
                return {
                    contact: contact.contact,
                    contact_type: contact.contact_type
                };
            });
            let tags = [];

            this.state.tags.forEach(tag => {
                if (+tag !== NaN) {
                    tags.push(+tag);
                } else {
                    tags.push(tag);
                }
            });

            let data = {
                first_name: this.state.employee.first_name,
                last_name: this.state.employee.last_name,
                sex: this.state.employee.sex,
                contacts: temp,
                basic: this.state.tags || [],
                positive: this.state.employee_good_tags || [],
                negative: this.state.employee_bad_tags || [],
                photo_id: this.props.photo || 0,
                post_id: this.state.posts[0].post.post_id,
                salon_id: this.state.posts[0].salon.salon_id,
                date_beg: this.state.posts[0].date_beg.replace(/\//g, "-"),
                date_end: this.state.posts[0].date_end.replace(/\//g, "-"),
                access_allowed: this.state.employee.is_access_allowed || false,
                role_id: +this.state.employee.role_id
            };

            if (empl.is_access_allowed) {
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
                data.status_family_id = empl.status_family;
            }

            this.props.onAddEmployee(data);
        }
    };

    render() {
        console.log('RENDER_PROPS', this.props);
        let { imagePreviewUrl } = this.state.image;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (
                <img
                    className="img-responsive"
                    src={imagePreviewUrl}
                    alt="Фото сотрудника"
                />
            );
        }

        return (
            <div className="row">
                <div className="col-md-3 col-lg-3">
                    <section className="panel">
                        <div className="panel-body">
                            <div
                                className="img-rounded employee-image"
                                style={{ width: "100%" }}
                            >
                                {$imagePreview}
                            </div>
                            <label
                                id="button-photo"
                                className="btn btn-primary mr-xs mb-sm mt-lg"
                                style={{ width: "60%" }}
                            >
                                <i className="fa fa-plus" /> Фото
                                <input
                                    type="file"
                                    onChange={this.onImageChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </section>
                </div>
                <div className="col-md-9 col-lg-9">
                    <div className="tabs">
                        <ul className="nav nav-tabs tabs-primary">
                            <li id="adding_tab" className="active">
                                <a href="#add" data-toggle="tab">
                                    Добавление сотрудника
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="add" className="tab-pane active">
                                <div className="form-horizontal">
                                    <h4 className="mb-xlg">Информация</h4>
                                    <GeneralInfoBlock
                                        person={this.state.employee}
                                        errors={this.state.errors}
                                        inputChanged={this.onInputChanged}
                                        onFocusLos={this.onFocusLos}
                                        changeBirthday={this.onDateChange}
                                        clearBirthDay={this.clearDateData}
                                    />
                                    <hr className="dotted tall" />
                                    {this.renderTags("Заметки", "tags_select")}
                                    {this.renderTags(
                                        "Сильные стороны",
                                        "good_tags_select"
                                    )}
                                    {this.renderTags(
                                        "Слабые стороны",
                                        "bad_tags_select"
                                    )}
                                    <hr className="dotted tall" />
                                    <h4 className="mb-xlg">Контакты</h4>
                                    <fieldset className="mb-xl">
                                        {this.mapToDataPhones(
                                            this.state.contacts
                                        )}
                                        {this.contactsButtonAdd(
                                            this.onPhoneAddClick,
                                            "Телефон"
                                        )}
                                        {this.mapToDataEmails(
                                            this.state.contacts
                                        )}
                                        {this.contactsButtonAdd(
                                            this.onEmailAddClick,
                                            "Email"
                                        )}
                                    </fieldset>
                                    <hr className="dotted tall" />
                                    <h4 className="mb-xlg">
                                        Занимаемая должность
                                    </h4>
                                    {this.mapToDataPosts(this.state.posts)}
                                    <hr className="dotted tall mb-md" />
                                    <h4 className="mb-xlg">Реквизиты</h4>
                                    <OtherInfoBlock
                                        person={this.state.employee}
                                        errors={this.state.errors}
                                        inputChanged={this.onInputChanged}
                                        onFocusLos={this.onFocusLos}
                                        onNumberInputChange={
                                            this.onNumberInputChange
                                        }
                                        clearDateData={this.clearDateData}
                                        changeDate={this.onDateChange}
                                    />
                                    <hr className="dotted tall mb-md" />
                                    <h4 className="mb-xlg">Дополнительно</h4>

                                    <div
                                        className={
                                            "form-group" +
                                            (this.state.errors["status_family"]
                                                ? " has-error"
                                                : "")
                                        }
                                    >
                                        <label className="col-md-3 control-label">
                                            Семейный статус
                                        </label>
                                        <div className="col-md-7">
                                            <Select2
                                                className="form-control"
                                                options={{
                                                    placeholder:
                                                        "Семейный статус",
                                                    theme: "bootstrap"
                                                }}
                                                name="status_family"
                                                data={this.props.status_family && this.props.status_family.map(
                                                    item => {
                                                        return {
                                                            id:
                                                                item.status_family_id,
                                                            text:
                                                                item.status_family_name
                                                        };
                                                    })
                                                }
                                                value={
                                                    this.state.employee
                                                        .status_family
                                                }
                                                onSelect={e => {
                                                    e.preventDefault();
                                                    this.setState({
                                                        employee: {
                                                            ...this.state
                                                                .employee,
                                                            status_family: +e
                                                                .target.value
                                                        }
                                                    });
                                                }}
                                            />
                                            <label
                                                className={
                                                    this.state.errors[
                                                        "status_family"
                                                    ]
                                                        ? "control-label"
                                                        : "hidden"
                                                }
                                            >
                                                {this.state.errors[
                                                    "status_family"
                                                ]
                                                    ? this.state.errors[
                                                          "status_family"
                                                      ].message
                                                    : ""}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-md-3 control-label">
                                            Описание
                                        </label>
                                        <div
                                            className="col-md-7"
                                            style={{ textAlign: "right" }}
                                        >
                                            <textarea
                                                className="form-control"
                                                name="note"
                                                rows="4"
                                                onChange={this.onInputChanged}
                                                onBlur={this.onFocusLos}
                                                style={{ overflow: "hidden" }}
                                            />
                                        </div>
                                    </div>

                                    <hr className="dotted tall mb-md" />
                                    <div className="form-group mb-lg">
                                        <label className="col-md-6 control-label pt-none">
                                            Разрешить вход в систему
                                        </label>
                                        <div
                                            className="col-md-6"
                                            style={{ textAlign: "right" }}
                                        >
                                            <div className="checkbox-custom checkbox-primary center-block">
                                                <input
                                                    type="checkbox"
                                                    name="is_access_allowed"
                                                    value={
                                                        this.state.employee
                                                            .is_access_allowed
                                                    }
                                                    onChange={() => {
                                                        let obj = this.state
                                                            .employee;
                                                        obj.is_access_allowed = !obj.is_access_allowed;
                                                        this.setState({
                                                            employee: obj
                                                        });
                                                    }}
                                                />
                                                <label />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            this.state.employee
                                                .is_access_allowed
                                                ? ""
                                                : "hidden"
                                        }
                                    >
                                        <h4 className="mb-xlg">
                                            Авторизационная информация
                                        </h4>
                                        <AuthorizationInfoBlock
                                            employee={this.state.employee}
                                            errors={this.state.errors}
                                            roles_list={this.rolesToData(
                                                this.props.roles
                                            )}
                                            role_val={
                                                this.state.employee.role_id
                                            }
                                            onInputChanged={this.onInputChanged}
                                            onFocusLos={this.onFocusLos}
                                            onRoleSelect={this.onRoleSelect}
                                        />
                                    </div>
                                    <div className="panel-footer">
                                        <div className="row">
                                            <div className="col-md-12 text-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary mr-sm"
                                                    onClick={this.onSaveClick}
                                                >
                                                    <i className="fa fa-fw fa-save" />
                                                    Сохранить
                                                </button>
                                                <button
                                                    type="reset"
                                                    className="btn btn-default"
                                                    onClick={this.onCancelClick}
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EmployeesAdd.propTypes = {
    salons: PropTypes.array.isRequired,
    posts: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    onNotifyShow: PropTypes.func.isRequired,
    onAddEmployee: PropTypes.func.isRequired
};

export default EmployeesAdd;
