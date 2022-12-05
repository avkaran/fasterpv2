// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import CustomerDashboard from "./dashboard";
import AddMember from './profile/addwizard/addMember'

export default [
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
        path: '/:userId/customer/register-wizard',
        component: AddMember,
        title: 'Registeration',
        allowed: CustomerROLES.CUSTOMER,
        exact: true
    },
];
