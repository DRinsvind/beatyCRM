import {push} from 'react-router-redux'

export function changeSettingUrl(url){
    return (dispatch,getState) => {
        dispatch(push(url))
    }
}