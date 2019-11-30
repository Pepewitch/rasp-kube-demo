import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Select,
  Card,
  Spin,
  Modal
} from "antd";
import { getData, useData } from "../../utils/data";
import styled from "styled-components";
import { PageLayout } from "../Layout";
import { Radial, Histogram, Pie, StackBar } from "../Chart";
import _ from "lodash";
import { Line } from "../Chart/Line";
import { FilterContext, applyFilter } from "../../utils/filter";
import { StackLine } from "../Chart/StackLine";
import { DataCard, DATA_CARD_COLOR } from "../DataCard";
import { GroupContext } from "../../utils/group";

const { Meta } = Card;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

const getRatio = filter => {
  let ratio = 1;
  let genderRatio = 1;
  let ageRatio = 1;
  Object.entries(filter).map(([key, value]) => {
    if (key === "day" && value !== -1) ratio /= 7;
    if (key === "time" && value !== -1) ratio /= 13;
    if (key === "male" && !value) genderRatio -= 0.4;
    if (key === "female" && !value) genderRatio -= 0.6;
    if (key.indexOf("age") > -1 && !value) ageRatio -= 0.2;
  });
  return ratio * genderRatio * ageRatio;
};

const applyRatio = (_ratio, data) => {
  const ratio = _ratio;
  return data.map(e => Math.floor(ratio * e));
};

const GenderChart = ({ data: _data }) => {
  const data = useMemo(
    () =>
      Object.entries(_.groupBy(_data, e => e.gender)).map(e => ({
        name: e[0],
        value: e[1].length
      })),
    [_data]
  );
  return <Pie title="Gender" data={data} theme="gender_theme" />;
};

const AgeChart = ({ data: _data }) => {
  // const data = useMemo(
  //   () =>
  //     Object.entries(_.groupBy(_data, e => Math.floor(e.age / 5))).map(e => ({
  //       name: `${Number(e[0]) * 5} - ${Number(e[0]) * 5 + 4}`,
  //       value: e[1].length
  //     })),
  //   [_data]
  // );
  // return (
  //   <Line
  //     title="Age"
  //     data={data}
  //     xName="Age"
  //     yName="People"
  //     tooltip="Age: {b}<br/>People: {c}"
  //   />
  // );
  const data = useMemo(
    () => [
      { name: "15 - 24", value: Math.floor(50 + Math.random() * 100) },
      { name: "24 - 30", value: Math.floor(100 + Math.random() * 100) },
      { name: "30 - 40", value: Math.floor(30 + Math.random() * 70) },
      { name: "40 - 50", value: Math.floor(10 + Math.random() * 50) }
    ],
    [_data]
  );
  return <Pie title="Age" data={data} theme="age_theme" />;
};

