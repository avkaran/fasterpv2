import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link,useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { FormViewItem, ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { getPaymentInfo } from '../../../admin/business/matrimony/models/matrimonyCore';
const MyPaymentBack = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
     
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="container">
                <Card title="My Current Plan">
{
    context.psGlobal.decrypt(decodeURIComponent(searchParams.get("res")))
}
                </Card>
            </div>
        </>
    );

}
export default MyPaymentBack;