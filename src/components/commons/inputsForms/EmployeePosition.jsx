import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';
import PropTypes from 'prop-types';

class EmployeePosition extends Component {
    render() {
        return (
            <div>
                <fieldset>
                    <div className={"form-group" + (this.props.errors['salon_id'] ? ' has-error' : '')}>
                        <label className="col-md-3 control-label">Салон</label>
                        <div className="col-md-7">
                            <div className="input-group btn-group">
                        <span className="input-group-addon">
                            <i className="fa fa-fw fa-map-marker"></i>
                        </span>
                                <Select2 className="form-control"
                                        name="salon_id"
                                         options={{placeholder: 'Выберите салон', theme: 'bootstrap'}}
                                         data={this.salonsToData(this.props.salons)}
                                         value={this.props.selected_salon}
                                         onSelect={this.onSalonSelect}
                                />
                            </div>
                            <label
                                className={this.props.errors['salon_id'] ? 'control-label' : 'hidden'}>
                                {this.props.errors['salon_id'] ? this.props.errors['salon_id'][0] : ''}
                            </label>
                        </div>
                    </div>
                    <div className={"form-group" + (this.props.errors['post_id'] ? ' has-error' : '')}>
                        <label className="col-md-3 control-label" style={{fontWeight: '600', color: 'black'}}></label>
                        <div className="col-md-7">
                            <div className="input-group btn-group">
                        <span className="input-group-addon">
                            <i className="fa fa-fw fa-area-chart"></i>
                        </span>
                                <Select2 className="form-control"
                                        name="post_id"
                                         options={{placeholder: 'Выберите должность', theme: 'bootstrap'}}
                                         data={this.postsToData(this.props.posts)}
                                         value={this.props.selected_post}
                                         onSelect={this.onPostSelect}
                                />
                            </div>
                            <label
                                className={this.props.errors['post_id'] ? 'control-label' : 'hidden'}>
                                {this.props.errors['post_id'] ? this.props.errors['post_id'][0] : ''}
                            </label>
                        </div>
                    </div>
                    <div className={"form-group" + (this.props.errors['date_beg'] ? ' has-error' : '')}>
                        <label className="col-md-3 control-label">Стаж</label>
                        <div className="col-md-7" style={{textAlign: 'right'}}>
                            <div className="input-daterange input-group">
                            <span className="input-group-addon">
                            <i className="fa fa-fw fa-calendar"></i>
                            </span>
                                <input type="text"
                                       className="form-control dates"
                                       name="date_beg"
                                       value={this.props.date_beg.replace(/-/g, '/')}
                                       onClick={(e) => {
                                           this.clearDate(e.target.name);
                                       }}
                                       onChange={(e) => {}}
                                       required/>
                                <span className="input-group-addon">по</span>
                                <input type="text"
                                       className="form-control dates"
                                       value={this.props.date_end.replace(/-/g, '/')}
                                       name="date_end"
                                       onClick={(e) => {
                                           this.clearDate(e.target.name);
                                       }}
                                       onChange={(e) => {}}
                                       required/>
                            </div>
                            <label
                                className={this.props.errors['date_beg'] ? 'control-label' : 'hidden'}>
                                {this.props.errors['date_beg'] ? this.props.errors['date_beg'][0] : ''}
                            </label>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }

    salonsToData = (props) => {
        let salons = [];
        props.forEach((salon) => {
            salons.push({
                id: salon.salon_id,
                text: salon.salon_name
            });
        });
        return salons;
    };

    postsToData = (posts) => {
        let postsList = [];
        posts.forEach((post) => {
            postsList.push({
                id: post.post_id,
                text: post.post_name
            });
        });
        return postsList;
    };

    clearDate = (name) => {
        this.props.onClearDate(name);
    };

    onSalonSelect = (e) => {
        this.props.onPositionChanged(0, e.target.value, 'salon');
    };

    onPostSelect = (e) => {
        this.props.onPositionChanged(0, e.target.value, 'post');
    };
}

EmployeePosition.propTypes = {
    posts: PropTypes.array.isRequired,
    salons: PropTypes.array.isRequired,
    selected_post: PropTypes.any,
    selected_salon: PropTypes.any,
    onPositionChanged: PropTypes.func.isRequired,
    onClearDate: PropTypes.func.isRequired
};

export default EmployeePosition;
