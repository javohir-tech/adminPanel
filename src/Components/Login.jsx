import React, { useEffect } from 'react'
import './Login.css'
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem('access_token')){
            navigate("/")
        }
    }, []);
    const onFinish = (values) => {
       axios({
        url:'https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin',
        method :'POST',
        data:values,
       }).then((res)=>{
        console.log(res)
        if(res.data.success){
            localStorage.setItem("access_token", res.data.data.tokens.accessToken.token)
            message.success("muvaffaqiyatli o'tdi tabriklaymiz")
            navigate("/Home")
        }
       }).catch((err)=>{
        message.error("Telefon raqam yoki Parol xato")
       })
    };

    return (
        <div className='box'>
            <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
            >
                <Form.Item
                    label="Telefon Raqami"
                    name="phone_number"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
