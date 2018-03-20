import React,{Component} from 'react';
import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;
const countries = [
    {
        id:0,
        text:"Украина"
    },
    {
        id:1,
        text:"Россия"
    },
    {
        id:2,
        text:"Австралия"
    }
]
const languages = [
    {
        id:0,
        text:"Украинский"
    },
    {
        id:1,
        text:"Русский"
    },
    {
        id:2,
        text:"Английский"
    }
]
const currency = [
    {
        id:0,
        text:"UAH - украинская гривна"
    },
    {
        id:1,
        text:"RU - российский рубль"
    },
    {
        id:2,
        text:"AUD - австралийский доллар"
    }
]

export default class SettingCommonLocation extends Component{

    state = {
        select_country:null,
        select_language:null,
        select_curency:null,
        countries:countries,
        languages:languages,
        currency:currency,
        city:'',
        phone:'',
        adress:'',
        site:''
    }
    componentDidMount(){
        ($ => {
            $('#setting-general__common-countries')
                .select2({
                    theme: 'bootstrap',
                    placeholder: '',
                    width: '100%',
                    data: this.state.countries,
                    tags: true
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    console.log(e.target.selectedOptions[0].label)
                    this.setState({
                        select_country:val
                    });
            });
            $('#setting-general__common-languages')
                .select2({
                    theme: 'bootstrap',
                    placeholder: '',
                    width: '100%',
                    data: this.state.languages,
                    tags: true
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    this.setState({
                        select_language:val
                    });
                });
            $('#setting-general__common-currency')
                .select2({
                    theme: 'bootstrap',
                    placeholder: '',
                    width: '100%',
                    data: this.state.currency,
                    tags: true
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    this.setState({
                        select_curency:val
                    });
                });
        })(window.$);
    }
    componentDidUpdate() {
        $('#setting-general__common-countries')
            .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                data: this.state.countries,
                tags: true
            })
            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                console.log(e.target.selectedOptions[0].label)
                this.setState({
                    select_country:val
                });
            });
        $('#setting-general__common-languages')
            .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                data: this.state.languages,
                tags: true
            })
            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                this.setState({
                    select_language:val
                });
            });
        $('#setting-general__common-currency')
            .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                data: this.state.currency,
                tags: true
            })
            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                this.setState({
                    select_curency:val
                });
            });
    }

    inputChanged = (type) => (e) => {
        e.preventDefault();
        this.setState({
            [type]:e.target.value
        })

    }
    render(){
        return(

                <div style={{backgroundColor:'white',minHeight:'100%',padding:'60px 10px 0px'}}>
                    <h6 className="title" style={{paddingLeft:15, marginBottom:20}}>
                       <strong>Размещение</strong>
                    </h6>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label fs-12">
                            Страна
                        </label>
                        <div className="col-md-5">

                            <select id="setting-general__common-countries" name="setting-general__common-countries"/>

                        </div>
                    </div>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label fs-12">
                            Город
                        </label>
                        <div className="col-md-5">

                            <input type="text" className="form-control" value={this.state.city} onChange={this.inputChanged('city')}/>

                        </div>
                    </div>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label fs-12">
                            Адрес
                        </label>
                        <div className="col-md-5">

                            <input type="text" className="form-control" value={this.state.address}  onChange={this.inputChanged('address')}/>

                        </div>
                    </div>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label fs-12">
                            Телефон
                        </label>
                        <div className="col-md-5">

                            <input type="text" className="form-control" value={this.state.phone}  onChange={this.inputChanged('phone')}/>

                        </div>
                    </div>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label  fs-12">
                            Веб-сайт
                        </label>
                        <div className="col-md-5">

                            <input type="text" className="form-control"  value={this.state.site}  onChange={this.inputChanged('site')}/>

                        </div>
                    </div>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label fs-12">
                            Язык програмы
                        </label>
                        <div className="col-md-5">

                            <select id="setting-general__common-languages" name="setting-general__common-languages"/>

                        </div>
                    </div>
                    <hr style={{margin:'20px 0px 25px'}}/>
                    <h6 className="title" style={{paddingLeft:15, marginBottom:20}}>
                        <strong>Валюта</strong>
                    </h6>
                    <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                        <label className="col-md-2 control-label fs-12">
                            Основная валюта
                        </label>
                        <div className="col-md-5">

                            <select id="setting-general__common-currency" name="setting-general__common-currency"/>

                        </div>
                    </div>
                    <hr style={{margin:'20px 0px 25px'}}/>
                    <h6 className="title" style={{paddingLeft:15, marginBottom:20}}>
                        <strong>Телефон</strong>
                    </h6>

                </div>


        )
    }
}