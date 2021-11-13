import * as React from 'react';
import { useUser } from '../hook/useUser';
import { createForm } from '@formily/core'
import { Field } from '@formily/react'
import { Form, FormItem, Input, Password, Submit } from '@formily/antd'

import { Tabs, Card, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import 'antd/lib/form/style/index.less';
import 'antd/lib/input/style/index.less';
import { useLocation, useNavigate } from 'react-router-dom';

export interface ILoginProps {
}

const normalForm = createForm({
	validateFirst: true,
})

export default function Login(props: ILoginProps) {


	let navigate = useNavigate();
	let location = useLocation();

	const { login, loading } = useUser();
	let from = location.state?.from?.pathname || "/";

	const onSubmit = (data) => {
		login(data.username, data.password, (err, u) => {

			if (!err) {
				message.info('登录成功');
				setTimeout(() => {
					navigate(from, { replace: true });
				}, 1000);
			} else {
				message.error(err.message);
			}
		});
	}

	return (
		<div style={{ backgroundColor: '#f7f7f7' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					padding: '40px 0',
					height: '100vh',
					background: 'url(https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png) no-repeat',
					backgroundSize: '100%'
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Card style={{ width: 400 }}>
						<Tabs style={{ overflow: 'visible', marginTop: -10 }}>
							<Tabs.TabPane key="1" tab="账密登录">
								<Form
									form={normalForm}
									layout="vertical"
									size="large"
									onAutoSubmit={onSubmit}
								>
									<Field
										name="username"
										title="用户名"
										required
										decorator={[FormItem]}
										component={[
											Input,
											{
												prefix: <UserOutlined />,
											},
										]}
									/>
									<Field
										name="password"
										title="密码"
										required
										decorator={[FormItem]}
										component={[
											Password,
											{
												prefix: <LockOutlined />,
											},
										]}
									/>
									<Submit block size="large" loading={loading}>
										登录
									</Submit>
								</Form>
							</Tabs.TabPane>

						</Tabs>
						{/* <div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<a href="#新用户注册">新用户注册</a>
						<a href="#忘记密码">忘记密码?</a>
					</div> */}
					</Card>
				</div>
				<div style={{
					width: '100%',
					height: '56px',
					background: '#fff',
					opacity: 0.6,
					position: 'absolute',
					bottom: 0
				}}>
					<div style={{
						width: '1200px',
						margin: '0 auto',
						padding: '9px 0'
					}}></div>
					<div style={{
						fontSize: '12px',
						color: '#666',
						textAlign: 'center'
					}}>
						<p>Copyright © 2021 DH</p>
					</div>
				</div>
			</div>
		</div>
	);
}
