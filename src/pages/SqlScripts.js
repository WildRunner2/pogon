import React, { useRef, useState } from "react";
import { format } from "sql-formatter";
import axios from "axios";
import auth from "../env";

const SqlScripts = () => {
  const [formated, setFormated] = useState("");
  const [mode, setMode] = useState(false);
  const sqlForm = useRef(null);

  const formatSql = (event) => {
    event.preventDefault();
    const sqlValue = sqlForm.current.sql.value;
    setFormated(format(sqlValue, { language: "mysql" }));    
    setMode(true);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormated(event.target.value); // Update the `formated` state
    setMode(false);
  };

  const clearSql = (event) => {
    event.preventDefault();
    setFormated(""); // Clear the formatted SQL
    setMode(false);
  };

  const saveSql = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const sql = sqlForm.current.sql.value;
    const userId = "1";
    const Busername = auth.BASIC_AUTH_USERNAME;
    const Bpassword = auth.BASIC_AUTH_PASSWORD;
    const token = btoa(`${Busername}:${Bpassword}`); // Encode credentials

    try {
      const response = await axios.post(
        "http://localhost:3010/api/scripts/",
        { sql, userId },
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      console.log("Response:", response);
    } catch (error) {
      console.error("Error saving SQL:", error);
    }
  };

  return (
    <div >
      <h1>SQL Scripts</h1>
      <p>Content under development, for now only formatting of sql scripts is available</p>
      <form ref={sqlForm} className="ss">
        <textarea
          type="text"
          spellCheck="false"
          name="sql"
          id="sql"
          className="formated form-control"
          value={formated}
          onChange={handleChange}
        ></textarea>
        <button onClick={formatSql} className="button_script" type="button">
          Format
        </button>
        <button onClick={clearSql} className="button_script" type="button">
          Clear
        </button>
        <button onClick={saveSql} className="button_script" type="submit" disabled="true">
          Save
        </button>
      </form>
    </div>
  );
};

export default SqlScripts;
