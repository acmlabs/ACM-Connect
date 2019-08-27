import {Icon, Menu} from "antd";
import React from "react";

export default function NavMenuLoggedIn(props) {
    const {handleClick, current} = props;

    return (<Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" theme="dark">
        <Menu.Item key="home" style={{float: 'left'}}>
            <Icon type="home"/>
            Home
        </Menu.Item>
        <Menu.Item key="profile" style={{float: 'left'}}>
            <Icon type="profile"/>
            Profile
        </Menu.Item>
        <Menu.Item key="logout" style={{float: 'right'}}>
            <a href="/logout" rel="noopener noreferrer">
                <Icon type="logout"/>
                Logout
            </a>
        </Menu.Item>
        <Menu.Item key="faq" style={{float: 'right'}}>
            <Icon type="question"/>
            FAQ
        </Menu.Item>
    </Menu>)
}