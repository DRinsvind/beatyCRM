import React, {Component} from 'react';
import InputElement from 'react-input-mask';
import PropTypes from 'prop-types';

class ContactInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: this.mapToData(props)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.contacts = this.mapToData(nextProps);
        }
    }

    render() {
        return (
            <div className="mb-md">{this.state.contacts}</div>
        );
    }

    mapToData = (props) => {
        return props.contacts.filter((contact) => contact.contact_type === props.contact_type)
            .map((contact, i) => {
                return (
                    <div className={"form-group" + (props.errors[props.id + i] ? ' has-error' : '')}
                         key={i}>
                        <label className="col-md-3 control-label">{props.label} {i + 1}</label>
                        <div className="col-md-7" style={{textAlign: 'right'}}>
                            <div className="input-group">
                                <span className="input-group-addon">
                                <i className={props.iclass}></i>
                                </span>
                                <InputElement className="form-control"
                                              id={props.id + i}
                                              name={props.contacts.indexOf(contact)}
                                              mask={props.mask}
                                              placeholder={props.text}
                                              value={contact.contact}
                                              onChange={props.contactChanged}
                                              onBlur={props.onFocusLoss}/>
                            </div>
                            <label className={props.errors[props.id + i] ? 'control-label' : 'hidden'}>
                                {props.errors[props.id + i] ? props.errors[props.id + i].message : ''}
                            </label>
                        </div>
                        <a className="col-md-2 pl-xs mt-sm show"
                           name={props.contacts.indexOf(contact)}
                           onClick={props.onContactTrashClick}>
                            <i className="fa fa-fw fa-lg fa-trash" id={props.id + i}></i>
                        </a>
                    </div>
                );
            });
    }
}

ContactInput.propTypes = {
    contacts: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    contact_type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    mask: PropTypes.string.isRequired,
    iclass: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    contactChanged: PropTypes.func.isRequired,
    onFocusLoss: PropTypes.func.isRequired,
    onContactTrashClick: PropTypes.func.isRequired
};

export default ContactInput;