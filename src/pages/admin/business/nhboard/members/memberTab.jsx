import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Radio, Tooltip } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined, DownloadOutlined,FormOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { listCollections } from '../../../../../models/core'
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs'
import { Steps } from 'antd';
import PsContext from '../../../../../context';
import { lettersOnly, integerIndMobile, momentDate, pincode } from '../../../../../utils';
import $, { event } from 'jquery';
import toast from 'react-hot-toast';
import { Tabs, Tab, Table } from 'react-bootstrap';
import ViewPage from './viewPage';
import PaymentHistory from './paymentHistory';
import CertificateDownload from './certificateDownload';

const MemberViewTab = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
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
    const [paymentHistory, setPaymentHistory] = useState([]);
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
        paymentData();
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

    const paymentData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', props.match.params.id);
            axios.post('v1/admin/getpaymenthistory', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    setPaymentHistory(d);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }


    console.log(collectionData);

    return (
        <>
            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >

                <Row style={{ background: '#0000', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                    <Col md={24} style={{ textAlign: 'center' }}>


                    </Col>
                </Row>
                <Card title={collectionData.member_id + ' - ' + collectionData.name} headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }}  extra={<Tooltip ><Button type="primary" shape="sqaure" href={"#" + userId + "/admin/namechangeentry/" + props.match.params.id} icon={<FormOutlined />} >Name Change</Button> <Button type="primary" shape="sqaure" href={context.baseUrl + "v1/admin/downloadform?q=" + context.psGlobal.encrypt("userid-" + collectionData.id)} icon={<DownloadOutlined />} target="blank">Download</Button></Tooltip>} >
                    <Tabs
                        defaultActiveKey="1"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="1" title="Member View">
                            <ViewPage data={collectionData} />
                        </Tab>
                        <Tab eventKey="2" title="Payment History">
                            <PaymentHistory data={paymentHistory} />
                        </Tab>
                        <Tab eventKey="3" title="Certificate Download">
                            <CertificateDownload data={collectionData} />
                        </Tab>
                    </Tabs>
                </Card>
            </Content>
        </>
    );
}
export default MemberViewTab;