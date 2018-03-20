import React, {Component} from "react";
import PropTypes from "prop-types";
import logged_user from "../../public/assets/images/logged-user.jpg";
import * as can from "../constants";

import {
  AppHeaderBills,
  AppHeaderNotificationMessage
} from './AppHeader';

let NEW_WIN_UNPAID;

class AppContent extends Component {

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.html_unpaid_for_check) {
      setTimeout(() => {
        NEW_WIN_UNPAID.document.write(nextProps.html_unpaid_for_check);
        NEW_WIN_UNPAID.print();
      }, 100);
      this.props.onClearHTMLForUnpaidCheck();
    }
  }

  componentDidMount() {
    // this.props.onLoadNotifications();

    const timerId = setInterval(() => {
      // this.props.onLoadNotifications();
    }, 600000);

    this.setState({
      timerId: timerId
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  viewAllClicked = () => {
    let dataArray = [];

    this.props.notificationsNew.forEach((notification) => {
      dataArray.push(notification.message.message_id);
    });

    let data = {
      items: dataArray
    };

    this.props.onNotificationChangeState(data);
    this.props.onViewAll();
  };

  printClick = (appointment_id) => {
    this.props.onPrintUnpaidBill(appointment_id);
    NEW_WIN_UNPAID = window.open("about:blank");
  };

  notificationClicked = (id) => {
    this.props.onNotificationChangeState({
      items: [id]
    });
  };

  renderNotPaidBills = () => {
    if (this.props.unpaid_bills.length) {
      const messages = this.props.unpaid_bills.map((bill, i) => {
        return (
          <AppHeaderBills
            bill={bill}
            key={'bill_' + bill.appointment_id}
            onPrintClick={this.printClick}
            showBill={this.props.onShowBill}
          />
        )
      });

      return (
        <ul>
          {messages}
        </ul>
      );
    }

    return (
      <div className="text-center">
        <label className="note">Неоплаченных счетов нет</label>
      </div>
    );
  };

  renderNotifications = () => {
    if (this.props.notificationsNew.length) {
      const messages = this.props.notificationsNew.map((notification, i) => {
        return (
          <AppHeaderNotificationMessage
            key={'notification_' + notification.message.message_id}
            message={{
              ...notification.message,
              created: new Date(notification.message.date_created)
            }}
            onClick={this.notificationClicked}
          />
        )
      });

      return (
        <ul>
          {messages}
        </ul>
      );
    }

    return (
      <div className="text-center">
        <label className="note">Уведомлений нет</label>
      </div>
    );
  };

  render() {
    const page = this.props.page || {title: '', icon: 'home'};

    const user = {
      name: "",
      photo: "",
      role_name: "",
      salon: "",
      ...this.props.user
    };

    return (
      <section role="main" className="content-body">
        <header className="page-header">
          <h2>{page.title}</h2>


          <div className={`header-right ${(!user.name.length || !user.role_name.length) ? 'mt-xs' : ''}`}>
            <ul className="notifications" style={{marginLeft: '10px'}}>
              <li>
                <a href="#" className="dropdown-toggle notification-icon" data-toggle="dropdown">
                  <i className="fa fa-shopping-cart"/>
                  <span
                    className={this.props.unpaid_bills.length ? "badge" : "hide"}
                    style={{backgroundColor: 'red'}}
                  >
                                    {this.props.unpaid_bills.length}
                                </span>
                </a>

                <div className="dropdown-menu notification-menu" style={{width: 300}}>
                  <div className="notification-title">
                                    <span className="pull-right label label-default">
                                        {this.props.unpaid_bills.length}
                                    </span>
                    Неоплаченные счета
                  </div>

                  <div className="content" style={{
                    minHeight: 150,
                    maxHeight: 350,
                    overflowY: 'scroll'
                  }}>
                    {this.renderNotPaidBills()}
                  </div>
                </div>
              </li>
            </ul>
            <ul className="notifications" style={{marginLeft: '10px', marginRight: '10px'}}>
              <li>
                <a href="#" className="dropdown-toggle notification-icon" data-toggle="dropdown">
                  <i className="fa fa-bell"/>
                  <span
                    className={this.props.notificationsNew.length ? "badge" : "hide"}
                    style={{backgroundColor: 'red'}}
                  >
                                    {this.props.notificationsNew.length}
                                </span>
                </a>

                <div className="dropdown-menu notification-menu" style={{width: 300}}>
                  <div className="notification-title">
                                    <span className="pull-right label label-default">
                                        {this.props.notificationsNew.length}
                                    </span>
                    Уведомления
                  </div>

                  <div className="content" style={{
                    minHeight: 150,
                    maxHeight: 350,
                    overflowY: 'scroll'
                  }}>
                    {this.renderNotifications()}
                  </div>
                  <div className="notification-foot">
                    <hr/>
                    <div className="text-right">
                      <a href="#"
                         className="view-more"
                         style={{padding: 10}}
                         onClick={(e) => {
                           e.preventDefault();

                           this.viewAllClicked();
                         }}>
                        Показать все
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <span className="separator"/>

            <div id="userbox" className="userbox">
              <a href="#" data-toggle="dropdown">
                <figure className="profile-picture">
                  <img
                    src={user.photo ? (can.API_HOST + user.photo) : logged_user}
                    alt={user.name}
                    className="img-circle"/>
                </figure>
                <div className="profile-info">
                  <span className="name">{user.name}</span>
                  <span className="role">{user.role_name}</span>
                </div>

                <i className="fa custom-caret"/>
              </a>

              <div className="dropdown-menu">
                <ul className="list-unstyled">
                  <li className="divider"/>
                  <li>
                    <a role="menuitem" tabIndex="-1" href="/login" onClick={(e) => {
                      e.preventDefault();

                      this.props.onSignOut();
                    }}>
                      <i className="fa fa-sign-out"/> Выход
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>


          <div className="right-wrapper pull-right">
            <ol className="breadcrumbs mr-xlg">
              <li>
                <i className={"fa fa-" + (page.icon || 'home')} style={{fontSize: '1rem'}} />
              </li>
              <li>
                <span>{page.title}</span>
              </li>
            </ol>
          </div>
        </header>
        {this.props.children}
      </section>
    );
  }
}

AppContent.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }),
  onPrintUnpaidBill: PropTypes.func.isRequired,
  onClearHTMLForUnpaidCheck: PropTypes.func.isRequired,
  unpaid_bills: PropTypes.arrayOf(PropTypes.any).isRequired,
  onNotificationChangeState: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  onViewAll: PropTypes.func.isRequired,
  onShowBill: PropTypes.func.isRequired
};

export default AppContent;