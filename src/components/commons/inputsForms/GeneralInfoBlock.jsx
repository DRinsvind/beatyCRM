import React, {Component} from 'react';
import PropTypes from 'prop-types';

import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;

class GeneralInfoBlock extends Component {
    componentDidUpdate() {
        $('#birthdaySelect').datepicker(
            {
                language: 'ru',
                weekStart: '1',
                format: 'yyyy/mm/dd'
            }
        )
            .off('changeDate').on('changeDate', (e) => {
                this.props.changeBirthday(e);
            });
    };

    render() {
        return (
            <fieldset>
                <div className={"form-group" + (this.props.errors['last_name'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Фамилия</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="last_name"
                               placeholder="Иванов"
                               value={this.props.person.last_name}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['last_name'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['last_name'] ? this.props.errors['last_name'][0] : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['first_name'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Имя</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="first_name"
                               placeholder="Иван"
                               value={this.props.person.first_name}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['first_name'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['first_name'] ? this.props.errors['first_name'][0] : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['second_name'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Отчество</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="second_name"
                               placeholder="Иванович"
                               value={this.props.person.second_name || ""}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['second_name'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['second_name'] ? this.props.errors['second_name'][0] : ''}
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-3 control-label">Пол</label>

                    <div className="col-md-9">
                        <div className="radio-custom radio-primary radio-inline mr-lg">
                            <input type="radio"
                                   name="sex"
                                   value="M"
                                   checked={this.props.person.sex === 'M'}
                                   onChange={this.props.inputChanged}/>
                            <label>Мужской</label>
                        </div>

                        <div className="radio-custom radio-primary radio-inline">
                            <input type="radio"
                                   name="sex"
                                   value="F"
                                   checked={this.props.person.sex === 'F'}
                                   onChange={this.props.inputChanged}/>
                            <label>Женский</label>
                        </div>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['date_birth'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Дата рождения</label>
                    <div className="col-md-7">
                        <div className="input-group" style={{textAlign: 'right'}}>
															<span className="input-group-addon">
																<i className="fa fa-fw fa-calendar"></i>
															</span>
                            <input type="text"
                                   id="birthdaySelect"
                                   className="form-control"
                                   name="date_birth"
                                   value={this.props.person.date_birth ? this.props.person.date_birth.replace(/-/g, '/') : ''}
                                   onClick={() => this.props.clearBirthDay('date_birth')}
                                   onChange={(e) => {}}
                            />
                        </div>
                        <label className={this.props.errors['date_birth'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['date_birth'] ? this.props.errors['date_birth'][0] : ''}
                        </label>
                    </div>
                </div>
            </fieldset>
        );
    }
}

GeneralInfoBlock.propTypes = {
    person: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    inputChanged: PropTypes.func.isRequired,
    onFocusLos: PropTypes.func.isRequired,
    changeBirthday: PropTypes.func.isRequired,
    clearBirthDay: PropTypes.func.isRequired
};

export default GeneralInfoBlock;
