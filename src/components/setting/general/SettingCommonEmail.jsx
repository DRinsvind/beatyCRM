import React,{Component} from 'react';
import jQuery from 'jquery';
import Modal from '../../commons/modals/Modal';
const $ = window && window.jQuery ? window.jQuery : jQuery;
import Mail from '../../../../public/assets/images/mails/mail.png'
import Gmail from '../../../../public/assets/images/mails/gmail.png'
const mails = [
    {
        id:0,
        text:"Mail.ru"
    },
    {
        id:1,
        text:"Gmail.com"
    },
    {
        id:3,
        text:"I.ua"
    },
    {
        id:4,
        text:"Mail.fex.net"
    }
]

export default class SettingCommonEmail extends Component{

    state = {
        select_mail:null,
        mails:mails,
        login:'',
        password:'',
        email:'',
        files:[

        ]

    }
    componentDidMount(){
        if(this.setState){
            this.setState({
                files:[]
            })
        }

        ($ => {

            $('#setting-general__common-countries')
                .select2({
                    theme: 'bootstrap',
                    placeholder: '',
                    width: '100%',
                    escapeMarkup: (markup) => markup,
                    tags: true,
                    templateSelection:(icon) =>{
                        console.log('--------------t1')
                        return `<div class="select2__option-with-img"><img class='select2__option-img' src=${$(icon.element).data('img')} /> ${icon.text}</div>`
                    },
                    templateResult: (icon) =>{
                        console.log('--------------t2')
                        return `<div class="select2__option-with-img"><img class='select2__option-img' src=${$(icon.element).data('img')} /> ${icon.text}</div>`
                    }
                })
                .off('change')
                .on('change', e => {
                    let val = parseFloat(e.target.value);
                    this.setState({

                        select_country:val
                    });
                });

        })(window.$);
    }
    componentDidUpdate() {
        ($ => {

        $('#setting-general__common-email')
            .select2({
                theme: 'bootstrap',
                placeholder: '',
                width: '100%',
                escapeMarkup: (markup) => markup,
                tags: true,
                templateSelection:(icon) =>{
                    console.log('--------------t1')
                    return `<div class="select2__option-with-img"><img class='select2__option-img' src=${$(icon.element).data('img')} /> ${icon.text}</div>`
                },
                templateResult: (icon) =>{
                   return `<div class="select2__option-with-img"><img class='select2__option-img' src=${$(icon.element).data('img')} /> ${icon.text}</div>`
                }
                })

            .off('change')
            .on('change', e => {
                let val = parseFloat(e.target.value);
                this.setState({
                    select_country:val
                });
            });
        })(window.$);

    }
    handleAddMessage = (e) =>{
        e.preventDefault;
    }
    inputChanged = (type) => (e) => {
        e.preventDefault();
        this.setState({
            [type]:e.target.value
        })

    }
    handleChange = (e) =>{
        this.setState({
            files:[...e]
        })
    }
    renderSelectFiles = () =>{
        const filesList = this.state.files.map(file=>(
            <li className="input-file__item" key={file.name}>{file.name}</li>
        ))
       return (
            <div>
                {filesList}
            </div>
       )
    }
    render(){
        return(

            <div style={{backgroundColor:'white',minHeight:'100%',padding:'60px 10px 0px'}}>
                <Modal
                    save={this.handleAddMessage}
                    customClass="modal-dialog"
                    name="modalAddMail"
                    id="ModalAddMail"
                    idForm="modalAddMail"
                    title="Отправка E-mail"
                    fa="fa-envelope"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div style={{padding:'15px 20px'}}>
                        <div className="form-group">
                            <label className="col-md-4 control-label fs-12" style={{paddingTop:5}}>
                                E-mail получателя
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
                        <div className="row" style={{marginTop:12}}>
                            <div className="col-md-4"></div>
                            <div className="col-md-8">
                                <div style={{display:'flex',justifyContent:'space-between',padding:'0px 15px 0px 5px',alignItems:'flex-start'}}>
                                    <ul className="input-file__list">
                                        <li className="input-file__heading-item">Прикрепить файл</li>
                                        {this.renderSelectFiles()}
                                    </ul>
                                    <button
                                            data-toggle="modal"
                                            className="btn btn-custom goods-add"
                                            style={{minWidth:60,display:'block',top:0}}
                                            onClick={e => {
                                                e.preventDefault();
                                                document.getElementById('file-input-email').click();
                                            }}
                                    >
                                        <i className="fa fa-paperclip"></i>
                                    </button>
                                    <input
                                        style={{display:'none'}}
                                        type="file" multiple onChange={ (e) => this.handleChange(e.target.files) } id="file-input-email"/>
                                </div>


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
                <h6 className="title" style={{paddingLeft:15, marginBottom:20}}>
                    <strong>Настройка почты</strong>
                </h6>
               <div className="row" style={{marginBottom:12}}>
                   <div className="col-md-2">

                   </div>
                   <div className="col-md-3">
                       <select id="setting-general__common-email" name="setting-general__common-email">
                           <option value={this.state.mails[0].id} data-img='https://cdn4.iconfinder.com/data/icons/address-book-providers-in-colors/512/mailru-symbol-256.png'>
                               {this.state.mails[0].text}
                           </option>
                           <option value={this.state.mails[1].id} data-img='https://image.flaticon.com/icons/svg/281/281769.svg'>
                               {this.state.mails[1].text}
                           </option>
                           <option value={this.state.mails[2].id} data-img='https://cdn4.iconfinder.com/data/icons/address-book-providers-in-colors/512/mailru-symbol-256.png'>
                               {this.state.mails[2].text}
                           </option>
                       </select>
                   </div>
               </div>
                <hr/>
                <h6 className="title" style={{paddingLeft:15, margin:'15px 0px 20px'}}>
                    <strong>Авторизация</strong>
                </h6>
                <div className="row" style={{marginBottom:10}}>
                    <div className="col-md-2">
                        <label className="control-label fs-12" style={{padding:'9px 0px 0px 15px'}}>
                            Логин
                        </label>
                    </div>
                    <div className="col-md-3">
                        <input type="text" className="form-control" value={this.state.login} onChange={this.inputChanged('login')}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <label className="control-label fs-12" style={{padding:'9px 0px 0px 15px'}}>
                            Пароль
                        </label>
                    </div>
                    <div className="col-md-3">
                        <input type="password" className="form-control" value={this.state.password} onChange={this.inputChanged('password')}/>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-3">
                        <label className="control-label fs-12" style={{padding:'9px 0px 0px 15px'}}>
                            Отправить текстовое сообщение
                        </label>
                    </div>
                    <div className="col-md-2">


                        <a href="#ModalAddMail"
                           data-toggle="modal"
                           className="change-warehouse-button-focus"
                           style={{marginLeft:'auto',display:'block',width:60}}
                           onClick={e => {
                               e.preventDefault();
                           }}
                        >
                            <i className="fa fa-envelope"></i>
                        </a>
                    </div>

                </div>
                <hr/>
                <h6 className="title" style={{paddingLeft:15, margin:'15px 0px 20px'}}>
                    <strong>Отправка отчетов по E-mail</strong>
                </h6>
                <div className="row" style={{marginBottom:10}}>
                    <div className="col-md-2">
                        <label className="control-label fs-12" style={{padding:'9px 0px 0px 15px'}}>
                            E-mail получателя
                        </label>
                    </div>
                    <div className="col-md-3">
                        <input type="email" className="form-control" value={this.state.email} onChange={this.inputChanged('email')}/>
                    </div>
                </div>
                <div className="row" style={{marginBottom:10}}>
                    <div className="col-md-2">
                        <label className="control-label fs-12" style={{padding:'9px 0px 0px 15px'}}>
                            Отчеты
                        </label>
                    </div>
                    <div className="col-md-3">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                            <ul className="input-file__list">
                                {this.renderSelectFiles()}
                            </ul>
                            <button
                                data-toggle="modal"
                                className="change-warehouse-button-focus"
                                style={{minWidth:60,display:'block',top:0}}
                                onClick={e => {
                                    e.preventDefault();
                                    document.getElementById('file-input-email').click();
                                }}
                            >
                                <i className="fa fa-upload"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}