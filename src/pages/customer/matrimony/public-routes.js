// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import PublicSearch from "./search/publicSearch";
import HomeSearch from "./search/homeSearch";
import PublicMembership from "./membership/publicMembership";

const myroutes= [
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
    {
        path: '/public/search',
        component: PublicSearch,
        title: 'Login',
        allowed: CustomerROLES.ALL,
        exact: true
    },
    {
        path: '/public/membership',
        component: PublicMembership,
        title: 'Login',
        allowed: CustomerROLES.ALL,
        exact: true
    },
    {
        path: '/public/home-search/:phrase',
        component: HomeSearch,
        title: 'Login',
        allowed: CustomerROLES.ALL,
        exact: true
    },
];
export default myroutes;
