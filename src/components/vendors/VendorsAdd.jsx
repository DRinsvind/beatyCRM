import React, {Component} from 'react';
import picture from '../../../public/assets/images/dummy/nophoto.jpg';
import peson from '../../../public/assets/images/dummy/client.jpg';
import VendorsForm from './VendorsForm';
import PropTypes from 'prop-types';

class VendorsAdd extends Component {
  constructor(props) {
    super(props);

    const contacts = [
      {
        contact: '',
        contact_type: 'PHONE'
      },
      {
        contact: '',
        contact_type: 'EMAIL'
      }
    ];

    const person = {
      first_name: '',
      last_name: '',
      second_name: '',
      contacts: contacts,
    };

    this.state = {
      vendor: {
        full_name: '',
        short_name: '',
        code: '',
        requisites: '',
        contacts: '',
        address: '',
        website: '',
        note: '',
        person: person,
      },
      image: {
        name: '',
        file: '',
        data: '',
        imagePreviewUrl: peson
      },
      photo: {
        name: '',
        file: '',
        data: '',
        personImagePreviewUrl: peson
      },
      errors: props.errors,
      vendor_id: null,
      person_id: null
    };

  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.errors !== nextProps.errors) {
      nextState.errors = nextProps.errors;
    }

    if (this.props.photo !== nextProps.photo) {
      if (nextProps.type === 'vendor') {
        nextState.vendor_id = nextProps.photo;
      } else {
        nextState.person_id = nextProps.photo;
      }
    }
  }

  render() {
    return (
      <div className="row vendor" style={{margin: '-90px -45px 0px -45px'}}>

        <div className="col-md-12 col-lg-12">

          <div className="tabs">
            <ul className="nav nav-tabs tabs-primary">
              <li id="adding_tab" className="active">
                <a href="#add" data-toggle="tab">Добавление поставщика</a>
              </li>

              <button type="reset" className="btn btn-default pull-right"
                      onClick={this.onCancelClick}>
                <i className="fa fa-fw fa-ban" />
              </button>
              <button type="button" className="btn btn-primary mr-sm pull-right"
                      onClick={this.onSaveClick}>
                <i className="fa fa-fw fa-save"/>
              </button>
            </ul>
            <div className="tab-content">
              <div id="add" className="tab-pane active">
                <VendorsForm
                  viewMode={false}
                  errors={this.state.errors}
                  image={this.state.image}
                  photo={this.state.photo}
                  onImageChange={this.onImageChange}
                  onInputChanged={this.onInputChanged}
                  onFocusLos={this.onFocusLos}
                  onPhoneFocusLos={this.onPhoneFocusLos}
                  onPersonImageChange={this.onPersonImageChange}
                  onPersonInputChanged={this.onPersonInputChanged}
                  onPhoneChanged={this.onPhoneChanged}
                  onEmailChanged={this.onEmailChanged}
                  vendor={this.state.vendor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.props.onLoad();
  }

  /**
   *
   * @param posts
   * @returns {*}
   */

  onImageChange = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    let reader = new FileReader();
    reader.onload = () => {
      this.setState({
        image: {
          name: file.name,
          data: reader.result.replace('data:;base64,', ''),
          imagePreviewUrl: reader.result
        }
      });
    };
    reader.readAsDataURL(new Blob([file]));

    const formData = new FormData();
    formData.append('image', file);

    this.props.onUploadImage(formData, 'vendor');
  };

  onPersonImageChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      this.setState({
        photo: {
          name: file.name,
          data: reader.result.replace('data:;base64,', ''),
          personImagePreviewUrl: reader.result
        }
      });
    };
    reader.readAsDataURL(new Blob([file]));

    const formData = new FormData();
    formData.append('image', file);

    this.props.onUploadImage(formData, 'person');
  };

  onFocusLos = (e) => {
    let data = {};
    if (e.target.name === 'phone') {
      let phone = e.target.value.replace(/[\+\(\)\-" "]/g, '');
      data = {
        [e.target.name]: phone
      }
    } else {
      data = {
        [e.target.name]: e.target.value
      };
    }

    this.props.onCheck(data);
  };

  onPhoneFocusLos = (e) => {
    let phone = e.target.value.replace(/[\+\(\)\-" "]/g, '');

    let data = {
      'contacts': phone
    };

    this.props.onCheck(data);
  };

  checkForErrors = (name) => {
    this.state.errors[name] ? delete this.state.errors[name] : '';
  };

  onInputChanged = (e) => {

    this.checkForErrors(e.target.name);

    let state = {
      vendor: this.state.vendor,
    };

    state.vendor[e.target.name] = e.target.value;

    this.setState(state);
  };

  onPersonInputChanged = (e) => {
    this.checkForErrors(e.target.name);
    let state = {
      contact_person: this.state.vendor.person,
    };

    state.contact_person[e.target.name] = e.target.value;

    this.setState(state);
  };

  onPhoneChanged = (e) => {
    this.checkForErrors(e.target.name);
    let state = {
      contacts: this.state.vendor.person.contacts,
    };

    state.contacts[0].contact = e.target.value;
    this.setState(state);
  };

  onEmailChanged = (e) => {
    this.checkForErrors(e.target.name);
    let state = {
      contacts: this.state.vendor.person.contacts,
    };

    state.contacts[1].contact = e.target.value;
    this.setState(state);
  };

  onCancelClick = () => {
    this.setState({
      vendor: {
        full_name: '',
        short_name: '',
        code: '',
        requisites: '',
        contacts: '',
        address: '',
        website: '',
        note: '',
        person: {
          first_name: '',
          last_name: '',
          second_name: '',
          contacts: [
            {
              contact: '',
              contact_type: 'PHONE'
            },
            {
              contact: '',
              contact_type: 'EMAIL'
            }
          ],
        },
      }
    });
    this.props.clearVendorForm();
    this.props.router.push('/vendors/');
  };

  checkForEmptiness = () => {

    let err = this.state.errors;

    if (this.state.vendor.short_name === '') {
      err['short_name'] = {message: 'Укажите название'};
    }

    if (this.state.vendor.full_name === '') {
      err['full_name'] = {message: 'Укажите название'};
    }

    if (this.state.vendor.code === '') {
      err['code'] = {message: 'Укажите код за ЕДРПОУ'};
    }

    if (this.state.vendor.contacts === '') {
      err['contacts'] = {message: 'Укажите телефон поставщика'};
    }

    if (this.state.vendor.requisites === '') {
      err['requisites'] = {message: 'Укажите реквизиты'};
    }

    if (this.state.vendor.person.first_name === '') {
      err['first_name'] = {message: 'Укажите имя'};
    }

    if (this.state.vendor.person.contacts[0].contact === '') {
      err['phone'] = {message: 'Укажите номер телефона'};
    }

    this.setState({
      errors: err,
    });
  };

  onSaveClick = (e) => {
    e.preventDefault();

    this.checkForEmptiness();

    if (Object.keys(this.state.errors).length > 0) {
      let error = {
        type: 'error',
        text: 'Заполнены не все поля!'
      };
      this.props.onNotifyShow(error);
    } else {

      let temp = this.state.vendor.person.contacts.map((contact) => {
        if (contact.contact_type === "PHONE") {
          let phone = contact.contact.replace(/[\+\(\)\-" "]/g, '');
          return {"contact": phone, "contact_type": contact.contact_type};
        }
        return {"contact": contact.contact, "contact_type": contact.contact_type}
      });

      let data = {
        'full_name': this.state.vendor.full_name,
        'code': this.state.vendor.code,
        'short_name': this.state.vendor.short_name,
        'note': this.state.vendor.note,
        'requisites': this.state.vendor.requisites,
        'address': this.state.vendor.address,
        'website': this.state.vendor.website,
        'contacts': this.state.vendor.contacts.replace(/[\+\(\)\-" "]/g, ''),
        "photo_id": this.state.vendor_id,
        'person': {
          'first_name': this.state.vendor.person.first_name,
          'last_name': this.state.vendor.person.last_name,
          'second_name': this.state.vendor.person.second_name,
          'photo_id': this.state.person_id,
          'contacts': temp,
        }
      };

      this.props.onAddVendor(data);
    }
  }
}

VendorsAdd.propTypes = {
  clearVendorForm: PropTypes.func.isRequired,
  onAddVendor: PropTypes.func.isRequired,
  onNotifyShow: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default VendorsAdd;
