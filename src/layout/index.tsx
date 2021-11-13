import * as React from 'react';
import {
  Outlet, useLocation, useNavigate
} from "react-router-dom";
import ProLayout, { PageContainer, ProSettings, SettingDrawer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import AvatarDropdown from '../components/avatar_dropdown';


export interface ILayoutProps {
}

export default function Layout(props: ILayoutProps) {

	let navigate = useNavigate();
  let location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    title: "DHK",
    // layout: "mix",
    contentWidth: "Fluid",
    navTheme: "dark",
    iconfontUrl: "//at.alicdn.com/t/font_2623101_o7ixfzs8qo.js",
  });

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  return (
    <div style={{
      height: '100vh',
    }}>

      <ProLayout
        route={{
          path: "/console",
          routes: [
            {
              path: "/console/welcome",
              name: "欢迎",
              icon: "icon-smart",
            },
            {
              path: "/console/file",
              name: "文件",
              icon: "icon-smart",
            }
          ]
        }}
        location={{
          pathname,
        }}
        headerContentRender={() => (
          <h1 style={{ fontWeight: "bold" }}>管理系统</h1>
        )}

        menuFooterRender={(props) => {
          return (
            <div
              style={{
                lineHeight: '48rpx',
                display: 'flex',
                height: 48,
                color: 'rgba(255, 255, 255, 0.65)',
                alignItems: 'center',
              }}
            >
              <img
                alt="pro-logo"
                src="https://procomponents.ant.design/favicon.ico"
                style={{
                  width: 16,
                  height: 16,
                  margin: '0 16px',
                  marginRight: 10,
                }}
              />
              {!props?.collapsed && 'DHK'}
            </div>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              navigate(item.path!);
              setPathname(item.path!);
            }}
          >
            {dom}
          </a>
        )}
        rightContentRender={() => (
          <div style={{ display: 'flex' }}>
            <AvatarDropdown />
          </div>
        )}
        {...settings}
      >
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </div>
  );
}
