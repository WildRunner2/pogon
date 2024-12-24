import React, { useState } from "react";
import SqlAddFormat from "../components/sqlAddFormat";


const SqlScripts = (props) => {
  const [page, setPage] = useState(<SqlAddFormat />);
  
  
  

  return (
    <div className="sqlscripts">
      <h1>SQL Scripts</h1>
      <p>Content under development, for now only formatting of sql scripts is available</p>

      <div className="sqlContainer">     

        <div className="sqlMainContainer">{page}</div>
      </div>
    </div>
  );
};

export default SqlScripts;
