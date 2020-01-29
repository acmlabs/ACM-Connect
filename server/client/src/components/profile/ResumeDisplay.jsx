import React, { Component } from 'react'
import axios from 'axios'
import NavMenu from '../../common/menu/NavMenu'
import { Card, Button, Icon } from 'antd'

class ResumeDisplay extends Component {

    state = {
        resumes: []
    }

    setResumes = (resumes) => {
        console.log('set state')
        this.setState({
            resumes: resumes
        })
    }

    componentWillMount() {
        fetch('/api/recruiter/resumes').
            then(response => {
                // response.formData().then(console.log)
                return response.json()
            }
            ).then((json) => {
                console.log(json)
                this.setResumes(json.data)
            })
    }

    renderResumes() {
        return this.state.resumes.map(resume =>
            (<Card title='Resume #1' style={{
                width: '50%',
                height: '10%',
                margin: 'auto'
            }}>
                <Button style={{
                    backgroundColor: '#001529',
                    margin: 'auto',
                    float: 'right'
                }}>
                    <a href={resume} style={{ color: 'white' }}>
                        <Icon type="download" />
                    </a>
                </Button>

            </Card>)
        )
    }

    render() {
        return (<React.Fragment>
            <NavMenu {...this.props} />
            {this.renderResumes()}
        </React.Fragment>)
    }
}

export default ResumeDisplay;