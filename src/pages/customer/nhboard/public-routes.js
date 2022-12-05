// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import CustomerDashboard from "./dashboard";
import AddMember from './profile/addwizard/addMember'




export default [
    {
        path: '/public/register',
        component: Register,
        title: 'Register',
        allowed: CustomerROLES.ALL,
        exact: true
    },
    {
        path: '/public/login',
        component: Login,
        title: 'Login',
        allowed: CustomerROLES.ALL,
        exact: true
    },
];