const RetentionChart = ({ data: _data }) => {
  const [store] = useState({});
  const { group } = useContext(GroupContext);
  const { filter } = useContext(FilterContext);
  const ratio = getRatio(filter);
  const enhance = data => {
    if (!store[group.toString() + ratio.toString()])
      store[ratio] = _.shuffle(data);
    return applyRatio(ratio, store[ratio]);
  };
  if (group === "age") {
    const AGE15_OLD = "#35E0B9";
    const AGE15_NEW = "#baf5e7";
    const AGE24_OLD = "#BD80F4";
    const AGE24_NEW = "#e8daf5";
    const AGE30_OLD = "#35AEE4";
    const AGE30_NEW = "#b1def2";
    const AGE40_OLD = "#FF879B";
    const AGE40_NEW = "#fcd2d9";
    const data = [
      ...(filter.age15
        ? [
            {
              name: "Age 15 - 24 Old customer",
              data: enhance([20, 24, 28, 16, 18, 22, 32]),
              stack: "Age 15 - 24",
              itemStyle: {
                color: AGE15_OLD
              }
            },
            {
              name: "Age 15 - 24 New customer",
              data: enhance([16, 28, 14, 10, 6, 8, 12]),
              stack: "Age 15 - 24",
              itemStyle: {
                color: AGE15_NEW
              }
            }
          ]
        : []),
      ...(filter.age24
        ? [
            {
              name: "Age 24 - 30 Old customer",
              data: enhance([18, 22, 44, 16, 8, 18, 32]),
              stack: "Age 24 - 30",
              itemStyle: {
                color: AGE24_OLD
              }
            },
            {
              name: "Age 24 - 30 New customer",
              data: enhance([10, 28, 12, 6, 18, 20, 22]),
              stack: "Age 24 - 30",
              itemStyle: {
                color: AGE24_NEW
              }
            }
          ]
        : []),
      ...(filter.age30
        ? [
            {
              name: "Age 30 - 40 Old customer",
              data: enhance([20, 24, 28, 16, 18, 22, 32]),
              stack: "Age 30 - 40",
              itemStyle: {
                color: AGE30_OLD
              }
            },
            {
              name: "Age 30 - 40 New customer",
              data: enhance([16, 28, 14, 10, 6, 8, 12]),
              stack: "Age 30 - 40",
              itemStyle: {
                color: AGE30_NEW
              }
            }
          ]
        : []),
      ...(filter.age40
        ? [
            {
              name: "Age 40 - 50 Old customer",
              data: enhance([18, 22, 44, 16, 8, 18, 32]),
              stack: "Age 40 - 50",
              itemStyle: {
                color: AGE40_OLD
              }
            },
            {
              name: "Age 40 - 50 New customer",
              data: enhance([10, 28, 12, 6, 18, 20, 22]),
              stack: "Age 40 - 50",
              itemStyle: {
                color: AGE40_NEW
              }
            }
          ]
        : [])
    ];
    return (
      <StackBar
        theme="age_theme"
        data={data}
        title="Visitor"
        xAxis={[
          "09/07/19",
          "10/07/19",
          "11/07/19",
          "12/07/19",
          "13/07/19",
          "14/07/19",
          "15/07/19"
        ]}
        xName="Date"
        yName="Number of visitors"
      />
    );
  }
  if (group === "gender") {
    const MALE_OLD = "#4888FC";
    const MALE_NEW = "#c1d4f5";
    const FEMALE_OLD = "#FF6EB7";
    const FEMALE_NEW = "#fcd4e8";
    const data = [
      ...(filter.male
        ? [
            {
              name: "Male Old customer",
              data: enhance([10, 12, 14, 8, 9, 11, 16]),
              stack: "Male",
              itemStyle: {
                color: MALE_OLD
              }
            },
            {
              name: "Male New customer",
              data: enhance([8, 14, 7, 5, 3, 4, 6]),
              stack: "Male",
              itemStyle: {
                color: MALE_NEW
              }
            }
          ]
        : []),
      ...(filter.female
        ? [
            {
              name: "Female Old customer",
              data: enhance([9, 11, 22, 8, 4, 9, 16]),
              stack: "Female",
              itemStyle: {
                color: FEMALE_OLD
              }
            },
            {
              name: "Female New customer",
              data: enhance([5, 14, 6, 3, 9, 10, 11]),
              stack: "Female",
              itemStyle: {
                color: FEMALE_NEW
              }
            }
          ]
        : [])
    ];
    return (
      <StackBar
        data={data}
        theme="gender_theme"
        title="Visitor"
        xAxis={[
          "09/07/19",
          "10/07/19",
          "11/07/19",
          "12/07/19",
          "13/07/19",
          "14/07/19",
          "15/07/19"
        ]}
        xName="Date"
        yName="Number of visitors"
      />
    );
  }
  const data = [
    {
      name: "Old customer",
      data: enhance([100, 120, 140, 80, 90, 110, 160])
    },
    {
      name: "New customer",
      data: enhance([80, 140, 70, 50, 30, 40, 60])
    }
  ];
  return (
    <StackLine
      data={data}
      title="Visitor"
      xAxis={[
        "09/07/19",
        "10/07/19",
        "11/07/19",
        "12/07/19",
        "13/07/19",
        "14/07/19",
        "15/07/19"
      ]}
      xName="Date"
      yName="Number of visitors"
    />
  );
};

