import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TreeView from '../TreeView';
import equal from 'deep-equal';

/**
 *
 */
class DropDownTreeViewCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: props.items,
            flagTree: false,
            selected: ''
        };
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.items) {
            if (!equal(this.props.items, nextProps.items)) {
                nextState.items = nextProps.items;

                if (nextProps.selectedItemId) {
                    nextState.selected = this.computeCategory(nextProps.items, nextProps.selectedItemId);
                } else {
                    nextState.selected = '';
                }

            }
            if (!equal(this.props.items, nextProps.items) && nextProps.items.length > 0 && !nextProps.selectedItemId) {
                nextState.flagTree = true;
            }
        } else {
            nextState.selected = '';
            nextState.items = nextProps.items;
        }
    };

    render() {
        return (
            <div className="calendar-select-service">
                <div id="tree_view"
                     className={'pb-sm pt-lg' + (this.state.flagTree ? '' : ' hide')}
                     style={{height: '250px', overflow: 'scroll'}}>
                    <TreeView
                        items={this.state.items}
                        onItemSelect={this.itemSelected}
                    />
                </div>
                <div className="input-group">
                    <input
                        className="form-control"
                        placeholder={this.props.placeholder}
                        value={this.state.selected}
                        readOnly={true}
                    />
                    <span className="input-group-btn">
                        <button
                            className="btn"
                            type="button"
                            onClick={this.toggleTreeView}
                        >
                            <i className={'fa fa-caret-' + (this.state.flagTree ? 'up' : 'down')}
                               style={{color: "#999", fontSize: '0.87em'}}></i>
                        </button>
                    </span>
                </div>

            </div>
        );
    }

    computeCategory(items, selectedItem) {
        let sel = '';
        const category = (category_items) => {
            for (let i = 0; i < category_items.item.services.length; i++) {
                if (+category_items.item.services[i].id === +selectedItem) {
                    sel = category_items.item.services[i].name;
                    return sel;
                }
                // if (category_items[i].subcategory && category_items[i].subcategory.length) {
                //     category(category_items[i].subcategory);
                // }
            }
            return sel;
        };
        return (category(items[0]));
    };

    toggleTreeView = (e) => {
        this.setState({
            flagTree: !this.state.flagTree
        });
    };

    itemSelected = (selected) => {
        this.setState({
            selected: selected.text,
            flagTree: false,
        });

        window.$('#tree_view').removeClass('show').addClass('hide');
        this.props.onItemSelected(selected.id, selected.item);
    };

}

DropDownTreeViewCalendar.propTypes = {
    onItemSelected: PropTypes.func.isRequired
};

export default DropDownTreeViewCalendar;
