import React, { useMemo } from "react";
import { Chart } from "./Chart";

export const Line = ({
  title = "",
  subtitle = "",
  tooltip,
  data,
  xName,
  yName,
  theme = "my_theme"
}) => {
  const option = useMemo(
    () => ({
      title: {
        text: title,
        subtext: subtitle
      },
      tooltip: {
        trigger: "item",
        formatter: tooltip
      },
      xAxis: {
        type: "category",
        data: data.map(e => e.name),
        name: xName
      },
      yAxis: {
        type: "value",
        name: yName
      },
      series: [
        {
          data: data.map(e => e.value),
          type: "line",
          smooth: true
        }
      ]
    }),
    [data, title, subtitle, tooltip, xName, yName]
  );
  return <Chart option={option} theme={theme} />;
};
