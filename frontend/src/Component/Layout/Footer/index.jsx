import { Col, Row } from 'antd'
import React from 'react'
import './footer.scss'
import { Logo } from '../../../assets'

const Footer = () => {
    return (
        <div className='footer-main'>
            <div className='footer'>
                <Row style={{ marginTop: "50px" }}>
                    <Col className='logo-area' span={8}>
                        <img src={Logo} />
                        <p></p>
                    </Col>

                    <Col span={24}>
                        <p style={{ textAlign: "center" }}>
                            © 2023 All Rights Reserved
                        </p>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Footer