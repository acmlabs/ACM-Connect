import axios from "axios";
import React from "react";

import {
  Breadcrumb,
  Button,
  Col,
  Icon,
  Input,
  Layout,
  message,
  Row,
  Typography
} from "antd";

import NavMenu from "../../common/menu/NavMenu";
import BouncyLoader from "../../common/loader/loader";
import ACMFooter from "../../common/footer/ACMFooter";

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    requestIssued: false,
    error: null
  };

  handleSignInResponse = res => {
    if (res.status === 200) {
      const { email } = res.data;
      message.success(`Successfully signed in as ${email}`);
      this.props.history.push("/");
    } else if (res.status === 401) {
      message.error("Incorrect username and/or password.");
    } else {
      message.error("Unable to sign in right now. Try again later.");
    }
  };

  onClick = e => {
    const { email, password } = this.state;
    axios
      .post("/api/signin", {
        email: email,
        password: password
      })
      .then(response => {
        this.setState({ requestIssued: true });
        this.handleSignInResponse(response);
      })
      .catch(err => {
        this.handleSignInResponse(err.response);
      });
  };

  handleEmail = e => {
    this.setState({
      email: e.target.value.toLowerCase()
    });
  };

  handlePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  render() {
    const { requestIssued } = this.state;

    if (requestIssued) {
      return <BouncyLoader />;
    } else {
      return (
        <div>
          <Layout className="layout" style={{ height: "100vh" }}>
            <NavMenu {...this.props} />
            <Layout.Content style={{ padding: "0 50px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Account</Breadcrumb.Item>
                <Breadcrumb.Item>Sign In</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ textAlign: "center" }}>
                <Typography>
                  <h3>Login</h3>
                </Typography>
              </div>
              <Row type="flex" justify="center">
                <Col span={5}>
                  <Input.Group compact size="large">
                    <Input placeholder="Email" onChange={this.handleEmail} />
                    <div style={{ padding: 5 }} />
                    <Input.Password
                      placeholder="Password"
                      onChange={this.handlePassword}
                    />
                  </Input.Group>
                </Col>
              </Row>
              <div style={{ padding: 5 }} />
              <Row type="flex" justify="center" align="middle">
                <Col span={5} style={{ textAlign: "center" }}>
                  <Button type="primary" size="large" onClick={this.onClick}>
                    <Icon type="Login" />
                    Sign In
                  </Button>
                  <div style={{ textAlign: "left" }}>
                    Or <a href="/signup">register now!</a>
                  </div>
                </Col>
              </Row>
            </Layout.Content>
            {ACMFooter()}
          </Layout>
        </div>
      );
    }
  }
}

export default SignIn;
