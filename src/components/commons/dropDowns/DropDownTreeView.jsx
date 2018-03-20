import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TreeView from '../TreeView';

/**
 *
 */
class DropDownTreeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.items,
            flagTree: false,
            sel: ''
        };
    };

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let items = nextProps.items || []
            nextState.items = this.mapToDataCategories(items);
            nextState.sel = nextProps.selected_service_id;
            nextState.sel = this.computeCategory(items, nextProps.category_id);
        }

    };

    render(){
        return (<div className="mb-md">
            <div className="input-group">

                <input
                    className="form-control fs-12"
                    style={{
                        'zIndex' : 10
                    }}
                    value={this.state.sel}
                    placeholder={this.props.placeholder}
                    readOnly={true}
                    disabled={this.props.disabled}
                />

                <span className="input-group-btn">
                    <button className="btn btn-default fs-14" type="button" onClick={this.handleShowTree} disabled={this.props.disabled}>
                        <i
                            className="fa fa-caret-down"
                            style={{
                                color: "#999"
                            }}
                        />
                    </button>
                </span>
            </div>
            <div id="tree_view" className={this.state.flagTree
                    ? 'pb-sm pt-lg fs-12'
                    : 'hide'} style={{
                    border: '1px solid #ccc',
                    borderTop: 'none',
                    borderRadius: '4px',
                    background: 'white',
                    overflowX: 'scroll'
                }}>
                <TreeView items={this.state.items} onItemSelect={this.onSelectClick}/>
            </div>
        </div>);
    }

    mapToDataCategories = (categories) => {
        let i = 0;
        const loadNodes = (items) => {
            let removed = false;
            return items.map((item) => {
                i++;
                let flag = i <= 1
                    ? true
                    : false;
                removed = (+ item.good_group_id === 271828182);
                if (item.subgroup && item.subgroup.length !== 0 || item.services) {
                    return {
                        item: item,
                        id: item.good_group_id,
                        text: item.good_group_name,
                        children: loadNodes(item.subgroup || item.services),
                        state: {
                            opened: true,
                            disabled: flag || removed
                        }
                    };
                }

                return {
                    item: item,
                    id: item.good_group_id,
                    text: item.good_group_name,
                    type: 'file',
                    state: {
                        disabled: removed
                    }
                };
            });
        };

        return loadNodes(categories);
    };

    handleShowTree = (e) => {
        this.setState({
            flagTree: !this.state.flagTree
        });
    };

    computeCategory(items, selectedItem) {
        let sel = '';
        const category = (category_items) => {
            for (let i = 0; i < category_items.length; i++) {
                if (+ category_items[i].good_group_id === + selectedItem) {
                    sel = category_items[i].good_group_name;
                    return sel;
                }
                if (category_items[i].subgroup && category_items[i].subgroup.length) {
                    category(category_items[i].subgroup);
                }
            }
            return sel;
        };
        return (category(items));
    };

    onSelectClick = (selected) => {
        this.setState({sel: selected.text, flagTree: false});
        window.$('#tree_view').removeClass('show').addClass('hide');
        this.props.onItemSelect(selected.id);
    };

}

DropDownTreeView.propTypes = {
    onItemSelect: PropTypes.func.isRequired
};

export default DropDownTreeView;
