/** @format */

"use client";

import { AuthModel, authSelector } from "@/store/reducers/auth-reducer";
import { Affix, Layout, Menu, MenuProps } from "antd";
import { MenuItemType } from "antd/es/menu/interface";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const router = useRouter();
  const auth: AuthModel = useSelector(authSelector);

  const isAdmin = auth && auth.role === "admin";

  const menus: MenuItem[] = [
    {
      key: "/",
      label: "Bảng điều khiển",
      disabled: !isAdmin,
    },
    {
      key: "/bai-kiem-tra",
      label: "Bài kiểm tra",
    },
    {
      key: "/cau-hoi",
      label: "Câu hỏi",
    },
    // {
    //   key: "/hoc-sinh",
    //   label: "Học sinh",
    // },
    {
      key: "/giang-vien",
      label: "Giảng viên",
    //   disabled: !isAdmin,
    },
    {
      key: "/cai-dat",
      label: "Cài đặt",
    //   disabled: !isAdmin,
    },
  ];

  return (
    <Affix offsetTop={0}>
      <Sider
        style={{
          minHeight: "100vh",
        }}
        className="pt-5 px-1"
        breakpoint="sm"
        collapsedWidth="0"
        width={280}
      >
        <Menu
          onClick={(e) => {
            router.push(e.key);
          }}
          theme="dark"
          mode="inline"
          style={{ height: "100%", borderRight: 0 }}
          items={menus}
        />
      </Sider>
    </Affix>
  );
};

export default SiderComponent;
