import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Routes, Route, HashRouter, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { businesses, currentInstance } from '../utils';
import PsContext from '../context';
import AdminLogin from '../pages/admin/login'
import CryptoJS from 'crypto-js';
import Branches from '../pages/admin/branches';
const AdminPublicLayout = React.lazy(() => import('../pages/admin/public-layout-desktop'));
const AdminLayout = React.lazy(() => import('../pages/admin/layout-desktop'));

const AdminPublicLayoutMobile = React.lazy(() => import('../pages/admin/public-layout-mobile'));
const AdminLayoutMobile = React.lazy(() => import('../pages/admin/layout-mobile'));

/* const userLogin = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/login'));
const userRegister = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/register'));
const userActivate = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/activate'));
const userVerifyEmail = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/verify-email'));
const userPasswordReset = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/reset-password')); */


const userLayout = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/layout'));
const userPublicLayout = React.lazy(() => import('../pages/customer/' + currentInstance.name + '/public-layout'));

const MyRoutes = (props) => {
  const [adminRoutes, setAdminRoutes] = useState([]);
  const [customerPublicRoutes, setCustomerPublicRoutes] = useState([])
  const [customerRoutes, setCustomerRoutes] = useState([])
  useEffect(() => {
    import('../pages/admin/business/' + currentInstance.name + '/routes').then((module) => {
      setAdminRoutes(module.default);
    })
    import('../pages/customer/' + currentInstance.name + '/public-routes').then((module) => {
      setCustomerPublicRoutes(module.default);

    })
    import('../pages/customer/' + currentInstance.name + '/routes').then((module) => {
      setCustomerRoutes(module.default);

    }) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<HashRouter >
    <Suspense fallback={<div className="text-center" style={{ marginTop: 'calc(30vh)' }} ><Spinner animation="border" /></div>}>
      <Routes>
       
        {customerPublicRoutes}
        {customerRoutes}
        {adminRoutes}

        <Route path="/a" element={props.isMobile && businesses[currentInstance.index].responsive && businesses[currentInstance.index].responsive.isMobile ? <AdminPublicLayoutMobile /> : <AdminPublicLayout />} >
          <Route path="/a/admin-login" element={<AdminLogin />} />
        </Route>

        {/*  <Route path="/:userId/customer" element={userLayout} />
        <Route path="/public" element={userPublicLayout} /> */}

        {/*   
  //only for old univeristy association projects(start)
  <Route path="/member-login" component={userLogin} />
        <Route path="/member-register" component={userRegister} />
        <Route path="/activate-member/:memberId" component={userActivate} />
        <Route path="/member-verify-email" component={userVerifyEmail} />
        <Route path="/member-reset-password" component={userPasswordReset} /> 
        
 // only for old univeristy association projects(end)
        */}
      </Routes >
    </Suspense>
  </HashRouter >
  )
}
export default MyRoutes;