const PeopleGroupChart = ({ data: _data, onClick }) => {
  const data = [
    { name: "1 person", data: [49, 62, 52, 72, 91, 54, 43], stack: "1 person" },
    { name: "2 people", data: [22, 47, 37, 45, 39, 11, 24], stack: "2 person" },
    { name: "3 people", data: [16, 31, 26, 29, 14, 18, 32], stack: "3 person" },
    {
      name: "More than 3 people",
      data: [18, 24, 17, 25, 16, 14, 12],
      stack: "4 person"
    }
  ];
  return (
    <StackLine
      data={data}
      area={null}
      title="Visitor"
      xAxis={[
        "09/07/19",
        "10/07/19",
        "11/07/19",
        "12/07/19",
        "13/07/19",
        "14/07/19",
        "15/07/19"
      ]}
      onClick={onClick}
      xName="Date"
      yName="Number of visitors"
    />
  );
};

const TimeSpendChart = ({ onClick }) => {
  const { group } = useContext(GroupContext);
  const { filter } = useContext(FilterContext);
  if (group === "age") {
    const label = ["Age"];
    const purchasing = [
      ["1 min"],
      ["3 min"],
      ["5 min"],
      ["10 min"],
      ["30 min"],
      ["More than 30 min"]
    ];
    if (filter.age15) {
      label.push("Age 15 - 24");
      purchasing[0].push(6);
      purchasing[1].push(3);
      purchasing[2].push(4);
      purchasing[3].push(6);
      purchasing[4].push(7);
      purchasing[5].push(9);
    }
    if (filter.age24) {
      label.push("Age 24 - 30");
      purchasing[0].push(10);
      purchasing[1].push(8);
      purchasing[2].push(11);
      purchasing[3].push(13);
      purchasing[4].push(9);
      purchasing[5].push(6);
    }
    if (filter.age30) {
      label.push("Age 30 - 40");
      purchasing[0].push(11);
      purchasing[1].push(9);
      purchasing[2].push(7);
      purchasing[3].push(4);
      purchasing[4].push(8);
      purchasing[5].push(11);
    }
    if (filter.age40) {
      label.push("Age 40 - 50");
      purchasing[0].push(5);
      purchasing[1].push(2);
      purchasing[2].push(6);
      purchasing[3].push(6);
      purchasing[4].push(6);
      purchasing[5].push(9);
    }
    const data = [label, ...purchasing];
    return (
      <Histogram
        onClick={onClick}
        data={data}
        theme="age_theme"
        title="Time Spending"
        xName="Timespend"
        yName="Number of visitors"
      />
    );
  }
  if (group === "gender") {
    const label = ["Gender"];
    const purchasing = [
      ["1 min"],
      ["3 min"],
      ["5 min"],
      ["10 min"],
      ["30 min"],
      ["More than 30 min"]
    ];
    if (filter.male) {
      label.push("Male");
      purchasing[0].push(10);
      purchasing[1].push(8);
      purchasing[2].push(12);
      purchasing[3].push(14);
      purchasing[4].push(10);
      purchasing[5].push(11);
    }
    if (filter.female) {
      label.push("Female");
      purchasing[0].push(22);
      purchasing[1].push(14);
      purchasing[2].push(16);
      purchasing[3].push(17);
      purchasing[4].push(20);
      purchasing[5].push(24);
    }
    const data = [label, ...purchasing];
    return (
      <Histogram
        onClick={onClick}
        theme="gender_theme"
        data={data}
        title="Time Spending"
        xName="Timespend"
        yName="Number of visitors"
      />
    );
  }
  const data = [
    ["1 min", 32],
    ["3 min", 22],
    ["5 min", 28],
    ["10 min", 31],
    ["30 min", 30],
    ["More than 30 min", 35]
  ];
  return (
    <Histogram
      onClick={onClick}
      data={data}
      title="Time Spending"
      xName="Timespend"
      yName="Number of visitors"
    />
  );
};

