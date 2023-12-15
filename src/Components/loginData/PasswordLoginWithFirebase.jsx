// PasswordLoginWithFirebase.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import RegisterAndLogin from "./RegisterAndLogin";
import Hme from "./Hme";
import ForgotPassword from "./ForgotPassword";

function PasswordLoginWithFirebase() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<RegisterAndLogin />} />
        <Route path="/home/*" element={<Hme />} />
        <Route path="/reset/*" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default PasswordLoginWithFirebase;
