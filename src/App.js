import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    ratesArray: [],
  }

  dataFetch = (baseCurrency = 'EUR') => {
    fetch(`https://api.exchangeratesapi.io/latest?symbols=AUD,BRL,CAD,CHF,GBP&base=${baseCurrency}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          currencyData: responseJson,
        });
        this.rateLoop();
      });
  }

  // Loop through JSON response and create an array of rates
  rateLoop = () => {
    const rates = this.state.currencyData.rates;

    // Get max value of rates, to use as bar height ratio
    const ratesValuesArray = Object.values(rates);
    const maxRate = Math.max(...ratesValuesArray);

    let ratesArray = [];

    // Create rates as objects
    for (const key in rates) {
      const rateObj = {};
      const val = rates[key];
      const bar = (val / maxRate) * 100;
      rateObj.currency = key;
      rateObj.value = val;
      rateObj.barHeight = bar;
      ratesArray.push(rateObj);
    }

    this.setState({
      ratesArray: ratesArray,
    });
  }

  componentDidMount() {
    this.dataFetch();
  }

  render() {
    return (
      <div className="App">
        <section className="SelectorSection">
          <h1>Exchange Rates</h1>
          <h3>Select a base currency:</h3>
          <div className="SelectorContainer">
            <div className="SelectorButtonsContainer">
              <button className="SelectorButton" onClick={() => this.dataFetch('EUR')}>EUR</button>
              <button className="SelectorButton" onClick={() => this.dataFetch('USD')}>USD</button>
            </div>
          </div>
        </section>

        <div id="ChartContainer">
          {
            this.state.ratesArray.map((item) => (
              <div key={item.currency} className="ChartBar" style={{height: item.barHeight + '%'}}>
                <div className="ChartBar-label">{item.currency}</div>
                <div className="ChartBar-label">{item.value}</div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