const FrequencyNumberChart = ({ data: _data, onClick }) => {
  const { group } = useContext(GroupContext);
  const { filter } = useContext(FilterContext);
  if (group === "age") {
    const label = ["Age"];
    const purchasing = [[1], [2], [3], [4], [5], [6], [7], [8], [9]];
    if (filter.age15) {
      label.push("Age 15 - 24");
      purchasing[0].push(21);
      purchasing[1].push(46);
      purchasing[2].push(11);
      purchasing[3].push(8);
      purchasing[4].push(3);
      purchasing[5].push(2);
      purchasing[6].push(4);
      purchasing[7].push(1);
      purchasing[8].push(4);
    }
    if (filter.age24) {
      label.push("Age 24 - 30");
      purchasing[0].push(11);
      purchasing[1].push(23);
      purchasing[2].push(16);
      purchasing[3].push(3);
      purchasing[4].push(4);
      purchasing[5].push(2);
      purchasing[6].push(3);
      purchasing[7].push(4);
      purchasing[8].push(2);
    }
    if (filter.age30) {
      label.push("Age 30 - 40");
      purchasing[0].push(41);
      purchasing[1].push(12);
      purchasing[2].push(4);
      purchasing[3].push(2);
      purchasing[4].push(1);
      purchasing[5].push(1);
      purchasing[6].push(4);
      purchasing[7].push(2);
      purchasing[8].push(1);
    }
    if (filter.age40) {
      label.push("Age 40 - 50");
      purchasing[0].push(32);
      purchasing[1].push(12);
      purchasing[2].push(5);
      purchasing[3].push(3);
      purchasing[4].push(0);
      purchasing[5].push(1);
      purchasing[6].push(2);
      purchasing[7].push(3);
      purchasing[8].push(0);
    }
    const data = [label, ...purchasing];
    return (
      <Histogram
        onClick={onClick}
        data={data}
        theme="age_theme"
        title="Frequency of purchasing"
        xName="Frequency of purchasing"
        yName="Number of visitors"
      />
    );
  }
  if (group === "gender") {
    const label = ["Gender"];
    const purchasing = [[1], [2], [3], [4], [5], [6], [7], [8], [9]];
    if (filter.male) {
      label.push("Male");
      purchasing[0].push(121);
      purchasing[1].push(96);
      purchasing[2].push(41);
      purchasing[3].push(23);
      purchasing[4].push(11);
      purchasing[5].push(14);
      purchasing[6].push(12);
      purchasing[7].push(11);
      purchasing[8].push(6);
    }
    if (filter.female) {
      label.push("Female");
      purchasing[0].push(121);
      purchasing[1].push(62);
      purchasing[2].push(37);
      purchasing[3].push(46);
      purchasing[4].push(24);
      purchasing[5].push(19);
      purchasing[6].push(14);
      purchasing[7].push(18);
      purchasing[8].push(19);
    }
    const data = [label, ...purchasing];
    return (
      <Histogram
        onClick={onClick}
        data={data}
        theme="gender_theme"
        title="Frequency of purchasing"
        xName="Frequency of purchasing"
        yName="Number of visitors"
      />
    );
  }
  const data = [
    [1, 240],
    [2, 200],
    [3, 180],
    [4, 120],
    [5, 64],
    [6, 62],
    [7, 44],
    [8, 21],
    [9, 10]
  ];
  return (
    <Histogram
      onClick={onClick}
      data={data}
      theme="my_theme"
      title="Frequency of visiting"
      xName="Frequency of visiting"
      yName="Number of visitors"
    />
  );
};

