import React, { useState, useEffect, useContext } from 'react';
import { Navigate, withRouter, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import ViewMember from '../../../admin/business/matrimony/members/viewMember'
const MyProfile = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="container">
                <div className="row">
                    <Card title="My Profile">


                        <ViewMember isForCustomer={true} viewIdOrObject={context.customerUser.id} onListClick={() => { }} userId={0} />
                    </Card>
                </div>
            </div>
        </>
    );

}
export default MyProfile;