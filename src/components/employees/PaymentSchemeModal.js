import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';

const paymentList = [
  {
    name: 'Визаж',
    id: 1
  },
  {
    name: 'Косметология',
    id: 2
  },
  {
    name: 'Массаж',
    id: 3
  },
  {
    name: 'Маникюр',
    id: 4
  }
];

class PaymentSchemeModal extends Component {
  state = {
    activePaymentScheme: undefined
  };

  // handlers

  render() {
    const {
      activePaymentScheme
    } = this.state;
    return (
      <Modal
          title="Схемы оплаты"
          visible={true}
          onOk={this.props.onModalClose}
          onCancel={this.props.onModalClose}
          cancelText="Редактировать"
          okText="Удалить"
          footer={[
            <div className="btn-group pull-left" key="1">
              <button
                type="button"
                className="btn btn-default dropdown-toggle btn-sm"
                data-toggle="dropdown"
              >
                Добавить
                <span
                  className="caret"
                  style={{marginLeft: 5}}
                />
              </button>
              <ul
                className="dropdown-menu"
                style={{fontSize: 12}}
                role="menu">
                <li>
                  <a href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onSelectScheme(1);
                  }}>
                    Процентная схема
                  </a>
                </li>
                <li>
                  <a href="#"
                     onClick={(e) => {
                       e.preventDefault();
                       this.props.onSelectScheme(2);
                     }}>
                    Накопительная схема
                  </a>
                </li>
              </ul>
            </div>,
            <button
              className="btn btn-primary btn-sm"
              onClick={this.props.onModalClose}
              disabled={!this.state.activePaymentScheme}
              key="2"
            >
              <i
                className="fa fa=fw fa-pencil"
                style={{marginRight: 5}}
              />
              Редактировать
            </button>,
            <button
              className="btn btn-default btn-sm"
              onClick={this.props.onModalClose}
              disabled={!this.state.activePaymentScheme}
              key="3"
            >
              <i
                className="fa fa=fw fa-trash"
                style={{marginRight: 5}}
              />
              Удалить
            </button>,
          ]}>
          <ul className="list-unstyled">
            {paymentList.map((item) => (
              <li key={item.id.toString()}>
                <a
                  href="#"
                  className={`employees_payment_schemes_list ${(activePaymentScheme && item.id === activePaymentScheme) ? 'active' : '' }`}
                  onClick={() => {this.setState({activePaymentScheme: item.id})}}

                >
                  <i
                    className="fa fa-fw fa-list"
                    style={{marginRight: 5}}
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </Modal>
    );
  };
}

PaymentSchemeModal.PropTypes = {
  onModalClose: PropTypes.func.isRequired,
  onSelectScheme: PropTypes.func.isRequired
};

export default PaymentSchemeModal;
