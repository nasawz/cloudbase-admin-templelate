import * as React from "react";
import { Avatar, Menu, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./index.module.less";
import HeaderDropdown from "../header_dropdown";

import { useUser } from "../../hook/useUser";

export interface IAvatarDropdownProps {}

export default function AvatarDropdown(props: IAvatarDropdownProps) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]}>
      {/* <Menu.Item key="settings">
        <SettingOutlined />
        修改密码
      </Menu.Item> */}
      {/* <Menu.Divider /> */}
      <Menu.Item
        key="logout"
        onClick={() => {
          logout();
          navigate('/login',{replace:true});
          
        }}
      >
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
        <Avatar
          shape="square"
          size="small"
          className={styles.avatar}
          icon={<UserOutlined />}
        />
        <span className={`${styles.name} anticon`}>{user.nickName}</span>
      </span>
    </HeaderDropdown>
  );
}
