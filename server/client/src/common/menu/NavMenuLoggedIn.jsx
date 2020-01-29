import { Icon, Menu } from "antd";
import React from "react";

export default function NavMenuLoggedIn(props) {
    const { handleClick, current } = props;

    const profile = props.type === 'student' ? (<Menu.Item key="profile" style={{ float: 'left' }}>
        <Icon type="profile" />
        Profile
            </Menu.Item>) : (<Menu.Item key="profiles" style={{ float: 'left' }}>
            <Icon type="profile" />
            Student Resumes
            </Menu.Item>)

    return (<Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" theme="dark">
        <Menu.Item key="home" style={{ float: 'left' }}>
            <Icon type="home" />
            Home
            </Menu.Item>
        {profile}
        <Menu.Item key="logout" style={{ float: 'right' }}>
            <Icon type="logout" />
            Logout
            </Menu.Item>
        <Menu.Item key="faq" style={{ float: 'right' }}>
            <Icon type="question" />
            FAQ
            </Menu.Item>
    </Menu>
    )
}