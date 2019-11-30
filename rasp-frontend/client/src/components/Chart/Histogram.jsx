import React from "react";
import { Chart } from "./Chart";

const option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar"
    }
  ]
};

export const Histogram = ({
  data,
  xName,
  yName,
  title,
  subtitle,
  series,
  theme = "my_theme",
  onClick
}) => {
  const option = {
    title: {
      text: title,
      subtext: subtitle
    },
    legend: {
      bottom: 0
    },
    tooltip: {},
    dataset: {
      source: data
    },
    xAxis: { type: "category", name: xName },
    yAxis: { name: yName },
    series:
      series ||
      new Array(data[0].length - 1).fill(0).map(e => ({
        type: "bar",
        barWidth:
          data[0].length < 3
            ? 20
            : data[0].length < 5
            ? 18
            : data[0].length < 7
            ? 16
            : 14
      }))
  };

  return <Chart option={option} theme={theme} onClick={onClick} />;
};
