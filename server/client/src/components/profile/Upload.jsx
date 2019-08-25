import React from "react";
import {Breadcrumb, Button, Icon, Layout, message, Result, Upload} from 'antd';
import NavMenu from "../../common/menu/NavMenu";
import 'antd/dist/antd.css';
import ACMFooter from "../../common/footer/ACMFooter";

const {Dragger} = Upload;
const {Footer, Content} = Layout;


class UploadResume extends React.Component {
    state = {
        loading: false,
        uploaded: false,
        url: null,
    };

    width = "50%";
    height = "100%";


    handleFileUploadOnChange = (info) => {
        const {status} = info.file;
        this.setState({loading: true});

        console.log(status)

        if (status !== 'uploading') {
            const {response} = info.file;
            this.setState({url: response.url})
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);

            this.setState({
                loading: false, uploaded: true
            });
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    resetToUploadAgain = () => {
        message.warn(`Overriding your old resume.`);
        this.setState({loading: false, uploaded: false});
    };

    renderDropZone = (dropZoneProps) => {
        return (<Dragger {...dropZoneProps}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                </p>
                <p className="ant-upload-text">Click or drag your resume to this area to upload</p>
                <p className="ant-upload-hint">
                    Make sure you're uploading your newest resume!
                </p>
            </Dragger>
        );
    };

    handleBackNav = () => {
        this.props.history.push("/profile");
    };

    renderUploadedResume(url) {
        const pdfViewerUrl = `http://docs.google.com/gview?url=${url}&embedded=true`;

        return (<React.Fragment>
            <Button type="primary" onClick={this.handleBackNav}>
                <Icon type="arrow-left"/>
                Go Back
            </Button>
            <Result
                status="success"
                title="Successfully Uploaded Your Resume!"
                subTitle="Your resume is now visible to recruiters!."
                extra={[
                    <Button type="primary" key="view">
                        <a href={pdfViewerUrl} target="_blank" rel="noopener noreferrer">
                            View Upload
                        </a>
                    </Button>,
                    <Button key="upload" onClick={this.resetToUploadAgain}>
                        Upload Something Else</Button>,
                ]}
            />
        </React.Fragment>)
    }

    render() {
        let content;

        if (this.state.uploaded === false) {
            const props = {
                name: 'file',
                multiple: false,
                action: '/api/upload',
                onChange: this.handleFileUploadOnChange
            };

            content = this.renderDropZone(props);
        } else {
            content = this.renderUploadedResume(this.state.url);
        }
        return (<Layout className="layout" style={{height: '100vh'}}>
            <div className="logo"/>
            <NavMenu {...this.props}/>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Profile</Breadcrumb.Item>
                    <Breadcrumb.Item>Resume</Breadcrumb.Item>
                    <Breadcrumb.Item>Upload</Breadcrumb.Item>
                </Breadcrumb>
                {content}
            </Content>
            {ACMFooter()}
        </Layout>);
    }
}

export default UploadResume;
