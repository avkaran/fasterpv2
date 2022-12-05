import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import avg from '../../../../assets/images/avatar.jpg';
import PsContext from '../../../../context';
import { Form, Input, Select, InputNumber, message, Space, Image, Spin, Row, Col } from 'antd';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { MyButton } from '../../../../comp';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const ViewCustomerCourse = (props) => {
    const context = useContext(PsContext);
    const [courseId] = useState(props.match.params.courseId)
    const [viewData, setViewData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [courseFee, setCourseFee] = useState(0);
    const [couponCode, setCoponCode] = useState(null);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select c.*,(select fee from course_fees where status='1' and course_id=c.id and country=(select country from users where id='" + context.customerUser.id + "')) as country_fee from courses c where status='1' and course_status in ('enroll','view-only') and c.id='" + courseId + "'"
        }
            ;

        context.psGlobal.apiRequest(reqData, context.customerUser.mode).then((res, error) => {
            setViewData(res[0]);
            setCourseFee(res[0].country_fee || res[0].default_fee)
            console.log('res', res)

        }).catch(err => {
            message.error(err);

        })
        setLoader(false);
    }
    const onCouponApply=()=>{
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from course_fees where status='1'  and country=(select country from users where id='" + context.customerUser.id + "') and course_id='" + courseId + "'"
        }
        context.psGlobal.apiRequest(reqData, context.customerUser.mode).then((res) => {
            var cuFeeData=res[0];
            if(cuFeeData && cuFeeData.coupon_code && parseInt(cuFeeData.discount)>0 && couponCode===cuFeeData.coupon_code){
                var appliedFee=parseFloat(cuFeeData.fee)-(parseFloat(cuFeeData.fee)*parseInt(cuFeeData.discount))/100
                setCourseFee(appliedFee);
                message.success('Coupon Applied for ' + cuFeeData.discount +"% discount")
            }
            else message.error("Invalid Coupon");

        }).catch(err => {
            message.error(err);

        })
     
        
    }
    return (
        <>
            <div class="main-content bg-white right-chat-active">

                <div class="middle-sidebar-bottom">
                    <div class="middle-sidebar-left">
                        <div class="row">
                            <div class="col-xl-12 mt-3">
                                <Spin spinning={loader}>

                                    {viewData && Object.keys(viewData).length > 0 && (<div class="row">
                                        <div className="col-lg-5 offset-lg-1 mb-4" style={{ marginLeft: '5px' }}>
                                            <img src={viewData.course_image ? context.baseUrl + viewData.course_image : context.noImg} alt="icon" style={{ width: '400px' }} />
                                        </div>
                                        <div class="col-lg-6  col-md-12 pad-top-lg-200 pad-bottom-lg-100 pad-top-100 pad-bottom-75 ps-md--5">
                                            {/* <h4 class="text-danger font-xssss fw-700 ls-2">DNMX</h4> */}
                                            <h2 class="fw-700 text-grey-900 display1-size lh-3 porduct-title display2-md-size">{viewData.course_name}</h2>

                                            {/* <p class="review-link font-xssss fw-500 text-grey-500 lh-3"> 2 customer review</p>
                                    <div class="clearfix"></div>
                                    <p class="font-xsss fw-400 text-grey-500 lh-30 pe-5 mt-3 me-5">ultrices justo eget, sodales orci. Aliquam egestas libero ac turpis pharetra, in vehicula lacus scelerisque. Vestibulum ut sem laoreet, feugiat tellus at, hendrerit arcu.</p> */}

                                            <h6 class="display2-size fw-700 text-current ls-2 mb-2"><span class="font-xl">$</span>{courseFee}
                                                {/* <span class="font-xs text-grey-500" style={{textDecoration: "line-through"}}>$699</span> */}
                                            </h6>
                                            <div class="timer bg-white mt-2 mb-0 w350 rounded-3">
                                            Coupen Code
                                                <Row style={{marginBottom:'5px'}}>
                                                   
                                                    <Col><Input placeholder='Coupon Code' onChange={(e) => setCoponCode(e.target.value)} />
                                                    </Col>
                                                    <Col>
                                                        <MyButton onClick={onCouponApply}>Apply</MyButton>
                                                    </Col>
                                                </Row>
                                                {/* <div class="time-count"><span class="text-time">56</span> <span class="text-day">Duration</span>
                                                </div>
                                                <div class="time-count"><span class="text-time">10</span> <span class="text-day">Hours</span>
                                                </div>
                                                <div class="time-count"><span class="text-time">49</span> <span class="text-day">Min</span>
                                                </div>
                                                <div class="time-count"><span class="text-time">11</span> <span class="text-day">Sec</span>
                                                </div> */}
                                            </div>
                                            <div class="clearfix"></div>
                                            <form action="#" class="form--action mt-4 mb-3">
                                                <div class="product-action flex-row align-items-center">
                                                    {/* <div class="quantity me-3">
                                                        <input type="number" class="quantity-input" name="qty" id="qty" value="1" min="1" />
                                                        <div class="dec qtybutton">-</div>
                                                        <div class="inc qtybutton">+</div>
                                                    </div> */}
                                                    {viewData.course_status == 'enroll' && (<PayPalScriptProvider options={{ "client-id": "AWTpMX60JnCBzqC8A8pLIm82I57sTWXpol4DWaHOT0CMJAULa9qA9mGAY1NuZpBGemfYOqpTuc4I_icx" }}>
                                                        <PayPalButtons
                                                            createOrder={(data, actions) => {
                                                                return actions.order.create({
                                                                    purchase_units: [
                                                                        {
                                                                            reference_id: moment().unix(),
                                                                            amount: {
                                                                                value: courseFee,
                                                                            },
                                                                        },
                                                                    ],
                                                                });
                                                            }}
                                                            onApprove={(data, actions) => {
                                                                return actions.order.capture().then((details) => {
                                                                    const name = details.payer.name.given_name;
                                                                    alert(`Transaction completed by ${name}`);
                                                                });
                                                            }}
                                                            onError={(err) => {
                                                                console.error('An error prevented the buyer from checking out with PayPal' + err);
                                                            }}
                                                        />
                                                    </PayPalScriptProvider>)}

                                                    {/*  <a href="#" class="btn-round-xl alert-dark text-white d-inline-block mt-0 ms-4 float-left"><i class="ti-heart font-sm"></i></a> */}
                                                </div>
                                            </form>
                                            <div class="clearfix"></div>
                                            <ul class="product-feature-list mt-5">
                                                <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900"> Duration : </b>{viewData.duration}</li>
                                                <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900"> Status : </b>{viewData.course_status == 'enroll' ? 'Admission Going On' : 'Not Started'}</li>
                                                {/*<li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left">Straight fit</li>
                                                <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900">SKU : </b> REF. LA-107</li>
                                                <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left">Dry clean</li>
                                                <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900">Tags : </b>Design, Toys</li>
                                                <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left">Cutton shirt</li> */}
                                            </ul>
                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: viewData.description }}></div>
                                    </div>)}
                                </Spin>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ViewCustomerCourse;