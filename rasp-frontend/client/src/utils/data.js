import moment from "moment";
import { get } from "lodash";
import { useState, useEffect } from "react";

const formatData = data => {
  return data.map(e => ({
    ...e,
    timestamp: moment(
      `${get(e, "date")} ${get(e, "time")}`,
      "DD/MM/YYYY HH:mm:ss"
    )
  }));
};

export const getData = async () => {
  const data = await fetch("/data").then(data => data.json());
  return formatData(data);
};

export const useData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(undefined);
  useEffect(() => {
    getData().then(e => {
      setData(e);
      setLoading(false);
    });
  }, []);
  return { loading, data };
};
