import { Button, Col, Empty, Row } from "antd";
import React, { useState } from "react";
import "./portfolio.scss";
import { Trading } from "../../assets";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

const Protfolio = () => {
  const [active, setActive] = useState("live");
  const eventHandler = (tab) => {
    setActive(tab);
  };

  const userDetails = useSelector(
    (state) => state?.gernalReducer?.completeUser
  );

  const navigate = useNavigate();

  const mobileResponsive = useMediaQuery({
    query: "(max-width: 900px)",
  });

  return (
    <div className="portfolio wallet">
      <Row className="portfolio-top">
        <Col className="mobile-responsive" span={mobileResponsive ? 24 : 8}>
          <p className="heading">
            Total Earning
          </p>
          <p className="value"><b> ₦ </b>{userDetails?.profit}</p>
        </Col>
        <Col className="mobile-responsive" span={mobileResponsive ? 24 : 8}>
          <p className="heading">
            Open Orders Value
          </p>
          <p className="value"><b> ₦ </b>{userDetails?.bids?.reduce((acc, obj) => acc + parseInt(obj.bidamount), 0)}</p>
        </Col>
        <Col className="mobile-responsive" span={mobileResponsive ? 24 : 8}>
          <p className="heading">Shares</p>
          <p className="value">{userDetails?.bids?.length}</p>
        </Col>
      </Row>
      <Row className="ready-to-trade">
        {userDetails?.bids?.length > 0 ? (
          <>
            <Col span={24}>
              <div className="left-side">
                {userDetails?.bids?.map((item, index) => (
                  <>
                    <div onClick={() => showDrawer()} className="wellate-card">
                      <div className="wellate-card-inner">
                        <div className="wellate-left">
                          <p className="first-text">{item.tradingName}</p>
                          <p className="second-text">{item.share}</p>
                        </div>
                        <p className="right-text">{item.bidamount} ₦</p>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col span={24}>
              <div className="left-side">
                <img src={Trading} />
                <p>You are ready to trade. Start Now!</p>
                <div className="trade-start">
                  <p>Discover various markets to trade</p>
                  <Button onClick={() => navigate("/market")} type="primary">
                    Start Now
                  </Button>
                </div>
              </div>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default Protfolio;
