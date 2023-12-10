import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import React from 'react';
import { useMediaQuery } from "react-responsive";

const RenderLineChart = ({chartData,type}) => {
  const mobileResponsive = useMediaQuery({
    query: "(max-width: 900px)",
  });

  const axisStyle = {
    fill: "#99A69D",
    fontSize: "14px",
  };
  const yAxisStyle = {
    fill: "#99A69D",
    fontSize: "12px",
  };
  return(

  <ResponsiveContainer width="100%" height={mobileResponsive ? 200 : 400}>
    <LineChart data={chartData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
      <Line type='bump' dataKey="bidamount" name={type?"No ":"Yes"} stroke={type?"#D762AE": "#8884d8"} />
      <LabelList  position="left" /> {/* Display labels on the left side */}
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis  hide={true} />
      <YAxis ticks={[20, 40, 60, 80, 100]} />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
  )
};

export default RenderLineChart