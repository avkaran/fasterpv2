// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";
import  Home  from "./home";
import NewArticle from "./home/newArticle";
import EditProfile from "./profile/editProfile";
import CustomerAnnouncements from "./announcements"
import CustomerEvents from "./events"
import CustomerGallery from "./gallery"
import Matrimony from "./matrimony";
import ViewProfile from "./matrimony/viewProfile";
import ViewMember from "./matrimony/viewMember";
import ExpressInterest from "./express-interest";
import CustomerMembers from "./members";
import CustomerDashboard from "./dashboard";
const myroutes = [
    {
        path: '/:userId/customer',
        component: Home,
        title: 'My Home',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/dashboard',
        component: CustomerDashboard,
        title: 'Dashboard',
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
        path: '/:userId/customer/view-member/:memberId',
        component: ViewMember,
        title: 'Edit Profile',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/new-article',
        component: NewArticle,
        title: 'New Article',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/announcements',
        component: CustomerAnnouncements,
        title: 'New Article',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/events',
        component: CustomerEvents,
        title: 'New Article',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/gallery',
        component: CustomerGallery,
        title: 'New Article',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/matrimony',
        component:Matrimony,
        title: 'Matrimony',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/members',
        component:CustomerMembers,
        title: 'Members',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/express-interest/:type',
        component:ExpressInterest,
        title: 'Express Interest',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
   
  
];
export default myroutes;