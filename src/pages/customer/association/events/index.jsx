import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import avg from '../../../../assets/images/avatar.jpg';
import PsContext from '../../../../context';
import { Form, Input, Select, InputNumber, message,Space } from 'antd';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { MyButton } from '../../../../comp';
const CustomerEvents = (props) => {
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
                query: "select * from contents where type='event' and status='1' and content_status='published'"
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
                <div class="row feed-body"  style={{ paddingTop: context.isMobile?'50px':'20px' }}>
                    <div class="col-xl-8 col-xxl-9 col-lg-8">
                        <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
                            <div class="card-body p-0">
                                <Space>
                                    <MyButton type="primary" shape="circle"><FontAwesomeIcon icon={faNewspaper}  href={"0/customer/new-article"}/></MyButton>
                                    <a href={"0/customer/new-article"} class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center">Create Article</a>
                                </Space>
                            </div>


                        </div>
                        {data.map(item => {
                            return <div class="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
                                <div class="card-body p-0 d-flex">{item.feature_img}
                                  
                                    <h4 class="fw-700 text-grey-900 font-xssss mt-1">{item.title} <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{item.created_date}</span></h4>
                                    {/* <a href="#" class="ms-auto" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
     <div class="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu2">
         <div class="card-body p-0 d-flex">
             <i class="feather-bookmark text-grey-500 me-3 font-lg"></i>
             <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Save Link <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Add this to your saved items</span></h4>
         </div>
         <div class="card-body p-0 d-flex mt-2">
             <i class="feather-alert-circle text-grey-500 me-3 font-lg"></i>
             <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Hide Post <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
         </div>
         <div class="card-body p-0 d-flex mt-2">
             <i class="feather-alert-octagon text-grey-500 me-3 font-lg"></i>
             <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Hide all from Group <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
         </div>
         <div class="card-body p-0 d-flex mt-2">
             <i class="feather-lock text-grey-500 me-3 font-lg"></i>
             <h4 class="fw-600 mb-0 text-grey-900 font-xssss mt-0 me-4">Unfollow Group <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
         </div>
     </div> */}
                                </div>
                                <div class="card-body p-0 me-lg-5">
                                    <p class="fw-500 text-grey-500 lh-26 font-xssss w-100">
                                        <div dangerouslySetInnerHTML={{ __html: item.content_html }}></div>
                                    </p>
                                </div>

                                {/*  <div class="card-body d-flex p-0 mt-3">
     <a href="#" class="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"><i class="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i> <i class="feather-heart text-white bg-red-gradiant me-2 btn-round-xs font-xss"></i>2.8K Like</a>
     <div class="emoji-wrap">
         <ul class="emojis list-inline mb-0">
             <li class="emoji list-inline-item"><i class="em em---1"></i> </li>
             <li class="emoji list-inline-item"><i class="em em-angry"></i></li>
             <li class="emoji list-inline-item"><i class="em em-anguished"></i> </li>
             <li class="emoji list-inline-item"><i class="em em-astonished"></i> </li>
             <li class="emoji list-inline-item"><i class="em em-blush"></i></li>
             <li class="emoji list-inline-item"><i class="em em-clap"></i></li>
             <li class="emoji list-inline-item"><i class="em em-cry"></i></li>
             <li class="emoji list-inline-item"><i class="em em-full_moon_with_face"></i></li>
         </ul>
     </div>
     <a href="#" class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i><span class="d-none-xss">22 Comment</span></a>
     <a href="#" id="dropdownMenu21" data-bs-toggle="dropdown" aria-expanded="false" class="ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-share-2 text-grey-900 text-dark btn-round-sm font-lg"></i><span class="d-none-xs">Share</span></a>
     <div class="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu21">
         <h4 class="fw-700 font-xss text-grey-900 d-flex align-items-center">Share <i class="feather-x ms-auto font-xssss btn-round-xs bg-greylight text-grey-900 me-2"></i></h4>
         <div class="card-body p-0 d-flex">
             <ul class="d-flex align-items-center justify-content-between mt-2">
                 <li class="me-1"><a href="#" class="btn-round-lg bg-facebook"><i class="font-xs ti-facebook text-white"></i></a></li>
                 <li class="me-1"><a href="#" class="btn-round-lg bg-twiiter"><i class="font-xs ti-twitter-alt text-white"></i></a></li>
                 <li class="me-1"><a href="#" class="btn-round-lg bg-linkedin"><i class="font-xs ti-linkedin text-white"></i></a></li>
                 <li class="me-1"><a href="#" class="btn-round-lg bg-instagram"><i class="font-xs ti-instagram text-white"></i></a></li>
                 <li><a href="#" class="btn-round-lg bg-pinterest"><i class="font-xs ti-pinterest text-white"></i></a></li>
             </ul>
         </div>
         <div class="card-body p-0 d-flex">
             <ul class="d-flex align-items-center justify-content-between mt-2">
                 <li class="me-1"><a href="#" class="btn-round-lg bg-tumblr"><i class="font-xs ti-tumblr text-white"></i></a></li>
                 <li class="me-1"><a href="#" class="btn-round-lg bg-youtube"><i class="font-xs ti-youtube text-white"></i></a></li>
                 <li class="me-1"><a href="#" class="btn-round-lg bg-flicker"><i class="font-xs ti-flickr text-white"></i></a></li>
                 <li class="me-1"><a href="#" class="btn-round-lg bg-black"><i class="font-xs ti-vimeo-alt text-white"></i></a></li>
                 <li><a href="#" class="btn-round-lg bg-whatsup"><i class="font-xs feather-phone text-white"></i></a></li>
             </ul>
         </div>
         <h4 class="fw-700 font-xssss mt-4 text-grey-500 d-flex align-items-center mb-3">Copy Link</h4>
         <i class="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
         <input type="text" value="https://socia.be/1rGxjoJKVF0" class="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg" />
     </div>
 </div> */}
                            </div>
                        })}






                    </div>
                    <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                        <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Recent Members</h4>
                                {/*  <a href="default-member.html" class="fw-600 ms-auto font-xssss text-primary">See all</a> */}
                            </div>
                            {recentMembers.map(member => {
                                return <><div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 border-top-xs bor-0">
                                    <figure class="avatar me-3"><img src={member.photo ? context.baseUrl + member.photo : context.noImg} class="shadow-sm rounded-circle w45" /></figure>
                                    <h4 class="fw-700 text-grey-900 font-xssss mt-1">{member.name} <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{member.qualification}</span></h4>
                                </div>
                                    <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                                        <a href={"/0/customer/view-member/" + member.id} className="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">View</a>
                                        {/* <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a> */}
                                    </div></>

                            })}


                        </div>
                        {/*   <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Friend Request</h4>
                                <a href="default-member.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>
                            </div>
                            <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 border-top-xs bor-0">
                                <figure class="avatar me-3"><img src={avg} alt="image" class="shadow-sm rounded-circle w45" /></figure>
                                <h4 class="fw-700 text-grey-900 font-xssss mt-1">Anthony Daugloi <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
                            </div>
                            <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                                <a href="#" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Confirm</a>
                                <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a>
                            </div>

                            <div class="card-body d-flex pt-0 ps-4 pe-4 pb-0">
                                <figure class="avatar me-3"><img src="images/user-8.png" alt="image" class="shadow-sm rounded-circle w45" /></figure>
                                <h4 class="fw-700 text-grey-900 font-xssss mt-1">Mohannad Zitoun <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
                            </div>
                            <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                                <a href="#" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Confirm</a>
                                <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a>
                            </div>

                            <div class="card-body d-flex pt-0 ps-4 pe-4 pb-0">
                                <figure class="avatar me-3"><img src="images/user-12.png" alt="image" class="shadow-sm rounded-circle w45" /></figure>
                                <h4 class="fw-700 text-grey-900 font-xssss mt-1">Mohannad Zitoun <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
                            </div>
                            <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                                <a href="#" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Confirm</a>
                                <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a>
                            </div>
                        </div> */}






                    </div>

                </div>



            </div>
        </>
    );
};

export default CustomerEvents;