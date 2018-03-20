// REACT
import React from "react";
import ReactDOM from "react-dom";
// REDUX
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {persistStore} from "redux-persist";
// ROUTER
import {browserHistory} from "react-router";
import {routerMiddleware} from "react-router-redux";
// REDUCERS
import appReducer from "./state/reducers";
// ROUTES
import Routes from "./routes";
// MIDDLEWARES
import createLogger from "redux-logger";
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

const middlewares = [routerMiddleware(browserHistory), thunk];

// REDUX DEV
if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
}

const composeEnhancers = composeWithDevTools({});

const store = createStore(
    appReducer,
    composeEnhancers(applyMiddleware(...middlewares))
);

const pStore = persistStore(store, {
    whitelist: ['routing', 'core', 'menu']
}, () => {
    if (process.env.CLEAR_STORE) {
        pStore.purgeAll();
    }
});

window.store = store;

// RENDER
ReactDOM.render(
    ( <Routes store={store}/> ),
    document.getElementById('root')
);