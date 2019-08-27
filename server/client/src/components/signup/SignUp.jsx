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
import ACMApplyFooter from "../../common/apply_footer/ACMApplyFooter";

const utdEmailSuffix = "utdallas.edu";

class SignUp extends React.Component {
  state = {
    email: "",
    password: "",
    passwordConfirmation: "",
    token: "",
    requestSent: false,
    error: null
  };

  passwordMatches = (password, passwordConfirmation) => {
    return password === passwordConfirmation;
  };

  validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  emailValid = email => {
    const isEmailFormat = this.validateEmail(email);
    const isUTDEmail = email.endsWith(utdEmailSuffix);

    return isEmailFormat && isUTDEmail;
  };

  setError = error => {
    this.setState({
      error: error
    });
  };

  onClick = () => {
    const { email, password, passwordConfirmation, token } = this.state;

    if (!this.passwordMatches(password, passwordConfirmation)) {
      message.error("The passwords need to match.");
      return;
    } else if (!this.emailValid(email)) {
      message.error("Email isn't a valid utdallas email.");
      return;
    }

    this.setState({ requestSent: true });

    axios
      .post("/api/signup", {
        email: email,
        password: password,
        token: token
      })
      .then(resp => {
        if (resp.status === 200) {
          message.success("Successfully registered.");
          this.props.history.push("/");
        } else {
          message.error("Registration failed.");
          this.setState({ requestSent: false });
        }
      })
      .catch(err => {
        message.error("Registration failed.");
        this.setState({ requestSent: false });
      });
  };

  handleEmail = e => {
    console.log(e.target.value);
    this.setState({
      email: e.target.value.toLowerCase()
    });
  };

  handlePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  handlePasswordConf = e => {
    this.setState({
      passwordConfirmation: e.target.value
    });
  };

  handleToken = e => {
    this.setState({
      token: e.target.value
    });
  };

  render() {
    const registerIconType = this.state.requestSent ? "loading" : "login";
    return (
      <div>
        <Layout className="layout" style={{ height: "100vh" }}>
          <div className="logo" />
          <NavMenu {...this.props} current="profile" />
          <Layout.Content style={{ padding: "0 50px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Account</Breadcrumb.Item>
              <Breadcrumb.Item>Sign Up</Breadcrumb.Item>
            </Breadcrumb>
            <Typography style={{ textAlign: "center" }}>
              <h3> Sign Up</h3>
            </Typography>
            <Row type="flex" justify="center">
              <Col span={5}>
                <Input.Group size="large" compact>
                  <Input placeholder="Email" onChange={this.handleEmail} />
                  <div style={{ padding: 5 }} />
                  <Input.Password
                    placeholder="Password"
                    onChange={this.handlePassword}
                  />
                  <div style={{ padding: 5 }} />
                  <Input.Password
                    placeholder="Password Confirmation"
                    onChange={this.handlePasswordConf}
                  />
                  <div style={{ padding: 5 }} />
                  <Input placeholder="Token" onChange={this.handleToken} />
                </Input.Group>
              </Col>
            </Row>
            <div style={{ padding: 5 }} />
            <Row type="flex" justify="center" align="middle">
              <Col span={5} style={{ textAlign: "center" }}>
                <Button type="primary" size="large" onClick={this.onClick}>
                  <Icon type={registerIconType} />
                  Register
                </Button>
              </Col>
            </Row>
          </Layout.Content>
          {ACMApplyFooter()}
        </Layout>
      </div>
    );
  }
}

export default SignUp;
