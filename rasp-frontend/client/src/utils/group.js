import React, { createContext, useState } from "react";

const DEFAULT_GROUP = "none";

export const GroupContext = createContext();

export const GroupContextProvider = props => {
  const [group, setGroup] = useState(DEFAULT_GROUP);
  return <GroupContext.Provider {...props} value={{ group, setGroup }} />;
};

export const applyGroup = (data, group) => {
  // TODO: apply group by method to data
};
