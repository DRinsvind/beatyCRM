import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputElement from 'react-input-mask';

class VendorsForm extends Component {
  render() {
    let {imagePreviewUrl} = this.props.image;
    let {personImagePreviewUrl} = this.props.photo;
    let $imagePreview = null;
    let $personImagePreviewUrl = null;

    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          className="img-responsive"
          src={imagePreviewUrl}
          alt="Фото поставщика"
          style={{boxShadow: '0 0 0 6px #fccdd3'}}
        />
      );
    }

    if (personImagePreviewUrl) {
      $personImagePreviewUrl = (
        <img
          className="img-responsive"
          src={personImagePreviewUrl}
          alt="Фото контактного лица"
          style={{boxShadow: '0 0 0 6px #fccdd3'}}
        />
      );
    }

    return (
      <form className="form-horizontal">
        <fieldset>
          <div className="row pb-lg">
            <div className="col-md-2">
              <div className="img-rounded employee-image"
                   style={{width: '100%', border: '15px solid #dfdfdf'}}>
                {$imagePreview}
              </div>
              {
                !this.props.viewMode &&
                <label
                  id="button-photo"
                  className="btn btn-primary mr-xs mb-sm mt-lg"
                  style={{width: '60px'}}
                >
                  <i className="fa fa-fw fa-plus"/>
                  <i className="fa fa-fw fa-camera-retro"/>
                  <input
                    type="file"
                    onChange={this.props.onImageChange}
                    style={{display: 'none'}}
                  />
                </label>
              }
            </div>
            <div className="col-md-5">
              <div className="text-weight-bold">
                Контакты
              </div>
              <hr/>
              <div className={"form-group fs-12" + (this.props.errors['short_name'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">
                  Название
                </label>
                <div className="col-md-12"
                     style={{textAlign: 'right'}}
                >
                  <input type="text"
                         className="form-control fs-12"
                         name="short_name"
                         onChange={this.props.onInputChanged}
                         onBlur={this.props.onFocusLos}
                         disabled={this.props.viewMode}
                         value={this.props.vendor.short_name ? this.props.vendor.short_name : ''}
                  />
                  <label
                    className={this.props.errors['short_name'] ? 'control-label' : 'hidden'}
                  >
                    {
                      this.props.errors['short_name']
                        ? this.props.errors['short_name'][0]
                        : ''
                    }
                  </label>
                </div>
              </div>
              <div className={"form-group fs-12" + (this.props.errors['contacts'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">
                  Телефон
                </label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                  <InputElement
                    className="form-control fs-12"
                    mask="+38 (099) 999-99-99"
                    placeholder="+380 (67) 123-12-34"
                    name="contacts"
                    onChange={this.props.onInputChanged}
                    onBlur={this.props.onPhoneFocusLos}
                    disabled={this.props.viewMode}
                    value={this.props.vendor.contacts ? this.props.vendor.contacts : ''}
                  />
                  <label
                    className={this.props.errors['contacts'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['contacts'] ? this.props.errors['contacts'][0] : ''}
                  </label>
                </div>
              </div>
              <div className={"form-group fs-12" + (this.props.errors['address'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Адрес</label>
                <div className="col-md-12"
                     style={{textAlign: 'right'}}>
                  <InputElement
                    className="form-control fs-12"
                    placeholder="Адрес"
                    name="address"
                    onChange={this.props.onInputChanged}
                    onBlur={this.props.onFocusLos}
                    disabled={this.props.viewMode}
                    value={this.props.vendor.address ? this.props.vendor.address : ''}
                  />
                  <label
                    className={this.props.errors['address'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['address'] ? this.props.errors['address'][0] : ''}
                  </label>
                </div>
              </div>
              <div className={"form-group fs-12" + (this.props.errors['website'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Веб-сайт</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                  <InputElement
                    className="form-control fs-12"
                    placeholder="Веб-сайт"
                    name="website"
                    onChange={this.props.onInputChanged}
                    onBlur={this.props.onFocusLos}
                    disabled={this.props.viewMode}
                    value={this.props.vendor.website ? this.props.vendor.website : ''}
                  />
                  <label
                    className={this.props.errors['website'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['website'] ? this.props.errors['website'][0] : ''}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="text-weight-bold">Реквизиты</div>
              <hr/>
              <div className={"form-group fs-12" + (this.props.errors['code'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">код ЕДРПОУ</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                  <input type="text"
                         className="form-control fs-12"
                         name="code"
                         onChange={this.props.onInputChanged}
                         onBlur={this.props.onFocusLos}
                         disabled={this.props.viewMode}
                         value={this.props.vendor.code ? this.props.vendor.code : ''}
                  />
                  <label
                    className={this.props.errors['code'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['code'] ? this.props.errors['code'][0] : ''}
                  </label>
                </div>
              </div>
              <div className={"form-group fs-12" + (this.props.errors['full_name'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Оф. название</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                                                <textarea
                                                  className="form-control fs-12"
                                                  name="full_name"
                                                  rows="1"
                                                  onChange={this.props.onInputChanged}
                                                  onBlur={this.props.onFocusLos}
                                                  disabled={this.props.viewMode}
                                                  value={this.props.vendor.full_name ? this.props.vendor.full_name : ''}
                                                />
                  <label
                    className={this.props.errors['full_name'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['full_name'] ? this.props.errors['full_name'][0] : ''}
                  </label>
                </div>
              </div>
              <div className={"form-group fs-12" + (this.props.errors['requisites'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Реквизиты</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                                                <textarea
                                                  className="form-control fs-12"
                                                  name="requisites"
                                                  rows="2"
                                                  onChange={this.props.onInputChanged}
                                                  onBlur={this.props.onFocusLos}
                                                  disabled={this.props.viewMode}
                                                  value={this.props.vendor.requisites ? this.props.vendor.requisites : ''}
                                                />
                  <label
                    className={this.props.errors['requisites'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['requisites'] ? this.props.errors['requisites'][0] : ''}
                  </label>
                </div>
              </div>

            </div>
          </div>

          <hr className="pink mt-xlg mb-xlg"/>

          <div className="row pt-md mb-lg">
            <div className="col-md-2">
              <div className="img-rounded employee-image" style={{width: '100%', border: '15px solid #dfdfdf'}}>
                {$personImagePreviewUrl}
              </div>
              {!this.props.viewMode && <label id="button-photo" className="btn btn-primary mr-xs mb-sm mt-lg">
                <i className="fa fa-fw fa-plus"/>
                <i className="fa fa-fw fa-user"/>
                <input type="file" onChange={this.props.onPersonImageChange} style={{display: 'none'}}/>
              </label>}
            </div>

            <div className="col-md-5">
              <div className="text-weight-bold">Контактное лицо</div>
              <hr/>
              <div
                className={"form-group fs-12" + (this.props.errors['last_name'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Фамилия</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                  <input type="text"
                         className="form-control fs-12"
                         name="last_name"
                         placeholder="Иванов"
                         onChange={this.props.onPersonInputChanged}
                         onBlur={this.props.onFocusLos}
                         disabled={this.props.viewMode}
                         value={this.props.vendor.person.last_name ? this.props.vendor.person.last_name : ''}
                  />
                  <label
                    className={this.props.errors['last_name'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['last_name'] ? this.props.errors['last_name'][0] : ''}
                  </label>
                </div>
              </div>
              <div
                className={"form-group fs-12" + (this.props.errors['first_name'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Имя</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                  <input type="text"
                         className="form-control fs-12"
                         name="first_name"
                         placeholder="Иван"
                         onChange={this.props.onPersonInputChanged}
                         onBlur={this.props.onFocusLos}
                         disabled={this.props.viewMode}
                         value={this.props.vendor.person.first_name ? this.props.vendor.person.first_name : ''}
                  />
                  <label
                    className={this.props.errors['first_name'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['first_name'] ? this.props.errors['first_name'][0] : ''}
                  </label>
                </div>
              </div>
              <div
                className={"form-group fs-12" + (this.props.errors['second_name'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Отчество</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                  <input type="text"
                         className="form-control fs-12"
                         name="second_name"
                         placeholder="Иванович"
                         onChange={this.props.onPersonInputChanged}
                         onBlur={this.props.onFocusLos}
                         disabled={this.props.viewMode}
                         value={this.props.vendor.person.second_name ? this.props.vendor.person.second_name : ''}
                  />
                  <label
                    className={this.props.errors['second_name'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['second_name'] ? this.props.errors['second_name'][0] : ''}
                  </label>
                </div>
              </div>
              <div
                className={"form-group fs-12 pl-sm pr-md" + (this.props.errors['phone'] ? ' has-error' : '')}>
                <div className="row">
                  <label className="col-md-6 mb-none">Телефон</label>
                  <label className="col-md-6 mb-none">Эл. почта</label>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <InputElement
                      className="form-control fs-12"
                      mask="+38 (099) 999-99-99"
                      placeholder="+380 (67) 123-12-34"
                      name="phone"
                      onChange={this.props.onPhoneChanged}
                      onBlur={this.props.onFocusLos}
                      disabled={this.props.viewMode}
                      value={this.props.vendor.person.contacts.length ?
                        this.props.vendor.person.contacts.filter((item) => (item.contact_type === 'PHONE'))[0].contact : ''}
                    />
                    <label
                      className={this.props.errors['phone'] ? 'control-label' : 'hidden'}>
                      {this.props.errors['phone'] ? this.props.errors['phone'][0] : ''}
                    </label>
                  </div>
                  <div className="col-md-6">
                    <InputElement
                      className="form-control fs-12"
                      placeholder="Эл. почта"
                      name="email"
                      onChange={this.props.onEmailChanged}
                      onBlur={this.props.onFocusLos}
                      disabled={this.props.viewMode}
                      value={this.props.vendor.person.contacts.length ?
                        this.props.vendor.person.contacts
                          .filter((item) => (item.contact_type === 'EMAIL'))[0].contact : ''}
                    />
                    <label
                      className={this.props.errors['email'] ? 'control-label' : 'hidden'}>
                      {this.props.errors['email'] ? this.props.errors['email'][0] : ''}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className={"form-group fs-12" + (this.props.errors['note'] ? ' has-error' : '')}>
                <label className="col-md-12 mb-none">Заметки</label>
                <div className="col-md-12" style={{textAlign: 'right'}}>
                                                <textarea
                                                  className="form-control fs-12"
                                                  name="note"
                                                  rows="3"
                                                  onChange={this.props.onInputChanged}
                                                  onBlur={this.props.onFocusLos}
                                                  disabled={this.props.viewMode}
                                                  value={this.props.vendor.note ? this.props.vendor.note : ''}
                                                />
                  <label
                    className={this.props.errors['note'] ? 'control-label' : 'hidden'}>
                    {this.props.errors['note'] ? this.props.errors['note'][0] : ''}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}

VendorsForm.defaultProps = {
  errors: [],
  onImageChange: () => {
  },
  onInputChanged: () => {
  },
  onFocusLos: () => {
  },
  onPhoneFocusLos: () => {
  },
  onPersonImageChange: () => {
  },
  onPersonInputChanged: () => {
  },
  onPhoneChanged: () => {
  },
  onEmailChanged: () => {
  }
};

VendorsForm.PropTypes = {
  viewMode: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.any).isRequired,
  onImageChange: PropTypes.func.isRequired,
  onInputChanged: PropTypes.func.isRequired,
  onFocusLos: PropTypes.func.isRequired,
  onPhoneFocusLos: PropTypes.func.isRequired,
  onPersonImageChange: PropTypes.func.isRequired,
  onPersonInputChanged: PropTypes.func.isRequired,
  onPhoneChanged: PropTypes.func.isRequired,
  onEmailChanged: PropTypes.func.isRequired,
  vendor: PropTypes.objectOf(PropTypes.any).isRequired
};

export default VendorsForm;