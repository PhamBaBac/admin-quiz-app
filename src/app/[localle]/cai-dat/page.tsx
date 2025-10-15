"use client";
import { addAuth, authSelector } from "@/store/reducers/auth-reducer";
import { Card, Switch, Modal, message, Divider, Button } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import handleAPI from "@/apis/handleAPI";
import { API_NAME } from "@/apis/apiName";
import { Qr2faModal } from "@/modals";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const Settings = () => {
  const [enable, setEnable] = useState(false);
  const [enableQrModal, setEnableQrModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth?.isTwoFactorEnabled !== undefined) {
      setEnable(auth.isTwoFactorEnabled);
    }
  }, [auth?.isTwoFactorEnabled]);

  const onChange = async (checked: boolean) => {
    if (checked && !auth?.isTwoFactorEnabled) {
      setEnableQrModal(true);
    } else if (!checked && auth?.isTwoFactorEnabled) {
      Modal.confirm({
        title: "Tắt bảo mật hai lớp",
        content:
          "Bạn có chắc chắn muốn tắt bảo mật hai lớp? Điều này sẽ làm giảm tính bảo mật của tài khoản.",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: () => disable2FA(),
      });
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      const response = await handleAPI(API_NAME.auth.disable2fa, {}, "post");

      if (response?.success) {
        setEnable(false);

        const updatedAuth = {
          ...auth,
          isTwoFactorEnabled: false,
        };
        dispatch(addAuth(updatedAuth));
        localStorage.setItem("userInfo", JSON.stringify(updatedAuth));
        sessionStorage.setItem("userInfo", JSON.stringify(updatedAuth));

        message.success("Đã tắt bảo mật hai lớp!");
      }
    } catch (error: any) {
      message.error("Không thể tắt bảo mật hai lớp!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEnableQrModal(false);
  };

  const handleSuccess = (enabled: boolean) => {
    setEnable(enabled); // Update switch state ngay lập tức
    setEnableQrModal(false); // Đóng modal
  };

  return (
    <>
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6 offset-md-3">
              <Card
                className="my-5 shadow-sm"
                style={{ borderRadius: "12px" }}
                title="Cài đặt bảo mật"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5>Bảo mật hai lớp (2FA)</h5>
                    <p className="mb-0 text-muted">
                      Kích hoạt bảo mật hai lớp để tăng cường an toàn cho tài
                      khoản của bạn.
                    </p>
                    {enable && (
                      <small className="text-success">
                        ✓ Bảo mật hai lớp đã được kích hoạt
                      </small>
                    )}
                  </div>
                  <div>
                    <Switch
                      checked={enable}
                      onChange={onChange}
                      loading={loading}
                      checkedChildren="Bật"
                      unCheckedChildren="Tắt"
                    />
                  </div>
                </div>
                <Divider />
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5>Đăng xuất</h5>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        localStorage.removeItem("userInfo");
                        sessionStorage.removeItem("userInfo");
                        router.push("/");
                      }}
                    >
                      {<LogoutOutlined />}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Qr2faModal
        open={enableQrModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Settings;
