import React from "react";
import { Chart } from "./Chart";

// const option = {
//   tooltip: {
//     trigger: "axis",
//     axisPointer: {
//       type: "shadow"
//     }
//   },
//   legend: {
//     data: [
//       "直接访问",
//       "邮件营销",
//       "联盟广告",
//       "视频广告",
//       "搜索引擎",
//       "百度",
//       "谷歌",
//       "必应",
//       "其他"
//     ]
//   },
//   grid: {
//     left: "3%",
//     right: "4%",
//     bottom: "3%",
//     containLabel: true
//   },
//   xAxis: [
//     {
//       type: "category",
//       data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
//     }
//   ],
//   yAxis: [
//     {
//       type: "value"
//     }
//   ],
//   series: [
//     {
//       name: "直接访问",
//       type: "bar",
//       data: [320, 332, 301, 334, 390, 330, 320]
//     },
//     {
//       name: "邮件营销",
//       type: "bar",
//       stack: "广告",
//       data: [120, 132, 101, 134, 90, 230, 210]
//     },
//     {
//       name: "联盟广告",
//       type: "bar",
//       stack: "广告",
//       data: [220, 182, 191, 234, 290, 330, 310]
//     },
//     {
//       name: "视频广告",
//       type: "bar",
//       stack: "广告",
//       data: [150, 232, 201, 154, 190, 330, 410]
//     },
//     {
//       name: "搜索引擎",
//       type: "bar",
//       data: [862, 1018, 964, 1026, 1679, 1600, 1570],
//       markLine: {
//         lineStyle: {
//           normal: {
//             type: "dashed"
//           }
//         },
//         data: [[{ type: "min" }, { type: "max" }]]
//       }
//     },
//     {
//       name: "百度",
//       type: "bar",
//       barWidth: 5,
//       stack: "搜索引擎",
//       data: [620, 732, 701, 734, 1090, 1130, 1120]
//     },
//     {
//       name: "谷歌",
//       type: "bar",
//       stack: "搜索引擎",
//       data: [120, 132, 101, 134, 290, 230, 220]
//     },
//     {
//       name: "必应",
//       type: "bar",
//       stack: "搜索引擎",
//       data: [60, 72, 71, 74, 190, 130, 110]
//     },
//     {
//       name: "其他",
//       type: "bar",
//       stack: "搜索引擎",
//       data: [62, 82, 91, 84, 109, 110, 120]
//     }
//   ]
// };

export const StackBar = ({
  title,
  data,
  xName,
  yName,
  xAxis,
  theme = "my_theme"
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
      type: "scroll",
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
      type: "bar",
      barWidth: 24,
      stack: e.stack || "stack",
      areaStyle: {},
      label: {},
      barWidth:
        data[0].length < 3
          ? 20
          : data[0].length < 5
          ? 18
          : data[0].length < 7
          ? 16
          : 14,
      ...(e && e.itemStyle ? { itemStyle: e.itemStyle } : {}),
      data: e.data
    }))
  };
  return <Chart option={option} theme={theme} />;
};
