import PsContext from '../../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, Form } from 'antd';
import dayjs from 'dayjs'
import { FormViewItem } from '../../../../../../comp';
const ViewMemberBasic = (props) => {
    const context = useContext(PsContext);
    const { viewData, isForCustomer,userId, ...other } = props;
    useEffect(() => {
        //load photos of
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <> <Form
            colon={false}
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            autoComplete="off"

        >
            <Row gutter={16}>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Member Id">{viewData.member_id}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Created For">{viewData.member_created_for}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Created By">{viewData.member_created_by}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Created User">{viewData.member_created_ref_id}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Name">{viewData.name}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Father Name">{viewData.father_name}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Mother Name">{viewData.mother_name}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Gender">{viewData.gender}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Dob">{dayjs(viewData.dob).format("DD/MM/YYYY")}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Marital Status">{viewData.marital_status}</FormViewItem>
                </Col>
                {
                    viewData.marital_status !== "Never Married" && (<><Col className='gutter-row' xs={24} xl={12}>
                        <FormViewItem label="No Of Children">{viewData.no_of_children}</FormViewItem>
                    </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Children Status">{viewData.children_living_status}</FormViewItem>
                        </Col></>)
                }
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Aadhaar No">{viewData.aadhaar_no}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Caste">{viewData.caste_name}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Sub Caste">{viewData.sub_caste}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Caste Detail">{viewData.caste_detail}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Religion">{viewData.religion}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Mother Tongue">{viewData.mother_tongue}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Languages Known">{viewData.languages_known}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Gothra">{viewData.gothra}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Kuladeivam">{viewData.kuladeivam}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Poorveegam">{viewData.poorveegam}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Residence Type">{viewData.residence_type}</FormViewItem>
                </Col>
                {
                    viewData.gender === "Male" && (<Col className='gutter-row' xs={24} xl={12}>
                        <FormViewItem label="Home Mappilai?">{parseInt(viewData.willing_to_home_mappilai) === 1 ? 'Yes' : 'No'}</FormViewItem>
                    </Col>)
                }
                {
                    !isForCustomer && (context.adminUser(userId).role==='admin' || context.adminUser(userId).role==='employee') && (<Col className='gutter-row' xs={24} xl={12}>
                        <FormViewItem label="Password">{context.psGlobal.decrypt(viewData.password)}</FormViewItem>
                    </Col>)
                }

                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="Created Date">{dayjs(viewData.created_date).format("DD/MM/YYYY h:m a")}</FormViewItem>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <FormViewItem label="About Profile">{viewData.about_profile}</FormViewItem>
                </Col>
            </Row>
        </Form>
        </>
    );

}
export default ViewMemberBasic;