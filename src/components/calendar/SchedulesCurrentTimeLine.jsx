import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WORKING_TIME} from '../../constants';
import jquery from 'jquery';

import {FORMAT_TIME_WITHOUT_SECONDS} from '../../utils';

const $ = jquery;

const TIME_MUL = 3600000;
const TIME_MIN = WORKING_TIME.begin;
const TIME_MAX = WORKING_TIME.end;

/**
 * Current time-line component
 */
class SchedulesCurrentTimeLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateTime: new Date()
        };
    }

    render() {
        const height = $('.'.concat(this.props.componentClass)).prop('scrollHeight') - 5;
        let distance;
        // = 0;

        if (!isNaN(height)) {
            const currentMs = (this.state.dateTime.getHours() - TIME_MIN) + (this.state.dateTime.getMinutes() / 60);

            const availableHours = TIME_MAX - TIME_MIN;
            const srcDelta = availableHours * TIME_MUL;
            const dstDelta = currentMs * TIME_MUL;

            // TODO: Fix time line distance.
            distance = (dstDelta / srcDelta) * ((height / availableHours) * (availableHours - 1));
        }

        return (
            <div id="currentTimeLine" className="currentTimeLine" style={{top: distance}}>
                <div>{this.renderCurrentTime()}</div>
                <div>{this.renderCurrentTime()}</div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            timerId: setInterval(this.onIntervalUpdate, this.props.interval)
        });

        if ($('#currentTimeLine')[0] && this.props.scrolled) {

            $('#scrollSection').stop().animate({
                scrollTop: $('#currentTimeLine').position().top
                // - ($('#scrollSection').height() / 2 - 150)
            })
            //     .off('scroll').on('scroll', () => {
            //     this.props.onSwitchScrolled(false);
            // });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timerId);
    }

    // UTILS
    renderCurrentTime = () => {
        return FORMAT_TIME_WITHOUT_SECONDS(this.state.dateTime);
    };

    // EVENTS
    onIntervalUpdate = () => {
        this.setState({
            dateTime: new Date()
        });
    };
}

SchedulesCurrentTimeLine.propTypes = {
    interval: PropTypes.number,
    componentClass: PropTypes.string
};

SchedulesCurrentTimeLine.defaultProps = {
    interval: 1000, // ms
    componentClass: 'scroller'
};

export default SchedulesCurrentTimeLine;