const ConversionChart = ({ onClick }) => {
  const { group } = useContext(GroupContext);
  const { filter } = useContext(FilterContext);
  if (group === "age") {
    const data = [
      ...(filter.age15
        ? [
            {
              name: "Age 15 - 24",
              data: [6, 3, 4, 6, 7, 9, 8]
            }
          ]
        : []),
      ...(filter.age24
        ? [
            {
              name: "Age 24 - 30",
              data: [10, 8, 11, 13, 9, 6, 10]
            }
          ]
        : []),
      ...(filter.age30
        ? [
            {
              name: "Age 30 - 40",
              data: [11, 9, 7, 4, 8, 11, 8]
            }
          ]
        : []),
      ...(filter.age40
        ? [
            {
              name: "Age 40 - 50",
              data: [5, 2, 6, 6, 6, 9, 6]
            }
          ]
        : [])
    ];
    return (
      <StackLine
        onClick={onClick}
        data={data}
        theme="age_theme"
        title="Conversion Rate (%)"
        xAxis={[
          "09/07/19",
          "10/07/19",
          "11/07/19",
          "12/07/19",
          "13/07/19",
          "14/07/19",
          "15/07/19"
        ]}
        xName="Date"
        yName="Conversion Rate (%)"
      />
    );
  }
  if (group === "gender") {
    const data = [
      ...(filter.male
        ? [
            {
              name: "Male",
              data: [10, 8, 12, 14, 10, 11, 8]
            }
          ]
        : []),
      ...(filter.female
        ? [
            {
              name: "Female",
              data: [22, 14, 16, 17, 20, 24, 24]
            }
          ]
        : [])
    ];
    return (
      <StackLine
        onClick={onClick}
        data={data}
        theme="gender_theme"
        title="Conversion Rate (%)"
        xAxis={[
          "09/07/19",
          "10/07/19",
          "11/07/19",
          "12/07/19",
          "13/07/19",
          "14/07/19",
          "15/07/19"
        ]}
        xName="Date"
        yName="Conversion Rate (%)"
      />
    );
  }
  const data = [{ name: "Conversion", data: [32, 22, 28, 31, 30, 35, 32] }];
  return (
    <StackLine
      data={data}
      onClick={onClick}
      title="Conversion Rate (%)"
      xAxis={[
        "09/07/19",
        "10/07/19",
        "11/07/19",
        "12/07/19",
        "13/07/19",
        "14/07/19",
        "15/07/19"
      ]}
      xName="Date"
      yName="Conversion Rate (%)"
    />
  );
};

const FrequencyVisitorChart = ({ data: _data, onClick }) => {
  const { group } = useContext(GroupContext);
  const { filter } = useContext(FilterContext);
  if (group === "age") {
    const label = ["Age"];
    const purchasing = [[1], [2], [3], [4], [5], [6]];
    if (filter.age15) {
      label.push("Age 15 - 24");
      purchasing[0].push(21);
      purchasing[1].push(46);
      purchasing[2].push(11);
      purchasing[3].push(8);
      purchasing[4].push(3);
      purchasing[5].push(2);
    }
    if (filter.age24) {
      label.push("Age 24 - 30");
      purchasing[0].push(11);
      purchasing[1].push(23);
      purchasing[2].push(16);
      purchasing[3].push(3);
      purchasing[4].push(4);
      purchasing[5].push(2);
    }
    if (filter.age30) {
      label.push("Age 30 - 40");
      purchasing[0].push(41);
      purchasing[1].push(12);
      purchasing[2].push(4);
      purchasing[3].push(2);
      purchasing[4].push(1);
      purchasing[5].push(1);
    }
    if (filter.age40) {
      label.push("Age 40 - 50");
      purchasing[0].push(32);
      purchasing[1].push(12);
      purchasing[2].push(5);
      purchasing[3].push(3);
      purchasing[4].push(0);
      purchasing[5].push(1);
    }
    const data = [label, ...purchasing];
    console.log("data", data);
    return (
      <Histogram
        onClick={onClick}
        data={data}
        theme="age_theme"
        title="Frequency of purchasing"
        xName="Frequency of purchasing"
        yName="Number of visitors"
      />
    );
  }
  if (group === "gender") {
    const label = ["Gender"];
    const purchasing = [[1], [2], [3], [4], [5], [6]];
    if (filter.male) {
      label.push("Male");
      purchasing[0].push(21);
      purchasing[1].push(46);
      purchasing[2].push(11);
      purchasing[3].push(8);
      purchasing[4].push(3);
      purchasing[5].push(2);
    }
    if (filter.female) {
      label.push("Female");
      purchasing[0].push(121);
      purchasing[1].push(65);
      purchasing[2].push(47);
      purchasing[3].push(16);
      purchasing[4].push(14);
      purchasing[5].push(3);
    }
    const data = [label, ...purchasing];
    return (
      <Histogram
        onClick={onClick}
        theme="gender_theme"
        data={data}
        title="Frequency of purchasing"
        xName="Frequency of purchasing"
        yName="Number of visitors"
      />
    );
  }
  const data = [[1, 143], [2, 83], [3, 86], [4, 42], [5, 21], [6, 8], [7, 7]];
  console.log("data", data);
  return (
    <Histogram
      onClick={onClick}
      data={data}
      title="Frequency of purchasing"
      xName="Frequency of purchasing"
      yName="Number of visitors"
    />
  );
};

