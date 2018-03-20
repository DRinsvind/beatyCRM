import React,{Component} from 'react';
import OperatorList from './OperatorList';
import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;
import {TimePicker} from 'antd';
import moment from 'moment';
import Provider from '../../../../public/assets/images/provider.png'
const frequencyList = [
    {
        id:'fl1',
        text:'Раз в сутки'
    },
    {
        id:'fl2',
        text:'Два раза в сутки'
    },
    {
        id:'fl3',
        text:'Три раза в сутки'
    }
]
export default class SettingCommonBackup extends Component{

    state = {
        selectFrequency:'',
        frequencyList:frequencyList,
        time: {
            timeStart: ['09', '00'],
            timeEnd: ['18', '00']
        },
        copy:true,
        showTime: false
    }

    onChangeStartTime = (time, timeString) => {
        const timeState = this.state.time;
        const timeArr = timeString.split(':');
        timeState.timeStart = timeArr;
        this.setState({time: timeState});
    };
    componentDidMount(){
        ($ => {
            $('#setting-general__common-backup')
                .select2({
                    theme: 'bootstrap',
                    placeholder: '',
                    width: '100%',
                    data: this.state.frequencyList,
                    tags: true
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    console.log(e.target.selectedOptions[0].label)
                    this.setState({
                        selectFrequency:val
                    });
                });

        })(window.$);
    }
    componentDidUpdate() {
        $('#setting-general__common-backup')
            .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                data: this.state.frequencyList,
                tags: true
            })
            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                console.log(e.target.selectedOptions[0].label)
                this.setState({
                    selectFrequency:val
                });
            });

    }
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

    handleCountrySelect = (id) => (ev) => {
        this.setState({
            selectCountry:id
        })
    }

    renderProviderList = () =>{
        let operators = this.props.operators.map((operator)=>(
            (
                <div className="operator-item" key={operator.key}>
                    <div className="operator-item__logo">
                        <img className="operator-item__img" src={operator.img} alt=""/>
                    </div>
                    <div className="operator-item__content">
                        <h5 className="operator-item__heading">{operator.heading}</h5>
                        <p className="operator-item__url">{operator.url}</p>
                    </div>
                </div>
            )
        ))
        return (
            <div className="operator-list">
                {operators}
            </div>
        );
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

            <div style={{backgroundColor:'white',minHeight:'100%',padding:'30px 30px 0px'}}>

                <section>
                    <div className="row">
                        <div className="col-md-6" style={{borderRight:'2px solid #CECECE'}}>
                            <div
                                style={{display: 'block',margin: 0,padding: '0px 0px 20px',top: 0,left:0,marginRight: 20}}
                                className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                                <input
                                    type="checkbox"
                                    name="workingThisDay"
                                    onChange={this.onCheckedWorkingThisDay('copy')}
                                    checked={this.state.copy}
                                />
                                <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                                    Делать резервные копии
                                </label>
                            </div>
                            <hr style={{margin:'15px 0px'}}/>
                            <div className="row" style={{display:'flex',alignItems:'center'}}>
                                <div className="col-md-2">
                                    <label className=" control-label fs-12">
                                        Частота копирования
                                    </label>
                                </div>
                                <div className="col-md-6"><select id="setting-general__common-backup" name="setting-general__common-backup"/></div>
                                <div className="col-md-4" style={{display:'flex',alignItems:'center'}}>
                                    <label className=" control-label fs-12" style={{margin: '0px 25px 0px 0px',padding:0,lineHeight:'12px'}}>
                                        В
                                    </label>
                                    <div className='display-inline-block' style={{margin:0,padding:0}}>
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
                                </div>
                            </div>
                            <hr style={{margin:'15px 0px 25px'}}/>
                            <div className="row" style={{display:'flex',alignItems:'center'}}>
                                <div className="col-md-6">
                                    <label className="control-label fs-12" style={{lineHeight:'12px'}}>
                                        Сделать резервную копию сейчас
                                    </label>

                                </div>
                                <div className="col-md-6">
                                    <button
                                       className="change-warehouse-button-focus"
                                       style={{marginLeft:11}}
                                       onClick={e => {
                                           e.preventDefault();
                                       }}
                                    >
                                        <i className="fa fa-envelope"></i>
                                    </button>
                                </div>
                            </div>
                            <hr style={{margin:'15px 0px'}}/>
                            <div className="row" style={{display:'flex',alignItems:'center'}}>
                                <div className="col-md-6">
                                    <label className=" control-label fs-12">
                                        Ваше облачное хранилище
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <div className="operator-item">
                                        <div className="operator-item__logo">
                                            <img className="operator-item__img" src={Provider} alt=""/>
                                        </div>
                                        <div className="operator-item__content">
                                            <h5 className="operator-item__heading">Google Drive</h5>
                                            <p className="operator-item__url">www.providerwebsite.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            { this.renderProviderList()}
                        </div>
                    </div>



                </section>



            </div>


        )
    }
}