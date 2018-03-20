import React, {Component} from "react";
import Modal from "../commons/modals/Modal";
import PropTypes from "prop-types";
import EmployeePremiumsServicesTable from "./EmployeePremiumsServicesTable";


class EmployeePremiumsForSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        };
    }

    componentDidMount() {
        window.$("#services_tab").addClass("active");
        window.$("#services").addClass("active");
        window.$("#goods_tab").removeClass("active");
        window.$("#goods").removeClass("active");
        window.$("#premiums_tab").removeClass("active");
        window.$("#premiums").removeClass("active");
        window.$("#cards_tab").removeClass("active");
        window.$("#cards").removeClass("active");
        window.$("#certificates_tab").removeClass("active");
        window.$("#certificates").removeClass("active");

    }

    componentDidUpdate() {
        switch (this.state.tab) {
            case 0:
                window.$("#services_tab").addClass("active");
                window.$("#services").addClass("active");
                window.$("#goods_tab").removeClass("active");
                window.$("#goods").removeClass("active");
                window.$("#premiums_tab").removeClass("active");
                window.$("#premiums").removeClass("active");
                window.$("#cards_tab").removeClass("active");
                window.$("#cards").removeClass("active");
                window.$("#certificates_tab").removeClass("active");
                window.$("#certificates").removeClass("active");
                break;
            case 1:
                window.$("#services_tab").removeClass("active");
                window.$("#services").removeClass("active");
                window.$("#goods_tab").addClass("active");
                window.$("#goods").addClass("active");
                window.$("#premiums_tab").removeClass("active");
                window.$("#premiums").removeClass("active");
                window.$("#cards_tab").removeClass("active");
                window.$("#cards").removeClass("active");
                window.$("#certificates_tab").removeClass("active");
                window.$("#certificates").removeClass("active");
                break;
            case 2:
                window.$("#services_tab").removeClass("active");
                window.$("#services").removeClass("active");
                window.$("#goods_tab").removeClass("active");
                window.$("#goods").removeClass("active");
                window.$("#premiums_tab").addClass("active");
                window.$("#premiums").addClass("active");
                window.$("#cards_tab").removeClass("active");
                window.$("#cards").removeClass("active");
                window.$("#certificates_tab").removeClass("active");
                window.$("#certificates").removeClass("active");
                break;
            case 3:
                window.$("#services_tab").removeClass("active");
                window.$("#services").removeClass("active");
                window.$("#goods_tab").removeClass("active");
                window.$("#goods").removeClass("active");
                window.$("#premiums_tab").removeClass("active");
                window.$("#premiums").removeClass("active");
                window.$("#cards_tab").addClass("active");
                window.$("#cards").addClass("active");
                window.$("#certificates_tab").removeClass("active");
                window.$("#certificates").removeClass("active");
                break;
            case 4:
                window.$("#services_tab").removeClass("active");
                window.$("#services").removeClass("active");
                window.$("#goods_tab").removeClass("active");
                window.$("#goods").removeClass("active");
                window.$("#premiums_tab").removeClass("active");
                window.$("#premiums").removeClass("active");
                window.$("#cards_tab").removeClass("active");
                window.$("#cards").removeClass("active");
                window.$("#certificates_tab").addClass("active");
                window.$("#certificates").addClass("active");
                break;
            default:
                break;
        }
    }

    servicesTabSelect = () => {
        this.setState({tab: 0});
    };

    goodsTabSelect = () => {
        this.setState({tab: 1});
    };

    premiumsTabSelect = () => {
        this.setState({tab: 2});
    };

    cardsTabSelect = () => {
        this.setState({tab: 3});
    };

    certificatesTabSelect = () => {
        this.setState({tab: 4});
    };

    render() {
        return (<Modal id="ModalEmployeePremiumForSale" idForm="formAddEmployeeCategory" customClass="modal-dialog" title="Премии за продажу">
            <div className="row">
                <div className="col-md-12">
                    <div className="tabs">
                        <ul className="nav nav-tabs tabs-primary">
                            <li id="services_tab">
                                <a href="#services" data-toggle="tab" onClick={this.servicesTabSelect}>
                                    Услуги
                                </a>
                            </li>
                            <li id="goods_tab">
                                <a href="#goods" data-toggle="tab" onClick={this.goodsTabSelect}>
                                    Товары
                                </a>
                            </li>
                            <li id="premiums_tab">
                                <a href="#premiums" data-toggle="tab" onClick={this.premiumsTabSelect}>
                                    Премии за товары
                                </a>
                            </li>
                            <li id="cards_tab">
                                <a href="#cards" data-toggle="tab" onClick={this.cardsTabSelect}>
                                    Карты
                                </a>
                            </li>
                            <li id="certificates_tab">
                                <a href="#certificates" data-toggle="tab" onClick={this.certificatesTabSelect}>
                                    Сертификаты
                                </a>
                            </li>
                        </ul>

                        <div className="tab-content">
                            <div id="services" className="tab-pane">
                                <EmployeePremiumsServicesTable />
                            </div>
                            <div id="goods" className="tab-pane">
                                {/*<EmployeePremiumsGoodsTable />*/}
                            </div>
                            <div id="premiums" className="tab-pane">
                                {/*<EmployeePremiumsTable />*/}
                            </div>
                            <div id="cards" className="tab-pane">
                                {/*<EmployeePremiumsCardsTable />*/}
                            </div>
                            <div id="certificates" className="tab-pane">
                                {/*<EmployeePremiumsCertificatesTable />*/}
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </Modal>);
    }
}
EmployeePremiumsForSale.propTypes = {};

export default EmployeePremiumsForSale;
