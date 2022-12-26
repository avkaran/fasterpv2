import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import PsContext from '../../../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { magenta,cyan, yellow } from '@ant-design/colors';
import { faEnvelope,faExclamation,faExclamationTriangle,faLocationPin, faMobileAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MyButton } from '../../../../../../comp';
const ContactNotice = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const {viewData,onContactViewClick,loading,...other } = props;
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
          {
            viewData && (<><Row gutter={16} align="center">
                <span style={{  fontWeight: 'bold',fontSize:'40px' }}> <FontAwesomeIcon icon={faExclamationTriangle} style={{color: yellow[6]}}/></span>
                <br/>
                <span style={{ color: yellow[6], fontWeight: 'bold' }}> Amount will be deducted from Main Balance when viewing contact. Are you sure?</span>
                <br/>
                <br/>
               <MyButton type="primary" loading={loading} onClick={()=>onContactViewClick(viewData)}>View Contact</MyButton>
            </Row>

            </>)
          }

        </>
    );

}
export default ContactNotice;