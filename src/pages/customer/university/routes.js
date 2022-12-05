// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";
import  Home  from "./home";
import EditProfile from "./profile/editProfile";
import CustomerCourses from './courses';
import viewCustomerCourse from "./courses/viewCustomerCourse";
import MyDocuments from "./mydocuments";
const myroutes = [
    {
        path: '/:userId/customer',
        component: Home,
        title: 'My Home',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/editprofile',
        component: EditProfile,
        title: 'Edit Profile',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/courses',
        component: CustomerCourses,
        title: 'Courses',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/courses/view/:courseId',
        component: viewCustomerCourse,
        title: 'Courses',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/mydocuments',
        component: MyDocuments,
        title: 'My Documents',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
  
];
export default myroutes;