import React from 'react';

function header(props){
  const varMap = new Map(props.newVarMap)
  const headerTable = []
  varMap.forEach((value, key) => {
    headerTable.push(value)
  })
  headerTable.push("f(x)")
  const inside = []
  const outside = []
  for(let i=0; i<headerTable.length; i++){
    let val = headerTable[i]
    inside.push(<th scope="col" key={i}>{val}</th>)
  }
  outside.push(<tr key='headers'>{inside}</tr>)
  return outside
}
function bodyValues(props){
  const truthM = new Map(props.truthMap)
  const valuesTable = []
  
  truthM.forEach((value, key)=>{
    const charArr = key.split('')
    charArr.push(value)
    valuesTable.push(charArr)
  })
  
  const outside = []
  for(let i=0; i<valuesTable.length; i++){
    const inside = []
    for(let j=0; j<valuesTable[0].length; j++){
      let id1 = String(i)+String(j)
      let val1 = valuesTable[i][j]
      if(j===valuesTable[0].length-1){
        inside.push(<td className='fx' id={id1} key={id1}>{val1}</td>) 
      } else {
      inside.push(<td id={id1} key={id1}>{val1}</td>)
      }    
    }
    outside.push(<tr id={i} key={i}>{inside}</tr>)    
  }
  return outside   
}
  
function TruthTable(props){
  const newVarMap = new Map(props.newVarMap)
  const headerTable = header(props)
  const valueTable = bodyValues(props)
 
  const varNum = newVarMap.size

  
  
  let tableWidhtClass = ""
  if(varNum > 10){
      tableWidhtClass = "d-flex justify-content-center bigTable"
  } else if(varNum > 6){
      tableWidhtClass = "d-flex justify-content-center middleTable"
  } else{ 
      tableWidhtClass = "d-flex justify-content-center smallTable"
  }

      return (
       
          <div className='parent4'>
            <div id="table1" className={tableWidhtClass}>
              <table className='table table-light table-striped table-hover '>
                <thead>{headerTable}</thead>
                <tbody>{valueTable}</tbody>
              </table>
            </div>
          </div>
        
      );
    
}

export default TruthTable;

