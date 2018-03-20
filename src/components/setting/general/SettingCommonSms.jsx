import React,{Component} from 'react';
import OperatorList from './OperatorList';
import Provider from '../../../../public/assets/images/provider.png'
import {TimePicker} from 'antd';
import moment from 'moment';
import Modal from '../../commons/modals/Modal';
const operatorList = [
    {
        key:'ol0',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol1',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol2',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol3',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol4',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol5',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol6',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol7',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol8',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol9',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol10',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    },
    {
        key:'ol11',
        img:Provider,
        heading:'SMS Provider',
        url:'www.providerwebsite.com'
    }
]
const countries = [
    {
        id:'cou0',
        title:'Узбекистан',
        items:[
            {
                key:'ol0',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol1',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            }
        ]
    },
    {
        id:'cou1',
        title:'Украина',
        items:[
            {
                key:'ol0',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol1',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol2',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol3',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol4',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol5',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol6',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol7',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol8',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol9',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol10',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol11',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            }
        ]
    },
    {
        id:'cou2',
        title:'Чехия',
        items:[
            {
                key:'ol0',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            }
        ]
    },
    {
        id:'cou3',
        title:'Швейцария',
        items:[
            {
                key:'ol0',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol1',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            },
            {
                key:'ol2',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            }
        ]
    },
    {
        id:'cou4',
        title:'ЮАР',
        items:[
            {
                key:'ol0',
                img:Provider,
                heading:'SMS Provider',
                url:'www.providerwebsite.com'
            }
        ]
    }
]
export default class SettingCommonSms extends Component{

    state = {
        countries:countries,
        selectCountry:null,
        password:'',
        login:'',
        sign:'',
        time: {
            timeStart: ['09', '00'],
            timeEnd: ['18', '00']
        },
        showTime: false
    }
    componentDidMount(){
        if(!this.state.selectCountry){
            this.setState({
                selectCountry:'cou1'
            })
        }
    }
    onChangeStartTime = (time, timeString) => {
        const timeState = this.state.time;
        const timeArr = timeString.split(':');
        timeState.timeStart = timeArr;
        this.setState({time: timeState});
    };

    onChangeEndTime = (time, timeString) => {
        const timeState = this.state.time;
        const timeArr = timeString.split(':');
        timeState.timeEnd = timeArr;
        this.setState({time: timeState});
    };
    onCheckedWorkingThisDay = (type) => (e) => {
        this.setState({
            [type]:!this.state[type]
        })
    }
    inputChanged = (type) => (e) => {
        e.preventDefault();
        this.setState({
            [type]:e.target.value
        })

    }
    handleCountrySelect = (id) => (ev) => {
        this.setState({
            selectCountry:id
        })
    }
    renderCountriesList = () =>{

        const countriesArray = this.state.countries.map((country)=>(
            <li onClick={this.handleCountrySelect(country.id)} className=
                {`setsms-counries__list-item
                  ${country.id===this.state.selectCountry && 'setsms-counries__list-item__active'}
                `} key={country.id}>
                <div className="setsms-counries__item-logo"
                     style={{width:26,height:16,backgroundColor:'red'}}></div>
                <h5 className="setsms-counries__item-heading">{country.title} ({country.items.length})</h5>
            </li>
        ));
        return(
            <ul className="setsms-counries__list">
                {countriesArray}
            </ul>
        )
    }
    renderOperators = () =>{
        if(!this.state.selectCountry)return
        let operatorList;
        for(let country of this.state.countries){
            if(country.id===this.state.selectCountry){
                operatorList = country.items;
            }
        }
        return  <OperatorList operators={operatorList}/>
    }
    handleAddMessage = (e) =>{
        e.preventDefault();

    }

    render(){
        return(

            <div style={{backgroundColor:'white',minHeight:'100%',padding:'60px 30px 0px'}}>
                <Modal
                    save={this.handleAddMessage}
                    customClass="modal-dialog"
                    name="settingSmsAdd"
                    id="ModalAddSms"
                    idForm="modalAddSms"
                    title="Отправка СМС"
                    fa="fa-envelope"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div style={{padding:'15px 20px 45px'}}>
                        <div className="form-group">
                            <label className="col-md-4 control-label fs-12" style={{paddingTop:5}}>
                                Номер телефона
                            </label>
                            <div className="col-md-8">

                                <input type="text" className="form-control"/>

                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 control-label fs-12" style={{paddingTop:5}}>
                                Сообщение
                            </label>
                            <div className="col-md-8">

                                <textarea  className="form-control" style={{resize:'none'}} rows={6}/>

                            </div>
                        </div>
                        <div className="modal-footer row display-none">
                            <div className="text-right">
                                <button
                                    id="save-goods-add-sale-form"
                                    type="button"
                                    onClick={this.handleAddMessage}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>

                </Modal>
             <section className="setsms-top">
                 <div className="setsms-counries">
                        {this.renderCountriesList()}
                 </div>
                 {this.renderOperators()}
             </section >
            <section className="setsms-bottom">
                <h6 className="title" style={{paddingLeft:15, margin:'40px 0px 20px'}}>
                    <strong>Дополнительные настройки</strong>
                </h6>
               <div className="col-md-9">
                   <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                       <label className="col-md-2 control-label fs-12">
                           Логин
                       </label>
                       <div className="col-md-4">

                           <input type="text" className="form-control" value={this.state.login} onChange={this.inputChanged('login')}/>

                       </div>
                   </div>
                   <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                       <label className="col-md-2 control-label fs-12">
                           Пароль
                       </label>
                       <div className="col-md-4">

                           <input type="password" className="form-control" value={this.state.password} onChange={this.inputChanged('password')}/>

                       </div>
                   </div>
                   <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                       <label className="col-md-2 control-label fs-12">
                           Подпись
                       </label>
                       <div className="col-md-4">

                           <input type="text" className="form-control" value={this.state.sign} onChange={this.inputChanged('sign')}/>

                       </div>
                   </div>
                   <div style={{display:'flex', alignItems: 'center'}}>
                       <label className="col-md-2 control-label fs-12">
                           Время отправки
                       </label>



                       
                       <div className="col-md-3">

                           <div className='display-inline-block' style={{marginBottom:5}}>
                               <TimePicker
                                   className="employee-schedule-time"
                                   format="HH:mm"
                                   minuteStep={30}
                                   onChange={this.onChangeStartTime}
                                   defaultValue={moment('09:00', 'HH:mm')}
                                   onOpenChange={()=>{}}
                                   placeholder="00:00"
                               />
                           </div>
                           <div className='display-inline-block' style={{marginBottom:5}}>
                               &nbsp;-&nbsp;
                               <TimePicker
                                   className="employee-schedule-time"
                                   format="HH:mm"
                                   minuteStep={30}
                                   onChange={this.onChangeEndTime}
                                   defaultValue={moment('18:00', 'HH:mm')}
                                   onOpenChange={()=>{}}
                                   placeholder="00:00"
                               />
                           </div>


                       </div>
                       <a href="#ModalAddSms"
                          data-toggle="modal"
                          className="change-warehouse-button-focus"
                          style={{marginLeft:11}}
                          onClick={e => {
                              e.preventDefault();
                          }}
                       >
                           <i className="fa fa-envelope"></i>
                       </a>
                   </div>
                   <p
                       style={{    fontSize: 11, color: "#BBB", marginTop: 11, paddingLeft: 14}}
                   >СМС клиентам будет доставляться только в указаное время (кроме напоминаний о записе)</p>
               </div>

            </section>



            </div>


        )
    }
}