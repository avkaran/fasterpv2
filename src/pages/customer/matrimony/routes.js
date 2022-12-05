// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";
import Home from "./home";
import CustomerDashboard from "./dashboard";

import LoggedInMembership from "./membership/loggedInMembership";
import LoggedInSearch from "./search/loggedInSearch";
import MyProfile from "./profile";
import MyMatches from "./profiles/myMatches";
import ExpressInterestProfiles from "./profiles/expressInterestProfiles";
import ViewedProfiles from "./profiles/viewedProfiles";
import MyPlan from "./membership/myPlan";



const myroutes=  [
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
        path: '/:userId/customer/membership',
        component: LoggedInMembership,
        title: 'Membership',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/search',
        component: LoggedInSearch,
        title: 'Membership',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/profile',
        component: MyProfile,
        title: 'Dashboard',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/mymatches',
        component: MyMatches,
        title: 'Dashboard',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/express-interest/:sendBy',
        component: ExpressInterestProfiles,
        title: 'Dashboard',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/profile-views/:viewedBy',
        component: ViewedProfiles,
        title: 'Dashboard',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
    {
        path: '/:userId/customer/myplan',
        component: MyPlan,
        title: 'Dashboard',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
];
export default myroutes;