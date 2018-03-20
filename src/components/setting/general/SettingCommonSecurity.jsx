import React,{Component} from 'react';
import jQuery from 'jquery';
const $ = window && window.jQuery ? window.jQuery : jQuery;
const setting = [
    {
        id:0,
        text:"На протяжении текущего месяца"
    },
    {
        id:1,
        text:"Указаный открытый период"
    }
]

export default class SettingCommonSecurity extends Component{

    state = {
        select_setting:null,
        cancelScreen:true,
        setting:setting,
    }
    componentDidMount(){
        ($ => {
            $('#setting-general__common-security')
                .select2({
                    theme: 'bootstrap',
                    placeholder: '',
                    width: '100%',
                    data: this.state.setting,
                    tags: true
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    console.log(e.target.selectedOptions[0].label)
                    this.setState({
                        select_setting:val
                    });
                });

        })(window.$);
    }
    componentDidUpdate() {
        $('#setting-general__common-security')
            .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                data: this.state.setting,
                tags: true
            })
            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                console.log(e.target.selectedOptions[0].label)
                this.setState({
                    select_setting:val
                });
            });

    }


    onCheckedWorkingThisDay = (type) => (e) => {
        this.setState({
            [type]:!this.state[type]
        })
    }
    render(){
        return(

            <div style={{backgroundColor:'white',minHeight:'100%',padding:'60px 10px 0px'}}>

                <div className="form-group" style={{display:'flex', alignItems: 'center'}}>
                    <label className="col-md-2 control-label fs-12">
                        Ограниченый режим корекции
                    </label>
                    <div className="col-md-5">

                        <select id="setting-general__common-security" name="setting-general__common-security"/>

                    </div>
                </div>
                <hr style={{margin:'20px 0px'}}/>
                <div
                    style={{display: 'block',margin: 0,padding: 0,top: 0,left:15,marginRight: 20}}
                    className="working-this-day checkbox-custom-employee checkbox-primary-employee">
                    <input
                        type="checkbox"
                        name="workingThisDay"
                        onChange={this.onCheckedWorkingThisDay('cancelScreen')}
                        checked={this.state.cancelScreen}
                    />
                    <label className="employee-schedule-work-this-day-label" style={{marginLeft:25}}>
                        Запретить снимки экрана
                    </label>
                </div>
            </div>


        )
    }
}