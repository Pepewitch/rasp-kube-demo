import React, { Fragment } from "react";
import { useData } from "../../utils/data";
import styled from "styled-components";
import { PageLayout } from "../Layout";
import _ from "lodash";
import { Table, Divider, Tag, Spin, Card } from "antd";

export default () => {
  const { loading, data } = useData();
  return (
    <PageLayout>
      <Card style={{ margin: "auto" }}>
        <Table
          loading={loading}
          pagination={false}
          columns={
            _.get(data, "[0]") &&
            Object.keys(data[0]).map(key => ({
              title: key,
              dataIndex: key,
              render: e => e.toString(),
              key
            }))
          }
          dataSource={
            _.get(data, "map") && data.map((e, index) => ({ ...e, key: index }))
          }
        />
      </Card>
    </PageLayout>
  );
};
