import React, { useEffect, useRef, useState, useContext} from "react";
import { format } from "sql-formatter";
import axios from "axios";
import auth from "../env";
import CodeMirror from '@uiw/react-codemirror';
import { basicDark } from '@uiw/codemirror-theme-basic';
// import { gruvboxDark } from '@uiw/codemirror-theme-gruvbox-dark';
import { sql } from "@codemirror/lang-sql";
import { OpenContext } from "../pages/Layout";


const SqlAddFormat = (props) => {
  const openfromContext = useContext(OpenContext);
  const [formatLang, setFormatLang] = useState("transactsql")
  const [value, setValue] = React.useState(props?.data?.sql);
  const sqlForm = useRef(null);
  
  
  const onChange = React.useCallback((val, viewUpdate) => {
   
    setValue(val);
  }, []);


  const setlang = (event) => {
    event.preventDefault()
    setFormatLang(event.target.value)
    console.log(formatLang)

  }
  

  const formatSql = (event) => {
    event.preventDefault();
    const sqlValue = value;
    console.log(formatLang)
    try {
      setValue(format(sqlValue, { language: formatLang }));    
     
    } catch (error) {
      console.error(error)
    }
    
  };  

  const clearSql = (event) => {
    event.preventDefault();
    setValue(""); // Clear the formatted SQL
   
  };

  const saveSql = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const sql = value;
    const userId = "1";
    const Busername = auth.BASIC_AUTH_USERNAME;
    const Bpassword = auth.BASIC_AUTH_PASSWORD;
    const token = btoa(`${Busername}:${Bpassword}`); // Encode credentials

    try {
      const response = await axios.post(
        "https://jbsite-api.onrender.com/api/scripts/",
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
    
        
        <form ref={sqlForm} className="sqlForm">
            <CodeMirror className={openfromContext ? "formated2":"formated"} value={value}  name="sql"
            id="sql" spellCheck="false" height="100%" theme={basicDark} onChange={onChange} 
            extensions={[sql()]} />
        {/* <textarea
            type="text"
            spellCheck="false"
            name="sql"
            id="sql"
            className="formated"
            value={formated}
            onChange={handleChange}
        ></textarea> */}
        
        <div className="sqlFormBar2">
            <button onClick={formatSql} className="button_script" type="button">Format</button>
            <button onClick={clearSql} className="button_script" type="button">Clear</button>
            <button onClick={saveSql} className="button_script" type="submit" disabled="true">Save</button>
        </div>

        <div className="sqlFormBar1">
            <select name="sqlFormat" id="sqlFormat" className="sqlLangChoose" onChange={setlang} defaultValue="transactsql">
            <option value="sql">sql</option>
            <option value="bigquery">bigquery</option>
            <option value="db2">db2</option>
            <option value="db2i">db2i</option>
            <option value="hive">hive</option>
            <option value="mariadb">mariadb</option>
            <option value="mysql">mysql</option>
            <option value="tidb">tidb</option>
            <option value="n1ql">n1ql</option>
            <option value="plsql">plsql</option>
            <option value="postgresql">postgresql</option>
            <option value="redshift">redshift</option>
            <option value="singlestoredb">singlestoredb</option>
            <option value="snowflake">snowflake</option>
            <option value="spark">spark</option>
            <option value="sqlite">sqlite</option>
            <option value="transactsql">transactsql</option>
            <option value="trino">trino</option>
            </select>
        </div>
        
        
        </form>
             
  );
};

export default SqlAddFormat;
