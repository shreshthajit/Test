import { Modal } from "antd";
import React from "react";

const LearnTrade = ({ handleCancel, handleOk, isModalOpen }) => {
  return (
    <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}></Modal>
  );
};

export default LearnTrade;
