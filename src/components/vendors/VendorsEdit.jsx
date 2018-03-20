import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DataTable from '../commons/tables/DataTable';
import picture from '../../../public/assets/images/dummy/nophoto.jpg';
import peson from '../../../public/assets/images/dummy/client.jpg';
import VendorsTabEdit from './VendorsTabEdit';
import VendorsForm from './VendorsForm';

import {API_HOST, API_URL} from '../../constants';

const PHONE_REGEX = /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/;

/**
 *
 */
class VendorsEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendor: this.mapToData(props),
      image: {
        name: '',
        file: '',
        data: '',
        imagePreviewUrl: picture
      },
      temp_image: {
        name: '',
        file: '',
        data: '',
        imagePreviewUrl: picture
      },
      photo: {
        name: '',
        file: '',
        data: '',
        personImagePreviewUrl: peson
      },
      temp_photo: {
        name: '',
        file: '',
        data: '',
        personImagePreviewUrl: peson
      },
      loaded: false,
      errors: {},
      invoice_history: []
    };
  };

  componentWillUpdate(nextProps, nextState) {

    if (this.props.vendor !== nextProps.vendor) {
      nextState.vendor = this.mapToData(nextProps);

      nextState.image.imagePreviewUrl = this.mapToDataImage(nextProps);
      nextState.photo.personImagePreviewUrl = this.mapToDataPersonImage(nextProps);

      nextState.temp_image.imagePreviewUrl = this.mapToDataImage(nextProps);
      nextState.temp_photo.personImagePreviewUrl = this.mapToDataPersonImage(nextProps);
    }

    if (this.props !== nextProps) {
      nextState.errors = nextProps.errors;
      nextState.loaded = true;
    }

    if (this.props.photo !== nextProps.photo) {
      switch (nextProps.type) {
        case 'person':
          nextState.vendor.person.photo_id = nextProps.photo;
          break;
        case'vendor':
          nextState.vendor.photo_id = nextProps.photo;
          break;
        default:
          break;
      }
    }

    nextState.vendor_goods = this.mapGoodsToData(nextProps.invoice_history);
  }

  componentDidUpdate() {
    (($) => {
      $('[data-plugin-masked-input]').each((i, input) => {
        const inp = $(input);
        inp.mask(inp.attr('data-input-mask'));
      });
    })(window.$);

    let path = this.props.router.location.pathname;

    if (path.match(/profile/i) !== null) {
      window.$('#profile_tab').addClass('active');
      window.$('#profile').addClass('active');
      window.$('#vendorGoodsInf').addClass('show');
      window.$('#edit_tab').removeClass('active');
      window.$('#edit').removeClass('active');
      window.$('#button-photo').removeClass('show');
      window.$('#button-photo').addClass('hide');
      window.$('#cancelEditButton').addClass('hide');
      window.$('#saveEditButton').addClass('hide');
    } else if (path.match(/edit/i) !== null) {
      window.$('#profile_tab').removeClass('active');
      window.$('#profile').removeClass('active');
      window.$('#vendorGoodsInf').removeClass('show');
      window.$('#vendorGoodsInf').addClass('hide');
      window.$('#edit_tab').addClass('active');
      window.$('#edit').addClass('active');
      window.$('#button-photo').addClass('show');
      window.$('#button-photo').removeClass('hide');
      window.$('#cancelEditButton').removeClass('hide');
      window.$('#saveEditButton').removeClass('hide');
    }
  }

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

    this.props.onCheckInputValue(data);
  };

  onPhoneFocusLos = (e) => {
    let phone = e.target.value.replace(/[\+\(\)\-" "]/g, '');

    let data = {
      'contacts': phone
    };

    this.props.onCheckInputValue(data);
  };

  onPersonImageChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      this.setState({
        temp_photo: {
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

  onPersonInputChanged = (e) => {
    this.checkForErrors(e.target.name);

    let state = {
      vendor: this.state.vendor,
    };

    state.vendor.person[e.target.name] = e.target.value;

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

  onImageChange = (e) => {
    e.preventDefault();

    let file = e.target.files[0];

    let reader = new FileReader();
    reader.onload = () => {
      this.setState({
        temp_image: {
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

  checkForErrors = (name) => {
    this.state.errors[name] ? delete this.state.errors[name] : '';
  };

  render() {
    let {imagePreviewUrl} = this.state.image ? this.state.image : picture;
    let {personImagePreviewUrl} = this.state.photo ? this.state.photo : peson;
    let $imagePreview = null;
    let $personImagePreviewUrl = null;

    if (imagePreviewUrl) {
      $imagePreview = (
        <img className="img-responsive" style={{width: 350}} src={imagePreviewUrl} alt="Фото поставщика"/>);
    }

    if (personImagePreviewUrl) {
      $personImagePreviewUrl = (
        <img className="img-responsive" src={personImagePreviewUrl} alt="Фото контактного лица"/>);
    }

    let phone = '';
    let email = '';

    if (this.state.vendor.person.contacts) {
      this.state.vendor.person.contacts.map((c) => {
        if (c.contact_type === 'EMAIL') {
          email = c.contact;
        } else {
          phone = c.contact;
        }
      })
    }

    return (
      <div style={{margin: '-90px -30px 0px -30px'}}>
        <div className="row vendor">
          <div className="col-md-12 col-lg-12">
            <div className="tabs">
              <ul className="nav nav-tabs tabs-primary">
                <li id="profile_tab">
                  <a href="#profile" data-toggle="tab" onClick={this.onClickProfile}>Профайл</a>
                </li>
                <li id="edit_tab">
                  <a href="#edit" data-toggle="tab" onClick={this.onClickEdit}>Редактировать</a>
                </li>
                <button
                  type="reset"
                  id="cancelEditButton"
                  className="btn btn-default pull-right mt-xs"
                  onClick={() => {
                    this.setState({
                      vendor: this.mapToData(this.props),
                      image: {
                        name: '',
                        file: '',
                        data: '',
                        imagePreviewUrl: this.mapToDataImage(this.props)
                      },
                      temp_image: {
                        name: '',
                        file: '',
                        data: '',
                        imagePreviewUrl: this.mapToDataImage(this.props)
                      },
                      photo: {
                        name: '',
                        file: '',
                        data: '',
                        personImagePreviewUrl: this.mapToDataPersonImage(this.props)
                      },
                      temp_photo: {
                        name: '',
                        file: '',
                        data: '',
                        personImagePreviewUrl: this.mapToDataPersonImage(this.props)
                      },
                    });
                    this.props.router.push(`/vendors/profile/${this.props.params.vendor_id}`);
                  }}>
                  <i className="fa fa-fw fa-ban"/>
                </button>
                <button
                  type="button"
                  id="saveEditButton"
                  className="btn btn-primary mr-sm pull-right mt-xs"
                  onClick={() => {
                    let data = {
                      'full_name': this.state.vendor.full_name,
                      'code': this.state.vendor.code,
                      'short_name': this.state.vendor.short_name,
                      'note': this.state.vendor.note,
                      'requisites': this.state.vendor.requisites,
                      'address': this.state.vendor.address,
                      'website': this.state.vendor.website,
                      'contacts': this.state.vendor.contacts.replace(/[\+\(\)\-" "]/g, ''),
                      "photo_id": this.state.vendor.photo_id,
                      'person': {
                        'first_name': this.state.vendor.person.first_name,
                        'last_name': this.state.vendor.person.last_name,
                        'second_name': this.state.vendor.person.second_name,
                        'photo_id': this.state.vendor.person.photo_id,
                        'contacts': [{
                          "contact": this.state.vendor.person.contacts[0].contact.replace(/[\+\(\)\-" "]/g, ''),
                          "contact_type": 'PHONE'
                        }, {"contact": this.state.vendor.person.contacts[1].contact, "contact_type": 'EMAIL'}],
                        'person_id': this.state.vendor.person.person_id
                      }
                    };

                    this.props.onEdit(data, +this.props.params.vendor_id, this.props.router);
                  }}>
                  <i className="fa fa-fw fa-save"/>
                </button>
              </ul>
              <div className="tab-content">
                <div id="profile" className="tab-pane m-md">
                  <VendorsForm
                    viewMode={true}
                    image={this.state.image}
                    photo={this.state.photo}
                    vendor={this.props.vendor}
                  />

                </div>

                <div id="edit" className="tab-pane m-md">
                  <VendorsForm
                    viewMode={false}
                    errors={this.state.errors}
                    image={this.state.temp_image}
                    photo={this.state.temp_photo}
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
        <div className="row" id="vendorGoodsInf">
          <div className="col-md-12 col-lg-12">
            <section className="panel panel-default">
              <header className="panel-heading pb-lg">
                <div className="pull-right">
                  <button className="btn btn-primary mr-xs pull-right" onClick={this.onAddClick}>
                    <i className="fa fa-plus"/>&nbsp;Товар
                  </button>
                </div>
                <h2 className="panel-title">Товары поставщика</h2>
              </header>
              <div className="panel-body">
                <div className="row">
                  <div className="col-md-12">
                    <DataTable
                      headers={[
                        {
                          text: '#',
                          sortable: true,
                          searchable: true
                        },
                        {
                          text: 'Название',
                          sortable: true,
                          searchable: true
                        },
                        {
                          text: 'Единица',
                          sortable: true,
                          searchable: true
                        },
                        {
                          text: 'Цена/ед.',
                          sortable: true,
                          searchable: true
                        },
                        {
                          text: 'Наличие',
                          sortable: true,
                          searchable: true
                        },
                        {
                          text: 'Функции',
                        }
                      ]}
                      data={this.state.rows}
                      detailed={true}
                      detailsRender={this.detailsRender}
                      cellRender={this.cellRender}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

  componentWillMount() {
    this.props.onLoad(this.props.params.vendor_id);
  }

  phone = (phone_number) => {
    let segs = [];
    let phone = (<span>&mdash;</span>);

    if (phone_number !== '') {
      segs = PHONE_REGEX.exec(phone_number);

      if (segs !== null) {
        phone = '+' + segs[1] + ' (' + segs[2] + ') ' + segs[3] + '-' + segs[4] + '-' + segs[5];
      } else {
        phone = phone;
      }
    }

    return phone;
  };

  mapToData = (props) => {
    return (
      props.vendor ? {
        full_name: props.vendor.full_name || '',
        short_name: props.vendor.short_name || '',
        photo_id: props.vendor.photo_id || '',
        photo: props.vendor.image ?
          API_HOST + props.vendor.image : '',
        code: props.vendor.code || '',
        requisites: props.vendor.requisites || '',
        contacts: props.vendor.contacts || [],
        address: props.vendor.address || '',
        website: props.vendor.website || '',
        note: props.vendor.note || '',
        person: props.vendor.person || {contacts: []},
        vendor_id: props.vendor.legal_enity_id || null
      } : {
        full_name: '',
        short_name: '',
        photo_id: '',
        code: '',
        requisites: '',
        contacts: [],
        address: '',
        website: '',
        note: '',
        person: {contacts: []},
        vendor_id: null
      }
    );
  };

  mapGoodsToData = (goods) => {
    // return goods.items.map((good) => {
    //     return {
    //         values: [
    //             good.number,
    //             good.name,
    //             good.unit,
    //             good.unit_price,
    //             good.availability,
    //         ],
    //         details: good
    //     };
    // });
  };

  mapToDataImage = (props) => {
    return (props.vendor ?
      (props.vendor.photo_id && props.vendor.image !== null ?
        props.vendor.image
        : picture)
      : picture)
  };

  mapToDataPersonImage = (props) => {
    return (props.vendor ?
      (props.vendor.person.image && props.vendor.person.image !== null ?
        props.vendor.person.image
        : peson)
      : peson)
  };

// Handlers

  onPlusClick = (e) => {
    e.preventDefault();

    this.setState({
      expanded: !this.state.expanded
    });
  };

  onEditVendor = (data, vendor_id) => {
    this.props.onEdit(data, vendor_id, this.props.router);
  };

  onAddClick = (e) => {
    e.preventDefault();
    // this.props.router.push('');
  };

  onCheck = (data) => {
    this.props.onCheckInputValue(data);
  };

  onClickProfile = () => {
    this.props.router.push('/vendors/profile/' + this.props.params.vendor_id);
  };

  onClickEdit = () => {
    this.props.router.push('/vendors/edit/' + this.props.params.vendor_id);
  };

  handleImageChange = (e) => {
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

  detailsRender = (details) => {
    return (<table className="table mb-none borderless ml-lg">
      <tbody>
      {this.renderGoods(details)}
      </tbody>
    </table>)
  };

  renderGoods = (details) => {

    return <tr>
      <td className="borderless">
        <div className="row">

        </div>
      </td>
    </tr>;
  };

  cellRender = (row_index, cell_index, cell, details) => {
    switch (cell_index) {
      case 0:
        return <a href={"#collapse_" + this.props.id} data-toggle="collapse" onClick={this.onPlusClick}
                  className="panelHeading" style={{textDecoration: 'none'}}>
          <i className={this.state.expanded ?
            "fa fa-minus-square-o h5 m-none details-control" :
            "fa fa-plus-square-o h5 m-none details-control"}
             style={{padding: '5px', color: '#0088cc'}}
          />
          {cell}
        </a>;
      case 1:
        return {cell};
      case 2:
        return {cell};
      case 3:
        return {cell};
      case 4:
        return {cell};
      case 5:
        return (
          <span>
                    <a className="p-xs mr-xs" href="#" style={{color: '#777'}}
                       onClick={(e) => this.editClick(e, cell)}>
                        <i className="fa fa-fw fa-pencil"/>
                    </a>
                    <a className="p-xs mr-xs" href="#" style={{color: '#777'}} onClick={(e) => this.onDeleteClick(e)}>
                        <i className="fa fa-fw fa-trash"/>
                    </a>
                </span> );
      default:
        break;
    }
  };

}

VendorsEdit.propTypes = {
  onUploadImage: PropTypes.func.isRequired
};

export default VendorsEdit;