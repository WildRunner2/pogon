import { Outlet } from "react-router-dom";
import React, { createContext } from "react";

export const OpenContext = createContext();

const NoLayout = () => {
  
  return (
    <>
      <OpenContext.Provider >        

        
          <Outlet />
       

        {/* <div className="footer">footer</div> */}
      </OpenContext.Provider>
    </>
  );
};

export default NoLayout;
