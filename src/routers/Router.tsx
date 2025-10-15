"use client";

import { Login } from "@/screens";
import { AuthModel, authSelector } from "@/store/reducers/auth-reducer";
import { addAuth, removeAuth } from "@/store/reducers/auth-reducer";
import { Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import handleAPI from "@/apis/handleAPI";
import { API_NAME } from "@/apis/apiName";
import { FooterComponent, HeaderComponent, SiderComponent } from "@/components";

const Router = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const auth: AuthModel = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userInfoString = localStorage.getItem("userInfo");

      if (!accessToken || !userInfoString) {
        dispatch(removeAuth(null));
        return;
      }

      const storedUserInfo = JSON.parse(userInfoString);
      console.log("Stored user info:", storedUserInfo);

      if (!auth || !auth._id) {
        const userData = {
          _id: storedUserInfo._id,
          email: storedUserInfo.email,
          name: storedUserInfo.name,
          role: storedUserInfo.role,
          isTwoFactorEnabled: storedUserInfo.isTwoFactorEnabled,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        dispatch(addAuth(userData));
      }

      const response = await handleAPI(API_NAME.users.getMe);
      console.log("Check login response:", response);

      if (response && response._id) {
        const freshUserData = {
          _id: response._id,
          email: response.email,
          name: response.name,
          role: response.role,
          isTwoFactorEnabled: response.isTwoFactorEnabled,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        console.log("Fresh user data:", freshUserData);

        dispatch(addAuth(freshUserData));
       
      }
    } catch (error: any) {
      console.error("Authentication failed:", error.message);

      sessionStorage.clear();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      dispatch(removeAuth(null));
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Spin size="large" />
    </div>
  ) : auth && auth._id && auth.accessToken ? (
    <Layout style={{ minHeight: "100vh" }} className="bg-light">
      <HeaderComponent />
      <Layout>
        <SiderComponent />
        <Layout.Content>
          <div className="main-container">
            <div className="container-fluid " style={{ paddingTop: "80px" }}>
              {children}
            </div>
          </div>
        </Layout.Content>
      </Layout>
      <FooterComponent />
    </Layout>
  ) : (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Login />
    </div>
  );
};

export default Router;
