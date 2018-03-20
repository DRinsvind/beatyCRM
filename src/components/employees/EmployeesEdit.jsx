import React, {Component} from "react";
import PropTypes from "prop-types";
import employee_picture from "../../../public/assets/images/dummy/employee.jpg";
import EmployeeTabEdit from "./EmployeeTabEdit";
import EmployeeTabSalary from "./EmployeeTabSalary";
import {FORMAT_DATE_WITHOUT_TIME, FORMAT_PHONE_NUMBER} from "../../utils";

class EmployeesEdit extends Component {
  state = {
    image: {
      name: "",
      file: "",
      data: "",
      imagePreviewUrl: employee_picture
    },
    salaryForm: {
      monthSalary: {value: +this.props.employee.wage_month},
      daySalary: {value: +this.props.employee.wage_day},
      hourSalary: {value: +this.props.employee.wage_hour},
      turnOverPerc: {value: undefined},
      bonusFrom: {value: '1'},
      isInWorkDays: {value: this.props.employee.is_only_working_days},
      isSalFromActLevel: {value: this.props.employee.is_payroll_calculation_actual_time},
      goods: {value: undefined}
    },
    tab: 0
  };

  componentDidMount() {
    window.$("#profile_tab").addClass("active");
    window.$("#profile").addClass("active");
    window.$("#edit_tab").removeClass("active");
    window.$("#edit").removeClass("active");
    window.$("#salary_tab").removeClass("active");
    window.$("#salary").removeClass("active");
    window.$("#button-photo").removeClass("show");
    window.$("#button-photo").addClass("hide");
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.employee !== nextProps.employee) {
      nextState.image.imagePreviewUrl = this.mapToDataImage(nextProps);
      nextState.salaryForm = {
        monthSalary: {value: +nextProps.employee.wage_month},
        daySalary: {value: +nextProps.employee.wage_day},
        hourSalary: {value: +nextProps.employee.wage_hour},
        turnOverPerc: {value: undefined},
        bonusFrom: {value: '1'},
        isInWorkDays: {value: nextProps.employee.is_only_working_days},
        isSalFromActLevel: {value: nextProps.employee.is_payroll_calculation_actual_time},
        goods: {value: undefined}
      };
    }
  }

  componentDidUpdate() {
    if (Object.keys(this.props.errors).length === 0) {
      switch (this.state.tab) {
        case 0:
          window.$("#profile_tab").addClass("active");
          window.$("#profile").addClass("active");
          window.$("#edit_tab").removeClass("active");
          window.$("#edit").removeClass("active");
          window.$("#button-photo").removeClass("show");
          window.$("#salary").removeClass("active");
          window.$("#history").removeClass("active");
          window.$("#salarySaveButGroup").addClass('hide');
          break;
        case 1:
          window.$("#profile_tab").addClass("active");
          window.$("#profile").removeClass("active");
          window.$("#edit_tab").removeClass("active");
          window.$("#edit").addClass("active");
          window.$("#button-photo").addClass("show");
          window.$("#salary").removeClass("active");
          window.$("#history").removeClass("active");
          window.$("#salarySaveButGroup").addClass('hide');
          break;
        case 2:
          window.$("#profile_tab").removeClass("active");
          window.$("#profile").removeClass("active");
          window.$("#edit_tab").removeClass("active");
          window.$("#edit").removeClass("active");
          window.$("#button-photo").removeClass("show");
          window.$("#salary").addClass("active");
          window.$("#salary_tab").addClass("active");
          window.$("#history").removeClass("active");
          window.$("#salarySaveButGroup").removeClass('hide');
          break;
        case 3:
          window.$("#profile_tab").removeClass("active");
          window.$("#profile").removeClass("active");
          window.$("#edit_tab").removeClass("active");
          window.$("#edit").removeClass("active");
          window.$("#button-photo").removeClass("show");
          window.$("#salary").removeClass("active");
          window.$("#history").addClass("active");
          window.$("#salarySaveButGroup").addClass('hide');
          break;
        default:
          break;
      }
    }
  }

  changeFields = (changedFields, formName) => {
    this.setState({
      [formName]: {
        ...this.state[formName],
        ...changedFields
      }
    });
  };

  render() {
    const {
      salaryForm
    } = this.state;
    let {imagePreviewUrl} = this.state.image;
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
                className="employee-image img-rounded"
                style={{width: "100%"}}
              >
                {$imagePreview}
              </div>
              <label
                id="button-photo"
                className="btn btn-primary mr-xs mb-sm mt-lg hide"
                style={{width: "60%"}}
              >
                <i className="fa fa-fw fa-plus"/> Фото
                <input
                  type="file"
                  onChange={this.onImageChange}
                  style={{display: "none"}}
                />
              </label>
              <div style={{color: "#21262d"}}>
                <span className="employee_name">
                  {`${this.props.employee.last_name} ${this.props.employee.first_name} ${this.props.employee.second_name || ''}`}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="col-md-9 col-lg-9">
          <div
            id="salarySaveButGroup"
            style={{display: 'inline'}}>
            <button
              className="btn btn-default pull-right ml-sm text-free"
              style={{display: 'inline-block'}}
              onClick={() => {
                this.setState({
                  salaryForm: {
                    monthSalary: {value: +this.props.employee.wage_month},
                    daySalary: {value: +this.props.employee.wage_day},
                    hourSalary: {value: +this.props.employee.wage_hour},
                    turnOverPerc: {value: undefined},
                    bonusFrom: {value: '1'},
                    isInWorkDays: {value: this.props.employee.is_only_working_days},
                    isSalFromActLevel: {value: this.props.employee.is_payroll_calculation_actual_time},
                    goods: {value: undefined}
                  },
                });
              }}>
              <i className="fa fa-fw fa-ban" />
            </button>
            <button
              className="btn btn-primary pull-right text-free"
              style={{display: 'inline-block'}}
              onClick={() => {
                const data = {
                  wage_month: +this.state.salaryForm.monthSalary.value,
                  wage_day: +this.state.salaryForm.daySalary.value,
                  wage_hour: +this.state.salaryForm.hourSalary.value,
                  is_only_working_days: this.state.salaryForm.isInWorkDays.value,
                  is_payroll_calculation_actual_time: this.state.salaryForm.isSalFromActLevel.value
                };
                this.props.onEditSalary(data, this.props.employee.employee_id);
              }}
            >
              <i className="fa fa-fw fa-save" />
            </button>
          </div>

          <div className="tabs">
            <ul className="nav nav-tabs tabs-primary">
              <li id="profile_tab">
                <a
                  href="#profile"
                  data-toggle="tab"
                  onClick={this.profileTabSelect}
                >
                  Профайл
                </a>
              </li>
              <li id="salary_tab">
                <a
                  href="#salary"
                  data-toggle="tab"
                  onClick={this.salaryTabSelect}
                >
                  Зарплата
                </a>
              </li>
              <li id="hystory_tab">
                <a
                  href="#hystory"
                  data-toggle="tab"
                  onClick={this.historyTabSelect}
                >
                  История
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div id="profile" className="tab-pane">
                <div className="row">
                  <div className="col-md-5">
                    <div className="row mb-md">
                      <div className="col-md-1 pr-sm">
                        <i
                          className={
                            this.props.employee
                              .sex === "M"
                              ? "fa fa-fw fa-male"
                              : "fa fa-fw fa-female"
                          }
                        />
                      </div>
                      <div className="col-md-11 pl-sm">
                                                <span>
                                                    {this.props.employee.sex ===
                                                    "M"
                                                      ? "Мужской"
                                                      : "Женский"}
                                                </span>
                      </div>
                    </div>
                    <div
                      className={
                        this.props.employee.date_birth
                          ? "row mb-md"
                          : "hide"
                      }
                    >
                      <div className="col-md-1 pr-sm">
                        <i className="fa fa-fw fa-birthday-cake"/>
                      </div>
                      <div className="col-md-11 pl-sm">
                                                <span>
                                                    {FORMAT_DATE_WITHOUT_TIME(
                                                      this.props.employee
                                                        .date_birth
                                                    )}
                                                </span>
                      </div>
                    </div>
                    <div
                      className={
                        this.mapToDataPhonesProfile(
                          this.props.employee.contacts
                        ).length > 0
                          ? "row mb-sm"
                          : "hide"
                      }
                    >
                      <div className="col-md-1 pr-sm">
                        <i className="fa fa-phone"/>
                      </div>
                      <div className="col-md-11 pl-sm">
                        {this.mapToDataPhonesProfile(
                          this.props.employee.contacts
                        )}
                      </div>
                    </div>
                    <div
                      className={
                        this.mapToDataEmailsProfile(
                          this.props.employee.contacts
                        ).length > 0
                          ? "row mb-md"
                          : "hide"
                      }
                    >
                      <div className="col-md-1 pr-sm">
                        <i className="fa fa-fw fa-envelope"/>
                      </div>
                      <div className="col-md-11 pl-sm">
                        {this.mapToDataEmailsProfile(
                          this.props.employee.contacts
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="col-md-1">
                      <i className="fa fa-fw fa-area-chart"/>
                    </div>
                    <div className="col-md-11">
                      <div
                        className="mb-lg"
                        key={
                          this.props.employee.post_id
                        }
                      >
                        <div
                          style={{
                            fontWeight: "600"
                          }}
                        >
                          {
                            this.props.employee
                              .post_name
                          }
                        </div>
                        <div className="mb-md">
                          <div
                            className="mb-sm pl-md"
                            style={{
                              borderLeft: "1px solid #777"
                            }}
                          >
                            <div>
                              {
                                this.props
                                  .employee
                                  .salon_name
                              }
                            </div>
                            <div>
                              <i className="fa fa-clock-o mr-xs"/>
                              <span>
                                                                {" "}
                                c{" "}
                                {FORMAT_DATE_WITHOUT_TIME(
                                  this.props
                                    .employee
                                    .date_beg
                                )}
                                                            </span>
                              <span
                                className={
                                  this.props
                                    .employee
                                    .date_end
                                    ? ""
                                    : "hidden"
                                }
                              >
                                                                {" "}
                                по{" "}
                                {FORMAT_DATE_WITHOUT_TIME(
                                  this.props
                                    .employee
                                    .date_end
                                )}
                                                            </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div
                      style={{cursor: "pointer"}}
                      onClick={() => {
                        this.setState({tab: 1});
                      }}
                    >
                      <i
                        className="fa fa-pencil-square-o"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <EmployeeTabEdit
                employee={this.props.employee}
                photo={
                  this.props.photo !== null
                    ? this.props.photo
                    : this.props.employee.photo_id
                }
                salons={this.props.salons}
                posts={this.props.posts}
                roles={this.props.roles}
                router={this.props.router}
                tags={this.props.tags}
                tags_bad={this.props.tags_bad}
                tags_good={this.props.tags_good}
                status_family={this.props.status_family}
                errors={this.props.errors}
                cancelEmployeeEdit={this.cancelEmployeeEdit}
                onEditEmployee={this.onEditEmployee}
                onLoadDataForEdit={this.props.onLoadDataForEdit}
                onCheckEmployee={this.props.onCheckData}
                onNotifyShow={this.props.onNotifyShow}
              />

              <EmployeeTabSalary
                fields={salaryForm}
                onChange={(value) => {
                  this.changeFields(value, 'salaryForm')
                }}
                onShowSchemeModal={this.props.onShowSchemeModal}
                payments={this.props.payments}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  cancelEmployeeEdit = () => {
    window.$("#profile_tab").addClass("active");
    window.$("#profile").addClass("active");
    window.$("#edit_tab").removeClass("active");
    window.$("#edit").removeClass("active");
    window.$("#button-photo").addClass("show");
    window.$("#salary").removeClass("active");
    window.$("#history").removeClass("active");
  };

  onEditEmployee = (editedData, employee_id) => {
    this.setState({tab: 0});
    this.props.onEditEmployee(editedData, employee_id);
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

  profileTabSelect = () => {
    this.setState({tab: 0});
  };

  editTabSelect = () => {
    this.setState({tab: 1});
  };

  salaryTabSelect = () => {
    this.setState({tab: 2});
  };
  historyTabSelect = () => {
    this.setState({tab: 3});
  };

  mapToDataPhonesProfile = contacts => {
    return contacts
      .filter(contact => contact.contact_type === "PHONE")
      .map((contact, idx) => {
        return (
          <div className="mb-xs" key={idx}>
                        <span style={{color: "#0088cc"}}>
                            {FORMAT_PHONE_NUMBER(contact.contact)}
                        </span>
          </div>
        );
      });
  };

  mapToDataEmailsProfile = contacts => {
    return contacts
      .filter(contact => contact.contact_type === "EMAIL")
      .map((contact, idx) => {
        return (
          <div className="mb-xs" key={idx}>
                        <span style={{color: "#0088cc"}}>
                            {contact.contact}
                        </span>
          </div>
        );
      });
  };

  mapToDataImage = props => {
    return props.employee
      ? props.employee.photo_id && props.employee.image !== null
        ? props.employee.image
        : employee_picture
      : employee_picture;
  };
}

EmployeesEdit.propTypes = {
  employee: PropTypes.object.isRequired,
  salons: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  payments: PropTypes.arrayOf(PropTypes.any).isRequired,
  tags: PropTypes.array.isRequired,
  tags_bad: PropTypes.array.isRequired,
  tags_good: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  onEditEmployee: PropTypes.func.isRequired,
  onCheckData: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  cancelEmployeeEdit: PropTypes.func.isRequired,
  onNotifyShow: PropTypes.func.isRequired,
  onEditSalary: PropTypes.func.isRequired,
  onShowSchemeModal: PropTypes.func.isRequired
};

export default EmployeesEdit;
