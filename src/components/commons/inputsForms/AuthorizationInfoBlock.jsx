import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';

class AuthorizationInfoBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <fieldset>
                <div
                    className={"form-group" + (this.props.errors['username'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Логин</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <div className="input-group">
                                                    <span className="input-group-addon">
                                                    <i className="fa fa-fw fa-user"></i>
                                                    </span>
                            <input type="text"
                                   name="login"
                                   placeholder="Логин"
                                   className="form-control pr-xs"
                                   value={this.props.employee.username || ''}
                                   onChange={this.props.onInputChanged}
                                   onBlur={this.props.onFocusLos}/>
                        </div>
                        <label
                            className={this.props.errors['username'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['username'] ? this.props.errors['username'].message : ''}
                        </label>
                    </div>
                </div>
                <div
                    className={"form-group" + (this.props.errors['password'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Пароль</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <div className="input-group">
                                                    <span className="input-group-addon">
                                                    <i className="fa fa-fw fa-key"></i>
                                                    </span>
                            <input type="password"
                                   className="form-control"
                                   name="password"
                                   placeholder="Укажите пароль"
                                   onChange={this.props.onInputChanged}
                                   onBlur={this.props.onFocusLos}/>
                        </div>
                        <label
                            className={this.props.errors['password'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['password'] ? this.props.errors['password'].message : ''}
                        </label>
                    </div>
                </div>
                <div
                    className={"form-group" + (this.props.errors['password_rep'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Повторите пароль</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <div className="input-group">
                                                    <span className="input-group-addon">
                                                    <i className="fa fa-fw fa-key"></i>
                                                    </span>
                            <input type="password"
                                   className="form-control"
                                   name="password_rep"
                                   placeholder="Повторите пароль"
                                   onChange={this.props.onInputChanged}
                                   onBlur={this.props.onFocusLos}/>
                        </div>
                        <label
                            className={this.props.errors['password_rep'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['password_rep'] ? this.props.errors['password_rep'].message : ''}
                        </label>
                    </div>
                </div>
                <div
                    className={"form-group" + (this.props.errors['role'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Роль сотрудника</label>
                    <div className="col-md-7">
                        <div className="input-group">
                                                    <span className="input-group-addon">
                                                    <i className="fa fa-fw fa-address-book-o "></i>
                                                    </span>
                            <Select2 className="form-control"
                                     options={{placeholder: 'Выберите роль', theme: 'bootstrap'}}
                                     data={this.props.roles_list}
                                     value={this.props.role_val}
                                     onSelect={this.props.onRoleSelect}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        );
    }
}

AuthorizationInfoBlock.propTypes = {
    employee: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    roles_list: PropTypes.array.isRequired,
    onInputChanged: PropTypes.func.isRequired,
    onFocusLos: PropTypes.func.isRequired,
    onRoleSelect: PropTypes.func.isRequired
};

export default AuthorizationInfoBlock;
