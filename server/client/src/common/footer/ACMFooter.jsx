import React from "react";
import {Layout} from 'antd'
import ACMFooterComponent from "./ACMFooterComponent";

export default function ACMFooter() {
    return (<Layout.Footer style={{padding: '10 50px', position: 'absolute', left: '0', bottom: '0', right: '0'}}>
            {ACMFooterComponent()}
        </Layout.Footer>
    )
};