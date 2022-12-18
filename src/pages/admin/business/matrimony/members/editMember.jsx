import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Tag } from 'antd';
import { Form, Input, Select, InputNumber, Steps } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { FormItem, MyButton, MyTable } from '../../../../../comp';
import PsContext from '../../../../../context';
import AddEditMember from './AddEditMember';
import PhoneInput from 'react-phone-input-2'

const EditMember = (props) => {
    const context = useContext(PsContext);
    const { userId, memberId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    return (
        <>

            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit Member</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Edit Member">
                    <AddEditMember
                        editIdOrObject={memberId} onListClick={() => {}}
                        onSaveFinish={() => { message.success("Member Data Updated")}}
                        userId={userId}
                        inputFields={
                            [
                                'members.member_created_for',
                                'members.name',
                                'members.gender',
                                'members.dob',
                                'members.religion',
                                'members.caste',
                                'members.sub_caste',
                                'members.caste_detail',

                                'members.password',
                                'members.marital_status',
                                'members.childrens',
                                'members.children_living_status',

                                'members.mobile_no',
                                'members.mobile_alt_no_1',
                                'members.mobile_alt_no_2',
                                'members.whatsapp_no',

                                'members.door_no',
                                'members.street',
                                'members.area',
                                'members.taluk',
                                'members.landmark',
                                'members.pincode',
                                'members.country',
                                'members.state',
                                'members.district',

                                'members.email',

                                'members.mother_tongue',
                                'members.gothra',
                                'members.kuladeivam',
                                'members.poorveegam',
                                'members.residence_type',
                                'members.willing_to_home_mappilai',
                                'members.about_profile',
                                'members.photo',
                                'members.is_protect_photo',
                                'members.educational_qualification',
                                'members.education_detail',
                                'members.job_type',
                                'members.job_name',
                                'members.job_detail',
                                'members.job_country',
                                'members.job_state',
                                'members.job_district',
                                'members.job_area',
                                'members.job_annual_income',

                                'members.father_name',
                                'members.mother_name',

                                'member_family_details.father_status',
                                'member_family_details.mother_status',
                                'member_family_details.father_occupation',
                                'member_family_details.mother_occupation',
                                'member_family_details.brothers',
                                'member_family_details.brothers_married',
                                'member_family_details.sisters',
                                'member_family_details.sisters_married',
                                'member_family_details.dowry_jewels',
                                'member_family_details.dowry_property',
                                'member_family_details.dowry_cash',
                                'member_family_details.about_family',

                                'member_physical_attributes.height',
                                'member_physical_attributes.weight',
                                'member_physical_attributes.body_type',
                                'member_physical_attributes.complexion',
                                'member_physical_attributes.physical_status',


                                //horoscope
                                'member_horoscope.star',
                                'member_horoscope.patham',
                                'member_horoscope.raasi',
                                'member_horoscope.laknam',
                                'member_horoscope.birth_time',
                                'member_horoscope.birth_place',
                                'member_horoscope.dhosam_type',
                                'member_horoscope.jadhagam_type',
                                'member_horoscope.raasi_chart',
                                'member_horoscope.amsam_chart',
                                'member_horoscope.dasa',
                                'member_horoscope.dasa_year',
                                'member_horoscope.dasa_month',
                                'member_horoscope.dasa_days',


                            ]
                        }

                    />
                </Card>



            </Content>

        </>
    );

}
export default EditMember;