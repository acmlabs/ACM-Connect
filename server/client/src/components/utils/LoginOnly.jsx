import React, { Component } from 'react';

import '../../common/checkToken'

export default function loginOnly(ComponentToProtect) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            if (localStorage.getItem('acmconnect_jwt_token')) {
                this.setState({ loading: false });
            } else {
                this.setState({ loading: false, redirect: true });
            }

            // fetch('/api/checkToken')
            //     .then(res => {
            //         if (res.status === 200) {
            //             this.setState({ loading: false });
            //         } else {
            //             const error = new Error(res.error);
            //             throw error;
            //         }
            //     })
            //     .catch(err => {
            //         console.error(err);
            //         this.setState({ loading: false, redirect: true });
            //     });
        }

        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return (<div>hi</div>);
            }
            if (redirect) {
                this.props.history.push('/signin');
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}