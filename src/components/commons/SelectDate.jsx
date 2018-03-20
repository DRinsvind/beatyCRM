import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';
import Popover from 'react-simple-popover';
import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;

const OVERVIEW_REPORT_CATEGORIES = [
    {text: 'Текущий день', id: 0},
    {text: 'Текущий месяц', id: 1},
    {text: 'Текущее полугодие', id: 3},
    {text: 'Текущий год', id: 4},
    {text: 'Другой период', id: 2},
];

class SelectDate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Popover
                style={{borderRadius: 3, width: '25%'}}
                placement='right'
                container={this.props.refs.cont}
                target={this.props.refs.target}
                show={this.props.open}
                onHide={this.props.closePopover}>
                <div>
                    <div className="form-group" style={{marginBottom: '0px', width: '100%'}}>
                        <Select2
                            className="form-control without-search"
                            options={{
                                placeholder: '',
                                theme: 'bootstrap',
                                width: '100%',
                                minimumResultsForSearch: 'Infinity'
                            }}
                            data={OVERVIEW_REPORT_CATEGORIES}
                            value={this.props.selected_period}
                            onSelect={this.props.periodChanged}
                        />
                    </div>
                    <div className="row">
                        <hr/>
                    </div>
                    <div className="row m-none p-none">
                        <div className="col-md-12 col-xs-12 col-sm-12 p-none">
                            <div>С</div>
                            <div className="input-group" style={{width: '100%'}}>
															<span className="input-group-addon">
																<i className="fa fa-fw fa-calendar"/>
															</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="bookingsDateFrom"
                                    value={this.props.period.from}
                                    name="from"
                                    onChange={() => {
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-12 col-xs-12 col-sm-12 p-none">
                            <div>По</div>
                            <div className="input-group" style={{width: '100%'}}>
															<span className="input-group-addon">
																<i className="fa fa-fw fa-calendar"/>
															</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="bookingsDateTo"
                                    value={this.props.period.to}
                                    name="to"
                                    onChange={() => {}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer row mt-lg pb-none">
                    <div className="text-right">
                        <button type="button" className="btn btn-default" onClick={this.props.onCancelSelecting}>
                            Отмена
                        </button>
                        <button type="button" className="btn btn-primary mr-sm" onClick={() => {
                            this.props.onSelecPeriod();
                        }}>
                            Применить
                        </button>
                    </div>
                </div>
            </Popover>
        )
    }

    componentDidUpdate() {
        $('#bookingsDateFrom').datepicker(
            {
                format: "dd/mm/yyyy",
                language: 'ru'
            }
        )
            .off('changeDate').on('changeDate', this.props.changeDate);

        $('#bookingsDateTo').datepicker(
            {
                format: "dd/mm/yyyy",
              language: 'ru'
            }
        )
            .off('changeDate').on('changeDate', this.props.changeDate);
    }
}

SelectDate.propTypes = {
    onCancelSelecting: PropTypes.func,
    onSelecPeriod: PropTypes.func.isRequired,
    periodChanged: PropTypes.func.isRequired,
    changeDate: PropTypes.func.isRequired,
    selected_period: PropTypes.number.isRequired,
    period: PropTypes.object.isRequired,
};

export default SelectDate;