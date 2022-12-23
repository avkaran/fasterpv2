import React, { useState, useEffect, useContext } from "react";
import { useNavigate,useParams } from "react-router-dom";
import PsContext from "../../../context";
import dayjs from "dayjs";
const MyAdminProfile = (props) => {
  const context = useContext(PsContext);
const {userId}=useParams();
  const navigate = useNavigate();

  useEffect(() => {
    var role = context.adminUser(userId).role;
    if (role === "employee" || role === "admin")
      navigate("/" + userId + "/admin/myaccounts/employee-profile");
    else if (role === "broker")
    navigate("/" + userId + "/admin/myaccounts/broker-profile");
    else if (role === "franchise")
    navigate("/" + userId + "/admin/myaccounts/franchise-profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>test</>;
};
export default MyAdminProfile;
