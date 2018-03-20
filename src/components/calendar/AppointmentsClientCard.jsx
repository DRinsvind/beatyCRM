import React, {Component} from 'react';
import PropTypes from 'prop-types';
// CONSTANTS
import CLIENT_PHOTO_DEFAULT from '../../../public/assets/images/dummy/client.jpg';
import {API_HOST} from '../../constants';

const $ = window.jQuery;
const PHONE_REGEX = /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/;

/**
 * Client information card.
 */
class AppointmentsClientCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detailed: false
        };
    }

    render() {
        if (this.props.data === undefined) {
            return null;
        }

        const client = this.props.data;
        let phone;

        let segs = PHONE_REGEX.exec(client.phone);
        if (segs !== null) {
            phone = ('+' + segs[1] + ' (' + segs[2] + ') ' + segs[3] + '-' + segs[4] + '-' + segs[5]);
        } else {
            phone = client.phone;
        }

        return (
            <section className="panel mb-none">
                <div className="panel-body pb-md pt-xs"
                     style={{background: '#ECEDF0', borderRadius: '0px'}}>
                    <div className="row mb-xs">
                        <div className="col-md-12 text-right">
                            <a href="#"
                               onClick={this.cancelAction}>
                                <i className="fa fa-fw fa-times" />
                            </a>
                            <a href="#"
                               className="mr-sm"
                               onClick={this.detailsAction}>
                                <i className={"fa fa-fw fa-chevron-" + (this.state.detailed ? 'up' : 'down')} />
                            </a>
                        </div>
                    </div>
                    <div id="clientDetailsFull" className={"row"} style={{display: 'none'}}>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-5 text-center">
                                    <div className="img-rounded employee-image" style={{width: '100%'}}>
                                        <img className="img-responsive"
                                             src={client.photo ? API_HOST + client.photo : CLIENT_PHOTO_DEFAULT}
                                             alt=""/>
                                    </div>
                                    <div className={"label label-client-" + client.category_id}
                                         style={{fontSize: '0.8461538462em', fontWeight: '300', color: '#21262d'}}
                                    >{client.category_name}</div>
                                </div>
                                <div className="col-md-7 pl-xs">
                                    <div style={{
                                        fontSize: '1.0769230769em',
                                        color: '#21262d',
                                        fontWeight: '700',
                                        marginTop: '0'
                                    }}>
                                        {client.last_name + ' ' + client.first_name + ' ' + client.second_name}
                                    </div>
                                    <div className="mt-md" style={{fontSize: '1.1em'}}>
                                        <i className="fa fa-fw fa-phone pr-md" />
                                        <span style={{color: "#0088cc"}}>{phone}</span>
                                    </div>
                                    <span>{client.note}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="clientDetailsSmall" className={"row"}>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-3 pr-sm">
                                    <div className="img-rounded employee-image" style={{width: '100%'}}>
                                        <img className="img-responsive"
                                             src={client.photo ? API_HOST + client.photo : CLIENT_PHOTO_DEFAULT}
                                             alt=""/>
                                    </div>
                                </div>
                                <div className="col-md-9 pl-xs">
                                    <div style={{
                                        fontSize: '1.0em',
                                        color: '#21262d',
                                        fontWeight: '700',
                                        marginTop: '0'
                                    }}>
                                        {this.shortClientName(client)}
                                    </div>
                                    <div className={"label mr-xs label-client-" + client.category_id}
                                         style={{fontSize: '0.8461538462em', fontWeight: '300', color: '#21262d'}}
                                    >{client.category_name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    shortClientName = (client) => {
        let fullName = client.last_name;

        if (client.first_name) {
            fullName += ' ' + client.first_name[0].toUpperCase() + '.';
        }

        if (client.second_name) {
            fullName += ' ' + client.second_name[0].toUpperCase() + '.';
        }

        return fullName;
    };

    // EVENTS
    cancelAction = (e) => {
        e.preventDefault();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    detailsAction = (e) => {
        e.preventDefault();

        $('#clientDetailsFull').stop().animate({
            height: "toggle",
            opacity: "toggle"
        });
        $('#clientDetailsSmall').stop().animate({
            height: "toggle",
            opacity: "toggle"
        });

        this.setState({
            detailed: !this.state.detailed
        });
    };
}

AppointmentsClientCard.propTypes = {
    data: PropTypes.object,
    onCancel: PropTypes.func,
    // onDetails: PropTypes.func,
};

export default AppointmentsClientCard;