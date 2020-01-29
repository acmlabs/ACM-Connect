import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import checkToken from "../checkToken";

import NavMenuLoggedIn from "./NavMenuLoggedIn";
import NavMenuLoggedOut from "./NavMenuLoggedOut";

const { SubMenu } = Menu;


class NavMenu extends React.Component {
    state = {
        loggedIn: false,
    };


    handleClick = e => {
        console.log('click ', e);
        this.props.history.push(`/${e.key}`)
    };

    async componentDidMount() {
        let loggedIn = await checkToken();

        console.log(`Setting logged in to ${loggedIn}`)

        this.setState({ loggedIn: loggedIn });
    }

    async componentWillUnmount() {
        this.setState({ loggedIn: false })
    }

    renderLoggedIn() {

        return <NavMenuLoggedIn {...this.props} type={localStorage.getItem('acmconnect_account_type')} handleClick={this.handleClick} current={this.props.current} />
    }

    renderNotLoggedIn() {
        return <NavMenuLoggedOut {...this.props} handleClick={this.handleClick} current={this.props.current} />
    }

    render() {
        const notLoggedIn = this.renderNotLoggedIn();
        const loggedIn = this.renderLoggedIn();
        return this.state.loggedIn ? loggedIn : notLoggedIn;
    }
}

export default NavMenu;