import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { businesses, currentInstance } from '../utils';
import PsContext from '../context';
import AdminLogin from '../pages/admin/login'
import CryptoJS  from 'crypto-js';
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
  const decryptNew = (passphrase,encrypted_json_string) => {
    var obj_json = JSON.parse(encrypted_json_string);
    var encrypted = obj_json.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
    var iv = CryptoJS.enc.Hex.parse(obj_json.iv);   
    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64/8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  useEffect(() => {

    import('../pages/admin/business/' + currentInstance.name + '/routes').then((module) => {
      setCurrentRoutes(module.default);
    })
    console.log('new decrypt', decryptNew('asdfasdf','{"ciphertext":"Sn9\/yllxWakeQo1KVhP1Pg==","iv":"a277726315b05d684bf6472c85b84924","salt":"b1fee459ce05870d8c332bca6840d90ea0795df37ba1434bb927174df010dad49f8f76b1c5060d3e4a7d4b3aa092717a481007b4639b1fd9a5b5bf8096f94e3827040e9c8b36432378bdd3f984252c73e1ae5e8504177c763782a8a01a529f5bb86c1e4f0e060a3140ff504462e9de31f1fc0ceacddb4dd9b25ea39b20349549c8bda0188cf7a60302763570b79c60168f575afc7c52b1364057dc94eddd29c4f3b66b62b7ca3371d304e10a33c3b1753dc1021e09dca408d1aed3bc9208e347203f79118a65f6713d27361c6081c83e231a557a50e2ecbb708e8a638cf351991b0e1945be0ecd230cf26cf1fff358a6b1cd87bec44ac52c76c1253e1b1370b7"}'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<BrowserRouter >
    <Suspense fallback={<div className="text-center" style={{ marginTop: 'calc(30vh)' }} ><Spinner animation="border" /></div>}>
      <Routes >
        <Route path="/:userId/admin" element={props.isMobile && businesses[currentInstance.index].responsive && businesses[currentInstance.index].responsive.isMobile ? <AdminLayoutMobile /> : <AdminLayout />} >
          {
            currentRoutes.map(item => item.allowed.indexOf(role) > -1 && (<Route key={item.title}  {...item} />))
          }
        </Route>
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
