import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import avg from '../../../../assets/images/avatar.jpg';
import PsContext from '../../../../context';
import { Form, Input, Select, InputNumber, message,Space,Image } from 'antd';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { MyButton } from '../../../../comp';
const CustomerGallery = () => {
    const context = useContext(PsContext);
    const [data, setData] = useState([]);
    const [recentMembers, setRecentMembers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        

        loadData();
    }, []);
    const loadData = () => {
        var reqData = [
            {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select * from contents where type='gallery' and status='1'"
            },
            {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select * from members where status='1' ORDER BY created_date desc limit 0,20"
            }
        ];

        context.psGlobal.apiRequest(reqData, context.customerUser.mode).then((res, error) => {
            setData(res[0]);
            setRecentMembers(res[1]);
            console.log('res', res)

        }).catch(err => {
            message.error(err);
            //setLoader(false);
        })
    }
    return (
        <>
            <div class="main-content right-chat-active">


            <div class="row"  style={{ paddingTop: context.isMobile?'50px':'20px' }}>
                               
                               {
                                data.map(item=>{
                                    return <div class="col-lg-4 col-md-6 pe-2 ps-2">
                                    <div class="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden ">
                                        <div class="card-image w-100">
                                            <Image src={item.feature_image ? context.baseUrl + item.feature_image : context.noImg} alt="event" className="w-100 rounded-3"/>
                                        </div>
                                        <div class="card-body d-flex ps-0 pe-0 pb-0">
                                            {/* <div class="bg-greylight me-3 p-3 border-light-md rounded-xxl theme-dark-bg">
                                                <h4 class="fw-700 font-lg ls-3 text-grey-900 mb-0">
                                                <span class="ls-3 d-block font-xsss text-grey-500 fw-500">FEB</span>22</h4>
                                                </div> */}
                                            <h2 class="fw-700 lh-3 font-xss">{item.title}
                                              {/*   <span class="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500"> <i class="ti-location-pin me-1"></i> Goa, Mumbai </span> */}
                                            </h2>
                                        </div>
                                        {/* <div class="card-body p-0">
                                            <ul class="memberlist mt-4 mb-2 ms-0 d-inline-block">
                                                <li><a href="#"><img src="images/user-6.png" alt="user" class="w30 d-inline-block"/></a></li>
                                                <li><a href="#"><img src="images/user-7.png" alt="user" class="w30 d-inline-block"/></a></li>
                                                <li><a href="#"><img src="images/user-8.png" alt="user" class="w30 d-inline-block"/></a></li>
                                                <li><a href="#"><img src="images/user-3.png" alt="user" class="w30 d-inline-block"/></a></li>
                                                <li class="last-member"><a href="#" class="bg-greylight fw-600 text-grey-500 font-xssss ls-3 text-center">+2</a></li>
                                            </ul>
                                            <a href="#" class="font-xsssss fw-700 ps-3 pe-3 lh-32 float-right mt-4 text-uppercase rounded-3 ls-2 bg-success d-inline-block text-white me-1">APPLY</a>
                                        </div> */}
                                    </div>
                                </div>

                                })
                               }

                                
                            </div>



            </div>
        </>
    );
};

export default CustomerGallery;