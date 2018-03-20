import React, {Component} from 'react';


class UnitsSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            units: this.mapToData(props),
            unit_id: this.props.unit_id,
        };
    };

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            nextState.units = this.mapToData(nextProps);
            nextState.unit_id = nextProps.unit_id;
        }
    };

    componentDidMount() {
        this.props.onLoadUnits();
    }

    onChangeUnit = (e) => {
        this.setState({
            unit_id: e.target.value
        });
        this.props.onChangeUnit(e.target.value);
    };


    render() {
        const loop = (data) => {
            return data.map((item) => {
                if (item.unit_id !== 2) {
                    return (
                        <option key={item.unit_id} value={item.unit_id}>
                            {item.unit_name}
                        </option>
                    );
                }
            });
        };

        return (
            <select className="btn btn-default" style={{height: '34px'}}  value={this.state.unit_id} onChange={this.onChangeUnit}>
                {loop(this.state.units.items)}
            </select>
        );
    }


    mapToData = (props) => {
        return (
            props.units ? {
                items: props.units.items || [{unit_id: 1, unit_name: ''}],
            } : {
                items: [{unit_id: 1, unit_name: ''}],
            }
        );
    }
}

export default UnitsSelect;
