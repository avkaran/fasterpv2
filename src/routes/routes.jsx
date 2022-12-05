import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, useParams } from 'react-router-dom';
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
  const context = useContext(PsContext);
  const { userId } = useParams();
  const role = context.adminUser(userId).role && context.adminUser(userId).role.toLowerCase();
  const [currentRoutes, setCurrentRoutes] = useState([]);

  useEffect(() => {
    import('../pages/admin/business/' + currentInstance.name + '/routes').then((module) => {
      setCurrentRoutes(module.default);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<BrowserRouter >
    <Suspense fallback={<div className="text-center" style={{ marginTop: 'calc(30vh)' }} ><Spinner animation="border" /></div>}>
      <Routes >
        {currentRoutes}
        
        <Route path="/a" element={props.isMobile && businesses[currentInstance.index].responsive && businesses[currentInstance.index].responsive.isMobile ? <AdminPublicLayoutMobile /> : <AdminPublicLayout />} >
          <Route path="/a/admin-login" element={<AdminLogin />} />
        </Route>
        <Route path="/:userId/customer" element={userLayout} />
        <Route path="/public" element={userPublicLayout} />

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
  </BrowserRouter >
  )
}
export default MyRoutes;
