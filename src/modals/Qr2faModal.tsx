import React, { useState, useEffect } from "react";
import { Modal, Steps, Button, Input, QRCode, message } from "antd";
import {
  SafetyOutlined,
  MobileOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import handleAPI from "@/apis/handleAPI";
import { API_NAME } from "@/apis/apiName";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSelector } from "@/store/reducers/auth-reducer";
import { TwoFactorInput } from "@/components";

interface Qr2faModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (enabled: boolean) => void; 
}

const Qr2faModal: React.FC<Qr2faModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [qrCodeData, setQrCodeData] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  const steps = [
    {
      title: "Quét mã QR",
      icon: <SafetyOutlined />,
    },
    {
      title: "Nhập mã xác thực",
      icon: <MobileOutlined />,
    },
    {
      title: "Hoàn thành",
      icon: <CheckCircleOutlined />,
    },
  ];

  useEffect(() => {
    if (open && !auth?.isTwoFactorEnabled) {
      generateQRCode();
    }
  }, [open]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const response = await handleAPI(
        API_NAME.auth.generateSecret,
        {},
        "post"
      );
      if (response?.uri) {
        setQrCodeData(response.uri);
        message.success("Đã tạo mã QR thành công!");
      } else if (response?.qrCodeUrl) {
        setQrCodeData(response.qrCodeUrl);
        message.success("Đã tạo mã QR thành công!");
      } else {
        message.error("Không nhận được dữ liệu QR từ server!");
      }
    } catch (error: any) {
      message.error("Không thể tạo mã QR. Vui lòng thử lại!");
      console.error("Generate QR error:", error);
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      message.error("Vui lòng nhập mã xác thực 6 số!");
      return;
    }

    setLoading(true);
    try {
      const response = await handleAPI(
        API_NAME.auth.verify2fa,
        { token: verificationCode },
        "post"
      );

      if (response?.success) {
        setCurrentStep(2);

        const updatedAuth = {
          ...auth,
          isTwoFactorEnabled: true,
        };
        dispatch(addAuth(updatedAuth));
        localStorage.setItem("userInfo", JSON.stringify(updatedAuth));
        sessionStorage.setItem("userInfo", JSON.stringify(updatedAuth));

        message.success("Đã bật bảo mật hai lớp thành công!");

        onSuccess?.(true);

        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        message.error("Không thể kích hoạt 2FA!");
      }
    } catch (error: any) {
      message.error(error.message || "Mã xác thực không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setQrCodeData("");
    setVerificationCode("");
    onClose();
  };

  return (
    <>
      <Modal
        title="Thiết lập bảo mật hai lớp"
        open={open}
        onCancel={handleClose}
        width={550}
        footer={null}
        destroyOnClose
        centered
        maskClosable={false}
        zIndex={10000}
      >
        <Steps
          current={currentStep}
          items={steps}
          className="mb-4"
          size="small"
        />

        {currentStep === 0 && (
          <div className="text-center">
            <h6 className="mb-3">Bước 1: Quét mã QR bằng ứng dụng xác thực</h6>
            <p className="text-muted mb-4">
              Sử dụng <strong>Google Authenticator</strong>,{" "}
              <strong>Authy</strong> hoặc ứng dụng xác thực tương tự để quét mã
              QR bên dưới:
            </p>

            {qrCodeData ? (
              <div className="d-flex justify-content-center mb-4">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <QRCode
                    value={qrCodeData}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Đang tạo...</span>
                </div>
                <p className="text-muted">Đang tạo mã QR...</p>
              </div>
            )}

            {qrCodeData && (
              <div className="alert alert-info mt-4 text-start">
                <small>
                  <strong>
                    <SafetyOutlined
                      style={{ color: "#1890ff", marginRight: 4 }}
                    />{" "}
                    Lưu ý:{" "}
                  </strong>
                  <span style={{ color: "red" }}>
                    Nếu bạn đã quét mã QR trước đó, hãy xóa tài khoản cũ trong
                    ứng dụng xác thực trước khi quét lại.
                  </span>
                  <br />
                  <strong>
                    <MobileOutlined
                      style={{ color: "#1890ff", marginRight: 4 }}
                    />{" "}
                    Hướng dẫn:
                  </strong>
                  <br />
                  1. Mở ứng dụng Authenticator trên điện thoại
                  <br />
                  2. Chọn "+" hoặc "Thêm tài khoản"
                  <br />
                  3. Quét mã QR này
                  <br />
                  4. Tài khoản "QuizApp" sẽ xuất hiện với mã 6 số
                </small>
              </div>
            )}

            <div className="mt-4 d-flex justify-content-between">
              <Button onClick={handleClose} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => setCurrentStep(1)}
                disabled={!qrCodeData}
                icon={<MobileOutlined />}
              >
                Đã quét xong, tiếp tục
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <TwoFactorInput
            verificationCode={verificationCode}
            onVerificationCodeChange={setVerificationCode}
            onSubmit={enable2FA}
            onBack={() => setCurrentStep(0)}
            loading={loading}
            title="Bước 2: Nhập mã xác thực"
            showBackButton={true}
            submitButtonText="Xác nhận"
          />
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <CheckCircleOutlined
              style={{ fontSize: "60px", color: "#52c41a" }}
              className="mb-4"
            />
            <h5 className="text-success mb-3">🎉 Thiết lập thành công!</h5>

            <div className="alert alert-success mb-4">
              <p className="mb-2">
                <strong>Bảo mật hai lớp đã được kích hoạt!</strong>
              </p>
              <small className="text-muted">
                Từ giờ, bạn sẽ cần nhập mã xác thực khi đăng nhập để đảm bảo an
                toàn tài khoản.
              </small>
            </div>

            <div className="alert alert-warning">
              <small>
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <br />
                • Giữ điện thoại có ứng dụng Authenticator an toàn
                <br />
                • Sao lưu mã khôi phục nếu có
                <br />• Liên hệ admin nếu mất quyền truy cập
              </small>
            </div>

            <Button
              type="primary"
              size="large"
              onClick={handleClose}
              icon={<CheckCircleOutlined />}
            >
              Hoàn thành
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Qr2faModal;
