import React, { useEffect, useRef, useState, useContext } from "react";
import { format } from "sql-formatter";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import auth from "../env";
import CodeMirror from "@uiw/react-codemirror";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { sql } from "@codemirror/lang-sql";
import { OpenContext } from "../pages/Layout";
import Cookies from "js-cookie";

const SqlAddFormat = (props) => {
  const openfromContext = useContext(OpenContext);
  const [formatLang, setFormatLang] = useState("transactsql");
  const [value, setValue] = useState(props?.data?.sql);
  const [categories, setCategories] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const sqlForm = useRef(null);

  // Helper method to determine the host
  const getHost = () => (auth.DEV ? auth.DEV_URL : auth.PROD_URL);
  const host = getHost();

  // OnChange for CodeMirror
  const onChange = React.useCallback((val) => {
    setValue(val);
  }, []);

  // Fetch categories
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const token = getAuthToken();
  //     const userId = getUserId();

  //     const path = `${host}/api/scripts/cat/${userId}`;
  //     try {
  //       const response = await axios.get(path, {
  //         headers: { Authorization: `Basic ${token}` },
  //       });
  //       if (response.data.data) setCategories(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     }
  //   };

  //   fetchCategories();
  // }, [host]);

  // // Fetch all scripts
  // useEffect(() => {
  //   const fetchScripts = async () => {
  //     const token = getAuthToken();
  //     const userId = getUserId();

  //     const path = `${host}/api/scripts/${userId}`;
  //     try {
  //       const response = await axios.get(path, {
  //         headers: { Authorization: `Basic ${token}` },
  //       });
  //       if (response.data.data) setScripts(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching scripts:", error);
  //     }
  //   };

  //   fetchScripts();
  // }, [host]);

  // Helper methods for user and token
  const getUserId = () => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      if (user.logged) return user.id;
    }
    return -1;
  };

  const getAuthToken = () => {
    const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = auth;
    return btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
  };

  const setLang = (event) => {
    setFormatLang(event.target.value);
  };

  const formatSql = (event) => {
    event.preventDefault();
    try {
      setValue(format(value, { language: formatLang }));
    } catch (error) {
      console.error(error);
    }
  };

  const clearSql = (event) => {
    event.preventDefault();
    setValue("");
  };

  // const saveSql = async (event) => {
  //   event.preventDefault();
  //   const sql = value;
  //   const categoryId = sqlForm.current.category.value;
  //   const scriptName = sqlForm.current.script_name.value;
  //   const userId = getUserId();
  //   const token = getAuthToken();

  //   try {
  //     const response = await axios.post(
  //       `${host}/api/scripts/`,
  //       { sql, userId, categoryId, scriptName },
  //       { headers: { Authorization: `Basic ${token}` } }
  //     );
  //     setMessage(response.data?.msg === "OK" ? "Saved successfully" : "Save failed");
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error("Error saving SQL:", error);
  //   }
  // };

  // const updateSql = async (scriptId, updatedSql, categoryId, scriptName) => {
  //   const userId = getUserId();
  //   const token = getAuthToken();

  //   try {
  //     const response = await axios.put(
  //       `${host}/api/scripts/${scriptId}`,
  //       { sql: updatedSql, userId, categoryId, scriptName },
  //       { headers: { Authorization: `Basic ${token}` } }
  //     );
  //     setMessage(response.data?.msg === "OK" ? "Updated successfully" : "Update failed");
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error("Error updating SQL:", error);
  //   }
  // };

  const deleteSql = async (scriptId) => {
    const token = getAuthToken();

    try {
      const response = await axios.delete(`${host}/api/scripts/${scriptId}`, {
        headers: { Authorization: `Basic ${token}` },
      });
      setMessage(response.data?.msg === "OK" ? "Deleted successfully" : "Delete failed");
      setShowModal(true);
      setScripts((prevScripts) => prevScripts.filter((script) => script.id !== scriptId));
    } catch (error) {
      console.error("Error deleting SQL:", error);
    }
  };

  return (
    <>
      {/* SQL Add/Edit Form */}
      <form ref={sqlForm} className="sqlForm">
        {/* <div className="sqlNavBar row">
          <div className="col-3">
            <label htmlFor="category" className="sql_form-label">Category</label>
            <select name="category" id="category" className="sqlCatChoose">
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-7">
            <label htmlFor="script_name" className="sql_form-label">Script Name</label>
            <input className="sqlName" id="script_name" name="script_name" type="text" />
          </div>
        </div> */}
        <CodeMirror
          className={openfromContext ? "formated2" : "formated"}
          value={value}
          name="sql"
          id="sql"
          spellCheck="false"
          height="100%"
          theme={basicDark}
          onChange={onChange}
          extensions={[sql()]}
        />
        <div className="sqlFormBar2">
          <button onClick={formatSql} className="button_script" type="button">Format</button>
          <button onClick={clearSql} className="button_script" type="button">Clear</button>
          {/* <button onClick={saveSql} className="button_script" type="submit" disabled="true">Save</button> */}
        </div>
        <div className="sqlFormBar1">
          <select
            name="sqlFormat"
            id="sqlFormat"
            className="sqlLangChoose"
            onChange={setLang}
            defaultValue="transactsql"
          >
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

      {/* List of All Scripts */}
      <div>
        <h3>All Scripts</h3>
        {scripts.map((script) => (
          <form key={script.id} className="sqlForm">
            <div className="sqlNavBar row">
              <div className="col-3">
                <label htmlFor={`category-${script.id}`} className="sql_form-label">Category</label>
                <select
                  name={`category-${script.id}`}
                  id={`category-${script.id}`}
                  className="sqlCatChoose"
                  defaultValue={script.categoryId}
                  onChange={(e) => (script.categoryId = e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-7">
                <label htmlFor={`script_name-${script.id}`} className="sql_form-label">Script Name</label>
                <input
                  className="sqlName"
                  id={`script_name-${script.id}`}
                  name={`script_name-${script.id}`}
                  type="text"
                  defaultValue={script.scriptName}
                  onChange={(e) => (script.scriptName = e.target.value)}
                />
              </div>
            </div>
            <CodeMirror
              className="formated2"
              value={script.script}
              name={`sql-${script.id}`}
              id={`sql-${script.id}`}
              spellCheck="false"
              height="100%"
              theme={basicDark}
              extensions={[sql()]}
              onChange={(val) =>
                setScripts((prevScripts) =>
                  prevScripts.map((s) =>
                    s.id === script.id ? { ...s, script: val } : s
                  )
                )
              }
            />
            <div className="sqlFormBar2">
              <button
                type="button"
                onClick={() => {
                  const formattedScript = format(script.script, { language: formatLang });
                  setScripts((prevScripts) =>
                    prevScripts.map((s) =>
                      s.id === script.id ? { ...s, script: formattedScript } : s
                    )
                  );
                }}
                className="button_script"
              >
                Format
              </button>
              <button
                type="button"
                onClick={() =>
                  setScripts((prevScripts) =>
                    prevScripts.map((s) =>
                      s.id === script.id ? { ...s, script: "" } : s
                    )
                  )
                }
                className="button_script"
              >
                Clear
              </button>
              {/* <button
                type="button"
                onClick={() =>
                  updateSql(script.id, script.script, script.categoryId, script.scriptName)
                }
                className="button_script"
              >
                Update
              </button> */}
              <button
                type="button"
                onClick={() => deleteSql(script.id)}
                className="button_script"
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>

      {/* Modal for Success/Failure Messages */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SqlAddFormat;
