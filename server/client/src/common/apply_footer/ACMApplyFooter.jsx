import {Button, Card, Col, Layout, Row} from "antd";
import React from "react";

import ACMFooterComponent from "../footer/ACMFooterComponent";

export default function ACMApplyFooter() {
    return (<Layout.Footer style={{padding: '10 50px', position: 'absolute', left: '0', bottom: '0', right: '0'}}>
        <Row gutter={16}>
            <Col span={8}>
                <Card title="ACM Projects Application" bordered={true}>
                    <p>Apply to ACM Projects here.</p>
                    <Button type="primary">
                        <a href="https://www.acmutd.co/applications/projects" target="_blank">
                            Apply here!
                        </a>
                    </Button>
                </Card>
            </Col>
            <Col span={8}>
                <Card title="ACM Mentor Application" bordered={true}>
                    <p>Apply to our ACM Mentorship application here! </p>
                    <Button type="primary">
                        <a href="https://www.acmutd.co/applications/mentor" target="_blank">
                            Apply here!
                        </a>
                    </Button>
                </Card>
            </Col>
            <Col span={8}>
                <Card title="ACM Ignite Application" bordered={true}>
                    <p>Apply to ACM Ignite application!</p>
                    <Button type="primary">
                        <a href="https://www.acmutd.co/applications/ignite" target="_blank">
                            Apply here!
                        </a>
                    </Button>
                </Card>
            </Col>
        </Row>
        {ACMFooterComponent()}
    </Layout.Footer>);
}