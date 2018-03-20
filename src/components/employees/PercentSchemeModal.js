import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Modal,
  Row,
  Col,
  Input,
  Checkbox,
  InputNumber,
  Select
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const costKinds = [
  {
    id: '1',
    name: 'от полной стоимости'
  },
  {
    id: '2',
    name: 'от стоимости со скидкой'
  }
];

class PercentSchemeModal extends Component {
  state = {};

  // handlers

  render() {

    const {
      form: {
        getFieldDecorator
      },
    } = this.props;

    return (
      <Modal
        title="Процентная схема"
        visible={true}
        onOk={this.props.onModalClose}
        onCancel={this.props.onModalClose}
        cancelText="Редактировать"
        okText="Удалить"
        width={'50%'}
        footer={[
          <button
            className="btn btn-primary btn-sm"
            onClick={this.props.onSave}
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
        <div className="employee_modal_content">
          <Form layout="vertical">
            <Row>
              <Col span={12} style={{padding: 10}}>
                <FormItem label="Название">
                  {getFieldDecorator('name', {
                    rules: [{required: false, message: ''}]
                  })(
                    <Input
                      type="text"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} style={{padding: 10}}>
                <FormItem label="Краткое название">
                  {getFieldDecorator('shortName', {
                    rules: [{required: false, message: ''}]
                  })(
                    <Input
                      type="text"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <Row>
                  <h5>
                    Формула
                  </h5>
                  <hr className="mr-lg"/>
                </Row>
                <Row>
                  <FormItem className="mb-none">
                    {getFieldDecorator('isCalculFromCardCost', {
                      rules: [{required: false, message: ''}]
                    })(
                      <Checkbox className="custom_checkbox">
                        Рассчитывать стоимость от стоимости по карте
                      </Checkbox>
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <Col span={24}>
                    <h5>От полной стоимости отнять:</h5>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem className="mb-none">
                      {getFieldDecorator('isSaleToClient', {
                        rules: [{required: false, message: ''}]
                      })(
                        <Checkbox className="custom_checkbox">
                          скидку, предоставленную клиенту
                        </Checkbox>
                      )}
                    </FormItem>
                    <FormItem className="mb-none">
                      {getFieldDecorator('isBonusSum', {
                        rules: [{required: false, message: ''}]
                      })(
                        <Checkbox className="custom_checkbox">
                          сумму, оплаченную бонусами
                        </Checkbox>
                      )}
                    </FormItem>
                    <FormItem className="mb-none">
                      {getFieldDecorator('isDepositSum', {
                        rules: [{required: false, message: ''}]
                      })(
                        <Checkbox className="custom_checkbox">
                          сумму, оплаченную депозитом
                        </Checkbox>
                      )}
                    </FormItem>
                    <FormItem className="mb-none">
                      {getFieldDecorator('isSertificateSum', {
                        rules: [{required: false, message: ''}]
                      })(
                        <Checkbox className="custom_checkbox">
                          сумму, оплаченную сертификатом
                        </Checkbox>
                      )}
                    </FormItem>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isPersFromSum', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('persFromSum', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              max={100}
                              style={{textAlign: 'center'}}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={16}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('costKindId', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Select
                              showSearch
                              placeholder={'Выберите вид стоимости'}
                              optionFilterProp="children"
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
                      </Col>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isPersFromPrice', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('persFromPrice', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label>цены</label>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isPersFromCost', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('persFromCost', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label>себестоимости</label>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isPersFromFactCost', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('persFromFactCost', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label>фактической себестоимости</label>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isPersFromPlanCost', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('persFromPlanCost', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              max={100}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label>плановой себестоимости</label>
                      </Col>
                    </Row>

                    <Row>
                      <h5>
                        Дополнительно
                      </h5>
                      <hr className="mr-lg"/>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isAdditUAH', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('additUAH', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              style={{width: '90%'}}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label> грн.</label>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isAdditHour', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('additHour', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              style={{width: '90%'}}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label> в час </label>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={1}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('isAdditMinute', {
                            rules: [{required: false, message: ''}]
                          })(
                            <Checkbox className="custom_checkbox"/>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem className="mb-none">
                          {getFieldDecorator('additMinute', {
                            rules: [{required: false, message: ''}]
                          })(
                            <InputNumber
                              min={0}
                              style={{width: '90%'}}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8} style={{paddingTop: 5}}>
                        <label> грн. в минуту </label>
                      </Col>
                    </Row>

                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <h5>
                    Просмотр формулы
                  </h5>
                  <hr/>
                </Row>
                <Row>
                  Насчитать зарплату от полной стоимости
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  };
}

const PercentSchemeModalForm = Form.create({
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
      'name',
      'shortName',
      'isCalculFromCardCost',
      'isSaleToClient',
      'isBonusSum',
      'isSertificateSum',
      'isPersFromSum',
      'persFromSum',
      'costKindId',
      'isPersFromPrice',
      'persFromPrice',
      'isPersFromCost',
      'persFromCost',
      'isPersFromFactCost',
      'persFromFactCost',
      'isPersFromPlanCost',
      'persFromPlanCost',
      'isAdditUAH',
      'additUAH',
      'isAdditHour',
      'additHour',
      'isAdditMinute',
      'additMinute'
    ].reduce(madePropsObj, {});


  }
})(PercentSchemeModal);

PercentSchemeModal.PropTypes = {
  onModalClose: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default PercentSchemeModalForm;
