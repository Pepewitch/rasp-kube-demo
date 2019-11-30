import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import Home from "./components/pages/Home";
import Raw from "./components/pages/Raw";
import { FilterContextProvider } from "./utils/filter";
import echarts from "echarts";
import { theme, genderTheme, ageTheme } from "./utils/theme";
import { GroupContextProvider } from "./utils/group";

const App = () => {
  useEffect(() => {
    echarts.registerTheme("my_theme", theme);
    echarts.registerTheme("gender_theme", genderTheme);
    echarts.registerTheme("age_theme", ageTheme);
  }, []);
  return (
    <GroupContextProvider>
      <FilterContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/raw" exact component={Raw} />
        </Switch>
      </FilterContextProvider>
    </GroupContextProvider>
  );
};

export default App;
