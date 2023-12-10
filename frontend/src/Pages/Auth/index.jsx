import React, { useEffect, useState } from "react";
import "./auth.scss";
import { Col, Form, Input, Row, Spin, message } from "antd";
import { Logo, TradingHome } from "../../assets";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../Redux/Reducers/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [signUp, setSignUp] = useState("login");
  const [nextPage, setNextPage] = useState(0);
  const [loading, setLoading] = useState(false);
  //   const [disable, setDisable] = useState(true);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const mobileResponsive = useMediaQuery({
    query: "(max-width: 900px)",
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const handleSendCode = async (e) => {
    setNextPage(1);

    try {
      setLoading(true);

      let phone = `+880${phoneNumber}` // TODO: later delete this +88
      const response = await fetch(`${baseUrl}/api/v1/auth/signup/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      });

      const responseData = await response.json();
      console.log(responseData)
      if (responseData?.message) {
        setNextPage(1);
        formHandler()
        message.success("OTP send successfully please check your inbox");
      } else {
        message.error("Failed to Send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
    setLoading(false);
  };


  const formHandler = () => {
    setLoading(true);
    const formData = {
      phoneNumber: `+880${phoneNumber}`,
      code,
    };

    fetch(`${baseUrl}/api/v1/auth/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data?.success) {
          message.success(data?.message);
          form.resetFields();
          message.success(data?.message);
          dispatch(setToken(data?.token));
          dispatch(setUser(data?.user));
          localStorage.setItem("tradingToken", data?.token);
          navigate("/profile");
          window.location.href = "/profile";
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error('Invalid OTP or time expired')
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      country: "+234",
    });
  }, []);

  return (
    <Row style={{ height: "100vh" }}>
      {!mobileResponsive && (
        <Col span={12}>
          <img
            style={{ cursor: "pointer" }}
            src={TradingHome}
            width="100%"
            height="100%"
          />
        </Col>
      )}
      <Col span={mobileResponsive ? 24 : 12}>
        <div className="auth-box">
          <div className="auth-fields">
            <Spin spinning={loading}>
              <Form form={form} layout="vertical">
                {signUp == "login" && (
                  <Row gutter={20}>
                    <div id="recaptcha-container"></div>
                    <Col span={24}>
                      <img
                        onClick={() => navigate("/market")}
                        src={Logo}
                        style={{ cursor: "pointer" }}
                        width="150px"
                        alt=""
                      />
                    </Col>
                    <Col span={24}>
                      <h2> {nextPage === 0 ? "Login or Create a New Account" : "Enter OTP"} </h2>
                    </Col>

                    {nextPage === 0 ? (
                      <>
                        <Col span={mobileResponsive ? 6 : 4}>
                          <Form.Item name="country" label=" ">
                            <Input disabled className="ant-input-affix-wrapper" />
                          </Form.Item>
                        </Col>

                        <Col span={mobileResponsive ? 18 : 20}>
                          <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[{ required: true }]}
                          >
                            <Input
                              type="number"
                              className="ant-input-affix-wrapper"
                              placeholder="1 XXX XXXX"
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <button
                            // disabled={} TODO:
                            type="button"
                            onClick={() => {
                              handleSendCode()
                            }}
                            style={{ width: "100%" }}
                          >
                            Get OTP via SMS
                          </button>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col span={24}>
                          <Form.Item
                            name="password"
                            label="OTP"
                          // rules={[{ required: true }]}
                          >
                            <Input
                              onChange={(e) => setCode(e.target.value)}
                              className="ant-input-affix-wrapper"
                              placeholder="Enter valid otp"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item label=" ">
                            <button
                              disabled={!code}
                              onClick={() => formHandler()}
                              type="button"
                              style={{ width: "100%" }}
                            >
                              Verify OTP
                            </button>
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </Row>
                )}
                {/* {signUp == "signUp" && (
                  <Row gutter={20}>
                    <Col span={24}>
                      <img
                        onClick={() => navigate("/market")}
                        src={Logo}
                        style={{cursor:"pointer"}}
                        width="150px"
                        alt=""
                      />
                    </Col>
                    <Col span={24}>
                      <h2>Create New Account</h2>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true }]}
                      >
                        <Input
                          className="ant-input-affix-wrapper"
                          placeholder="Enter Full Name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[{ required: true }]}
                      >
                        <Input
                          className="ant-input-affix-wrapper"
                          placeholder="Enter Email"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true }]}
                      >
                        <Input.Password
                          className="ant-input-affix-wrapper"
                          placeholder="Enter Email"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="mobile"
                        label="Phone Number"
                        rules={[{ required: true }]}
                      >
                        <Input
                          type="number"
                          className="ant-input-affix-wrapper"
                          placeholder="Enter Mobile Number"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <button type="submit" style={{ width: "100%" }}>
                        Sign Up
                      </button>
                    </Col>
                  </Row>
                )} */}
              </Form>
            </Spin>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
