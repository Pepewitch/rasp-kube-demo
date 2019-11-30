import React, { useMemo } from "react";
import { Chart } from "./Chart";

const option = {
  legend: {
    // orient: 'vertical',
    // top: 'middle',
    bottom: 10,
    left: "center",
    data: ["西凉", "益州", "兖州", "荆州", "幽州"]
  }
};
export const Pie = ({
  title = "",
  subtitle = "",
  tooltip = "{b} : {c} ({d}%)",
  legend,
  theme = "my_theme",
  data
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
      legend: {
        // orient: 'vertical',
        left: "center",
        data: data.map(e => e.name),
        bottom: 0
      },
      series: [
        {
          type: "pie",
          radius: "65%",
          center: ["50%", "50%"],
          selectedMode: "single",
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    }),
    [title, subtitle, data, tooltip, legend, tooltip]
  );
  return <Chart option={option} theme={theme} />;
};
