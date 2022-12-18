import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Navigate,useNavigate } from 'react-router-dom';
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
import { lettersOnly, integerIndMobile, pincode } from '../../utilFunctions'
import $ from 'jquery';
import { Tabs, Tab, Table } from 'react-bootstrap';


import toast from 'react-hot-toast';
import PageOne from './pageOne';
import PageTwo from './pageTwo';
import PageThree from './pageThree';
import PageFour from './pageFour';
import PageFive from './pageFive';
import PageSix from './pageSix';
const AddMember = (props) => {
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
    const [curPage, setCurPage] = useState(1);
    const [data, setData] = useState(null);
    const [pageid, setPageID] = useState(0);
    

    const onMemberFormFinish = (values) => {

        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append('id', context.customerUser.id);
        axios.post('/v1/admin/editmember', form).then(res => {
            if (res['data'].status == '1') {
                //document.getElementById("editform").reset();
                toast.success('Member Details Updated Successfully');
                setCurPage(2);
            }
            else {
                toast.error(res['data'].message);
                setShowLoader(false);
            }
        });
    }
    useEffect(() => {
        // navigate()
        listStaffData();


    }, []);
    if (context.customerLogged !== 'yes') {
        return (<Navigate to="/login" />);
    }
    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', context.customerUser.id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    setPageID(d.page_id);
                    addForm.setFieldsValue({
                        name: d.name,
                        doctor_name: d.doctor_name,
                        mobile: d.mobile,
                        ownership: d.type_of_ownership,
                        email_id: d.email_id,
                        page_id: d.page_id,


                    })

                    setData(d);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }

    
    const onAllFormFinish=()=>{
        var reqData = { 
            query_type: 'update',
            table:'hospital_members',
            where:{id: context.customerUser.id},
            values:{member_status:'waiting'}
        };
        context.psGlobal.apiRequest(reqData,"prod").then((res)=>{
            var user = context.customerUser;
            user.member_status = 'waiting';
            context.updateCustomerUser(user);
            navigate("/0/customer/dashboard");
        }).catch(err => {
            message.error(err);
        })
      
    }

    
    
    return (
        <>
      { /* <div class="ttm-page-title-row">
            <div class="container">
                <div class="row">
                    <div class="col-md-12"> 
                        <div class="title-box ttm-textcolor-white">
                            <div class="page-title-heading">
                                <h1 class="title">General Information</h1>
                            </div>
                             
                        </div>
                    </div>
                </div>
            </div>
        </div>*/}

        <div class="site-main mainpad" style={{padding: '0px'}}>

<section class="mt-md-12 mt-sm-0">
       <div class="row">
                    <Spin spinning={loader} >
                    
                  
            <Content className="site-layout-background" style={{
                    padding: '5px 24px 0px 0px',
                    margin: 0

                }}
            ></Content>            
               <Card >
                    <Tabs
                        defaultActiveKey={curPage}
                        activeKey={curPage}
                        id="fill-tab-example"
                        onSelect={(k) => setCurPage(k)}
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="1" title="General Information">
                          <PageOne data={collectionData}  onFormFinish={() => { setCurPage(2);  listStaffData() }} />
                        </Tab>
                        <Tab eventKey="2" title="Room status" disabled={(pageid >0 && pageid <= 6) ? false : true } >
                            <PageTwo data={collectionData} onFormFinish={() => { setCurPage(3);  listStaffData()  }} />
                        </Tab>
                        <Tab eventKey="3" title="Oxygen status" disabled={(pageid >1 &&  pageid <= 6) ? false : true }>
                            <PageThree data={collectionData} onFormFinish={() => { setCurPage(4);  listStaffData() }} />
                        </Tab>
                        <Tab eventKey="4" title="Facilitis status" disabled={(pageid >2 &&  pageid <= 6) ? false : true }>
                            <PageFour data={collectionData} onFormFinish={() => { setCurPage(5);  listStaffData() }} />
                        </Tab>
                        <Tab eventKey="5" title="Immaging services status" disabled={(pageid >3 &&  pageid <= 6) ? false : true }>
                            <PageFive data={collectionData} onFormFinish={() => { setCurPage(6);  listStaffData() }} />
                        </Tab>
                        <Tab eventKey="6" title="No of staffs" disabled={(pageid >4 &&  pageid <= 6) ? false : true }>
                            <PageSix data={collectionData} onFormFinish={onAllFormFinish} />
                        </Tab>
                        <Tab eventKey="7" title="">
                        {
                            curPage === 7 && (<Card title="Registration Completed">
                                <Button type='primary' target="__blank" href={"https://imanhb.org//nhboard/api/v2_0/v1/admin/downloadform?q=" + context.psGlobal.encrypt("userid-"+ context.customerUser.id)}>Download Form
                                </Button>
                            </Card>)
                        }
                        </Tab>
                       
                    </Tabs>
                </Card>
                     
                       
                    </Spin>

                </div></section></div>

        </>
    );

}
export default AddMember;