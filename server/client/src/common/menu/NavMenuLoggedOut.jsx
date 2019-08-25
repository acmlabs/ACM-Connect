import {Icon, Menu} from "antd";
import React from "react";

export default function NavMenuLoggedOut(props) {
    const {handleClick, current} = props;

    return (<Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" theme="dark">
        <Menu.Item key="home" style={{float: 'left'}}>
            <Icon type="home"/>
            Home
        </Menu.Item>
        <Menu.Item key="faq" style={{float: 'left'}}>
            <Icon type="question"/>
            FAQ
        </Menu.Item>
        <Menu.Item key="login" style={{float: 'right'}}>
            <a href="/signIn" rel="noopener noreferrer">
                <Icon type="login"/>
                Log In
            </a>
        </Menu.Item>
    </Menu>);

}