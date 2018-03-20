import React from "react";
import {shallow} from "enzyme";
import uuid from "uuid";
import App from "./App";

describe('<App />', () => {
    it('App render application', () => {
        let wrapper = shallow(
            <App
                token={{value: uuid(), valid: true}}
                onAuthorizationRequired={() => {
                }}
            />
        );
    });
});