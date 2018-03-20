import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import jQuery from "jquery";

const $ = window && window.jQuery ? window.jQuery : jQuery;

/**
 *
 */
class TreeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.items,
            visible: true,
            sel: "",
            flagTree: false,
            id: "jsTree_" + uuid.v4().replace(/[\-]+/g, ""),
            closedNodes: []
        };
    }

    componentDidMount() {
        let plugins =
            this.props.onAddCategory || this.props.onEditCategory
                ? ["types", "contextmenu"]
                : ["types"];
        this.treeView = $("#" + this.state.id);
        this.treeView.jstree({
            core: {
                multiple: false,
                themes: {
                    responsive: false
                },
                data: this.state.items
            },
            types: {
                default: {
                    icon: "fa fa-folder"
                },
                file: {
                    icon: "fa fa-circle"
                }
            },
            plugins: plugins,
            contextmenu: this.props.onAddCategory
                ? {
                      select_node: false,
                      items: this.reportMenu
                  }
                : this.props.onEditCategory
                  ? {
                        select_node: false,
                        items: this.reportMenuEmployee
                    }
                  : {}
        });
        this.treeView.on("changed.jstree", (e, data) => {
            this.onSelect(e, data);
        });
        this.treeView.on("close_node.jstree", (e, data) => {
            this.props.onCloseNode(data.node.id);
        });
        this.treeView.on("open_node.jstree", (e, data) => {
            this.props.onOpenNode(data.node.id);
        });
    }

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.closeNode === this.props.closeNode ||
            nextProps.opetTree !== "none"
        );
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.items !== nextProps.items) {
            nextState.items = nextProps.items;
        }
    }

    componentDidUpdate() {
        const jstree = this.treeView.jstree(true);
        jstree.settings.core.data = this.state.items;
        jstree.refresh(true, true);
    }

    reportMenuEmployee = node => {
        let menuItems = {};
        if (node.type !== "file") {
            menuItems = {
                createItem: {
                    label: "Редактировать роль",
                    action: () => this.props.onEditCategory(node)
                }
            };
            return menuItems;
        }
    };

    reportMenu = node => {
        let menuItems = {};
        if (+node.id === 2 || +node.id === 3) {
            menuItems = {
                createItem: {
                    label: "Создать категорию",
                    action: () => this.createItem(node.id)
                }
            };
        } else if (
            +node.id === 2 ||
            (+node.id === 3 && node.type === "employee")
        ) {
            menuItems = {
                renameItem: {
                    label: "Переименовать категорию",
                    action: () => this.renameItem(node.id, node.text)
                }
            };
        } else if (node.type === "file") {
            menuItems = {
                renameItem: {
                    label: "Переименовать подкатегорию",
                    action: () => this.renameItem(node.id, node.text)
                },
                deleteItem: {
                    label: "Удалить подкатегорию",
                    action: () => this.removeItem(node.id)
                }
            };
        } else if (+node.id !== 271828182 && +node.id !== 1) {
            menuItems = {
                createItem: {
                    label: "Создать подкатегорию",
                    action: () => this.createItem(node.id)
                },
                renameItem: {
                    label: "Переименовать категорию",
                    action: () => this.renameItem(node.id, node.text)
                },
                deleteItem: {
                    label: "Удалить категорию",
                    action: () => this.removeItem(node.id)
                }
            };
        }
        return menuItems;
    };

    createItem = id => {
        this.props.onAddCategory(id);
    };

    renameItem = (id, name) => {
        this.props.onRenameCategory(id, name);
    };

    removeItem = id => {
        this.props.onRemoveCategory(id);
    };

    onSelect = (e, n) => {
        if (n.node) {
            this.props.onItemSelect(n.node.original);
        }
    };

    render() {
        console.log('AHTUNG',this.props)
        return <div id={this.state.id} />;
    }

    componentWillUnmount() {
        this.treeView.off("changed.jstree");
        this.treeView.jstree("destroy");
    }
}

TreeView.propTypes = {
    onItemSelect: PropTypes.func.isRequired,
    onAddCategory: PropTypes.func,
    onRenameCategory: PropTypes.func,
    onRemoveCategory: PropTypes.func,
    firstEmployee: PropTypes.bool
};

export default TreeView;
