import { Spin, message } from "antd";
import React, { useState } from "react";
import "./payment.scss";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../Redux/Reducers/gernalSlice";
import { useNavigate } from "react-router-dom";

const Flutterwave = ({ Amount, setIsPayment }) => {
  const [loading, setLoading] = useState(false);
  const [cvc, setCVC] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = useSelector((state) => state?.authReducer?.token);
  const user = useSelector((state) => state?.authReducer?.user);
  const completeUser = useSelector((state) => state?.gernalReducer?.completeUser);


  const handleCardNumberChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedInput = "";

    for (let i = 0; i < input.length; i += 4) {
      formattedInput += input.substr(i, 4) + " ";
    }

    setCardNumber(formattedInput.trim());
  };
  
  const handleExpiryDateChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedInput = "";

    if (input.length > 2) {
      formattedInput += input.substr(0, 2) + " / " + input.substr(2, 2);
    } else {
      formattedInput += input;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const enteredYear = parseInt(input.substr(2, 2), 10);
    const enteredMonth = parseInt(input.substr(0, 2), 10);

    setIsExpired(
      enteredYear < currentYear ||
        (enteredYear === currentYear && enteredMonth < currentMonth)
    );
    setExpiryDate(formattedInput.trim());
  };

  const formHandler = async () => {
    console.log(user,"user?.emailuser?.email")
    const formData = {
      card_number: cardNumber.replace(/\s/g, ""),
      cvv: cvc,
      expiry_month: expiryDate.slice(0, 2).trim(),
      expiry_year: expiryDate.slice(4).trim(),
      amount: Amount || "0",
    };
    if ((cardNumber, cvc, expiryDate, Amount)) {
      console.log("chalya a ka ni")
      if (completeUser?.email) {
        setLoading(true);

        fetch(`${baseUrl}/api/v1/admin/trading/payment`, {
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
            if (data?.message) {
              message.success(data?.message);
              setIsPayment(false);
              setCardNumber("");
              setCVC("");
              setExpiryDate("");
              fetch(`${baseUrl}/api/v1/auth/user`, {
                method: "get",
                headers: {
                  Authorization: token,
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  dispatch(setUserDetails(data?.data));
                })
                .catch((error) => {
                  //   setLoading(false);
                });
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        message.warning("Please Update Profile");
        navigate("/profile");
      }
    } else {
      message.warning("Please enter valid card details");
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="payment">
        <h3>Pay With Card</h3>
        <input
          placeholder="Card no"
          maxLength={"19"}
          onChange={handleCardNumberChange}
          className="search-input"
          value={cardNumber}
        />
        <input
          placeholder="CVC"
          type="number"
          value={cvc}
          onChange={(e) => {
            setCVC((prev) => {
              if (e.target.value.length === 4) {
                return prev;
              }
              return e.target.value;
            });
          }}
          className="search-input"
        />

        <input
          placeholder="Expiry Date MM/YY"
          type="text"
          onChange={handleExpiryDateChange}
          value={expiryDate}
          className={isExpired ? "search-input expired-color" : "search-input"}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="pay-btn"
            disabled={
              cvc.length === 3 && cardNumber.length == 19 && expiryDate.length
                ? false
                : true
            }
            onClick={() => formHandler()}
          >
            Confirm payment
          </button>
        </div>
      </div>
    </Spin>
  );
};

export default Flutterwave;
