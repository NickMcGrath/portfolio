import React from 'react';
import PortfolioScreenerForm2 from "./components/portfolio_screener_form";

let tableData = [
  {
    display: "display title",
    subEntries: [{
      display: "sub display",
      apiKey: "sub api key",
      description: "Hello I do this",
      min: 10,
      max: 100,
      setMin: 10,
      setMax: 90,
      multiplier: -1
    }, {
      display: "sub display two",
      apiKey: "sub api key two",
      description: "Hello I do that 2",
      min: -10,
      max: 100,
      setMin: 10,
      setMax: 90,
      multiplier: -1
    }]
  },
  {
    display: "display title two",
    subEntries: [{
      display: "sub display three",
      apiKey: "sub api key two",
      description: "Hello I do something 3",
      min: 5,
      max: 10,
      setMin: 5,
      setMax: 10,
      multiplier: -1
    }, {
      display: "sub display four",
      apiKey: "sub api key four",
      description: "Hello I do not sure 4",
      min: 1,
      max: 3,
      setMin: 1,
      setMax: 3,
      multiplier: -1
    }]
  },
]

export default function App() {
  return (
    <div>
      <PortfolioScreenerForm2 elements={tableData}/>
    </div>
  )
}
