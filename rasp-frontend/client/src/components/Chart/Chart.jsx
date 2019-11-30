import React, { useState } from "react";
import ReactEcharts from "echarts-for-react";
import { Modal } from "antd";

export const DEFAULT_STYLE = {
  minHeight: 400
};

export const Chart = ({ onClick, onReady, option, ...props }) => {
  return (
    <>
      <ReactEcharts
        style={DEFAULT_STYLE}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        theme="my_theme"
        onChartReady={onReady}
        onEvents={{
          click: onClick
        }}
        {...props}
      />
    </>
  );
};
