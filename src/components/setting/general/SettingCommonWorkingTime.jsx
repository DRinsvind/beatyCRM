import React,{Component} from 'react';
import {TimePicker} from 'antd';
import moment from 'moment';

export default class SettingCommonWorkingTime extends Component{

    state = {
        time: {
            timeStart: ['09', '00'],
            timeEnd: ['18', '00']
        },
        showTime: false,
        workingMonday:true,
        workingTuesday:true,
        workingWednesday:true,
        workingThursday:true,
        workingFriday:true,
        workingSaturday:true,
        workingSunday:true
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
    render(){
        return(

            <div style={{backgroundColor:'white',minHeight:'100%',padding:'60px 10px 0px'}}>
                <div style={{display:'flex'}}>
                    <span style={{margin:'0px 0px 5px 145px',fontSize:12,color:'#424242'}}>От</span>
                    <span style={{margin:'0px 0px 5px 60px',fontSize:12,color:'#424242'}}>До</span>
                </div>
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingMonday')}
                            checked={this.state.workingMonday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Понедельник
                        </label>
                    </div>
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
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingTuesday')}
                            checked={this.state.workingTuesday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Вторник
                        </label>
                    </div>
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
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingWednesday')}
                            checked={this.state.workingWednesday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Среда
                        </label>
                    </div>
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
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingThursday')}
                            checked={this.state.workingThursday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Четверг
                        </label>
                    </div>
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
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingFriday')}
                            checked={this.state.workingFriday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Пятница
                        </label>
                    </div>
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
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingSaturday')}
                            checked={this.state.workingSaturday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Суббота
                        </label>
                    </div>
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
                <div style={{display:'flex',alignItems:'center',marginBottom:'25',marginLeft:'25'}}>
                    <div
                        style={{display: 'block',margin: 0,padding: 0,top: 0,left: 0,width: 100,marginRight: 20}}
                        className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                        <input
                            type="checkbox"
                            name="workingThisDay"
                            onChange={this.onCheckedWorkingThisDay('workingSunday')}
                            checked={this.state.workingSunday}
                        />
                        <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                            Воскресенье
                        </label>
                    </div>
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




            </div>


        )
    }
}