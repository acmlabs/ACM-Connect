import {BounceLoader} from "react-spinners";
import React from "react";
import {css} from "@emotion/core";


export default function BouncyLoader() {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: cyan;
`;
    return (<div style={{
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
    </div>);
}