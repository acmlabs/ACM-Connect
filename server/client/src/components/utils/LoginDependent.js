import React, {Component} from 'react';

import '../../common/checkToken'
import checkToken from "../../common/checkToken";

const loginDependent = function (LoggedIn, NotLoggedIn) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loggedIn: true,
            };
        }

        async componentDidMount() {
            const loggedIn = await checkToken();

            console.log(loggedIn);

            this.setState({loggedIn: loggedIn});
        }

        render() {
            const {loggedIn} = this.state;

            return loggedIn ? LoggedIn : NotLoggedIn
        }
    }
};
export default loginDependent