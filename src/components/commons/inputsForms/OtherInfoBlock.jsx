import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputElement from "react-input-mask";

import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;

class OtherInfoBlock extends Component {
    componentDidUpdate() {
        $('#passDateSelect').datepicker(
            {
                language: 'ru',
                weekStart: '1',
                format: 'yyyy/mm/dd'
            }
        )
            .off('changeDate').on('changeDate', (e) => {
            this.props.changeDate(e);
        });
    };

    render() {
        console.log('this.props', this.props);
        return (
            <fieldset>
                <div className={"form-group" + (this.props.errors['adr_city'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Город</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="adr_city"
                               placeholder="Киев"
                               value={this.props.person.adr_city || ""}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['adr_city'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['adr_city'] ? this.props.errors['adr_city'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['adr_street'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Улица</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="adr_street"
                               placeholder="Улица"
                               value={this.props.person.adr_street || ""}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['adr_street'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['adr_street'] ? this.props.errors['adr_street'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['adr_house'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Дом, Квартира</label>
                    <div className="col-md-4" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="adr_house"
                               placeholder="Дом"
                               value={this.props.person.adr_house || ""}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['adr_house'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['adr_house'] ? this.props.errors['adr_house'].message : ''}
                        </label>
                    </div>
                    <div className="col-md-3" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="adr_apartment"
                               placeholder="Квартира"
                               value={this.props.person.adr_apartment || ""}
                               onChange={this.props.onNumberInputChange}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['adr_apartment'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['adr_apartment'] ? this.props.errors['adr_apartment'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['adr_zip'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Индекс</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <InputElement
                            className="form-control"
                            name="adr_zip"
                            placeholder="Индекс"
                            mask="99999"
                            onChange={this.props.onNumberInputChange}
                            onBlur={this.props.onFocusLos}
                        />
                        <label className={this.props.errors['adr_zip'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['adr_zip'] ? this.props.errors['adr_zip'].message : ''}
                        </label>
                    </div>
                </div>
                <hr className="dotted tall mb-md"/>
                <div className={"form-group" + (this.props.errors['pasp_ser'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Серия, номер</label>
                    <div className="col-md-3" style={{textAlign: 'right'}}>
                        <InputElement
                            className="form-control"
                            name="pasp_ser"
                            placeholder="Серия"
                            mask="aa"
                            onChange={this.props.inputChanged}
                            onBlur={this.props.onFocusLos}
                        />
                        <label className={this.props.errors['pasp_ser'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['pasp_ser'] ? this.props.errors['pasp_ser'].message : ''}
                        </label>
                    </div>
                    <div className="col-md-4" style={{textAlign: 'right'}}>
                        <InputElement
                            className="form-control"
                            name="pasp_ser"
                            placeholder="Номер"
                            mask="999999"
                            onChange={this.props.onNumberInputChange}
                            onBlur={this.props.onFocusLos}
                        />
                        <label className={this.props.errors['pasp_num'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['pasp_num'] ? this.props.errors['pasp_num'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['pasp_date'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Выдан</label>
                    <div className="col-md-7">
                        <div className="input-group" style={{textAlign: 'right'}}>
                            <span className="input-group-addon">
                                <i className="fa fa-fw fa-calendar"></i>
                            </span>
                            <input type="text"
                                   id="passDateSelect"
                                   className="form-control"
                                   name="pasp_date"
                                   value={this.props.person.pasp_date ? this.props.person.pasp_date.replace(/-/g, '/') : ''}
                                   onClick={() => this.props.clearDateData('pasp_date')}
                                   onChange={(e) => {}}
                            />
                        </div>
                        <label className={this.props.errors['pasp_date'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['pasp_date'] ? this.props.errors['pasp_date'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['pasp_whom'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">Кем выдан</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <input type="text"
                               className="form-control"
                               name="pasp_whom"
                               value={this.props.person.pasp_whom || ""}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>
                        <label className={this.props.errors['pasp_whom'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['pasp_whom'] ? this.props.errors['pasp_whom'].message : ''}
                        </label>
                    </div>
                </div>
                <div className={"form-group" + (this.props.errors['tax_number'] ? ' has-error' : '')}>
                    <label className="col-md-3 control-label">ИНН</label>
                    <div className="col-md-7" style={{textAlign: 'right'}}>
                        <InputElement
                            className="form-control"
                            name="tax_number"
                            mask="9999999999"
                            onChange={this.props.onNumberInputChange}
                            onBlur={this.props.onFocusLos}
                        />


                        {/*<input type="text"
                               className="form-control"
                               name="tax_number"
                               value={this.props.person.tax_number || ""}
                               onChange={this.props.inputChanged}
                               onBlur={this.props.onFocusLos}/>*/}
                        <label className={this.props.errors['tax_number'] ? 'control-label' : 'hidden'}>
                            {this.props.errors['tax_number'] ? this.props.errors['tax_number'].message : ''}
                        </label>
                    </div>
                </div>
            </fieldset>
        )
    }
}

OtherInfoBlock.propTypes = {
    person: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    inputChanged: PropTypes.func.isRequired,
    clearDateData: PropTypes.func.isRequired,
    onNumberInputChange: PropTypes.func.isRequired,
    onFocusLos: PropTypes.func.isRequired
};

export default OtherInfoBlock;
