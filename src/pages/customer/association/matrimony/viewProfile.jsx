import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, message, Image, Avatar } from 'antd';
import { ImageUpload, MyButton } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber,Modal } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { heightList } from '../../../../models/core'
import { ViewItem } from '../../../../comp';
import { red, yellow, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faHeart,faClose } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
const ViewProfile = (props) => {
    const navigate = useNavigate();
    const { Option } = Select;
    const context = useContext(PsContext);
    const [loader, setLoader] = useState(true);
    const [viewData, setViewData] = useState(null);
    const [editForm] = Form.useForm();
    const [expressInterestForm]=Form.useForm();
    const { TextArea } = Input;
    const [country, setCountry] = useState('');
    const [IsMatrimonyMember, setIsMatrimonyMember] = useState(false);
    const [visibleExpressInterest,setVisibleExpressInterest]=useState(false);
    const [expressInterestLoading,setExpressInterestLoading]=useState(false);
    
    useEffect(() => {
        setLoader(true);
        //   var id=props.memberId;
        let mydata = props.memberData;
        setViewData(mydata)
        setIsMatrimonyMember(parseInt(mydata.is_matrimony_member) === 1);
        setLoader(false);
        // loadData(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from members where id='" + id + "'"
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
            let mydata = res[0];
            setViewData(mydata)

            setIsMatrimonyMember(parseInt(mydata.is_matrimony_member) == 1);
            var d = dayjs(mydata.dob, 'YYYY-MM-DD')
            if (d instanceof Date) {
                editForm.setFieldsValue({ dob: mydata.dob })
            }

            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const getHeight = (cm) => {
        let d = heightList.find((item) => item.cm == cm);
        return d && d.label;
    }
    const onFinishExpressInterest = (values) => {
        setExpressInterestLoading(true);
        var processedValues={};
        processedValues['msg']=values.msg;
        processedValues['member_auto_id']=context.customerUser.id;
        processedValues['member_id']=context.customerUser.member_id;
        processedValues['expressed_auto_id']=viewData.id;
        processedValues['expressed_member_id']=viewData.member_id;
        processedValues['expressed_date']=dayjs().format('YYYY-MM-DD HH:mm')

        var reqData = { 
            query_type: 'insert',
            table:'express_interests',
           // where:{id:'1'},
            values:processedValues

        };
       
        context.psGlobal.apiRequest(reqData,"prod").then((res)=>{
            message.success("Interest Sent");
            setExpressInterestLoading(false);
            setVisibleExpressInterest(false);
           
        }).catch(err => {
            message.error(err);
            setExpressInterestLoading(false);
        })

    }
    return (
        <>
            <Card title="View Profile" extra={props.showBackButton && (<MyButton onClick={props.onBack}><FontAwesomeIcon icon={faBackward} /> Back</MyButton>)}>

                <Spin spinning={loader} >
                    {viewData && (<><Row>
                        <span style={{ fontSize: '20px', color: cyan[6], fontWeight: 'bold', margin: '10px 0px 10px 0px' }}>{viewData.name}</span>
                    </Row>
                        <Row gutter={16}>

                            <Col className='gutter-row' xs={24} xl={12}>
                                <ViewItem label="Name" labelCol={8} wrapperCol={16} value={viewData.name} />
                                <ViewItem label="Age" labelCol={8} wrapperCol={16} value={viewData.age + " Years"} />
                                <ViewItem label="gender" labelCol={8} wrapperCol={16} value={viewData.gender} />
                                <ViewItem label="Date of Birth" labelCol={8} wrapperCol={16} value={viewData.dob && dayjs(viewData.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')} />
                                <ViewItem label="Qualification" labelCol={8} wrapperCol={16} value={viewData.qualification} />
                                <ViewItem label="Highter Study" labelCol={8} wrapperCol={16} value={viewData.higher_study} />
                                <ViewItem label="Marital Status" labelCol={8} wrapperCol={16} value={viewData.marital_status} />
                                <ViewItem label="Service" labelCol={8} wrapperCol={16} value={viewData.service} />
                                <ViewItem label="Medical Reg.No" labelCol={8} wrapperCol={16} value={viewData.medical_registration_no} />
                                <ViewItem label="Prefered Zone" labelCol={8} wrapperCol={16} value={viewData.prefered_zone} />
                                <ViewItem label="Working Details" labelCol={8} wrapperCol={16} value={viewData.work_details} />
                                <ViewItem label="About Profile" labelCol={8} wrapperCol={16} value={viewData.about_member} />
                                <ViewItem label="Location " labelCol={8} wrapperCol={16} value={viewData.city + "," + viewData.state + ',' + viewData.country} />
                                <ViewItem label="Mobile Number" labelCol={8} wrapperCol={16} value={viewData.mobile_no} />
                                <ViewItem label="Whatsapp Number" labelCol={8} wrapperCol={16} value={viewData.whatsapp_no} />
                                <ViewItem label="Address" labelCol={8} wrapperCol={16} value={viewData.address} />
                                {
                                    IsMatrimonyMember && (<>
                                        <ViewItem label="Height" labelCol={8} wrapperCol={16} value={viewData.height ? getHeight(parseInt(viewData.height)) : ''} />
                                        <ViewItem label="Weight" labelCol={8} wrapperCol={16} value={viewData.weight + " Kg"} />
                                    </>)
                                }
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                {IsMatrimonyMember && parseInt(context.customerUser.is_matrimony_member) ===1 && ( <Row align='center' style={{ marginBottom: '30px' }}>
                                    <MyButton type="primary" onClick={()=>setVisibleExpressInterest(true)}><FontAwesomeIcon icon={faHeart} /> Express Interest</MyButton>
                                </Row>)}
                               
                                <Row align='center'>
                                    <Avatar size={150} shape="circle" src={<Image
                                        src={viewData.photo ? context.baseUrl + viewData.photo : viewData.gender === 'Male' ? context.noMale : context.noFemale} fallback={context.noImg} />} />
                                </Row>
                                {IsMatrimonyMember && (<Row align='center' style={{ marginTop: '30px' }}><Image src={context.baseUrl + viewData.horoscope} fallback={context.noImg} /></Row>)}
                            </Col>
                        </Row></>)}
                </Spin>
            </Card>
            <Modal
                visible={visibleExpressInterest}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleExpressInterest(false) }}
                title={<span style={{ color: cyan[4] }} ><FontAwesomeIcon icon={faHeart} /> &nbsp; Express Interest</span>}
            >
                <Form
                    name="basic"
                    form={expressInterestForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinishExpressInterest}
                    autoComplete="off"
                >


                    <Form.Item
                        label="Msg"
                        name="msg"
                        rules={[{ required: true, message: 'Please Enter Msg' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                        <Button size="large" type="primary" htmlType="submit" style={{}} loading={expressInterestLoading}>
                            Express Now
                        </Button>
                    </Form.Item>

                </Form>


            </Modal>
        </>
    );

}
export default ViewProfile;