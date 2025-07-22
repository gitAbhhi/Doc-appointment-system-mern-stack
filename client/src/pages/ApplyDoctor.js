import React, { useState } from 'react'
import Layout from "./../components/Layout"
import { Col, Form, Input, Row, TimePicker, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { showLoading, hideLoading } from '../redux/features/alertSlice'
import axios from 'axios'
// import moment from "moment";

const ApplyDoctor = () => {
    const { user } = useSelector(state => state.user)
    const [uploadimage, setUploadimage] = useState(null);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    //handle form
    const handleFinish = async (values) => {
        try {
            // values.preventDefault();
            dispatch(showLoading())

            // if (!uploadimage) {
            //     return message.error("Please select an image to upload.");
            // }
            const formData = new FormData();
            // formData.append("profileImage", uploadimage);

            // Append all other form fields
            formData.append("userId", user._id);
            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("phone", values.phone);
            formData.append("email", values.email);
            formData.append("website", values.website);
            formData.append("address", values.address);
            formData.append("specialization", values.specialization);
            formData.append("experience", values.experience);
            formData.append("feesPerCunsaltation", values.feesPerCunsaltation);
            formData.append("timings", values.timings[0]);
            formData.append("timings", values.timings[1]);
            formData.append("userInfo",JSON.stringify(user))
            
            console.log(values)
            const res = await axios.post("/api/v1/user/apply-doctor",

                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate("/");
            }
            else {
                message.error(res.data.success);
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something went wrong')
        }
    };
    return (
        <Layout>
            <h1 className='text-center'>Apply Doctor</h1>
            <Form layout='vertical' onFinish={handleFinish} className='m-3'>
                <h4>Personal Details :</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your First name' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your Last name' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Phone No"
                            name="phone"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your contact no' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Email"
                            name="email"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your email address' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Website"
                            name="website"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your website' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Address"
                            name="address"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your clinic address' />
                        </Form.Item>
                    </Col>
                </Row>

                <h4>Professenol Details :</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Specialization"
                            name="specialization"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your specialization ' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Experience"
                            name="experience"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your  experience' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="FeesPerCunsaltation"
                            name="feesPerCunsaltation"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input type='text' placeholder='your fees Per Cunsaltation' />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Timings"
                            name="timings"
                            required
                        // rules={[{ required: true }]}
                        >
                            <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}>
                        {/* <Form.Item>

                            <input type="file" className="profileImage" name="profileImage" onChange={(e) => {
                                console.log("vlaue ", e)
                                setUploadimage(e.target.files[0])
                            }} />
                        </Form.Item> */}
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <button className='btn btn-primary form-btn' type='submit'>Submit</button>
                    </Col>

                </Row>
            </Form>
        </Layout>
    )
}

export default ApplyDoctor
