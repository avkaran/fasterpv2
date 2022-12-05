import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Radio, Tooltip } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
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
import { PaginatedTable } from '../../../../../comp'


const PaymentHistory = (props) => {
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
    const [refreshTable, setRefreshTable] = useState(0);


    console.log(props.data);

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
                        {props.data.length > 0 ? <Table bordered>
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    <th>Subscription Type</th>
                                    <th>Paid Date</th>
                                    <th>General Fund</th>
                                    <th>Journal Fund</th>
                                    <th>Total Fund</th>
                                    <th>Receipt Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.data.map((item, i) => {
                                    return <tr>
                                        <td>{i + 1}</td>
                                        <td>{item.sub_type}</td>
                                        <td>{moment(item.paid_date).format('DD-MM-YYYY')}</td>
                                        <td>{item.general_fund}</td>
                                        <td>{item.journal_fund}</td>
                                        <td>{item.total_amount}</td>
                                        <td><Tooltip title="Download Receipt"> <Button type="primary" shape="square" href={context.baseUrl + "v1/admin/downloadreceipt?q=" + context.psGlobal.encrypt("receipt-" + item.id)} icon={<DownloadOutlined />} target="blank" /></Tooltip></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table> : <b>No Payment History</b>}
                    </Col>
                </Row>
            </Content>
        </>
    );
}
export default PaymentHistory;