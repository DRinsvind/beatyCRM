import React, {Component} from "react";
import PropTypes from "prop-types";
import LOGOTYPE from "../../public/assets/images/logotype.png";
import Select2 from "react-select2-wrapper";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: true,
            error_message: '',
            selectedSalon: 1
        };
    }

    render() {
        return (
            <section className="login-back">
                <section className="body-sign">
                    <div className="center-sign">
                        <a href="/" className="logo pull-left">
                            <img src={LOGOTYPE} alt="Backstage" width={250}/>
                        </a>

                        <div className="panel panel-sign">
                            <div className="panel-title-sign mt-xl text-right">
                                <h2 className="title text-uppercase text-weight-bold m-none">
                                    <i className="fa fa-user mr-xs"></i> Вход
                                </h2>
                            </div>
                            <div className="panel-body">
                                <form onSubmit={this.onSignIn}>
                                    <div className="form-group mb-lg">
                                        <label>Салон</label>

                                        <Select2 className="form-control"
                                                 options={{placeholder: 'Выберите салон', theme: 'bootstrap'}}
                                                 data={this.mapToSalons()}
                                                 value={this.state.selectedSalon}
                                                 onChange={this.onChangeSalonId}
                                        />
                                    </div>

                                    <div className="form-group mb-lg">
                                        <div className="clearfix">
                                            <label className="pull-left">Логин</label>
                                        </div>
                                        <div className="input-group input-group-icon">
                                            <input type="text"
                                                   className="form-control"
                                                   placeholder="Логин"
                                                   value={this.state.username}
                                                   onChange={this.onChangeUsername}
                                                   autoFocus
                                            />
                                            <span className="input-group-addon">
                                                <span className="icon">
                                                    <i className="fa fa-fw fa-user"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group mb-lg">
                                        <div className="clearfix">
                                            <label className="pull-left">Пароль</label>
                                            {/*<a href="pages-recover-password.html" className="pull-right">Забыли пароль?</a>*/}
                                        </div>
                                        <div className="input-group input-group-icon">
                                            <input type="password"
                                                   className="form-control"
                                                   placeholder="Пароль"
                                                   value={this.state.password}
                                                   onChange={this.onChangePassword}
                                            />
                                            <span className="input-group-addon">
                                            <span className="icon">
                                                <i className="fa fa-fw fa-lock"></i>
                                            </span>
									    </span>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-8">
                                            <div className="checkbox-custom checkbox-primary">
                                                <input id="RememberMe"
                                                       name="rememberme"
                                                       type="checkbox"
                                                       value={this.state.remember}
                                                       onChange={this.onChangeRemember}
                                                />
                                                <label htmlFor="RememberMe">Запомнить меня</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 text-right">
                                            <button type="submit" className="btn btn-primary hidden-xs">
                                                <i className="fa fa-fw fa-sign-in"></i> Войти
                                            </button>
                                            <button type="submit"
                                                    className="btn btn-primary btn-block btn-lg visible-xs mt-lg">
                                                <i className="fa fa-fw fa-sign-in"></i> Войти
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <p className="text-center text-danger mt-lg">
                                    {this.state.error_message}
                                </p>
                            </div>
                        </div>

                        <p className="text-center text-muted mt-md mb-md">
                            Copyright &copy; Backstage 2014. All Rights Reserved.
                        </p>
                    </div>
                </section>
            </section>
        )
    };

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.error_message = nextProps.error;
        }
    }

    mapToSalons = () => {
        return this.props.salons.map((salon) => {
            return {
                id: salon.salon_id,
                text: salon.salon_name
            };
        });
    };

    onChangeUsername = (event) => {
        this.setState({
            username: event.target.value,
            error_message: ''
        });
    };

    onChangePassword = (event) => {
        this.setState({
            password: event.target.value,
            error_message: ''
        });
    };

    onChangeSalonId = (event) => {
        this.setState({
            selectedSalon: event.target.value
        });
    };

    onChangeRemember = (event) => {
        this.setState({
            remember: event.target.value
        });
    };

    onSignIn = (e) => {
        e.preventDefault();

        if (!Boolean(this.state.username) || !Boolean(this.state.password)) {
            this.setState({
                error_message: "Логин и пароль должны быть заполнены."
            });

            return;
        }

        this.props.onSubmit({
            login: this.state.username,
            password: this.state.password,
            salon_id: +this.state.selectedSalon
        });

    };

    componentDidMount() {
        this.props.onLoad();
    }
}

Login.propTypes = {
    onLoad: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default Login
