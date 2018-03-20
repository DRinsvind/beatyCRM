import React, {Component} from "react";
import PropTypes from "prop-types";
import Select2 from "react-select2-wrapper";
import DropDownTreeView from "../commons/dropDowns/DropDownTreeView";
import deepAssign from "deep-assign";
import * as net from "../../utils/network";
import * as can from "../../constants";
import ServicesAddTable from "../services/ServicesAddTable";
import {__mapToDataBrands,__mapToDataTags} from '../../utils/renderUtils';
import {DEFINE_DOUBLE_NUMBER, DEFINE_INT_NUMBER} from "../../utils/index";

const $ = window.$;


const items = [
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    },
    {
        employee: "Мастер",
        price: "250"
    }
];
const data_timing = [
    {
        text: '30мин',
        id: '30'
    },
    {
        text: '60мин',
        id: '60'
    },
    {
        text: '90мин',
        id: '90'
    },
    {
        text: '120мин',
        id: '120'
    },
    {
        text: 'Другая',
        id: 'other'
    }
]

const itemInitialState = {
    name: "",
    amount: "",
    sale_price: "",
    category_id: 0,
    tags: [],
    custom_timing_duration: ""
};

/**
 *
 */
class ServicesAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {

            loaded: true,
            category_id: props.category_id,
            services_tags: __mapToDataTags(props.services_tags),
            goods: this.mapToDataGoods(props.goods_list),
            goods_in_service: [],
            tags: [],
            errors: {},
            brands:[],
            brand:'',
////////////////////
            service__name: '',
            service__group:'',
            service__brand:'',
            service__barcode:'',
            service__vendor_code:'',
            service__timing_duration: '',
            service__custom_timing_duration: '',
            service__description:'',
            service__sale_price: '',
            service__goods_category: '',
            service__select_good: null,
            service__select_goods: [],
        };
    }

    componentDidMount() {
        this.props.onAddCategoriesGoods('product', 'pro');
        ($ => {
            $("#ModalAdd").on("hidden.bs.modal", () => {
                document.querySelector("#formAdd").reset();
                this.setState({
                    tags: [],
                    goods_in_service: [],
                    errors: {},
                    item: deepAssign({}, itemInitialState)
                });
                this.props.onErrorsClear();
            });
        })(window.$);
    }
    componentWillUpdate(nextProps, nextState) {

        if (this.props !== nextProps) {
            nextState.loaded = true;
        }
        if (nextProps.brands !== this.props.brands) {
            nextState.brands = __mapToDataBrands(nextProps.brands);
        }
        if (nextProps.services_tags !== this.props.services_tags) {
            nextState.services_tags = __mapToDataTags(
                nextProps.services_tags
            );
        }

        if (this.props.category_id !== nextProps.category_id) {
            nextState.category_id = nextProps.category_id;
        }

        if (nextProps.errors !== this.props.errors) {
            if (nextProps.errors.status) {
                if (nextProps.errors.status === "error") {
                    if (nextProps.errors.message.index !== "") {
                        nextState.errors[nextProps.errors.message.index] = {
                            message: nextProps.errors.message.error
                        };
                    } else {
                        nextState.errors[nextProps.errors.message.field] = {
                            message: nextProps.errors.message.error
                        };
                    }
                }
                if (nextProps.errors.status === "success") {
                    delete nextState.errors[nextProps.errors.message];
                }
            } else {
                nextState.errors = {};
            }
        }

        nextState.goods = this.mapToDataGoods(nextProps.goods_list);
        nextState.goods_in_service_ui = this.mapToDataGoodsInService(
            nextState.goods_in_service
        );
    }

    componentDidUpdate() {
        $("#tags_services_select")
            .select2({
                theme: "bootstrap",
                width: "100%",
                multiple: true,
                tags: true,
                placeholder: "Выберите теги",
                data: this.state.services_tags,
                value: this.state.tags
            })
            .off("select2:select")
            .on("select2:select", this.tagChanged)
            .off("select2:unselect")
            .on("select2:unselect", this.delTag);
        $('#select_duration_time')
            .select2({
                theme: "bootstrap",
                width: "100%",
                multiple: false,
                tags: false,
                placeholder: "",
                data: data_timing,
                value: ''
            })
            .off('select2:select')
            .on('select2:select', this.selectTimingDuration);
            $('#services__select_trends')
                .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                data: this.state.brands,
                tags: true
            })
            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                this.setState({
                    service__brand:val
                });
            });
    }

    selectTimingDuration = (e) => {
        this.setState({
            service__timing_duration: e.params.data.id
        })
    };

    inputChange = (type) => (e) => {
        e.preventDefault();
        this.checkForErrors(type);
        let newValue = type === "amount"
            ? DEFINE_INT_NUMBER(this.state.item[type], e.target.value)
            : e.target.value;
        this.setState({
            [type]: newValue
        });
    };

    inputChanged = (e) => {
        e.preventDefault();
        this.checkForErrors(e.target.name);
        let item = this.state.item;

        e.target.name === "amount"
            ? (item[e.target.name] = DEFINE_INT_NUMBER(
            this.state.item[e.target.name],
            e.target.value
        ))
            : (item[e.target.name] = e.target.value);

        this.setState({
            item: item
        });
    };
    mapToData = (props) => {
        return props.service_exp
            ? {
                name: props.service_exp.good.good_name || "",
                amount: +props.service_exp.amount || 0,
                sale_price: parseFloat(props.service_exp.sale_price).toFixed(2) ||
                (0.0).toFixed(2),
                tags: props.good_exp.tags || []
            }
            : {
                name: "",
                amount: 0,
                sale_price: 0.0,
                tags: []
            };
    };

    mapToDataGoods = (props) => {
        if (props) {
            return props.map(good => {
                return {
                    id: good.good_id,
                    text: good.good_name
                };
            });
        }
    };
    mapToDataGoodsInService = (goods_in_service) => {
        const state = {};
        state.core = {};
        state.core.token = this.props.token;
        return goods_in_service.map((good, pIndex) => {
            return (
                <GoodItemInService
                    key={pIndex}
                    id={pIndex}
                    errors={this.state.errors}
                    selected_good={+good.good_id}
                    amount={good.amount}
                    units={good.available_forms}
                    selected_unit={good.selected_unit}
                    disabled={good.disabled}
                    categories={this.props.categories}
                    state={state}
                    category_id={good.category_id}
                    onGoodChanged={this.onGoodChanged}
                    onGoodRemoved={this.onGoodRemoved}
                    onLosFocus={this.focusLos}
                    onUnitChange={this.changeUnit}
                />
            );
        });
    };

    tagChanged = (e) => {
        let tags = this.state.tags;
        if (e.params.data.element) {
            tags.push(+e.params.data.id);
        } else {
            tags.push(e.params.data.id);
        }
        this.setState({tags: tags});
    };

    delTag = (e) => {
        let tags = this.state.tags;
        tags = tags.filter(tag => {
            let found = true;
            if (tag.toString() === e.params.data.id) {
                found = false;
            }
            return found;
        });
        this.setState({tags: tags});
    };


    changeSalePrice = (e) => {
        this.checkForErrors(e.target.name);
        let item = this.state.item;
        item[e.target.name] = DEFINE_DOUBLE_NUMBER(
            this.state.item[e.target.name],
            e.target.value
        );
        this.setState({
            item: item
        });
    };

    checkForErrors = (name) => {
        switch (name) {
            case "name":
                name = "good_name";
                break;
            case "sale_price":
                name = "price";
                break;
            default:
                break;
        }
        this.state.errors[name] ? delete this.state.errors[name] : "";
    };

    focusLos = (e) => {
        e.preventDefault();

        let val = e.target.name;

        switch (val) {
            case "name":
                val = "good_name";
                break;
            case "sale_price":
                val = "price";
                break;
            default:
                val = e.target.name;
                break;
        }

        let data = {
            name: val,
            value: e.target.value,
            index: e.target.id ? e.target.id : "",
            id: ""
        };

        this.props.onCheckService(data);
    };

    onAdd = () => {

        let err = {}

        if (this.state.service__name === "") {
            err["service__name"] = {message: "Укажите название"};
        }
        if(!this.state.service__barcode  && !this.state.service__vendor_code){
            err["service__barcode"] = {message: "Укажите штрих-код либо артикул"};
        }
        if(
            (!this.state.service__timing_duration ||
            (this.state.service__timing_duration ==='other' &&
             !this.state.service__custom_timing_duration))
        ){
            err["service__timing_duration"] = {message: "Укажите продолжительность"};
        }
        if(!this.state.service__brand){
                err['service__brand'] = {message:'Выберите направление'}
        }
        if (
            this.state.service__sale_price === "" ||
            +this.state.service__sale_price === 0
        ) {
            err["service__sale_price"] = {message: "Укажите цену"};
        }
        if (!this.state.category_id || this.state.category_id === 0 || this.state.category_id === 1) {
            err["service__group"] = {message: "Выберите папку"};
        }
        if (Object.keys(err).length > 0) {
            let error = {
                type: "error",
                text: "Заполнены не все поля!"
            };
            this.props.onNotifyShow(error);
        } else {
            let timing = this.state.service__timing_duration === 'other' ?
                this.state.service__custom_timing_duration :
                this.state.service__timing_duration
            let data = {
                name:this.state.service__name,
                category:this.state.category_id,
                barcode:this.state.service__barcode,
                vendor_code:this.state.service__vendor_code,
                timing_duration:timing,
                description:this.state.service__description,
                sale_price:this.state.service__sale_price,
                goods:this.state.service__select_goods
            };
            console.log(data)
            //
            // document.querySelector("#formAdd").reset();
            // window.$("#ModalAdd").modal("hide");
        }
        this.setState({
            errors: err
        });
    };

    onAddGoodClick = (e) => {
        e.preventDefault();

        this.setState({
            goods_in_service: this.state.goods_in_service.concat([
                {
                    good_id: 0,
                    amount: 0,
                    selected_unit: "",
                    form_id: null,
                    disabled: true,
                    available_forms: []
                }
            ])
        });
    };

    changeUnit = (i, unit) => {
        let obj = this.state.goods_in_service;
        obj[i].selected_unit = unit.name;
        obj[i].form_id = unit.id;
        this.setState({
            goods_in_service: obj
        });
    };

    onGoodChanged = (id, data) => {
        let un_sel = "";
        let un_id = null;
        let forms = [];

        this.props.goods_list.forEach(good => {
            if (good.good_id === +data.good_id) {
                forms = good.available_forms;
                un_sel = good.available_forms[0].name;
                un_id = good.available_forms[0].id;
            }
        });

        const goods_in_service = this.state.goods_in_service.concat([]);
        goods_in_service.splice(id, 1, {
            category_id: data.category_id,
            good_id: data.good_id,
            amount: data.amount,
            selected_unit: un_sel,
            form_id: un_id,
            disabled: false,
            available_forms: forms
        });

        this.setState({
            goods_in_service: goods_in_service
        });
    };

    onGoodRemoved = (id) => {
        this.setState({
            goods_in_service: this.state.goods_in_service.filter(
                (item, index) => {
                    return index !== id;
                }
            )
        });
    };
    //////////////////LUCENKO////////////////
    handleDeleteProductFromServices = (id) => (e) => {
        e.preventDefault();

        let service__select_goods = this.state.service__select_goods.filter((good) => good.good_id !== id);

        this.setState({service__select_goods});
    };
    handleClearSelect = (type) => ev => {
        this.setState({[type]: null});
    }
    checkProductsInServices = () => {
        if (!this.state.service__select_goods) return;
        let rowsProduct = this.state.service__select_goods.map((good) => (
            <div className="services-goods__select-item" key={(Date.now() + Math.random()).toString() + good.good_id}>
                <h6 className="services-goods__good-name services__text-pink "> {good.good_name}</h6>
                <p className="services-goods__good-price">{good.sale_price} грн</p>
                <p className="services-goods__good-action">
                        <i className="fa fa-times-circle" onClick={this.handleDeleteProductFromServices(good.good_id)}/>
                </p>
            </div>
        ));
        let finalSum = this.state.service__select_goods.reduce((a, b) => (a + b.sale_price), 0);
        return (
            <div>
                <p className="services__text-pink "><span
                    className="text-muted font-weight-bold">На суму </span>{finalSum} грн</p>
                    <div className="services-goods">
                        {rowsProduct}
                    </div>



            </div>
        )

    }
    renderGoodSelect = () => {
        let goods = this.props.goodsTest.goods.map((good) => {
            good.good_group_id = good.good_id;
            good.good_group_name = good.good_name;
            return good;
        });
        let category_id = this.state.service__goods_category && this.state.service__select_good;
        return (
            <DropDownTreeView
                category_id={category_id}
                items={goods}
                placeholder="Товар"
                onItemSelect={this.onChangeCategory('service__select_good')}
                disabled={!this.state.service__goods_category}
            />
        )
    }

    onChangeCategory = (type) => (category_new_id) => {
        this.state.errors["service_group"]
            ? delete this.state.errors["service_group"]
            : "";
        if (type === 'service__goods_category') {
            this.props.onSelCategory(category_new_id, 'product', 'pro', '');
        }
        this.setState({
            [type]: category_new_id
        });
    };
    addGoodInState = () => {
        if (!this.state.service__select_good) return;
        let good = this.props.goodsTest.goods.filter(good => good.good_id === this.state.service__select_good);
        let goods = this.state.service__select_goods;
        let service__select_goods = [...goods, good[0]];
        this.setState({service__select_goods,service__goods_category:null,service__select_good:null});
    }
    render(){

        return (
            <div>
                <div
                    className="row"
                    style={{display: this.state.loaded ? "block" : "none"}}
                >
                    <div
                        className="col-md-4 form-horizontal form-bordered"
                        // style={{ borderRight: "1px solid #e5e5e5" }}
                    >
                        <p className="service-add-title mb-xlg">Информация по услуге</p>
                        <div
                            className={
                                "form-group" +
                                (this.state.errors["service__name"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Название
                            </label>
                            <div
                                className="col-md-8"
                                style={{textAlign: "right"}}
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    // placeholder="Услуга 1"
                                    onChange={this.inputChange('service__name')}
                                    onBlur={this.focusLos}
                                    value={this.state.service__name}
                                    required
                                />
                                <label
                                    className={
                                        this.state.errors["service__name"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__name"]
                                        ? this.state.errors["service__name"].message
                                        : ""}
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                "form-group mb-none pb-none" +
                                (this.state.errors["service__group"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Папка
                            </label>
                            <div className="col-md-8">
                                <DropDownTreeView
                                    items={this.props.categories}
                                    category_id={
                                        +this.state.category_id === 1 ||
                                        +this.state.category_id === 271828182
                                            ? 0
                                            : this.state.category_id
                                    }
                                    // placeholder="Выберите категорию"
                                    onItemSelect={this.onChangeCategory('category_id')}
                                />
                                <label style={{textAlign: "right",width:'100%'}}
                                    className={
                                        this.state.errors["service__group"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__group"]
                                        ? this.state.errors["service__group"].message
                                        : ""}
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                "form-group mb-none pb-none" +
                                (this.state.errors["service__brand"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Направление
                            </label>
                            <div className="col-md-8">
                                <select id="services__select_trends" name="services__select_trends"/>
                                <label style={{textAlign: "right",width:'100%'}}
                                    className={
                                        this.state.errors["service__brand"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__brand"]
                                        ? this.state.errors["service__brand"].message
                                        : ""}
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                "form-group" +
                                (this.state.errors["service__barcode"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Штрих-код
                            </label>
                            <div
                                className="col-md-8"
                                style={{
                                    textAlign: "right"
                                }}
                            >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-fw fa-barcode"/>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="barcode"
                                        // placeholder="Услуга 1"
                                         onChange={this.inputChange('service__barcode')}
                                        // onBlur={this.focusLos}
                                        value={this.state.service__barcode}
                                        required
                                    />

                                </div>
                                <label
                                    className={
                                        this.state.errors["service__barcode"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__barcode"]
                                        ? this.state.errors["service__barcode"].message
                                        : ""}
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                "form-group" +
                                (this.state.errors["service__barcode"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Артикул
                            </label>
                            <div
                                className="col-md-8"
                                style={{
                                    textAlign: "right"
                                }}
                            >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-fw fa-slack"/>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="article"
                                        // placeholder="Услуга 1"
                                         onChange={this.inputChange('service__vendor_code')}
                                        // onBlur={this.focusLos}
                                         value={this.state.service__vendor_code}
                                        required
                                    />

                                </div>
                                <label
                                    className={
                                        this.state.errors["service__barcode"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__barcode"]
                                        ? this.state.errors["service__barcode"].message
                                        : ""}
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                "form-group" +
                                (this.state.errors["service__timing_duration"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Продолжит.
                            </label>
                            <div>
                                <div
                                    className="col-md-4"
                                    style={{textAlign: "right", paddingRight: 0}}
                                >


                                    <select id="select_duration_time" name="duration-time"/>


                                </div>
                                <div
                                    className="col-md-4"
                                    style={{textAlign: "right"}}
                                >
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="amount-time"
                                        // placeholder="30"
                                        // onChange={this.inputChanged}
                                        // onBlur={this.focusLos}
                                        // value={this.state.item.amount}
                                        required
                                        value={this.state.service__timing_duration === 'other' ? this.state.service__custom_timing_duration : ''}
                                        disabled={this.state.service__timing_duration !== 'other'}
                                        onChange={this.inputChange('service__custom_timing_duration')}

                                    />


                                </div>
                                <label style={{textAlign: "right",width:'100%'}}
                                    className={
                                        this.state.errors["service__timing_duration"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__timing_duration"]
                                        ? this.state.errors["service__timing_duration"].message
                                        : ""}
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                "form-group" +
                                (this.state.errors["service__description"]
                                    ? " has-error"
                                    : "")
                            }
                        >
                            <label
                                className="col-md-4 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Описание
                            </label>
                            <div
                                className="col-md-12"
                                style={{
                                    textAlign: "right"
                                }}
                            >
                                <div className="input-group col-md-12">
                                    <textarea
                                        type="text"
                                        style={{
                                            overflow: 'hidden',
                                            // width: '210px',
                                            borderRadius: '4px'
                                        }}
                                        id="note"
                                        className="form-control fs-12"
                                        name="service__description"
                                        rows="6"
                                        value={this.state.service__description}
                                        onChange={this.inputChange('service__description')}
                                    />
                                    <label
                                        className={
                                            this.state.errors["service__description"]
                                                ? "control-label"
                                                : "hidden"
                                        }
                                    >
                                        {this.state.errors["service__description"]
                                            ? this.state.errors["service__description"].message
                                            : ""}
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-4 form-horizontal form-bordered">
                        <p className="service-add-title mb-xlg">Цены</p>
                        <ServicesAddTable items={items}/>
                    </div>
                    <div className="col-md-4 form-horizontal form-bordered">
                        <p className="service-add-title mb-xlg">Калькуляция</p>
                        <div
                            className={
                                "form-group" +
                                (this.state.errors["service__sale_price"]
                                    ? " has-error"
                                    : "")
                            }
                            style={{margin: 0}}
                        >
                            <label
                                className="col-md-12 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Планирование себестоимости услуги
                            </label>
                            <div
                                className="col-md-6"
                                style={{textAlign: "right"}}
                            >
                                <input
                                    type="number"
                                    className="form-control fs-10"
                                    name="amount-time"
                                    placeholder="Значение"
                                     onChange={this.inputChange('service__sale_price')}
                                     value={this.state.service__sale_price}
                                    // onBlur={this.focusLos}
                                    required
                                />
                                <label
                                    className={
                                        this.state.errors["service__sale_price"]
                                            ? "control-label"
                                            : "hidden"
                                    }
                                >
                                    {this.state.errors["service__description"]
                                        ? this.state.errors["service__sale_price"].message
                                        : ""}
                                </label>
                            </div>
                            <div
                                className="col-md-6"
                                style={{
                                    textAlign: "right"
                                }}
                            >
                                <div className="input-group col-md-12 service-dropdown">
                                    <DropDownTreeView
                                        // items={this.props.categories}
                                        // category_id={
                                        //     +this.state.category_id === 1 ||
                                        //     +this.state.category_id === 271828182
                                        //         ? 0
                                        //         : this.state.category_id
                                        // }
                                        placeholder="Распечатать"
                                        onItemSelect={this.onChangeCategory}
                                    />
                                    {/*</div>*/}
                                    <label
                                        className={
                                            this.state.errors["amount"]
                                                ? "control-label"
                                                : "hidden"
                                        }
                                    >
                                        {this.state.errors["amount"]
                                            ? this.state.errors["amount"].message
                                            : ""}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <hr style={{margin: "25px 0px 20px 0px"}}/>
                        <div
                            className={
                                "form-group" +
                                (this.state.errors[""]
                                    ? " has-error"
                                    : "")
                            }
                            style={{margin: 0}}
                        >
                            <label
                                className="col-md-12 control-label fs-12"
                                style={{textAlign: "left"}}
                            >
                                Калькуляция товаров по услуге
                            </label>
                            <div
                                className="input-group col-md-12 service-dropdown"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <DropDownTreeView
                                    items={this.props.goodsTest.goods_categories}
                                    category_id={this.state.service__goods_category}

                                    placeholder="Товар"
                                    onItemSelect={this.onChangeCategory('service__goods_category')}
                                />
                                <div className="col-md-2"
                                >
                                    <a>
                                        <i className="fa fa-times-circle" onClick={this.handleClearSelect('service__goods_category')}/>
                                    </a>
                                </div>
                            </div>

                            <div
                                className="input-group col-md-12 service-dropdown"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                {this.renderGoodSelect()}
                                <div className="col-md-2"
                                >
                                    <a>
                                        <i className="fa fa-times-circle" onClick={this.handleClearSelect('service__select_good')}/>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div
                            className="input-group col-md-12">
                            <a
                                href='#'
                                className="btn btn-primary mr-md goods-add"
                                style={{
                                    top: 5
                                }}
                                onClick={this.addGoodInState}
                            >
                                <i className="fa fa-plus-circle"/>
                                &nbsp;
                                <i className="fa fa-file-text"/>
                            </a>
                        </div>
                        <hr style={{margin: "25px 0px 20px 0px"}}/>


                        {this.checkProductsInServices()}
                        <div className="modal-footer row display-none">
                            <div className="text-right">
                                <button
                                    id="save-services-add"
                                    type="button"
                                    onClick={this.onAdd}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ServicesAdd.propTypes = {
    categories: PropTypes.array.isRequired,
    services_tags: PropTypes.array.isRequired,
    goods_list: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired,
    onAddService: PropTypes.func.isRequired,
    onErrorsClear: PropTypes.func.isRequired,
    onCheckService: PropTypes.func.isRequired,
    onNotifyShow: PropTypes.func.isRequired
};

/**
 *
 */
class GoodItemInService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods_list: [],
            categories: []
        };
    }

    componentDidMount() {
        if (this.state.categories !== this.props.categories) {
            this.setState({categories: this.props.categories});
        }
    }

    componentWillUpdate(nextProps, nextState) {

        nextState.goods_list = this.mapToDataGoods(nextState.goods_list);
        let id = "#service_add_select" + this.props.id;

        if (nextState.goods_list.length === 0) {
            $(id).attr("disabled", true);
        } else {
            $(id).attr("disabled", false);
        }
    }

    componentDidUpdate() {
        let data = this.state.goods_list;
        let id = "#service_add_select" + this.props.id;
        $(id)
            .select2({
                placeholder: "Выберите товар",
                theme: "bootstrap",
                width: "100%",
                className: "form-control",
                data: data,
                tags: true
            })
            .off("change")
            .on("change", e => {
                this.setState({
                    item: {
                        ...this.state.item,
                        good: e.target.value
                    }
                });
                this.goodsChanged(e);
            });
    }

    categoryChanged = category_id => {
        let data = {
            category_id: category_id,
            good_id: this.props.selected_good,
            amount: this.props.amount
        };
        this.props.onGoodChanged(this.props.id, data);
        net
            .aGet(
                this.props.state,
                can.API_GOODS.getGoodsWithinGroup
                    .replace(/\{groupId}/, category_id)
                    .replace(/\{goodsType}/, "product")
                    .replace(/\{warehouse}/, "pro")
            )
            .then(json => {
                this.setState({goods_list: json.data});
            });
    };

    goodsChanged = e => {
        this.props.errors["good" + this.props.id]
            ? delete this.props.errors["good" + this.props.id]
            : "";

        let data = {
            category_id: this.props.category_id,
            good_id: e.target.value,
            amount: this.props.amount
        };

        this.props.onGoodChanged(this.props.id, data);
    };

    amountChanged = e => {
        this.props.errors["amount_good" + this.props.id]
            ? delete this.props.errors["amount_good" + this.props.id]
            : "";
        this.props.errors[this.props.id]
            ? delete this.props.errors[this.props.id]
            : "";
        let data = {
            category_id: this.props.category_id,
            good_id: this.props.selected_good,
            amount: DEFINE_INT_NUMBER(this.props.amount, e.target.value)
        };
        this.props.onGoodChanged(this.props.id, data);
    };

    goodRemovedClick = () => {
        this.props.errors["good" + this.props.id]
            ? delete this.props.errors["good" + this.props.id]
            : "";
        this.props.errors["amount_good" + this.props.id]
            ? delete this.props.errors["amount_good" + this.props.id]
            : "";
        this.props.onGoodRemoved(this.props.id);
    };

    mapToDataGoods = goods => {
        if (goods.length !== 0) {
            let temp_goods = goods.map(good => {
                return {text: good.good_name, id: good.good_id};
            });
            temp_goods.unshift({text: "", id: ""});
            return temp_goods;
        } else {
            return goods;
        }
    };

    unitsSelect = (units, id) => {
        return units.map((unit, i) => {
            return (
                <li key={i}>
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            this.props.onUnitChange(id, unit);
                        }}
                    >
                        {unit.name}
                    </a>
                </li>
            );
        });
    };

    render() {
        return (
            <div
                style={
                    this.props.id > 0
                        ? {marginTop: "25px"}
                        : {marginTop: "0px"}
                }
            >
                <div className={"form-group mb-none pb-none"}>
                    <label className="col-md-3 control-label">Категория</label>
                    <div className="col-md-8">
                        <DropDownTreeView
                            items={
                                this.props.categories || this.state.categories
                            }
                            placeholder="Выберите категорию"
                            category_id={this.props.category_id}
                            onItemSelect={this.categoryChanged}
                        />
                    </div>
                </div>
                <div
                    className={
                        "form-group" +
                        (this.props.errors["good" + this.props.id]
                            ? " has-error"
                            : "")
                    }
                >
                    <label className="col-md-3 control-label">
                        Товар {this.props.id + 1}
                    </label>
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-fw fa-list-alt"/>
                            </span>
                            <select id={"service_add_select" + this.props.id}/>
                        </div>
                    </div>
                    <a
                        className={
                            this.props.length > 2
                                ? "col-md-1 pl-xs mt-xs"
                                : "hide"
                        }
                        onClick={this.goodRemovedClick}
                    >
                        <i className="fa fa-fw fa-lg fa-trash"/>
                    </a>
                </div>

                <div
                    className={
                        "form-group" +
                        (this.props.errors["amount_good" + this.props.id]
                            ? " has-error"
                            : "")
                    }
                >
                    <label className="col-md-3 control-label">Количество</label>
                    <div
                        className={
                            "col-md-4" +
                            (this.props.errors[this.props.id]
                                ? " has-error"
                                : "")
                        }
                    >
                        <div className="input-group">
                            <div className="input-group-addon">
                                <i className="fa fa-fw fa-glass"/>
                            </div>
                            <input
                                type="text"
                                id={this.props.id}
                                className="form-control"
                                name="amount_good"
                                disabled={this.props.disabled}
                                placeholder="0.00"
                                onChange={this.amountChanged}
                                value={this.props.amount}
                                onBlur={this.props.onLosFocus}
                            />
                            <div className="input-group-btn">
                                <button
                                    type="button"
                                    className="btn btn-default dropdown-toggle"
                                    data-toggle="dropdown"
                                    style={{
                                        width: "70px",
                                        backgroundColor: "rgb(238,238,238)"
                                    }}
                                >
                                    {this.props.selected_unit}{" "}
                                    <span className="caret"/>
                                </button>
                                <ul className="dropdown-menu">
                                    {this.unitsSelect(
                                        this.props.units,
                                        this.props.id
                                    )}
                                </ul>
                            </div>
                        </div>
                        <label
                            className={
                                this.props.errors[
                                "amount_good" + this.props.id
                                    ] || this.props.errors[this.props.id]
                                    ? "control-label"
                                    : "hidden"
                            }
                        >
                            {this.props.errors["amount_good" + this.props.id]
                                ? this.props.errors[
                                "amount_good" + this.props.id
                                    ].message
                                : this.props.errors[this.props.id]
                                    ? this.props.errors[this.props.id].message
                                    : ""}
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

GoodItemInService.propTypes = {
    id: PropTypes.number.isRequired,
    selected_good: PropTypes.number.isRequired,
    selected_unit: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
    units: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    category_id: PropTypes.number,
    state: PropTypes.object.isRequired,
    onGoodChanged: PropTypes.func.isRequired,
    onGoodRemoved: PropTypes.func.isRequired,
    onLosFocus: PropTypes.func.isRequired,
    onUnitChange: PropTypes.func.isRequired
};

export default ServicesAdd;
