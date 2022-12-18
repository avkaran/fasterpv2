import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Radio } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { listCollections } from '../../../../../models/core'
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs'
import { Steps } from 'antd';
import PsContext from '../../../../../context';
import { lettersOnly, integerIndMobile, dayjsDate, pincode } from '../../../../../utils';
import $, { event } from 'jquery';
import toast from 'react-hot-toast';
import { Tabs, Tab, Table } from 'react-bootstrap';
import EditMember from './editMember';
import EditPageTwo from './editPageTwo';
import EditPageThree from './editPageThree';
import EditPageFour from './editPageFour';
import EditPageFive from './editPageFive';
import EditPageSix from './editPageSix';


const EditPage = (props) => {
    const context = useContext(PsContext);
    const { Step } = Steps;
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;
    const [loader, setLoader] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [showLoader, setShowLoader] = useState(false);

    const [collectionData, setCollectionData] = useState([]);
    const [country, setCountry] = useState('');
    const [one, setOne] = useState('');
    const [two, setTwo] = useState('');
    const [three, setThree] = useState('');
    const [four, setFour] = useState('');
    const [five, setFive] = useState('');
    const [six, setSix] = useState('');
    //const [total, setTotal] = useState('');

    useEffect(() => {
        listStaffData();
    }, []);


    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', props.match.params.id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    setCollectionData(d);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }



    return (
        <>
            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 0px',
                    margin: 0

                }}
            >

                <Row style={{ background: '#0000', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                    <Col md={24} style={{ textAlign: 'center' }}>
                    </Col>
                </Row>

                <Card title="Member Edit" headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }} >
                    <Tabs
                        defaultActiveKey="1"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="1" title="General Information">
                            <EditMember data={collectionData} />
                        </Tab>
                        <Tab eventKey="2" title="Room status">
                            <EditPageTwo data={collectionData} />
                        </Tab>
                        <Tab eventKey="3" title="Oxygen status">
                            <EditPageThree data={collectionData} />
                        </Tab>
                        <Tab eventKey="4" title="Facilitis status">
                            <EditPageFour data={collectionData} />
                        </Tab>
                        <Tab eventKey="5" title="Immaging services status">
                            <EditPageFive data={collectionData} />
                        </Tab>
                        <Tab eventKey="6" title="No of staffs">
                            <EditPageSix data={collectionData} />
                        </Tab>
                    </Tabs>
                </Card>
            </Content>
        </>
    );
}
export default EditPage;