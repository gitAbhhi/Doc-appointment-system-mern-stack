import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";

const Profile = () => {
    const { user } = useSelector((state) => state.user)
    const [doctor, setDoctor] = useState(null)
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [timePickerValue, setTimePickerValue] = useState(null);


    //handle form
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading())
            console.log("values ", values)
            console.log("userid ", user._id)

            console.log(values.timings[0], values.timings[1])
            const formData = new FormData();

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
            const res = await axios.post("/api/v1/doctor/updateProfile",
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
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something went wrong')
        }
    };

    //get doc details
    const getDoctorInfo = async () => {
        try {
            const res = await axios.post('/api/v1/doctor/getDoctorInfo',
                { userId: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
            if (res.data.success) {
                setDoctor(res.data.data)
            }

        } catch (error) {
            console.log(error)
        }
    }




    useEffect(() => {
        getDoctorInfo();
        //eslint-disable-next-line
    }, [])
    return (
        <Layout>
            <h1 className='text-center'>Manange Profile</h1>
            {
                doctor && (
                    <Form layout='vertical' onFinish={handleFinish} className='m-3' initialValues={{
                        ...doctor
                        // ,
                        // timings: doctor.timings ? [
                        //     moment(doctor.timings[0], 'HH:mm'), // Assuming your database stores timings in HH:mm format
                        //     moment(doctor.timings[1], 'HH:mm'),
                        //   ] : null,
                        // timings:[
                        // //     // doctor.timings[0],doctor.timings[1]
                        //     moment(doctor.timings[0]).format('HH:mm'),
                        //     moment(doctor.timings[1]).format('HH:mm')
                        // ],
                        ,
                        timings: [
                            // moment(doctor.timings[0], 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
                            moment(doctor.timings[0]).local(),
                            moment(doctor.timings[1]).local()
                            // moment(doctor.timings[1], 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
                            // moment(doctor.timings[0]).format('HH:mm'),
                            //     moment(doctor.timings[1]).format('HH:mm')
                        ],
                    }}>
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
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker.RangePicker format="HH:mm" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24} lg={8}>
                                
                            </Col>
                            <Col xs={24} md={24} lg={8}>
                                <button className='btn btn-primary form-btn' type='submit'>Update</button>
                            </Col>
                        </Row>
                    </Form>)}
        </Layout>
    );
};

export default Profile
