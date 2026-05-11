import { useState } from 'react';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { sendOtpApi, resetPasswordWithOtpApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [emailCache, setEmailCache] = useState(``);

    const onSendOtp = async (values) => {
        const { email } = values;
        const res = await sendOtpApi(email);
        
        if (res && res.EC === 0) {
            setEmailCache(email);
            setStep(2);
            notification.success({
                message: `HỆ THỐNG OTP`,
                description: res.EM
            });
        } else {
            notification.error({
                message: `LỖI HỆ THỐNG`,
                description: res?.EM
            });
        }
    };

    const onResetPassword = async (values) => {
        const { otp, newPassword } = values;
        const res = await resetPasswordWithOtpApi(emailCache, otp, newPassword);
        
        if (res && res.EC === 0) {
            notification.success({
                message: `CẬP NHẬT MẬT KHẨU`,
                description: res.EM
            });
            navigate(`/login`);
        } else {
            notification.error({
                message: `LỖI XÁC THỰC`,
                description: res?.EM
            });
        }
    };

    return (
        <Row justify={`center`} style={{ marginTop: `30px` }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{ padding: `15px`, margin: `5px`, border: `1px solid #ccc`, borderRadius: `5px` }}>
                    <legend>Khôi Phục Mật Khẩu</legend>
                    
                    {step === 1 && (
                        <Form name={`sendOtpForm`} onFinish={onSendOtp} layout={`vertical`}>
                            <Form.Item label={`Email định danh`} name={`email`} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type={`primary`} htmlType={`submit`}>Gửi mã OTP</Button>
                            </Form.Item>
                        </Form>
                    )}

                    {step === 2 && (
                        <Form name={`resetPasswordForm`} onFinish={onResetPassword} layout={`vertical`}>
                            <Form.Item label={`Mã OTP`} name={`otp`} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={`Mật khẩu mới`} name={`newPassword`} rules={[{ required: true }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type={`primary`} htmlType={`submit`}>Xác nhận thay đổi</Button>
                            </Form.Item>
                        </Form>
                    )}

                    <Link to={`/login`}><ArrowLeftOutlined /> Trở về trang đăng nhập</Link>
                </fieldset>
            </Col>
        </Row>
    )
}
export default ForgotPasswordPage;