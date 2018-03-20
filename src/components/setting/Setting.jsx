import React,{Component} from 'react';
import Setting1 from '../svg/Setting1';
import Setting2 from '../svg/Setting2';
import Setting3 from '../svg/Setting3';
import {Link} from "react-router";
class Setting extends Component{

    render(){
        return(
            <div className="row" style={{margin:'-90px -45px 0px'}}>
                <div className="col-md-12">
                    <div className="setting">
                        <div className="setting-list">
                            <Link to={'/setting/general/'}>
                                <div className="setting-block">
                                    <div className="setting-block__logo">
                                        {<Setting1/>}
                                    </div>
                                    <h5 className="setting-block__heading">Общие Настройки</h5>
                                </div>
                            </Link>
                            <Link to={'/setting/general/'}>
                            <div className="setting-block">
                                <div className="setting-block__logo">
                                    {<Setting2/>}
                                </div>
                                <h5 className="setting-block__heading">Дополнительное Оборудование</h5>
                            </div>
                            </Link>
                            <Link to={'/setting/general/'}>
                            <div className="setting-block">
                                <div className="setting-block__logo">
                                    {<Setting3/>}
                                </div>
                                <h5 className="setting-block__heading">Внесение данных в программу</h5>
                            </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>



        )
    }
}


export default Setting;