const ChartCard = ({ loading, title, data, chart, span }) => {
  return (
    <Card style={{ gridColumn: `span ${span || 2}` }}>
      <Meta
        title={title}
        description={loading ? <Spin /> : chart && chart({ data })}
      />
    </Card>
  );
};

const MainContent = () => {
  const { loading, data: _data } = useData();
  const { filter } = useContext(FilterContext);
  const data = applyFilter(_data, filter);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const close = () => setVisible(false);
  const [src2, setSrc2] = useState("/images/image.png");
  const toggle = () => {
    if (src2 === "/images/image.png") setSrc2("/images/image2.png");
    else setSrc2("/images/image.png");
  };
  const close2 = () => setVisible2(false);
  return (
    <Layout style={{ padding: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridColumnGap: 16,
          marginBottom: 24
        }}
      >
        <DataCard
          title="Realtime visitors"
          value={120}
          color={DATA_CARD_COLOR.BLUE}
        />
        <DataCard
          title="Peak time"
          value={"12.00"}
          color={DATA_CARD_COLOR.PURPLE}
        />
        <DataCard
          title="Most active day"
          value={"Monday"}
          color={DATA_CARD_COLOR.GREEN}
        />
        <DataCard
          title="Least active day"
          value={"Tuesday"}
          color={DATA_CARD_COLOR.PINK}
        />
      </div>
      <Container>
        <ChartCard loading={loading} data={data} chart={RetentionChart} />
        <ChartCard span={1} loading={loading} data={data} chart={GenderChart} />
        <ChartCard span={1} loading={loading} data={data} chart={AgeChart} />
        <ChartCard
          loading={loading}
          data={data}
          chart={props => (
            <FrequencyNumberChart
              {...props}
              onClick={() => setVisible2(true)}
            />
          )}
        />
        <ChartCard
          loading={loading}
          data={data}
          chart={props => (
            <FrequencyVisitorChart
              {...props}
              onClick={() => setVisible2(true)}
            />
          )}
        />
        <ChartCard
          loading={loading}
          data={data}
          chart={props => (
            <ConversionChart {...props} onClick={() => setVisible2(true)} />
          )}
        />
        <ChartCard
          loading={loading}
          data={data}
          chart={props => (
            <TimeSpendChart {...props} onClick={() => setVisible(true)} />
          )}
        />
        <ChartCard
          loading={loading}
          data={data}
          chart={props => (
            <PeopleGroupChart {...props} onClick={() => setVisible2(true)} />
          )}
        />
      </Container>
      <Modal
        title="Customer Walking Heat Map"
        visible={visible}
        footer={null}
        onCancel={close}
      >
        <img
          src={`/images/heat${Math.random() > 0.5 ? 1 : 2}.jpg`}
          style={{ width: "100%" }}
        />
      </Modal>
      <Modal
        width="70vw"
        title="Customer Summary"
        visible={visible2}
        footer={null}
        onCancel={close2}
      >
        <img src={src2} style={{ width: "100%" }} onClick={toggle} />
      </Modal>
    </Layout>
  );
};

const Home = () => {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  );
};

export default Home;
