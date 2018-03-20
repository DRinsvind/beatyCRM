import React, {Component} from "react";
import Modal from "../commons/modals/Modal";
import PropTypes from "prop-types";

const $ = window.$;

class EmployeeMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    onPremiumForSale = () => {
        $("#ModalEmployeePremiumForSale").modal("show");
    };

    render() {
        return (<div id="ModalEmployeeMenu" className="modal fade">
            <form id="formEmployeeMenu" onSubmit={this.props.handlePressButt}>
                <div className="menu-modal-dialog" id="modalHeaderColor">
                    <div className="menu-modal-content">
                        <div className="menu-modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul>
                                        <li onClick={this.onPremiumForSale} data-dismiss="modal">Премии за продажу</li>
                                        <li>Оплата за услуги</li>
                                        <li>Схемы оплаты</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>);
    }
}

EmployeeMenu.propTypes = {
};

export default EmployeeMenu;
