import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import Select2 from "react-select2-wrapper";

import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;

const sumToPay = [
  {
    name: 'от суммы',
    id: 1
  },
  {
    name: 'от суммы - скидка',
    id: 2
  },
  {
    name: 'от суммы - себест.',
    id: 3
  },
  {
    name: 'от себестоимости',
    id: 4
  }
];

class CumSchemeModal extends Component {
  state = {};

  componentDidUpdate() {
    $('#dateSelect').datepicker(
      {
        language: 'ru',
        weekStart: '1',
        format: 'yyyy/mm/dd'
      }
    )
      .off('changeDate').on('changeDate', (e) => {
      // this.props.changeBirthday(e);
    });
  };

  // handlers

  render() {
    return (
      <Modal
        title="Накопительная схема"
        visible={true}
        onOk={this.props.onModalClose}
        onCancel={this.props.onModalClose}
        cancelText="Редактировать"
        okText="Удалить"
        width={'50%'}
        footer={[
          <button
            className="btn btn-primary btn-sm"
            onClick={this.props.onModalClose}
            key="0"
          >
            Сохранить
          </button>,
          <button
            className="btn btn-default btn-sm"
            onClick={this.props.onModalClose}
            key="1"
          >
            Отмена
          </button>,
        ]}>
        <div className="form-horizontal employee_modal_content">
          <div className="row">
            <div className="col-md-3 control-label">
              <label className="pull-right">
                Название
              </label>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="name"
                className="form-control"
              />
            </div>
            <div className="col-md-3 control-label">
              <label className="pull-right">
                Краткое название
              </label>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="shortName"
                className="form-control"
              />
            </div>
          </div>

          <div className="row mt-md">
            <div className="col-md-3">
              <label className="pull-right control-label">
                Величина накопления
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="text"
                name="curCount"
                className="form-control"
              />
            </div>
          </div>

          <h5
            style={{marginTop: 40}}
          >
            Период накопления
          </h5>
          <hr/>

          <div className="row">
            <div className="col-md-2">
              <div className="checkbox-custom checkbox-primary">
                  <input
                    type="checkbox"
                    name="isMounth"
                    className="form-control"
                  />
                  <label className="">
                    Месяц
                  </label>
              </div>
              <div className="checkbox-custom checkbox-primary">
                <input
                  type="checkbox"
                  name="isInDays"
                  className="form-control"
                />
                <label className="">
                  В днях
                </label>
              </div>
            </div>

            <div className="col-md-2">
              <label className="control-label pull-right">Продолжительность</label>
            </div>

            <div className="col-md-2">
              <input
                type="number"
                min={0}
                name="duration"
                className="form-control"
              />
            </div>

            <div className="col-md-2">
              <label className="control-label pull-right">Начиная с</label>
            </div>

            <div className="col-md-2">
              <input
                type="text"
                name="startFrom"
                id="dateSelect"
                className="form-control"
              />
            </div>
          </div>

          <h5
            style={{marginTop: 40}}
          >
            Период накопления
          </h5>
          <hr/>
          <div className="row">
            <div className="col-md-1">
              <label className="control-label pull-right">от</label>
            </div>
            <div className="col-md-2">
              <label className="control-label">0.00 грн.</label>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                name="from"
                className="form-control"
              />
            </div>
            <div className="col-md-1">
              <label className="control-label pull-right">до</label>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="to"
                className="form-control"
                min={0}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="percentFromTo"
                className="form-control mr-xs"
                min={0}
                style={{width: '80%', display: 'inline-block'}}
              />
              <label className="control-label">
                %
              </label>
            </div>
            <div className="col-md-1">
              <label className="control-label pull-right">Детальнее</label>
            </div>
          </div>


          <div className="row mt-md">
            <div className="col-md-1">
              <label className="control-label pull-right">свыше</label>
            </div>
            <div className="col-md-2">
              <label className="control-label">0.00 грн.</label>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                name="over"
                className="form-control"
              />
            </div>
            <div className="col-md-1">
            </div>
            <div className="col-md-2">
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control mr-xs"
                style={{width: '80%', display: 'inline-block'}}
                min={0}
              />
              <label className="control-label">
                %
              </label>
            </div>
            <div className="col-md-1">
              <label className="control-label pull-right">Детальнее</label>
            </div>
          </div>

          <div className="row mt-xlg">
            <div className="col-md-3">
              <label className="control-label pull-right">Сумма для расчета</label>
            </div>
            <div className="col-md-9">
              <Select2 className="form-control"
                       options={{placeholder: 'Выберите сумму для расчета', theme: 'bootstrap'}}
                       data={sumToPay.map((item) => ({id: item.id, text: item.name}))}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  };
}

CumSchemeModal.PropTypes = {
  onModalClose: PropTypes.func.isRequired
};

export default CumSchemeModal;
