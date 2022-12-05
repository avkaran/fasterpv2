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
const ViewProfile = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="row">
                                <div className="col-md-5">
                                    <img
                                        src="https://rajmatrimony.com/api/img/t-154566/undefined"
                                        className="img-fluid border bg-light w-100"
                                        style={{ maxHeight: 290 }}
                                    />
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body">
                                        <div className="font-weight-600">Murugeshwari</div>
                                        <div className="font-12 mt-1">RM-22154566</div>
                                        <div className="mt-1 font-13">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Age
                                                        </td>
                                                        <td>28</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Height
                                                        </td>
                                                        <td>152cm - 5ft</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Location
                                                        </td>
                                                        <td>Tenkasi, Tamil Nadu</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Religion
                                                        </td>
                                                        <td>Hindu</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Caste
                                                        </td>
                                                        <td>Thevar</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Mother Tongue
                                                        </td>
                                                        <td>Tamil</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height={25}>
                                                            Education
                                                        </td>
                                                        <td>Bachelors - Management / Others</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="35%" height="" colSpan={2}>
                                                            Profile Created By :{" "}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-theme py-0 font-12 card-footer">
                                <i className="icofont-envelope me-1" />
                                Email Verified
                                <i className="icofont-phone me-1 ms-3" />
                                Mobile Verified
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="px-0 py-0 card-body">
                                <div className="view_profile_side_bar_welcome row">
                                    <div className="col-md-12" />
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="bg-light-10 text-center py-10">
                                            <h6>Want to Send Interest ?</h6>
                                            <button type="button" className="btn btn-primary">
                                                Send Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="d-flex align-items-center justify-content-center pt-15">
                                            <button type="button" className="btn btn-theme">
                                                <i className="icofont-id-card me-1" /> Contact
                                            </button>

                                            <button type="button" className="btn btn-theme">
                                                <i className="icofont-heart me-1" />
                                                Shortlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-top mt-3 row">
                                    <div className="col-md-12">
                                        <div className="d-flex align-items-center justify-content-start pt-2 pb-2 px-15 font-12">
                                            <i className="icofont-ui-block me-1" /> Block Profile
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-15 row">
                    <div className="col-md-8">
                        <div className="card">
                            <ul className="tab-theme mb-15 mt-2 nav nav-tabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        type="button"
                                        id="noanim-tab-example-tab-personal"
                                        role="tab"
                                        data-rr-ui-event-key="personal"
                                        aria-controls="noanim-tab-example-tabpane-personal"
                                        className="nav-link active"
                                        aria-selected="true"
                                    >
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        type="button"
                                        id="noanim-tab-example-tab-family"
                                        role="tab"
                                        data-rr-ui-event-key="family"
                                        aria-controls="noanim-tab-example-tabpane-family"
                                        className="nav-link"
                                        tabIndex={-1}
                                    >
                                        Family Details
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        type="button"
                                        id="noanim-tab-example-tab-partner"
                                        role="tab"
                                        data-rr-ui-event-key="partner"
                                        aria-controls="noanim-tab-example-tabpane-partner"
                                        className="nav-link"
                                        tabIndex={-1}
                                    >
                                        PARTNER PREFERENCE
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div
                                    id="noanim-tab-example-tabpane-personal"
                                    aria-labelledby="noanim-tab-example-tab-personal"
                                    className="tab-pane active"
                                >
                                    <div className="px-20 py-10">
                                        <div>jolly peerson</div>
                                        <div className="text-theme font-weight-100 mt-30">
                                            <i className="icofont-user me-2" /> Basic Information
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Name
                                                        </td>
                                                        <td>Murugeshwari</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Date of Birth
                                                        </td>
                                                        <td>09/Apr/1994</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Place of Birth
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Time of Birth
                                                        </td>
                                                        <td>0h:0m:0s</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Age
                                                        </td>
                                                        <td>28</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Gender
                                                        </td>
                                                        <td>Female</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Height
                                                        </td>
                                                        <td>152cm - 5ft</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Location
                                                        </td>
                                                        <td>Tamil Nadu - Tenkasi</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Marital Status
                                                        </td>
                                                        <td>Never Married</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Mother Tongue
                                                        </td>
                                                        <td>Tamil</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-theme font-weight-100">
                                            <i className="icofont-certificate-alt-1 me-2" /> Qualification
                                            &amp; Career
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Educational Qualification
                                                        </td>
                                                        <td>Bachelors - Management / Others</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            College/University
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Working as
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Working With
                                                        </td>
                                                        <td>Private Company</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Annual Income
                                                        </td>
                                                        <td>INR 1.8 Lakhs to 3 Lakhs</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-theme font-weight-100">
                                            <i className="icofont-map-pins me-2" /> Current Location
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Country of Residence
                                                        </td>
                                                        <td>India</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            State of Residency
                                                        </td>
                                                        <td>Tamil Nadu</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            City of Residence
                                                        </td>
                                                        <td>Tenkasi</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="noanim-tab-example-tabpane-family"
                                    aria-labelledby="noanim-tab-example-tab-family"
                                    className="tab-pane"
                                >
                                    <div className="px-20 py-10">
                                        <div>jolly peerson</div>
                                        <div className="text-theme font-weight-100 mt-30">
                                            <i className="icofont-users me-2" /> Family Information
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Father's Occupation
                                                        </td>
                                                        <td>Business</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Mother's Occupation
                                                        </td>
                                                        <td>Homemaker</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Married Sisters (s)
                                                        </td>
                                                        <td>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Unmarried Sisters (s)
                                                        </td>
                                                        <td>1</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Married Brother (s)
                                                        </td>
                                                        <td>0</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Unmarried Brother (s)
                                                        </td>
                                                        <td>1</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-theme font-weight-100">
                                            <i className="icofont-ui-map me-2" /> Family Values and Native
                                            Information
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Native Country
                                                        </td>
                                                        <td>India</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Native State
                                                        </td>
                                                        <td>Tamil Nadu</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Native City
                                                        </td>
                                                        <td>Tenkasi</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Family Value
                                                        </td>
                                                        <td>Traditional</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Family Status
                                                        </td>
                                                        <td>Middle Class</td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Family Income
                                                        </td>
                                                        <td>INR 3 Lakhs to 4 Lakhs</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="noanim-tab-example-tabpane-partner"
                                    aria-labelledby="noanim-tab-example-tab-partner"
                                    className="tab-pane"
                                >
                                    <div className="px-20 py-10">
                                        <div />
                                        <div className="text-theme font-weight-100 mt-30">
                                            <i className="icofont-eye me-2" /> Desired Partner
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Age
                                                        </td>
                                                        <td> - </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Marital Status
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Height
                                                        </td>
                                                        <td> - </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Special Cases
                                                        </td>
                                                        <td>Doesn't matter</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-theme font-weight-100">
                                            <i className="icofont-map me-2" /> Residence Status
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Country of Residency
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            State of Residency
                                                        </td>
                                                        <td />
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-theme font-weight-100">
                                            <i className="icofont-map me-2" /> Qualification &amp; Career
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Educational Qualification
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Annual Income
                                                        </td>
                                                        <td />
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-theme font-weight-100">
                                            <i className="icofont-map me-2" /> Social Background
                                        </div>
                                        <div className="font-13 mt-3 border-bottom pb-15 mb-30">
                                            <table width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Religion
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Caste
                                                        </td>
                                                        <td />
                                                    </tr>
                                                    <tr>
                                                        <td width="40%" height={25}>
                                                            Mother Tongue
                                                        </td>
                                                        <td />
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}
export default ViewProfile;