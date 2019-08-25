import React from 'react'
import {Breadcrumb, Card, Col, Layout, Row} from "antd";
import NavMenu from "../../common/menu/NavMenu";

import ACMApplyFooter from "../../common/apply_footer/ACMApplyFooter";

const {Content} = Layout;


class FAQ extends React.Component {
    renderMenu() {
        return (<NavMenu {...this.props} />);
    }

    renderFAQ() {
        return (
            <Row justify="center">
                <Col span={24}>
                    <Card title="Frequently Answer Questions">
                        <p style={{
                            fontSize: 14,
                            color: 'rgba(0, 0, 0, 0.85)',
                            marginBottom: 16,
                            fontWeight: 500,
                        }}>
                            Site Usage
                        </p>

                        <Card style={{marginTop: 16}} type="inner" title="What do we do!" extra={<a href="#">More</a>}>
                            We've finally come up with a way to help interface ACM members with industry recruiters.
                        </Card>
                        <Card type="inner" title="What is a sign up token?" extra={<a href="#">More</a>}>
                            Sign up tokens are proof that you're an ACM member.
                        </Card>
                    </Card>
                </Col>
            </Row>);
    }

    render() {
        return (
            <div>
                {this.renderMenu()}
                <Layout className="layout" style={{height: '100vh'}}>
                    <div className="logo"/>
                    <Content style={{padding: '0 50px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>FAQ</Breadcrumb.Item>
                        </Breadcrumb>
                        {this.renderFAQ()}
                    </Content>
                    {ACMApplyFooter()}
                </Layout>
            </div>
        );
    }
}

export default FAQ;