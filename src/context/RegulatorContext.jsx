import { createContext, useState } from "react";

export const RegulatorContext = createContext();

export const RegulatorProvider = ({ children }) => {
  let regulatorData = JSON.parse(localStorage.getItem("regulator"));
  let regulatorToken = localStorage.getItem("regulatorToken");
  
  const [regulator, setRegulator] = useState({
    Id: regulatorData?.Id,
    Email: regulatorData?.Email,
    FullName: regulatorData?.FullName,
    Role: regulatorData?.Role,
    token: regulatorToken,
  });

  const value = { regulator, setRegulator };

  return (
    <RegulatorContext.Provider value={value}>
      {children}
    </RegulatorContext.Provider>
  );
};

