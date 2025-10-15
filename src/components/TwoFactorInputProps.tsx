// components/TwoFactorInput.tsx

import React from "react";
import { Input, Button } from "antd";
import { MobileOutlined } from "@ant-design/icons";

interface TwoFactorInputProps {
  verificationCode: string;
  onVerificationCodeChange: (value: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  submitButtonText?: string;
  helpText?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

const TwoFactorInput: React.FC<TwoFactorInputProps> = ({
  verificationCode,
  onVerificationCodeChange,
  onSubmit,
  onBack,
  loading = false,
  title = "Nhập mã xác thực",
  description = "Nhập mã 6 số từ ứng dụng xác thực của bạn:",
  placeholder = "000000",
  showBackButton = false,
  backButtonText = "← Quay lại",
  submitButtonText = "Xác nhận",
  helpText = "Mã xác thực thay đổi mỗi 30 giây. Nếu mã hết hạn, hãy sử dụng mã mới.",
  autoFocus = true,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    onVerificationCodeChange(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && verificationCode.length === 6 && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="text-center">
      {title && <h6 className="mb-3">{title}</h6>}

      {description && <p className="text-muted mb-4">{description}</p>}

      <Input
        placeholder={placeholder}
        value={verificationCode}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        maxLength={6}
        size="large"
        className="text-center mb-4"
        style={{
          fontSize: "24px",
          letterSpacing: "8px",
          fontWeight: "bold",
          height: "60px",
        }}
        prefix={
          <MobileOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
        }
        autoFocus={autoFocus}
        disabled={disabled}
      />

      {helpText && (
        <div className="text-muted mb-4">
          <small>{helpText}</small>
        </div>
      )}

      <div
        className={
          showBackButton
            ? "d-flex justify-content-between"
            : "d-flex justify-content-center"
        }
      >
        {showBackButton && onBack && (
          <Button onClick={onBack} size="large" disabled={loading}>
            {backButtonText}
          </Button>
        )}

        <Button
          type="primary"
          onClick={onSubmit}
          loading={loading}
          disabled={verificationCode.length !== 6 || disabled}
          size="large"
          style={showBackButton ? {} : { minWidth: "120px" }}
        >
          {loading ? "Đang xác thực..." : submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default TwoFactorInput;
