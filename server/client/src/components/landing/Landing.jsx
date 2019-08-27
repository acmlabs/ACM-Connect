import React from "react";
import "antd/dist/antd.css";
import { Breadcrumb, Layout, Card } from "antd";
import NavMenu from "../../common/menu/NavMenu";

import ACMApplyFooter from "../../common/apply_footer/ACMApplyFooter";

export default function Landing(props) {
  return (
    <React.Fragment>
      <Layout className="layout" style={{ height: "100vh" }}>
        <div className="logo" />
        <NavMenu {...props} current="home" />
        <Layout.Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <Card title="Welcome!">
            <p>
              Hey! You'll notice a lot of the website in progress. ACM Connect
              is a new venture for us and this website's still in the works.
            </p>
            <p>
              If you have any problems with signing up (tokens aren't working,
              etc.), signing in, or problems in general, please contact us at &nbsp;
              <a href="mailto:aneeshsaripalli@gmail.com">
                aneeshsaripalli@gmail.com
              </a>
            </p>
          </Card>
        </Layout.Content>
        {ACMApplyFooter()}
      </Layout>
    </React.Fragment>
  );
}
