import { Card, Col, Form, Input, Modal, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import RenderLineChart from "../lineChart";
import "./chats.scss";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../Redux/Reducers/gernalSlice";

const TradingScreen = () => {
  const [sellAmount, setsellAmount] = useState("");
  let [number, setNumber] = useState("");
  const [active, setActive] = useState("yes");
  const [buyOrSell, setBuyOrSell] = useState("buy");
  const [outcomeBtn, setOutcomeBtn] = useState("yes");
  const [doller, setDoller] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [noBids, setNoBids] = useState([]);
  const [totalAmountYes, setTotalAmountYes] = useState(0);
  const [totalAmountNo, setTotalAmountNo] = useState(0);
  const [completeUserDetails, setCompleteUserDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedtradingShare, setSelectedtradingShare] = useState([]);


  // here are my states

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const token = useSelector((state) => state?.authReducer?.token);

  const userDetails = useSelector(
    (state) => state?.gernalReducer?.completeUser
  );

  console.log("This is theuserDetails = "+ userDetails?.amount);

  const [form] = Form.useForm();

  useEffect(() => {
    form?.setFieldValue({
      amout: number,
    });
  }, [number]);

  const mobileResponsive = useMediaQuery({
    query: "(max-width: 900px)",
  });

  const bidId = useParams();

  const formHandler = async () => {

    const formData = {
      bid: outcomeBtn,
      bidamount: doller,
      amount:
        outcomeBtn == "yes"
          ? chartData[chartData?.length - 1]?.bidamount || 0
          : noBids[noBids?.length - 1]?.bidamount || 0
    };

    if (doller && doller <= 100 && doller >= 10) {
      setLoading(true);

      fetch(`${baseUrl}/api/v1/admin/trading/bid/${bidId?.id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {

          setLoading(false);

          if (data.message) {
            message.success(data.message);

            navigate(`/trading-chart/${bidId?.id}`);
            form.resetFields();

            setDoller("");

            fetch(`${baseUrl}/api/v1/auth/user`, {
              method: "get",
              headers: {
                Authorization: token,
              },
            })
              .then((res) => res.json())
              .then((userData) => {
                dispatch(setUserDetails(userData?.data));
                getAllBids();
                //setIsModalOpen(false);
              })
              .catch((error) => {
                setLoading(false);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      message.warning(
        "Please enter an amount greater then 10 and less then or equal to 100"
      );
    }
  };

  const getAllBids = () => { 
    setTotalAmountYes(0);

    fetch(`${baseUrl}/api/v1/admin/trading/single/${bidId?.id}`, {
      method: "get",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        setCompleteUserDetails(userData?.data);

        setChartData(
          userData?.data?.bids?.filter((item) => item?.bid == "yes")
        );

        setIsModalOpen(false);
        // setSelectedtradingShare(userDetails?.length ? userDetails?.bids?.filter((item)=> item))
        setNoBids(userData?.data?.bids?.filter((item) => item?.bid == "no"));

        for (let i = 0; i < userData?.data?.bids?.length; i++) {
          if (userData?.data?.bids[i]?.bid == "yes") {
            setTotalAmountYes(
              (pre) => pre + parseInt(userData?.data?.bids[i]?.bidamount)
            );
          } else {
            setTotalAmountNo(
              (pre) => pre + parseInt(userData?.data?.bids[i]?.bidamount)
            );
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };


  useEffect(() => {
    getAllBids();
  }, [bidId?.id]);


  useEffect(() => {
    for (let i = 0; i < userDetails?.bids?.length; i++) {
      if (bidId?.id == userDetails?.bids[i]?.tradingId) {
        setSelectedtradingShare(userDetails?.bids[i]);
      }
    }
  }, [userDetails]);



  // Sell Amount
  const formSellHandler = async () => {

    const formData = {
      share: sellAmount,
      latestamount:
        outcomeBtn == "yes"
          ? chartData[chartData?.length - 1]?.bidamount || 0
          : noBids[noBids?.length - 1]?.bidamount || 0,
      oldamount: selectedtradingShare?.oldamount,
      bid: outcomeBtn,
    };

    if (
      selectedtradingShare?.share > 0 &&
      sellAmount <= selectedtradingShare?.share
    ) {
      setLoading(true);

      fetch(`${baseUrl}/api/v1/admin/trading/sell/${bidId?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.message) {
            message.success(data.message);
            navigate(`/trading-chart/${bidId?.id}`);
            form.resetFields();
            setDoller("");
            fetch(`${baseUrl}/api/v1/auth/user`, {
              method: "get",
              headers: {
                Authorization: token,
              },
            })
              .then((res) => res.json())
              .then((userData) => {
                dispatch(setUserDetails(userData?.data));
                getAllBids();
                setIsModalOpen(false);
              })
              .catch((error) => {
                setLoading(false);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      message.warning("Please enter valid share");
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

// ...........................................

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDoller(inputValue);
  };



  return (
    <Spin spinning={loading}>
      <Row
        style={mobileResponsive ? { marginTop: "20px" } : { marginTop: "50px" }}
        gutter={[20, 20]}
        className="wallet"
      >
        <Col span={24}>
          <p style={{ fontWeight: "600", fontSize: "20px" }}>
            {completeUserDetails?.title}
          </p>
        </Col>
        <Col span={24}>
          <div className="trading-cart">
            <p className="right-text1">
              Yes {chartData[chartData?.length - 1]?.bidamount || 0.0}
            </p>
            <p className="right-text2">
              No {noBids[noBids?.length - 1]?.bidamount || 0.0}
            </p>
          </div>
        </Col>
        <Col span={24} className="trading-yeschart">
          <button
            onClick={() => setActive("yes")}
            className={active == "yes" ? "yes activeButton" : "yes"}
          >
            Yes Chart
          </button>
          <button
            onClick={() => setActive("no")}
            className={active == "no" ? "yes activeButton" : "yes"}
          >
            No Chart
          </button>
          <button
            onClick={() => setActive("about")}
            className={active == "about" ? "about activeButton" : "about"}
          >
            About
          </button>
        </Col>
        {active == "yes" && (
          <Col span={mobileResponsive ? 24 : 16}>
            <RenderLineChart chartData={chartData} />
          </Col>
        )}
        {active == "no" && (
          <Col span={mobileResponsive ? 24 : 16}>
            <RenderLineChart chartData={noBids} type="no" />
          </Col>
        )}
        {active == "about" && (
          <Col span={mobileResponsive ? 24 : 16}>
            <Card>
              <h2>About the event</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>Total Amount Yes</p>
                <p>{totalAmountYes || 0}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>Total Amount No</p>
                <p>{totalAmountNo || 0}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ marginTop: "0px" }}>Number of Yes Bids</p>
                <p style={{ marginTop: "0px" }}>{chartData?.length || "0"}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ marginTop: "0px" }}>Number of No Bids</p>
                <p style={{ marginTop: "0px" }}>{noBids?.length || "0"}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ marginTop: "0px" }}>Closes on</p>
                <p
                  style={{ marginTop: "0px" }}
                >{`${completeUserDetails?.endDate} ${completeUserDetails?.endTime}`}</p>
              </div>
              <h3>Market Resolution</h3>
              <p>{completeUserDetails?.resolution}</p>
            </Card>
          </Col>
        )}

        {mobileResponsive ? (
          <Col span={24} style={{ 
            position: "fixed", 
            bottom: "10%", 
            zIndex: 100,
            width: "100%",
            padding: "0.4rem",
            borderTop: "1px solid #E5E5E5"
          }}>
            <div className="mobile-btns"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100% !important"
            }}>
              <button
                onClick={() => {
                  setOutcomeBtn("yes");
                  showModal();
                }}
                className={"outcome-yes"}
              >
                Buy Yes
              </button>
              <button
                onClick={() => {
                  setOutcomeBtn("no");
                  showModal();
                }}
                className={"outcome-no"}
              >
                Buy No
              </button>
            </div>
          </Col>
        ) : (
          <Col span={mobileResponsive ? 24 : 8}>
            <div className="wallet-right-side">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="trading-yeschart">
                  <button
                    onClick={() => setBuyOrSell("buy")}
                    className={buyOrSell == "buy" ? "yes activeButton" : "yes"}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setBuyOrSell("sell")}
                    className={buyOrSell == "sell" ? "yes activeButton" : "yes"}
                  >
                    Sell
                  </button>
                </div>
                <span>Market</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <p>Outcome</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setOutcomeBtn("yes")}
                    className={
                      outcomeBtn == "yes"
                        ? "outcome-yes active-outcome-yes"
                        : "outcome-yes"
                    }
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setOutcomeBtn("no")}
                    className={
                      outcomeBtn == "no"
                        ? "outcome-yes active-outcome-no"
                        : "outcome-yes"
                    }
                  >
                    No
                  </button>
                </div>
              </div>
              <p className="credits">
                Credits to be added (<b> ₦ </b>)
              </p>

              <Form layout="vertical" form={form}>
                {buyOrSell == "buy" ? (
                  <>
                    <Form.Item
                      name="amout"
                      label="Amount"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your amount",
                        },
                      ]}
                    >
                      {/* changing some values here */}
                      <Input
                        onChange={handleInputChange}
                        min={0}
                        className="ant-input-affix-wrapper"
                        type="number"
                        placeholder="Enter Amout ₦"
                      />
                    </Form.Item>
                    <div>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Available Balance : {userDetails?.amount}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Average Price
                      </p>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        {/* This is the Average Price */}
                        {outcomeBtn == "yes" &&
                          chartData[chartData?.length - 1]?.bidamount}

                        {outcomeBtn == "no" &&
                          noBids[noBids?.length - 1]?.bidamount}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Estimated Shares
                      </p>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        {/* This is the estimated shares */}
                        {doller &&  chartData[chartData?.length - 1]?.share}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Potential Returns
                      </p>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      > 
                      {/* {console.log(chartData[chartData?.length - 1]?.bidamount)} */}
                        {/* This is the potential returns */}
                        {outcomeBtn == "yes" &&
                        (100 - Number(chartData[chartData?.length - 1]?.bidamount)) * Number(chartData[chartData?.length - 1]?.share) 
                        } 
                        {outcomeBtn == "no" &&
                          noBids[noBids?.length - 1]?.bidamount * selectedtradingShare?.share || ""}
                          
                      </p>
                    </div>
                    <div className="text-area">
                      <p className="dec">Trading Fee: 10% of profit</p>
                    </div>

                    {userDetails?.amount < doller ? (
                      <div className="proceed">
                        {token ? (
                          <button
                            onClick={() => {
                              message.warning("Please Recharge your account");
                              navigate("/wallet");
                            }}
                            className={
                              (outcomeBtn == "yes" && "active-outcome-yes") ||
                              (outcomeBtn == "no" && "active-outcome-no  ")
                            }
                          >
                            Add {doller - userDetails?.amount}
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/login")}
                            className={
                              (outcomeBtn == "yes" && "active-outcome-yes") ||
                              (outcomeBtn == "no" && "active-outcome-no  ")
                            }
                          >
                            Sign up to Ochuba
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="proceed">
                        {token ? (
                          <button
                            disabled={!doller}
                            onClick={() => formHandler()}
                            className={
                              (outcomeBtn == "yes" && "active-outcome-yes") ||
                              (outcomeBtn == "no" && "active-outcome-no  ")
                            }
                          >
                            Proceed
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/login")}
                            className={
                              (outcomeBtn == "yes" && "active-outcome-yes") ||
                              (outcomeBtn == "no" && "active-outcome-no  ")
                            }
                          >
                            Sign up to Ochuba
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Form.Item
                      name="amout"
                      label="Shares"
                      rules={[
                        {
                          required: true,
                          message: "please enter your share",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => setsellAmount(e.target.value)}
                        min={0}
                        className="ant-input-affix-wrapper"
                        type="number"
                        placeholder="Enter share"
                      />
                    </Form.Item>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Available Shares
                      </p>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        {selectedtradingShare?.share || "0"}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Shares Price
                      </p>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        {outcomeBtn == "yes" &&
                          chartData[chartData?.length - 1]?.bidamount}
                        {outcomeBtn == "no" &&
                          noBids[noBids?.length - 1]?.bidamount}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        Potential Returns
                      </p>
                      <p
                        style={{
                          margin: "0px",
                          color: "gray",
                          fontSize: "14px",
                        }}
                      >
                        {outcomeBtn == "yes" &&
                          chartData[chartData?.length - 1]?.bidamount *
                            sellAmount}
                        {outcomeBtn == "no" &&
                          noBids[noBids?.length - 1]?.bidamount * sellAmount}
                      </p>
                    </div>

                    <div className="text-area">
                      <p className="dec">Trading Fee: 10% of profit</p>
                    </div>

                    <div className="proceed">
                      {token ? (
                        <button
                          disabled={!sellAmount}
                          onClick={() => formSellHandler()}
                          className={
                            (outcomeBtn == "yes" && "active-outcome-yes") ||
                            (outcomeBtn == "no" && "active-outcome-no  ")
                          }
                        >
                          Proceed
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("/login")}
                          className={
                            (outcomeBtn == "yes" && "active-outcome-yes") ||
                            (outcomeBtn == "no" && "active-outcome-no  ")
                          }
                        >
                          Sign up to Ochuba
                        </button>
                      )}
                    </div>
                  </>
                )}
              </Form>
            </div>
          </Col>
        )}

        <Modal
          onOk={handleOk}
          onCancel={handleCancel}
          open={isModalOpen}
          footer={false}
        >
          {token ? (
            <Col span={24}>
              <div
                className="wallet-right-side"
                style={{ boxShadow: "none", padding: "0px", marginTop: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="trading-yeschart">
                    <button
                      onClick={() => setBuyOrSell("buy")}
                      className={
                        buyOrSell == "buy" ? "yes activeButton" : "yes"
                      }
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setBuyOrSell("sell")}
                      className={
                        buyOrSell == "sell" ? "yes activeButton" : "yes"
                      }
                    >
                      Sell
                    </button>
                  </div>
                  <span>Market</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <p>Outcome</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setOutcomeBtn("yes")}
                      className={
                        outcomeBtn == "yes"
                          ? "outcome-yes active-outcome-yes"
                          : "outcome-yes"
                      }
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setOutcomeBtn("no")}
                      className={
                        outcomeBtn == "no"
                          ? "outcome-yes active-outcome-no"
                          : "outcome-yes"
                      }
                    >
                      No
                    </button>
                  </div>
                </div>
                <p className="credits">
                  Credits to be added (<b> ₦ </b>)
                </p>

                <Form layout="vertical" form={form}>
                  {buyOrSell == "buy" ? (
                    <>
                      <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[
                          {
                            required: true,
                            message: "please enter your amount",
                          },
                        ]}
                      >
                        <Input
                          onChange={(e) => setDoller(e.target.value)}
                          min={0}
                          className="ant-input-affix-wrapper"
                          type="number"
                          placeholder="Enter Amount ₦"
                        />
                      </Form.Item>
                      <div>
                        <p
                          style={{
                            margin: "0px",
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          Available Balance : {userDetails?.amount}
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            margin: "0px",
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          Average Price
                        </p>
                        <p
                          style={{
                            margin: "0px",
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          {outcomeBtn == "yes" &&
                            chartData[chartData?.length - 1]?.bidamount}
                          {outcomeBtn == "no" &&
                            noBids[noBids?.length - 1]?.bidamount}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            margin: "0px",
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          Est. Shares
                        </p>
                        <p
                          style={{
                            margin: "0px",
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          {selectedtradingShare?.share || "0"}
                        </p>
                      </div>

                      <div className="text-area">
                        <p className="dec">Trading Fee: 10% of profit</p>
                      </div>

                      {userDetails?.amount < doller ? (
                        <div className="proceed">
                          {token ? (
                            <button
                              onClick={() => {
                                message.warning("Please Recharge your account");
                                navigate("/wallet");
                              }}
                              className={
                                (outcomeBtn == "yes" && "active-outcome-yes") ||
                                (outcomeBtn == "no" && "active-outcome-no  ")
                              }
                            >
                              Add {doller - userDetails?.amount}
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate("/login")}
                              className={
                                (outcomeBtn == "yes" && "active-outcome-yes") ||
                                (outcomeBtn == "no" && "active-outcome-no  ")
                              }
                            >
                              Sign up to Ochuba
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="proceed">
                          {token ? (
                            <button
                              disabled={!doller}
                              onClick={() => formHandler()}
                              className={
                                (outcomeBtn == "yes" && "active-outcome-yes") ||
                                (outcomeBtn == "no" && "active-outcome-no  ")
                              }
                            >
                              Proceed
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate("/login")}
                              className={
                                (outcomeBtn == "yes" && "active-outcome-yes") ||
                                (outcomeBtn == "no" && "active-outcome-no  ")
                              }
                            >
                              Sign up to Ochuba
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {
                        <>
                          <Form.Item
                            name="amout"
                            label="Shares"
                            rules={[
                              {
                                required: true,
                                message: "please enter your share",
                              },
                            ]}
                          >
                            <Input
                              onChange={(e) => setsellAmount(e.target.value)}
                              min={0}
                              className="ant-input-affix-wrapper"
                              type="number"
                              placeholder="Enter share"
                            />
                          </Form.Item>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                margin: "0px",
                                color: "gray",
                                fontSize: "14px",
                              }}
                            >
                              Available Shares
                            </p>
                            <p
                              style={{
                                margin: "0px",
                                color: "gray",
                                fontSize: "14px",
                              }}
                            >
                              {selectedtradingShare?.share || "0"}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                margin: "0px",
                                color: "gray",
                                fontSize: "14px",
                              }}
                            >
                              Shares Price
                            </p>
                            <p
                              style={{
                                margin: "0px",
                                color: "gray",
                                fontSize: "14px",
                              }}
                            >
                              {outcomeBtn == "yes" &&
                                chartData[chartData?.length - 1]?.bidamount}
                              {outcomeBtn == "no" &&
                                noBids[noBids?.length - 1]?.bidamount}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                margin: "0px",
                                color: "gray",
                                fontSize: "14px",
                              }}
                            >
                              Potential Returns
                            </p>
                            <p
                              style={{
                                margin: "0px",
                                color: "gray",
                                fontSize: "14px",
                              }}
                            >
                              {outcomeBtn == "yes" &&
                                chartData[chartData?.length - 1]?.bidamount *
                                  sellAmount}
                              {outcomeBtn == "no" &&
                                noBids[noBids?.length - 1]?.bidamount *
                                  sellAmount}
                            </p>
                          </div>

                          <div className="text-area">
                            <p className="dec">Trading Fee: 10% of profit</p>
                          </div>

                          <div className="proceed">
                            {token ? (
                              <button
                                disabled={!sellAmount}
                                onClick={() => formSellHandler()}
                                className={
                                  (outcomeBtn == "yes" &&
                                    "active-outcome-yes") ||
                                  (outcomeBtn == "no" && "active-outcome-no  ")
                                }
                              >
                                Proceed
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate("/login")}
                                className={
                                  (outcomeBtn == "yes" &&
                                    "active-outcome-yes") ||
                                  (outcomeBtn == "no" && "active-outcome-no  ")
                                }
                              >
                                Sign up to Ochuba
                              </button>
                            )}
                          </div>
                        </>
                      }
                    </>
                  )}
                </Form>
              </div>
            </Col>
          ) : (
            <Col span={24}>
              <div
                className="wallet-right-side"
                style={{ boxShadow: "none", padding: "0px", marginTop: "20px" }}
              >
                <h2>How it works</h2>
                <h3>Predict Outcomes. Buy Yes or No</h3>
                <p>
                  Buy Yes if you think the event will happen & No if you don’t.
                  Please note that news triggers price changes in the market
                </p>
                <h3>Sell Early to book profits</h3>
                <p>
                  Buy & Sell positions as events become more or less likely over
                  time.
                </p>
                <h3>Collect Profits on Event Settlement</h3>
                <p>
                  When the outcome of the event becomes clear, the event settles
                  and you earn 100 to 1000 Naira for every correct share you
                  own.
                </p>
                <div className="proceed">
                  <button
                    onClick={() => navigate("/login")}
                    className={
                      (outcomeBtn == "yes" && "active-outcome-yes") ||
                      (outcomeBtn == "no" && "active-outcome-no  ")
                    }
                  >
                    Sign up to Ochuba
                  </button>
                </div>
              </div>
            </Col>
          )}
        </Modal>
      </Row>
    </Spin>
  );
};

export default TradingScreen;
