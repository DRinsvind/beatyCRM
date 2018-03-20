import * as can from "../constants";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router";
import jQuery from "jquery";

const $ = jQuery;

/**
 *
 */
class AppMenu extends Component {
    render() {
        if (!this.props.loadedMenu) {
            return null;
        }

        return (
            <aside id="sidebar-left-collapsed" className="sidebar-left">
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        &nbsp;
                    </div>
                    {/*<div className="sidebar-toggle hidden-xs"
                         data-toggle-class="sidebar-left-collapsed"
                         data-fire-event="sidebar-left-toggle"
                         data-target="html" onClick={(e) => $('html').toggleClass('sidebar-left-collapsed')}
                    >
                        <i className="fa fa-bars" aria-label="Toggle sidebar"></i>
                    </div>*/}
                    <div className="sidebar-toggle hidden-xs"
                         onClick={(e) => {
                             $(".nano-without-hover").toggleClass("nano");
                         }}
                    >
                        <i className="fa fa-bars" aria-label="Toggle sidebar"></i>
                    </div>
                </div>

                {/*<div className="nano-without-hover">*/}
                <div className="nano-without-hover">
                    <div className="nano-content">
                        <nav id="menu" className="nav-main" role="navigation">
                            {this.renderSections()}
                        </nav>
                    </div>
                </div>
            </aside>
        )
    }

    componentDidMount() {
        this.props.onLoad();
    }

    // RENDERS
    renderSections = () => {
        return this.props.sections.sort((s1, s2) => {
            if (s1.order_index > s2.order_index) {
                return 1;
            } else if (s1.order_index < s2.order_index) {
                return -1;
            }

            return 0;
        }).map((section) => {
            return (
                <MenuSection
                    key={'menu_section_' + section.id}
                    section={section}
                    selectedItem={this.props.selected}
                    onItemSelected={this.itemSelected}
                />
            );
        })
    };

    // EVENTS
    itemSelected = (item) => {
        this.props.onMenuItemSelected(item);
    };
}

AppMenu.propTypes = {
    sections: PropTypes.array.isRequired,
    onLoad: PropTypes.func.isRequired,
    onMenuItemSelected: PropTypes.func.isRequired
};

/**
 *
 */
class MenuSection extends Component {
    render() {
        return (
            <div>
                <ul className="nav nav-main">
                    {this.renderItems()}
                </ul>
                <hr />
            </div>
        );
    }

    itemSelected = (menuItem) => {
        this.props.onItemSelected(menuItem.props.item);
    };
    componentWillUpdate(nextProps, nextState){
        if (this.props !== nextProps) {
            console.log('______UPDATING')
        }
    }
    renderItems = () => {
        let {section} = this.props;
        console.log('______SECTION',section)

        if(section.title==='Notification_section' && !section.items[2]){
            section.items=[...section.items,{
                component: "SETTING",
                icon: "cogs",
                id: 241,
                items: [],
                order_index: 251,
                title: "Настройки",
                type: "MENU_ITEM"
            }]
        }
        const mapItems = (items) => {
            return items.sort((i1, i2) => {
                if (i1.order_index > i2.order_index) {
                    return 1;
                } else if (i1.order_index < i2.order_index) {
                    return -1;
                }

                return 0;
            }).map((item) => {
                if (item.items.length) {
                    return (
                        <MenuItem
                            key={'menu_section_' + section.id + '_item_' + item.id}
                            item={item}
                            parent={true}
                        >
                            {mapItems(item.items)}
                        </MenuItem>
                    );
                }

                return (
                    <MenuItem
                        key={'menu_section_' + section.id + '_item_' + item.id}
                        item={item}
                        selected={this.props.selectedItem === item}
                        onClick={this.itemSelected}
                    />
                );
            });
        };

        return mapItems(section.items);
    }
}

MenuSection.propTypes = {
    section: PropTypes.object.isRequired,
    onItemSelected: PropTypes.func.isRequired
};

/**
 *
 */
class MenuItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };

        this.classNames = {
            parent: '',
            parentNotActive: 'nav-parent',
            parentActive: 'nav-parent nav-expanded nav-active',
            child: '',
            childActive: 'nav-active'
        };
    }

    render() {
        const item = this.mapToData();

        return this.props.children ? (
            <li className={this.state.active ? this.classNames.parentActive : this.classNames.parentNotActive}>
                <Link onClick={this.toggleParent}>
                    <i className={item.iconClass}></i>
                    <span>{item.title}</span>
                </Link>
                <ul className="nav nav-children">
                    {this.props.children}
                </ul>
            </li>
        ) : (
            <li className={this.props.selected ? 'nav-active' : ''}>
                <Link to={item.path} onClick={this.linkClicked}>
                    <i className={item.iconClass}></i>
                    <span>{item.title}</span>
                </Link>
            </li>
        );
    }

    mapToData = () => {
        return {
            ...this.props.item,
            iconClass: this.props.item.icon ? "fa fa-" + this.props.item.icon : '',
            path: can.MENU[this.props.item.component]
        };
    };

    // EVENTS
    linkClicked = (e) => {
        this.props.onClick(this);
    };

    toggleParent = (e) => {
        this.setState({
            active: !this.state.active
        })
    };
}

MenuItem.propTypes = {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func
};

export default AppMenu;
