import React, {Component} from "react";
import PropTypes from "prop-types";
import LOGOTYPE from "../../public/assets/images/logotype.png";
import logged_user from "../../public/assets/images/logged-user.jpg";
import * as can from "../constants";
import {FORMAT_DATE_WITH_TIME, FORMAT_TIME_WITH_OUT_SEC} from '../utils';

/**
 *
 */
export class AppHeaderNotificationMessage extends Component {
  render() {
    const {message} = this.props;

    return (
      <li>
        <a href="#"
           className="clearfix"
           style={{
             whiteSpace: 'nowrap',
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             width: 276
           }}
           onClick={(e) => {
             e.preventDefault();

             this.props.onClick(message.message_id);
           }}>

          <div className="image">
            <i className="fa fa-sm fa-bell"/>
          </div>
          <div className="title" style={{
            overflow: 'hidden', textOverflow: 'ellipsis'
          }}>{message.title}</div>
          <div className="message" style={{
            overflow: 'hidden', textOverflow: 'ellipsis'
          }}>{message.body}</div>
          <div className="message text-right" style={{
            fontSize: '0.7272727273em',
            color: '#555555'
          }}>
            {FORMAT_DATE_WITH_TIME(message.created)}
          </div>
        </a>
      </li>
    );
  }

}

AppHeaderNotificationMessage.propTypes = {
  onClick: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
};

export class AppHeaderBills extends Component {
  render() {
    return (
      <li>
        <a href="#"
           className="clearfix"
           style={{
             whiteSpace: 'nowrap',
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             width: 276
           }}>

          <div onClick={(e) => {
            e.preventDefault();
            this.props.showBill(this.props.bill.appointment_id);
          }}>
            <div className="image">
              <i className="fa fa-sm fa-shopping-cart"/>
            </div>
            <div className="title" style={{
              overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {this.props.bill.client}
            </div>
            <div className="message">
              <div className="form-inline">
                <label style={{
                  overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {'Мастер ' + FORMAT_TIME_WITH_OUT_SEC(new Date())}
                </label>
                <label className="pull-right" style={{
                  fontSize: '1.2em',
                  color: '#555555',
                  fontWeight: 'bold'
                }}>
                  {parseFloat(this.props.bill.total).toFixed(2)}
                </label>
              </div>
            </div>
          </div>
          <div className="message">
            <button className="btn btn-xs btn-primary" style={{marginLeft: '15%'}} onClick={(e) => {
              e.preventDefault();
              this.props.onPrintClick(this.props.bill.appointment_id);
            }}>
              <i className="fa fa-sm fa-print" /> Печать
            </button>
          </div>
        </a>
      </li>
    );
  }
}

AppHeaderBills.propTypes = {
  bill: PropTypes.object.isRequired,
  onPrintClick: PropTypes.func.isRequired,
  showBill: PropTypes.func.isRequired,
  onClearHTMLForUnpaidCheck: PropTypes.func.isRequired
};
