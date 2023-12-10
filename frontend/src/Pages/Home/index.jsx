import React, { useState, useEffect } from "react";
import "./home.scss";
import { Card, Carousel, Col, Dropdown, Empty, Row, Select, Spin } from "antd";
import { CardData, Title } from "./constant";
import { ReactSVG } from "react-svg";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import {
  Filter,
  Timer,
  image1,
  image2,
  image3,
  image4,
  image5,
} from "../../assets";
import LearnTrade from "../../Component/LearnTrading";
import { useSelector } from "react-redux";

const Home = () => {
  const [data, setData] = useState([]);
  const [tabs, setTabs] = useState({ name: "Sports", index: 0 });
  const [subTabs, setSubTabs] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [category, setCategory] = useState([]);
  const [dateAndTime, setDateAndTime] = useState([]);
  const [yesBids, setYesBids] = useState([]);
  const [noBids, setNoBids] = useState([]);

  const token = useSelector((state) => state?.authReducer?.token);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsEditOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsEditOpen(false);
  };

  
  const GetAllTrading = () => {
    setLoading(true);

    fetch(`${baseUrl}/api/v1/admin/trading`, {
      method: "get",
      headers: {
        "x-sh-auth": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data?.success) {
          setData(data.data);
          setAllData(data.data);
        }
      });
  };

  useEffect(() => GetAllTrading(), []);

  const mobileResponsive = useMediaQuery({
    query: "(max-width: 900px)",
  });

  const filterdata = (object) => {

    const filter = allData.filter(
      (item) => item?.type?.toLowerCase() == object?.name?.toLowerCase()
    );
    setData(filter);
    const uniqueArray = filter.filter((item, index, self) => {
      return index === self.findIndex((t) => t.category?.toLowerCase()?.trim() === item.category?.toLowerCase()?.trim());
    });
    setCategory(uniqueArray);
  };

  const filtercategory = (object) => {
    const filterCategory = allData.filter(
      (item) => item?.category?.toLowerCase() == object?.category?.toLowerCase()
    );
    setData(filterCategory);
  };

  const GetDate = (endDate, endTime, item) => {
    // setYesBids(item?.bids?.filter((item)=> item?.bid == "yes"))
    // setNoBids(item?.bids?.filter((item)=> item?.bid == "no"))
    const inputDateString = endDate + "T" + endTime + "Z"; // Combine date and time strings
    const inputDateTime = new Date(inputDateString);

    const now = new Date(); // Current date and time
    const timeDifference = inputDateTime - now; // Calculate the time difference in milliseconds

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (timeDifference < 0) {
      return (
        <div style={{ background: "#FAE9F4" }} className="main-expire">
          <p style={{ color: "#CA2F93" }} className="expire">
            Event Expire
          </p>
        </div>
      );
    }

    return (
      <div className="main-expire">
        <img width={15} src={Timer} />
        <p className="expire">
          Event will expire in ({days} days {hours} hours)
        </p>
      </div>
    );
  };

  useEffect(() => {
    if (allData?.length) {
      const filtercategory = allData?.filter((item) => item?.type == "sports");
      const uniqueArray = filtercategory.filter((item, index, self) => {
        return index === self.findIndex((t) => t.category?.toLowerCase()?.trim() === item.category?.toLowerCase()?.trim());
      });
      setCategory(uniqueArray);
    }
  }, [allData?.length]);

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          onClick={() => {
            setData(allData);
            setTabs({ name: "Sports", index: 0 });
          }}
          rel="noopener noreferrer"
        >
          Closing Soon
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={() => {
            setData(allData);
            setTabs({ name: "Sports", index: 0 });
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          New Market
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          onClick={() => {
            setData(allData);
            setTabs({ name: "Sports", index: 0 });
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Total Volume
        </a>
      ),
    },
  ];



  return (
    <Spin spinning={loading}>
      <div className="home">
        <div className="home-box">
          <Row gutter={[20, 20]}>
            <Col
              span={24}
              style={
                mobileResponsive ? { marginTop: "20px" } : { marginTop: "50px" }
              }
            >
              <Carousel
                style={
                  mobileResponsive
                    ? { width: "100%", height: "100px" }
                    : { width: "100%", height: "200px" }
                }
                slidesToShow={mobileResponsive ? 1 : 3}
                dots={false}
                autoplay
              >
                <div style={{ width: "100%" }}>
                  <img
                    style={{ borderRadius: "10px" }}
                    width={"100%"}
                    src={image1}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <img
                    style={{ borderRadius: "10px" }}
                    width={"100%"}
                    src={image2}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <img
                    style={{ borderRadius: "10px" }}
                    width={"100%"}
                    src={image3}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <img
                    style={{ borderRadius: "10px" }}
                    width={"100%"}
                    src={image4}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <img
                    style={{ borderRadius: "10px" }}
                    width={"100%"}
                    src={image5}
                  />
                </div>
              </Carousel>
            </Col>
            <Col
              style={mobileResponsive ? { marginTop: "20px" } : {}}
              span={mobileResponsive ? 4 : 2}
            >
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="filter">
                  <img width={25} height="auto" src={Filter} />
                </div>
              </Dropdown>
            </Col>

            <Col
              style={mobileResponsive ? { marginTop: "20px" } : {}}
              span={mobileResponsive ? 20 : 22}
            >
              <div className="title-tabs">
                {Title?.length > 0 &&
                  Title?.map((item, index) => (
                    <div
                      onClick={() => {
                        filterdata(item);
                        setTabs({ name: item?.name, index: index });
                        setSubTabs("");
                      }}
                      key={index}
                      className={`title-tab ${tabs?.name == item?.name && "activetab"
                        }`}
                    >
                      <ReactSVG
                        style={{ marginTop: "5px" }}
                        src={item?.icons}
                      />
                      <p className="title">{item?.name}</p>
                    </div>
                  ))}
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }}>
            <Col span={24}>
              <div className="title-tabs">
                {category?.length > 0 &&
                  category.map((item, index) => (
                    <div
                      onClick={() => {
                        setSubTabs(index);
                        filtercategory(item);
                      }}
                      key={index}
                      className={`title-tab ${subTabs == index && "activetab"}`}
                    >
                      <p className="title1">{item?.category}</p>
                    </div>
                  ))}
              </div>
            </Col>
          </Row>

          <Row style={{ marginTop: "50px" }} gutter={[20, 20]}>
            {(data?.length &&
              data?.map((item) => (
                <Col className="card-s" span={mobileResponsive ? 24 : 8}>
                  <Card
                    onClick={() => navigate(`/trading-chart/${item?._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card">
                      <p className="title-text">{item?.title}</p>
                      <img
                        src={baseUrl + "/uploads/" + item?.image}
                        alt={item?.image}
                      />
                    </div>
                    <div className="card-bottom">
                      <p className="right-text1">
                        Yes{" "}
                        {item?.bids?.filter((item) => item?.bid == "yes")[
                          item?.bids?.filter((item) => item?.bid == "yes")
                            ?.length - 1
                        ]?.bidamount || "0.00"}
                      </p>
                      <p className="right-text2">
                        No{" "}
                        {item?.bids?.filter((item) => item?.bid == "no")[
                          item?.bids?.filter((item) => item?.bid == "no")
                            ?.length - 1
                        ]?.bidamount || "0.00"}
                      </p>
                    </div>
                  </Card>
                  {GetDate(item?.endDate, item?.endTime, item)}
                </Col>
              ))) || (
                <Col
                  span={24}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Empty />
                </Col>
              )}
          </Row>
        </div>

        {/* MOdal */}

        <LearnTrade
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      </div>
    </Spin>
  );
};

export default Home;
