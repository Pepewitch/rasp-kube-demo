import React from "react";
import { Chart } from "./Chart";

export const StackLine = ({
  data,
  xAxis,
  title,
  xName,
  yName,
  area = {},
  theme = "my_theme",
  onClick
}) => {
  const option = {
    title: {
      text: title
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: data.map(e => e.name),
      bottom: 0
    },
    // grid: {
    //   left: "3%",
    //   right: "4%",
    //   bottom: "3%",
    //   containLabel: true
    // },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: xAxis,
        name: xName
      }
    ],
    yAxis: [
      {
        type: "value",
        name: yName
      }
    ],
    series: data.map(e => ({
      name: e.name,
      type: "line",
      stack: e.stack || "stack",
      ...(area ? { areaStyle: area } : {}),
      smooth: true,
      label: {
        normal: {
          show: true,
          position: "top"
        }
      },
      ...(e && e.itemStyle ? { itemStyle: e.itemStyle } : {}),
      data: e.data
    }))
  };
  return <Chart option={option} theme={theme} onClick={onClick} />;
};
