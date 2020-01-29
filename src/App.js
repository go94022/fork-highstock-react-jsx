import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import Resizable from "re-resizable";
import {
  HighchartsStockChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Title,
  AreaSplineSeries,
  SplineSeries,
  Navigator,
  CandlestickSeries,
  Tooltip
} from "react-jsx-highstock";
import data from "./data";

const StaticSimpleChart = (state, data2) => {
  if (state === "Candle") {
    return <CandlestickSeries id="profit" name="Candle Chart" data={data2} />;
  } else if (state === "Line") {
    return <SplineSeries id="profit" name="Line Chart" data={data2} />;
  } else if (state === "Area") {
    return <AreaSplineSeries id="profit" name="Area Chart" data={data2} />;
  }
};

const Indicators = {
  height: "3px"
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data2: data.map(e => {
        return [e.time, e.Open, e.High, e.Low, e.Close];
      }),
      state: "Line",
      period: 12,
      indicator: null
    };
  }
  render() {
    const { data2, state, indicator } = this.state;

    const StaticindicatorChart = period => {
      if (indicator === "MovingAverage") {
        return (
          <div>
            <SplineSeries
              id="indicator"
              name="MovingAverage"
              data={maxim("ma", "close", period)}
            />
          </div>
        );
      } else if (indicator === null) {
        return <div />;
      }
    };
    const buttonChange = () => {
      return (
        <div>
          <button
            onClick={() => {
              this.setState({ state: "Candle" });
            }}
          >
            Candle
          </button>
          <button
            onClick={() => {
              this.setState({ state: "Line" });
            }}
          >
            Line
          </button>
          <button
            onClick={() => {
              this.setState({ state: "Area" });
            }}
          >
            Area
          </button>
        </div>
      );
    };
    const indicatorChange = () => {
      return (
        <div>
          <button
            onClick={() => {
              this.setState({ indicator: "MovingAverage" });
            }}
          >
            MovingAverage
          </button>
          <button
            onClick={() => {
              this.setState({ indicator: null });
            }}
          >
            Null
          </button>
        </div>
      );
    };
    const maxim = (e, type, func) => {
      const arr = data2.map(e => {
        switch (type) {
          case "close":
            return e[4];
          case "open":
            return e[1];
          case "high":
            return e[2];
          case "low":
            return e[3];
          default:
            break;
        }
      });
      if (e === "max") {
        return Math.max.apply(null, arr);
      } else if (e === "min") {
        return Math.min.apply(null, arr);
      } else if (e === "ma") {
        return arr.map((e, i) => {
          const n = i - func;
          return [data2[i][0], (arr[i] + arr[n]) / 2];
        });
      }
    };
    return (
      <div className="app">
        <div>{buttonChange()}</div>
        <div>{indicatorChange()}</div>
        <HighchartsStockChart>
          <Chart zoomType="x" />

          <Title>Highstocks Example</Title>

          <Tooltip />
          <XAxis>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>
          <div>
            <YAxis
              id="price"
              opposite
              min={maxim("min", "close", 12)}
              max={maxim("max", "close", 12)}
            >
              <YAxis.Title>Price</YAxis.Title>
              {StaticSimpleChart(state, data2)}
              {StaticindicatorChart(this.state.period)}
            </YAxis>
          </div>
        </HighchartsStockChart>
        <Resizable defaultSize={{ height: "40px" }} maxHeight={"60px"}>
          <HighchartsStockChart height="15%">
            <Tooltip />
            <XAxis>
              <XAxis.Title>Time</XAxis.Title>
            </XAxis>
              <YAxis
                id="price close"
                opposite
                min={maxim("min", "close", 12)}
                max={maxim("max", "close", 12)}
              >
                <YAxis.Title>Price Close</YAxis.Title>
                {StaticSimpleChart(state, data2)}
                {StaticindicatorChart(this.state.period)}
              </YAxis>
              <YAxis
                id="price"
                min={maxim("min", "high", 12)}
                max={maxim("max", "high", 12)}
              >
                <YAxis.Title>Price High</YAxis.Title>
                {StaticSimpleChart(state, data2)}
                {StaticindicatorChart(this.state.period)}
              </YAxis>

            <Navigator>
            </Navigator>
          </HighchartsStockChart>
        </Resizable>
      </div>
    );
  }
}

export default withHighcharts(App, Highcharts);
