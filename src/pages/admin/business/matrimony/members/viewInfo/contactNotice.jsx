import React, { useEffect, useContext,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import PsContext from '../../../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { magenta,cyan, yellow } from '@ant-design/colors';
import { faEnvelope,faExclamation,faExclamationTriangle,faLocationPin, faMobileAlt, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MyButton } from '../../../../../../comp';
import { getResellerBalance } from '../../models/matrimonyCore';
const ContactNotice = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [insufficientBalance, setInsufficientBalance] = useState(true)
    const {viewData,onContactViewClick,loading,userId,...other } = props;
    useEffect(() => {

      getResellerBalance(context.adminUser(userId).role, context.adminUser(userId).ref_id).then(res => {
        if (parseFloat(res) < 50){
         
          setInsufficientBalance(true);
        }
        else setInsufficientBalance(false)
           
    })
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
                <br/>{
                  !insufficientBalance && (<MyButton type="primary" loading={loading} onClick={()=>onContactViewClick(viewData)}>View Contact</MyButton>)
                }
                {
                  insufficientBalance && (<>Insufficient Balance</>)
                }
               
            </Row>

            </>)
          }

        </>
    );

}
export default ContactNotice;