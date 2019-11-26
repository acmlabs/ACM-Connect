import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Profile from "./components/profile/Profile";
import Landing from "./components/landing/Landing";
import SignUp from "./components/signup/SignUp.jsx";
import SignIn from "./components/signin/SignIn.jsx";
import Logout from './components/logout/Logout.jsx'
import UploadResume from "./components/profile/Upload";
import FAQ from './components/faq/FAQ'
import "./index.css";

import loginOnly from './components/utils/LoginOnly'


const routing = (
    <Router>
        <div>
            <Route exact path="/" component={Landing} />
            <Route exact path="/home" component={Landing} />
            <Route exact path="/faq" component={FAQ} />
            <Route exact path="/profile" component={loginOnly(Profile)} />
            <Route exact path="/profile/upload" component={loginOnly(UploadResume)} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/logout" component={Logout} />
        </div>
    </Router>
);

export default routing