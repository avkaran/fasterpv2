import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import PsContext from '../../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { magenta, cyan, yellow, red } from '@ant-design/colors';
import { faClose, faEnvelope, faExclamation, faExclamationTriangle, faLocationPin, faMobileAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MyButton } from '../../../../../comp';
const ContactBuyNotice = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Row gutter={16} align="center">
                <span style={{ fontWeight: 'bold', fontSize: '40px' }}> <FontAwesomeIcon icon={faClose} style={{ color: red[6] }} /></span>
                <br />
                <span style={{ color: red[6], fontWeight: 'bold' }}> You have no active Credits to view Contact Info?</span>
                <br />
                <br />
                <MyButton type="primary" href="//0/customer/membership">Buy Now</MyButton>
            </Row>
        </>
    );

}
export default ContactBuyNotice;