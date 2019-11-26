import React from 'react'
import { BounceLoader } from "react-spinners";
import { css } from '@emotion/core';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: cyan;
`;

class Logout extends React.Component {
    handleLogout = () => {
        localStorage.removeItem('acmconnect_jwt_token')
        this.props.history.push("/")
    };

    componentDidMount() {
        fetch('/api/logout')
            .then((response) => {
                setTimeout(this.handleLogout, 1500)
            });
    }

    render() {
        return (
            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }} className='sweet-loading'>
                <BounceLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#123abc'}
                    loading={true}
                />
            </div>
        )
    }
}

export default Logout
