import React from 'react';
import 'antd/dist/antd.css';
import {Breadcrumb, Layout} from 'antd';
import NavMenu from "../../common/menu/NavMenu";

import ACMApplyFooter from "../../common/apply_footer/ACMApplyFooter"

export default function Landing(props) {
    return (
        <React.Fragment>
            <Layout className="layout" style={{height: '100vh'}}>
                <div className="logo"/>
                <NavMenu {...props} current="home"/>
                <Layout.Content style={{padding: '0 50px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                </Layout.Content>
                {ACMApplyFooter()}
            </Layout>
        </React.Fragment>
    );
};