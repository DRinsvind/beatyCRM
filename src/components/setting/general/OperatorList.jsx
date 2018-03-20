import React,{Component} from 'react'


export default class OperatorList extends Component{

    renderItems = () =>{
        if(!this.props.operators) return
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
        return operators;
    }

    render(){
        return(
            <div className="operator-list">
                {this.renderItems()}
            </div>
        )
    }
}