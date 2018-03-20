import React,{Component} from 'react';
import {Route} from 'react-router';
import TreeView from '../../commons/TreeView';
import SettingClients from './SettingClients';
import SettingCommon from './SettingCommon'
const settingParams = [
    {
        children:[
            {
                id:10011,
                item:{
                    good_group_id:10011,
                    good_group_name:"Размещение и валюта",
                    is_root:false,
                    subgroup:[]
                },
                text: "Размещение и валюта",
                type: "file",
                url:'/setting/general/common/location',
                state:{
                    disabled:false
                }

            },
            {

                id:10012,
                item:{
                    good_group_id:10012,
                    good_group_name:"Время работы",
                    is_root:false,
                    subgroup:[]
                },
                text: "Время работы",
                type: "file",
                url:'/setting/general/common/working-time',
                state:{
                    disabled:false
                }
            },
            {
                id:10013,
                item:{
                    good_group_id:10013,
                    good_group_name:"Направление",
                    is_root:false,
                    subgroup:[]
                },
                text: "Направление",
                type: "file",
                url:'/setting/general/common/direction',
                state:{
                    disabled:false
                }

            },
            {
                id:10014,
                item:{
                    good_group_id:10014,
                    good_group_name:"Отправка СМС",
                    is_root:false,
                    subgroup:[]
                },
                text: "Отправка СМС",
                type: "file",
                url:'/setting/general/common/sms',
                state:{
                    disabled:false
                }

            },
            {
                id:10015,
                item:{
                    good_group_id:10015,
                    good_group_name:"Отправка E-mail",
                    is_root:false,
                    subgroup:[]
                },
                text: "Отправка E-mail",
                type: "file",
                url:'/setting/general/common/email',
                state:{
                    disabled:false
                }

            },
            {
                id:10016,
                item:{
                    good_group_id:10016,
                    good_group_name:"Безопасность",
                    is_root:false,
                    subgroup:[]
                },
                text: "Безопасность",
                url:'/setting/general/common/security',
                type: "file",
                state:{
                    disabled:false
                }

            },
            {
                id:10017,
                item:{
                    good_group_id:10017,
                    good_group_name:"Резервное копирование",
                    is_root:false,
                    subgroup:[]
                },
                text: "Резервное копирование",
                type: "file",
                url:'/setting/general/common/backup',
                state:{
                    disabled:false
                }

            },
        ],
        id:1001,
        item:{
            good_group_id:1001,
            good_group_name:"Общие",
            is_root:true,
            subgroup:[
                {
                    good_group_id:10011,
                    good_group_name:"Размещение и валюта",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10012,
                    good_group_name:"Время работы",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10013,
                    good_group_name:"Направление",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10014,
                    good_group_name:"Отправка СМС",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10015,
                    good_group_name:"Отправка E-mail",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10016,
                    good_group_name:"Безопасность",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10017,
                    good_group_name:"Резервное копирование",
                    is_root:false,
                    subgroup:[]
                },
            ]
        },
        state:{
            disabled:false,
            opened:true,
        },
        text:'Общие',
        url:'/setting/general/common/',
    },
    {
        children:[
            {
                id:10021,
                item:{
                    good_group_id:10021,
                    good_group_name:"Поздравление с др",
                    is_root:false,
                    subgroup:[]
                },
                text: "Поздравление с др",
                type: "file",
                url:'/setting/general/clients/happy-birthday',
                state:{
                    disabled:false
                }

            },
            {

                id:10022,
                item:{
                    good_group_id:10022,
                    good_group_name:"Напоминание о записи",
                    is_root:false,
                    subgroup:[]
                },
                text: "Напоминание о записи",
                type: "file",
                url:'/setting/general/clients/reminder',
                state:{
                    disabled:false
                }
            },
            {
                id:10023,
                item:{
                    good_group_id:10023,
                    good_group_name:'Акция "Приведи друга"',
                    is_root:false,
                    subgroup:[]
                },
                text: 'Акция "Приведи друга"',
                type: "file",
                url:'/setting/general/clients/action',
                state:{
                    disabled:false
                }

            },
            {
                id:10024,
                item:{
                    good_group_id:10024,
                    good_group_name:"Запись клиентов через сайт",
                    is_root:false,
                    subgroup:[]
                },
                text: "Запись клиентов через сайт",
                type: "file",
                url:'/setting/general/clients/record',
                state:{
                    disabled:false
                }

            },
        ],
        id:1002,
        item:{
            good_group_id:1002,
            good_group_name:"Общие",
            is_root:true,
            subgroup:[
                {
                    good_group_id:10021,
                    good_group_name:"Поздравление с др",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10022,
                    good_group_name:"Напоминание о записи",
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id:10023,
                    good_group_name:'Акция "Приведи друга"',
                    is_root:false,
                    subgroup:[]
                },
                {
                    good_group_id: 10024,
                    good_group_name: "Запись клиентов через сайт",
                    is_root: false,
                    subgroup: []
                }
            ]
        },
        url:'/setting/general/clients/',
        state:{
            disabled:false,
            opened:true,
        },
        text:'Клиенты'
    },
    {
        children:[
            {
                id:10031,
                item:{
                    good_group_id:10031,
                    good_group_name:"Основная анкета",
                    is_root:false,
                    subgroup:[]
                },
                text: "Основная анкета",
                type: "file",
                url:'/setting/general/polls/questionnaire',
                state:{
                    disabled:false
                }

            }
        ],
        id:1003,

        item:{
            good_group_id:1003,
            good_group_name:"Опросы",
            is_root:true,
            subgroup:[
                {
                    good_group_id:10031,
                    good_group_name:"Основная анкета",
                    is_root:false,
                    subgroup:[]
                },
            ]
        },
        state:{
            disabled:false,
            opened:true,
        },
        url:'/setting/general/polls',
        text:'Опросы'
    }
]
export default class SettingGeneral extends Component{

    handleClickSettingList = (option) =>{
        this.props.onChangeSettingUrl(option.url)
    }
    render(){
        return(
            <section className="content-with-menu">
                <div className="content-with-menu-container" style={{display:'flex'}}>
                    <menu id="content-menu" className="inner-menu" role="menu">
                        <div className="nano">
                            <div className="nano-content">
                                <div className="inner-menu-content">
                                    <div className="sidebar-widget m-none">
                                        <div className="widget-header">
                                            <h6 className="title">
                                                Общие настройки
                                            </h6>
                                        </div>
                                        <div className="widget-content">
                                            <TreeView
                                                items={settingParams}
                                                onItemSelect={this.handleClickSettingList}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </menu>
                    <div className="inner-body mg-main">
                        {this.props.children}
                    </div>
                </div>
            </section>
        )
    }
}