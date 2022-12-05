import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import PsContext from '../../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { magenta,cyan } from '@ant-design/colors';
import { faEnvelope,faLocationPin, faMobileAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
const ProfileContactInfo = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const {viewData,...other } = props;
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
          {
            viewData && (<><Row gutter={16}>
                <Col className='gutter-row' xs={24} xl={2}>
                    <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faPhoneVolume} /></span>
                </Col>
                <Col className='gutter-row' xs={24} xl={22}>
                    <a href={"tel:" + context.psGlobal.decrypt(viewData.mobile_no)}>{context.psGlobal.decrypt(viewData.mobile_no)}</a>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col className='gutter-row' xs={24} xl={2}>
                    <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faWhatsapp} /></span>
                </Col>
                <Col className='gutter-row' xs={24} xl={22}>
                    <a href={viewData.whatsapp_no ? "tel:" + context.psGlobal.decrypt(viewData.whatsapp_no) : ''}>{viewData.whatsapp_no ? context.psGlobal.decrypt(viewData.whatsapp_no) : ''}</a>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className='gutter-row' xs={24} xl={2}>
                    <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faEnvelope} /></span>
                </Col>
                <Col className='gutter-row' xs={24} xl={22}>
                    <span style={{ color: cyan[6], fontWeight: 'bold' }}>
                        {viewData.email}
                    </span>
                </Col>
            </Row>
            <Row gutter={16} style={{ fontSize: '15px' }}>
                <Col className='gutter-row' xs={24} xl={2}>
                    <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faMobileAlt} /></span>
                </Col>
                <Col className='gutter-row' xs={24} xl={22}>
                    <a href={viewData.mobile_alt_no_1 ? "tel:" + context.psGlobal.decrypt(viewData.mobile_alt_no_1) : ''}>{viewData.mobile_alt_no_1 ? context.psGlobal.decrypt(viewData.mobile_alt_no_1) : 'N/A'}</a><br />
                    <a href={viewData.mobile_alt_no_2 ? "tel:" + context.psGlobal.decrypt(viewData.mobile_alt_no_2) : ''}>{viewData.mobile_alt_no_2 ? context.psGlobal.decrypt(viewData.mobile_alt_no_2) : 'N/A'}</a>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className='gutter-row' xs={24} xl={2}>
                    <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faLocationPin} /></span>
                </Col>
                <Col className='gutter-row' xs={24} xl={22}>
                    <span style={{ color: cyan[6], fontWeight: 'bold' }}>
                        {viewData.door_no}, {viewData.street}, {viewData.area}, {viewData.taluk}, {viewData.landmark}, {viewData.district}, {viewData.state}, Pin : {viewData.pincode}
                    </span>
                </Col>
            </Row></>)
          }

        </>
    );

}
export default ProfileContactInfo;