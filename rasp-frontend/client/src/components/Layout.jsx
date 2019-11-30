import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Select,
  Card,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Divider,
  Radio
} from "antd";
import history from "../utils/history";
import styled from "styled-components";
import { FilterContext } from "../utils/filter";
import { GroupContext } from "../utils/group";

const { Sider, Header } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Sidebar = ({ collapsed, onCollapse }) => {
  const { filter, setFilter } = useContext(FilterContext);
  const { group, setGroup } = useContext(GroupContext);
  return (
    <Sider
      collapsible={false}
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={280}
      style={{
        position: "fixed",
        height: "100vh",
        paddingTop: 64,
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          padding: "0 24px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 24
          }}
        >
          <img src="/images/adidas.svg" />
          <span style={{ marginLeft: 16, fontWeight: 600, fontSize: "1.4rem" }}>
            Adidas
          </span>
        </div>
        <Divider />
        <span
          style={{
            fontWeight: 600,
            fontSize: "1.3rem",
            marginBottom: "0.5rem",
            marginTop: "-0.25rem"
          }}
        >
          Filter
        </span>
        <span
          style={{
            marginBottom: "0.3rem",
            fontSize: "0.9rem",
            color: "#777"
          }}
        >
          Date Range
        </span>
        <RangePicker
          value={filter.range}
          onChange={e => setFilter({ ...filter, range: e })}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 16,
            gridRowGap: 16
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              paddingRight: 4
            }}
          >
            <span
              style={{
                marginBottom: "0.3rem",
                fontSize: "0.9rem",
                color: "#777"
              }}
            >
              Day
            </span>
            <Select
              value={filter.day}
              onChange={value => setFilter({ ...filter, day: value })}
            >
              <Option value={-1}>No Filter</Option>
              <Option value={0}>Sun</Option>
              <Option value={1}>Mon</Option>
              <Option value={2}>Tue</Option>
              <Option value={3}>Wed</Option>
              <Option value={4}>Thu</Option>
              <Option value={5}>Fri</Option>
              <Option value={6}>Sat</Option>
            </Select>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              paddingLeft: 4
            }}
          >
            <span
              style={{
                marginBottom: "0.3rem",
                fontSize: "0.9rem",
                color: "#777"
              }}
            >
              Time
            </span>
            <Select
              value={filter.time}
              onChange={value => setFilter({ ...filter, time: value })}
            >
              <Option value={-1}>No Filter</Option>
              <Option value={8}>08:00-09:00</Option>
              <Option value={9}>09:00-10:00</Option>
              <Option value={10}>10:00-11:00</Option>
              <Option value={11}>11:00-12:00</Option>
              <Option value={12}>12:00-13:00</Option>
              <Option value={13}>13:00-14:00</Option>
              <Option value={14}>14:00-15:00</Option>
              <Option value={15}>15:00-16:00</Option>
              <Option value={16}>16:00-17:00</Option>
              <Option value={17}>17:00-18:00</Option>
              <Option value={18}>18:00-19:00</Option>
              <Option value={19}>19:00-20:00</Option>
              <Option value={20}>20:00-21:00</Option>
              <Option value={21}>21:00-22:00</Option>
            </Select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <span
            style={{
              marginTop: 16,
              gridColumn: "span 2",
              marginBottom: "0.3rem",
              fontSize: "0.9rem",
              color: "#777"
            }}
          >
            Gender
          </span>
          <div>
            <Checkbox
              style={{ fontSize: "0.95rem" }}
              checked={filter.male}
              onChange={e => setFilter({ ...filter, male: e.target.checked })}
            >
              Male
            </Checkbox>
          </div>
          <div>
            <Checkbox
              style={{ fontSize: "0.95rem" }}
              checked={filter.female}
              onChange={e => setFilter({ ...filter, female: e.target.checked })}
            >
              Female
            </Checkbox>
          </div>
          <span
            style={{
              marginTop: 16,
              gridColumn: "span 2",
              marginBottom: "0.3rem",
              fontSize: "0.9rem",
              color: "#777"
            }}
          >
            Age Range
          </span>
          <div>
            <Checkbox
              style={{ fontSize: "0.95rem" }}
              checked={filter.age15}
              onChange={e => setFilter({ ...filter, age15: e.target.checked })}
            >
              15 - 24
            </Checkbox>
          </div>
          <div>
            <Checkbox
              style={{ fontSize: "0.95rem" }}
              checked={filter.age24}
              onChange={e => setFilter({ ...filter, age24: e.target.checked })}
            >
              24 - 30
            </Checkbox>
          </div>
          <div>
            <Checkbox
              style={{ fontSize: "0.95rem" }}
              checked={filter.age30}
              onChange={e => setFilter({ ...filter, age30: e.target.checked })}
            >
              30 - 40
            </Checkbox>
          </div>
          <div>
            <Checkbox
              style={{ fontSize: "0.95rem" }}
              checked={filter.age40}
              onChange={e => setFilter({ ...filter, age40: e.target.checked })}
            >
              40 - 50
            </Checkbox>
          </div>
          <Divider style={{ gridColumn: "span 2", marginTop: 28 }} />
          <span
            style={{
              gridColumn: "span 2",
              fontWeight: 600,
              fontSize: "1.3rem",
              marginTop: "-0.25rem"
            }}
          >
            Group by
          </span>
          <Radio.Group
            onChange={e => setGroup(e.target.value)}
            value={group}
            style={{
              gridColumn: "span 2",
              fontWeight: 600,
              fontSize: "1.6rem"
            }}
          >
            <Radio
              style={{ fontSize: "0.95rem", width: "100%" }}
              value={"none"}
            >
              None
            </Radio>
            <Radio style={{ fontSize: "0.95rem", width: "100%" }} value={"age"}>
              Age
            </Radio>
            <Radio
              style={{ fontSize: "0.95rem", width: "100%" }}
              value={"gender"}
            >
              Gender
            </Radio>
          </Radio.Group>
        </div>
      </div>
    </Sider>
  );
};

export const PageLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = e => {
    setCollapsed(e);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ paddingLeft: 280, paddingTop: 64 }}>{children}</Layout>
      <Sidebar collapsed={collapsed} onCollapse={onCollapse} />
      <Header
        style={{
          position: "fixed",
          width: "100vw",
          background: "#2BC1D9",
          boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.4)"
        }}
      >
        <h1 style={{ color: "white", fontWeight: 800 }}>IRIS</h1>
      </Header>
    </Layout>
  );
};
