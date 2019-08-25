import React from "react";
import {Breadcrumb, Button, Col, Icon, Layout, message, Popconfirm, Row} from 'antd';
import NavMenu from "../../common/menu/NavMenu";
import 'antd/dist/antd.css';

import ACMApplyFooter from "../../common/apply_footer/ACMApplyFooter";


class Profile extends React.Component {
    state = {
        loading: false,
        uploaded: false,
        url: undefined,
        deleting: false,
        urlIsValid: false
    };

    componentDidMount() {
        this.init();
    }

    init = () => {
        fetch('/api/getresumeurl')
            .then(response => response.json())
            .then(response => {
                const {url} = response;

                const validUrl = this.isValidResumeURL(url);

                if (validUrl) {
                    message.success("Found a uploaded resume.");
                }

                this.setState({url: url, urlIsValid: validUrl});
            });
    }

    routeUpload = () => {
        this.props.history.push('/profile/upload');
    };

    isValidResumeURL = (url) => {
        return url !== undefined && url !== '/';
    };

    handleResponse = (response) => {
        if (response.status === 200) {
            message.success("Successfully deleted resume.");
            this.init();
        } else if (response.status === 401) {
            message.error("You need to have uploaded a resume to delete it.");
        } else {
            message.error("Internal error, please try again later.");
        }
        this.setState({deleting: false});
    };

    deleteResume = () => {
        this.setState({deleting: true});
        fetch('/deleteresume')
            .then(response => {
                this.handleResponse(response)
            }).catch(err => {
            const {response} = err.response;
            this.handleResponse(response);
        });

    };


    render() {
        let downloadButton;
        let deleteButton;

        const {url, urlIsValid, deleting} = this.state;

        if (urlIsValid) {
            downloadButton = <a href={url}>
                <Button type="primary" shape="round">
                    Download
                    <Icon type="download"/>
                </Button>
            </a>;

            deleteButton = <Popconfirm
                title="Are you sure?"
                icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                onConfirm={this.deleteResume}>
                <Button type="danger" shape="round">
                    Delete
                    <Icon type="delete"/>
                </Button>
            </Popconfirm>;
        } else {
            if (url !== undefined) {
                downloadButton = <Button type="primary" disabled shape="round">
                    Download
                    <Icon type="download"/>
                </Button>;

                deleteButton = <Button type="danger" disabled shape="round">
                    Delete
                    <Icon type="delete"/>
                </Button>;
            } else {
                downloadButton =
                    <Button type="primary" disabled shape="round">
                        Download
                        <Icon type="loading"/>
                    </Button>;

                deleteButton =
                    <Button type="primary" disabled shape="round">
                        Delete
                        <Icon type="loading"/>
                    </Button>;
            }
        }

        if (deleting) {
            deleteButton = (<Button type="danger" shape="round">
                Delete
                <Icon type="loading"/>
            </Button>);
        }

        return (<Layout className="layout" style={{height: '100vh'}}>
                <div className="logo"/>
                <NavMenu {...this.props} current="profile"/>
                <Layout.Content style={{padding: '0 50px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Profile</Breadcrumb.Item>
                        <Breadcrumb.Item>Console</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row justify="center" type="flex">
                        <Col span={6}>
                            {downloadButton}

                        </Col>
                        <Col span={6}>
                            <Button type="primary" shape="round" onClick={this.routeUpload}>
                                Upload New
                                <Icon type="upload"/>
                            </Button>
                        </Col>
                        <Col span={6}>
                            {deleteButton}
                        </Col>
                    </Row>
                </Layout.Content>
                {ACMApplyFooter()}
            </Layout>
        );
    }
}

export default Profile;
