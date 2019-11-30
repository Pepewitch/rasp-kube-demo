import React, { createContext, useState } from "react";
import moment from "moment";

const DEFAULT_FILTER = {
  male: true,
  female: true,
  age15: true,
  age24: true,
  age30: true,
  age40: true,
  day: -1,
  time: -1,
  range: [
    moment("06/07/2019", "DD/MM/YYYY"),
    moment("12/07/2019", "DD/MM/YYYY")
  ]
};

export const FilterContext = createContext();

export const FilterContextProvider = props => {
  const [filter, setFilter] = useState({
    ...DEFAULT_FILTER
  });
  return <FilterContext.Provider {...props} value={{ filter, setFilter }} />;
};

export const applyFilter = (data, filter) => {
  if (!data) return data;
  return data.filter(e => {
    if (!filter.male && e.gender === "Male") return false;
    if (!filter.female && e.gender === "Female") return false;
    if (!filter.age15 && e.age >= 15 && e.age < 24) return false;
    if (!filter.age24 && e.age >= 24 && e.age < 30) return false;
    if (!filter.age30 && e.age >= 30 && e.age < 40) return false;
    if (!filter.age40 && e.age >= 40 && e.age < 50) return false;
    for (let i = 0; i < 7; i++) {
      if (filter.day === i && e.timestamp.day() !== i) return false;
    }
    for (let i = 8; i < 23; i++) {
      if (filter.time === i && e.timestamp.hour() !== i) return false;
    }
    if (filter.range[0] && e.timestamp.valueOf() < filter.range[0].valueOf())
      return false;
    if (filter.range[1] && e.timestamp.valueOf() > filter.range[1].valueOf())
      return false;
    return true;
  });
};
