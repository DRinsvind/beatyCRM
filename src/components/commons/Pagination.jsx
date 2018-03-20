import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 *
 */

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.prevClick = this.prevClick.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.pageClick = this.pageClick.bind(this);

        this.state = {
            start: props.active,
            end: props.total < 5 ? props.total : props.active + 4
        };

    }


    componentWillUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {

            if (nextProps.total !== this.props.total) {
                nextState.start = nextProps.active;
                nextState.end = nextProps.total < 5 ? nextProps.total : nextProps.active + 4
            }

            if (nextProps.active !== this.props.active) {
                if (nextProps.active < nextState.start) {
                    nextState.start = nextProps.active;
                    nextState.end = (nextProps.active + 4 > nextProps.total) ? nextProps.total : nextProps.active + 4;
                }
                if (nextProps.active > nextState.end) {
                    nextState.start = (nextProps.active - 4 < 1) ? 1 : nextProps.active - 4;
                    nextState.end = nextProps.active;
                }
            }
        }
    }


    render() {
        return (
            <div className={'pagination' + ((this.props.total === 0) ? ' hidden' : '')}>
                <button
                    className={'btn btn-primary btn-sm prev'}
                    onClick={this.prevClick}
                    disabled={(this.props.active === 1 || this.props.loading)}>
                    <i className="fa fa-fw fa-chevron-left"/>
                </button>
                {this.renderButtons()}
                <button
                    className={'btn btn-primary btn-sm next'}
                    onClick={this.nextClick}
                    disabled={(this.props.active === this.props.total || this.props.loading)}>
                    <i className="fa fa-fw fa-chevron-right"/>
                </button>
            </div>
        )
    }

    renderButtons = () => {
        const {active, loading} = this.props;
        const {start, end} = this.state;

        const buttons = [];

        for (let i = start; i <= end; i++) {
            buttons.push(
                <button
                    className={'btn btn-sm btn-default' + ((i === active) ? ' btn-active' : '')}
                    key={'pagination_button_' + i}
                    onClick={() => this.pageClick(i)}
                    disabled={loading}
                >{i}</button>
            );
        }

        return buttons;
    };

    prevClick = () => {
        this.props.onChangeActivePage(this.props.active - 1);
    };

    nextClick = () => {
        this.props.onChangeActivePage(this.props.active + 1);
    };

    pageClick = (number) => {
        this.setState({
            info: {
                ...this.state.info,
                page: 0
            }
        });
        this.props.onChangeActivePage(number);
    };
}


Pagination.PropTypes = {
    active: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onChangeActivePage: PropTypes.func.isRequired
};
export default Pagination;

