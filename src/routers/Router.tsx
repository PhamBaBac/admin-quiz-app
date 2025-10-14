"use client";
import FooterComponent from "@/components/FooterComponent";
import HeaderComponent from "@/components/HeaderComponent";
import { AuthModel, authSelector } from "@/store/reducers/auth-reducer";
import { Spin } from "antd";
import { Footer } from "antd/es/layout/layout";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Router = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const auth: AuthModel = useSelector(authSelector);
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    setIsLoading(true);
    try {
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return isLoading ? (
    <div className="container py-5 text-center">
      <Spin />
    </div>
  ) : auth && auth._id && auth.accessToken ? (
    <>
      <HeaderComponent />
      <div className="main-container">
        <div className="container-fluid mt-5">{children}</div>
      </div>
      <FooterComponent />
    </>
  ) : (
    <div>Please log in</div>
  );
};

export default Router;
