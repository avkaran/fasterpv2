import React, { useState, useEffect, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { heightList } from '../../../../models/core'
import axios from 'axios';
const EditProfile = (props) => {
    const { Option } = Select;
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const [collectionData, setCollectionData] = useState(null);
    useEffect(() => {
       // navigate()
    }, []);
    return (
        <>
            <div class="main-content right-chat-active" >
                <div style={{ paddingTop: '20px' }}>
                    <Card title="My Profile" >
                        <Spin spinning={loader} >
                           
                        </Spin>
                    </Card>


                </div>


            </div>

        </>
    );

}
export default EditProfile;
