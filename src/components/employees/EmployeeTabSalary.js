import React, {Component} from 'react';
import {
  Form,
  Modal,
  Row,
  Col,
  Input,
  Checkbox,
  InputNumber,
  Select,
  Collapse,
  Table
} from 'antd';
import PropTypes from 'prop-types';

import PaymentSchemeModal from './PaymentSchemeModal';
import CumSchemeModal from './CumSchemeModal';
import PercentSchemeModal from './PercentSchemeModal';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

const columns = [{
  title: 'Услуги',
  dataIndex: 'services',
  key: 'services',
}, {
  title: 'Процент',
  dataIndex: 'percent',
  key: 'percent',
}, {
  title: 'Сумма',
  dataIndex: 'summ1',
  key: 'summ1',
}, {
  title: 'Бесплатно',
  dataIndex: 'free',
  key: 'free',
}, {
  title: 'Сумма',
  dataIndex: 'summ2',
  key: 'summ2',
}, {
  title: 'Свои клиенты',
  dataIndex: 'ounClients',
  key: 'ounClients',
}, {
  title: 'Сумма',
  dataIndex: 'summ3',
  key: 'summ3',
}];

const costKinds = [
  {
    id: '1',
    name: 'от суммы'
  },
  {
    id: '2',
    name: 'от суммы 2'
  }
];

class EmployeeTabSalary extends Component {

  componentWillUpdate(nextProps, nextState) {
  }

  // handlers

  render() {
    const {
      form: {
        getFieldDecorator
      },
      payments
    } = this.props;
    return (
      <div
        id="salary"
        className="tab-pane employee_salary_tab">
        <div className="row">
          <div className="col-md-4">
            <div className="text-weight-bold">Ставка</div>
            <hr/>
          </div>
          <div className="col-md-8">
            <div className="text-weight-bold">Бонусы</div>
            <hr/>
          </div>
        </div>

        <Form>
          <Row>
            <Col span={8}>
              <FormItem label="З/П за месяц" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                {getFieldDecorator('monthSalary', {
                  rules: [{required: false, message: ''}]
                })(
                  <InputNumber
                    style={{width: '100%'}}
                    min={0}
                  />
                )}
              </FormItem>
              <FormItem label="З/П за день" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                {getFieldDecorator('daySalary', {
                  rules: [{required: false, message: ''}]
                })(
                  <InputNumber
                    style={{width: '100%'}}
                    min={0}
                  />
                )}
              </FormItem>
              <FormItem label="З/П за час" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                {getFieldDecorator('hourSalary', {
                  rules: [{required: false, message: ''}]
                })(
                  <InputNumber
                    style={{width: '100%'}}
                    min={0}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Процент от оборота" labelCol={{span: 10}} wrapperCol={{span: 12}}>
                {getFieldDecorator('turnOverPerc', {
                  rules: [{required: false, message: ''}]
                })(
                  <InputNumber
                    min={0}
                    max={100}
                    style={{textAlign: 'center', width: '100%'}}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                )}
              </FormItem>
              <FormItem wrapperCol={{span: 12, offset: 10}}>
                {getFieldDecorator('bonusFrom', {
                  rules: [{required: false, message: ''}]
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    style={{width: '100%'}}
                  >
                    {payments.map((payment) =>
                      (<Option
                        key={payment.payment_schema_id}
                        value={`${payment.payment_schema_id}`}
                      >
                        {payment.payment_schema_name}
                      </Option>))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Все товары" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {getFieldDecorator('goods', {
                  rules: [{required: false, message: ''}]
                })(
                  <Select
                    mode="multiple"
                    style={{width: '100%'}}
                  >
                    {costKinds.map((kind) =>
                      (<Option
                        key={kind.id}
                        value={`${kind.id}`}
                      >
                        {kind.name}
                      </Option>))}
                  </Select>
                )}
              </FormItem>
              <div className="salary-checkbox">
                <FormItem label="Только в рабочие дни" labelCol={{span: 15}} wrapperCol={{span: 2, offset: 7}}>
                  {getFieldDecorator('isInWorkDays', {
                    rules: [{required: false, message: ''}],
                    valuePropName: 'checked'
                  })(
                    <Checkbox
                      className="custom_checkbox"
                    />
                  )}
                </FormItem>
                <FormItem label="Расчет З/П от фактического уровня" labelCol={{span: 22}} wrapperCol={{span: 2}}>
                  {getFieldDecorator('isSalFromActLevel', {
                    rules: [{required: false, message: ''}],
                    valuePropName: 'checked'
                  })(
                    <Checkbox
                      className="custom_checkbox"
                    />
                  )}
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="text-weight-bold">Услуги
                <a
                  href="#"
                  className="pull-right edit"
                  onClick={this.props.onShowSchemeModal}
                >
                  Редактировать схемы оплаты
                  <i className="fa fa-fw fa-pencil" />
                </a></div>
              <hr/>
              <Collapse>
                <Panel header="Услуги" key="1">
                  <Table
                    columns={columns}
                    dataSource={[]}
                    bordered
                    locale={
                      {
                        emptyText: 'Нет данных'
                      }
                    }
                  />
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
}

const EmployeeTabSalaryForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const madePropsObj = (rez, curName) => {
      return {
        ...rez,
        [curName]: {
          ...props.fields[curName],
          value: props.fields[curName].value
        }
      }
    };
    return [
      'monthSalary',
      'daySalary',
      'hourSalary',
      'turnOverPerc',
      'bonusFrom',
      'isInWorkDays',
      'isSalFromActLevel',
      'goods'
    ].reduce(madePropsObj, {});


  }
})(EmployeeTabSalary);

EmployeeTabSalary.PropTypes = {
  onShowSchemeModal: PropTypes.func.isRequired,
  payments: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default EmployeeTabSalaryForm;
