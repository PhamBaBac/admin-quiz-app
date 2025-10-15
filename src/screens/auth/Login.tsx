'use client';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Steps,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import handleAPI from "@/apis/handleAPI";
import { API_NAME } from "@/apis/apiName";
import { useDispatch, useSelector } from "react-redux";
import {
  addAuth,
} from "@/store/reducers/auth-reducer";
import { TwoFactorInput } from "@/components";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Login form, 1: 2FA verification
  const [pendingUser, setPendingUser] = useState<any>(null);
  console.log("Pending user data:", pendingUser); // Store user data after first step
  const [verificationCode, setVerificationCode] = useState("");
  const [loginForm] = Form.useForm();

  const dispatch = useDispatch();
  const router = useRouter();

  const steps = [
    {
      title: "Đăng nhập",
      icon: <UserOutlined />,
    },
    {
      title: "Xác thực 2FA",
      icon: <SafetyOutlined />,
    },
  ];

  const onFinish = async (values: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    setLoading(true);

    try {
      const loginPayload = {
        email: values.email,
        password: values.password,
      };

      const response = await handleAPI(
        API_NAME.auth.login,
        loginPayload,
        "post"
      );

      if (response.isTwoFactorRequired) {
        setPendingUser({
          userId: response.userId,
          email: values.email,
          remember: values.remember,
        });
        setCurrentStep(1);
        message.info("Vui lòng nhập mã xác thực từ ứng dụng Authenticator!");
      } else if (response.user) {
        completeLogin(response.user, values.remember);
      } else {
        message.error("Response không hợp lệ từ server!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      message.error(error || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const onVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      message.error("Vui lòng nhập mã xác thực 6 số!");
      return;
    }

    setLoading(true);
    try {
      const response = await handleAPI(
        API_NAME.auth.tfaVerify,
        {
          email: pendingUser.email, 
          token: verificationCode,
        },
        "post"
      );

      if (response?.user) {
        completeLogin(response.user, pendingUser.remember);
        message.success("Xác thực thành công! Chào mừng bạn!");
      } else {
        message.error("Mã xác thực không chính xác!");
      }
    } catch (error: any) {
      console.error("2FA verification error:", error);
      message.error(error || "Mã xác thực không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (userData: any, remember?: boolean) => {
    const userInfo = {
      _id: userData._id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isTwoFactorEnabled: userData.isTwoFactorEnabled,
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
    };

    // Save to localStorage
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("accessToken", userInfo.accessToken);
    localStorage.setItem("refreshToken", userInfo.refreshToken);

    // Save remember preference
    if (remember) {
      localStorage.setItem("rememberMe", "true");
    }

    // Update Redux store
    dispatch(addAuth(userInfo));
    //chuyen sang trang dashboard
     router.push("/");

    message.success("Đăng nhập thành công!");
  };

  // Back to login form
  const backToLogin = () => {
    setCurrentStep(0);
    setPendingUser(null);
    setVerificationCode("");
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <Card className="my-5 shadow-sm" style={{ borderRadius: "12px" }}>
              <Typography.Title
                level={3}
                className="text-center mb-4"
                style={{ color: "#1890ff" }}
              >
                {currentStep === 0 ? "Đăng Nhập Hệ Thống" : "Xác Thực Bảo Mật"}
              </Typography.Title>

              {/* Steps indicator when 2FA is required */}
              {pendingUser?.isTwoFactorEnabled && (
                <Steps
                  current={currentStep}
                  items={steps}
                  className="mb-4"
                  size="small"
                />
              )}

              {/* Step 1: Login Form */}
              {currentStep === 0 && (
                <Form
                  form={loginForm}
                  name="login"
                  onFinish={onFinish}
                  layout="vertical"
                  size="large"
                  requiredMark={false}
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      {
                        validator: async (_, value) => {
                          if (!value || value.trim() === "") {
                            return Promise.reject(
                              new Error("Email không được để trống!")
                            );
                          }
                          if (!/\S+@\S+\.\S+/.test(value)) {
                            return Promise.reject(
                              new Error("Email không hợp lệ!")
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nhập email của bạn"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                      {
                        validator: async (_, value) => {
                          if (!value || value.trim() === "") {
                            return Promise.reject(
                              new Error("Mật khẩu không được để trống!")
                            );
                          }
                          const regex =
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                          if (!regex.test(value)) {
                            return Promise.reject(
                              new Error(
                                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
                              )
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <a href="#" className="text-primary text-decoration-none">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="w-100"
                      size="large"
                      style={{
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                        border: "none",
                      }}
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </Form.Item>
                </Form>
              )}

              {/* Step 2: 2FA Verification */}
              {currentStep === 1 && (
                <TwoFactorInput
                  verificationCode={verificationCode}
                  onVerificationCodeChange={setVerificationCode}
                  onSubmit={onVerify2FA}
                  onBack={backToLogin}
                  loading={loading}
                  title="Xác thực bảo mật hai lớp"
                  description="Nhập mã 6 số từ ứng dụng Google Authenticator hoặc Authy của bạn:"
                  showBackButton={true}
                  submitButtonText="Đăng nhập"
                />
              )}

              {/* Register link */}
              {currentStep === 0 && (
                <div className="text-center mt-3">
                  <Typography.Text className="text-muted">
                    Chưa có tài khoản?{" "}
                    <a
                      href="#"
                      className="text-primary text-decoration-none fw-bold"
                    >
                      Đăng ký ngay
                    </a>
                  </Typography.Text>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
