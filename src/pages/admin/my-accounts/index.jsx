import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PsContext from "../../../context";
import moment from "moment";
const MyAdminProfile = (props) => {
  const context = useContext(PsContext);
  const navigate = useNavigate();

  useEffect(() => {
    var role = context.adminUser(props.match.params.userId).role;
    if (role === "employee" || role === "admin")
      navigate("/" + props.match.params.userId + "/admin/myaccounts/employee-profile");
    else if (role === "broker")
    navigate("/" + props.match.params.userId + "/admin/myaccounts/broker-profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>test</>;
};
export default MyAdminProfile;
