import React from 'react';
import Graph from "react-graph-vis";

import  pl from '../translations/polski.json'
import  en from '../translations/english.json'


function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

function makeItColor(myGraph, functionType){
  let type = functionType
  myGraph.edges.forEach(element => {
    let to = element.to
    let type1 = element.type
    const index = myGraph.nodes.findIndex(object => {
      return object.id === to;
     });
    let terminalNodeLabel = myGraph.nodes[index].label
    
    if(type === "KPS"){
      if(type1 === "terminal" && terminalNodeLabel === "1" ){
        element.color = "#cc0000"
      } 
      if(type1 === "terminal" && terminalNodeLabel === "0" ){
        element.dashes = true
      }
    } else {
      if(type1 === "terminal" && terminalNodeLabel === "0" ){
        element.color = "#cc0000"
      } 
      if(type1 === "terminal" && terminalNodeLabel === "1" ){
        element.dashes = true
      }
    }
  })
  myGraph.nodes.forEach(element => {
    if(type === "KPS"){
      if(element.type === "terminal" && element.label === "1" ){
        element.color = "#86df76"
      } 
      if(element.type === "terminal" && element.label === "0" ){
      }
    } else {
      if(element.type === "terminal" && element.label === "0" ){
        element.color = "#86df76"
      } 
      if(element.type === "terminal" && element.label === "1" ){
      }
    }
  })
}
function makeExpressions(myGraph, functionType, varM){

  for(let i=0; i<varM.size ;i++){
    myGraph.nodes.forEach(element => {
      let parentExp = "varM.get(1)"
      let parentLabel = ""
      if(element.parent !== undefined){
        const index6 = myGraph.nodes.findIndex(object => {
          return object.id === element.parent;
        });
        if(index6 >= 0){
          parentExp = myGraph.nodes[index6].exp
          parentLabel = myGraph.nodes[index6].label
        } 
      } else {
        parentLabel = varM.get(1)
      }

      if(functionType === "KPS"){
          if(element.id.slice(element.id.length-1,element.id.length) === "0"){
            element.exp = parentExp +"/"+ parentLabel
            element.title = element.exp
          } else if(element.id.slice(element.id.length-1,element.id.length) === "1") { //element.side==="right"
            element.exp = parentExp + parentLabel
            element.title = element.exp
          }
      } else { //function.type==="KPI"
        if(String(element.id.slice(element.id.length-1,element.id.length)) === "0"){
          if(parentExp.length === 0){
            element.exp = parentExp + parentLabel
          }else {
            element.exp = parentExp +"+"+ parentLabel
          }
          element.title = element.exp
        } else if(element.id.slice(element.id.length-1,element.id.length) === "1") { //element.side==="right"
          if(parentExp.length === 0){
            element.exp = parentExp +"/"+ parentLabel
          }else {
            element.exp = parentExp +"+/"+ parentLabel
          }
          element.title = element.exp
        }
      } 
    })
  }
 
}
function Bdd(props){
  const myGraph = { nodes:[], edges:[] }
  const thruMap = props.truthMap
  const newVarMap = props.newVarMap
  const functionType = props.functionType
  const language = props.language
  let lang
  if(language === 'pl'){
    lang = pl
  }else{
    lang = en
  }
  // variable nodes - nonterminal
  for(let i=Math.pow(2,(newVarMap.size-1)); i>=0; i--){
    let id = ""
    let element = newVarMap.get(i)
    let key = getByValue(newVarMap, element)
    for(let j=Math.pow(2,(key-1)); j>=1; j--){
      let value = "" 
      for(let k=0; k<key-1; k++){
        let val = (j & Math.pow(2,k)) ? "1" : "0"
        value = String(value+val)
      }
      id = String(element+value)
        myGraph.nodes.push({type: "nonterminal",  id: String(id), label: element, parent: String(newVarMap.get(key-1))+String(value).slice(0,String(value).length-1), shape: "eclipse", exp:"",  font:{size:30}, borderWidth:2})
    }
  }
  // value nodes - terminal
  for (const [key, value] of thruMap.entries()) {
    myGraph.nodes.push({type: "terminal", id: String(key), label: String(value),parent: String(newVarMap.get(newVarMap.size))+String(key).slice(0,String(key).length-1), shape: "box",  exp:"", font:{size:30}})
  }

  myGraph.nodes.sort(function(a, b){
    return a.parent - b.parent;
  })
  // edges
  myGraph.nodes.forEach(element => {
    let id = element.id
    let parent = element.parent
    let type = element.type
    let value = element.label
    if(parent !== '0'){
     
      myGraph.edges.push(
        { from: parent,
          hoverWidth: 3,
          // physics: true,
          
    
          shadow:{
            enabled: false,
            color: 'rgba(0,0,0,0.5)',
            size:30
          },
          to: id,
          type: type,
          value1: value,
          label:String(id).slice(String(id).length-1, String(id).length),
          font:{size:30}})
        }
  })
  makeItColor(myGraph, functionType)
  
  myGraph.edges.sort(function(a, b){
    return a.to.slice(1) - b.to.slice(1)
  })
   const events = {
        select: function(event) {
        },
        
      };
  const options = {
    interaction:{hover:true},
    // physics:{
    //   enabled: true
    // },
    
    physics:{
      enabled: true,
      barnesHut: {
        theta: 0.5,
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: 95,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 0
      },
      forceAtlas2Based: {
        theta: 0.5,
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 100,
        damping: 0.4,
        avoidOverlap: 0
      },
      repulsion: {
        centralGravity: 0.2,
        springLength: 200,
        springConstant: 0.05,
        nodeDistance: 100,
        damping: 0.09
      },
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 100,
        springConstant: 0.01,
        nodeDistance: 120,
        damping: 0.09,
        avoidOverlap: 0
      },
      maxVelocity: 50,
      minVelocity: 0.1,
      solver: 'barnesHut',
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 100,
        onlyDynamicEdges: false,
        fit: true
      },
      timestep: 0.5,
      adaptiveTimestep: true,
      wind: { x: 0, y: 0 }
    },
    autoResize: true,
    layout: {
        randomSeed: undefined,
        improvedLayout:true,
        clusterThreshold: 150,
        hierarchical: {
          treeSpacing: 300,
          nodeSpacing: 150,
          edgeMinimization: true,
          parentCentralization: true,
          shakeTowards: "leaves",
          direction: "UD",
          sortMethod: "directed",
        }
      },
    edges: {
      color: "#000000"
    },
    nodes: {
      //color: "#FFFFFF",
      borderWidth: 0.7,
      color: {
        border: '#a6a6a6',
        background: '#FFFFFF',
        highlight: {
          border: '#cc0000',
          background: '#DF7676'
        },
        hover: {
          border: '#cc0000',
          background: '#DF7676'
        }
      },
  
  },
  height: "695px"
  };
  let important
  if(functionType === "KPS"){
    important = "1"
  } else { important = "0"}
  let countTerminalNodes = 0
  let countNonTerminalNodes = 0
  let countNodes = 0
  let countNodesTerminalImportant = 0
  let countEdges = 0
  myGraph.nodes.forEach( e =>{
    if(e.type === "terminal"){countTerminalNodes+=1}
    if(e.type === "nonterminal"){countNonTerminalNodes+=1}
    if(e.type === "terminal" && e.label === important){countNodesTerminalImportant+=1}
    countNodes=countNodes+1
  })
  myGraph.edges.forEach( e =>{
    countEdges=countEdges+1
  })
  countEdges = countEdges -1
  makeExpressions(myGraph, functionType, newVarMap)
  let functionTitle = ""
    
    
      if(functionType === "KPS"){
      
        functionTitle = lang.translation.diagrams.KPS
      } else {
        
        functionTitle = lang.translation.diagrams.KPI
      }
      return (
        <div className="parent" >
          <Graph
            graph={myGraph}
            options={options}
            events={events}
          />
          <div className="stats">
              <label className="stat1">{lang.translation.statusBar.statistic}: </label>
              <label className="stat1">{lang.translation.statusBar.nonTerminal}<label className='stat2'>({countNonTerminalNodes}),</label></label>
              <label className="stat1">{lang.translation.statusBar.terminal}<label className='stat2'>({countTerminalNodes}),</label></label>
              <label className="stat1">{lang.translation.statusBar.allNodes}<label className='stat2'>({countNodes}),</label></label>
              <label className="stat1">{lang.translation.statusBar.importantNodes} {functionTitle}<label className='stat2'>({countNodesTerminalImportant}),</label></label>
              <label className="stat1">{lang.translation.statusBar.edges}<label className='stat2'>({countEdges})</label></label>
            </div>
            
            
          
        </div>
      );
    
}

export default Bdd;

