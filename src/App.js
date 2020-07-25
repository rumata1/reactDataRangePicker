import React, { Component } from "react";
import "./App.css";
import "moment/locale/ru";
const moment = require("moment");
moment.locale("ru");

console.log(moment().format("MMMM"));

const HOURS = [];
const MINUTES = [];

for (let i = 0; i < 24; i++) {
  HOURS.push(i);
}

for (let i = 0; i < 60; i++) {
  MINUTES.push(i);
}

class DataRangePicker extends Component {
  state = {
    startDate: moment().startOf("day"),
    endDate: moment().startOf("day").add(1, "month"),
    firstDate: null,
    secondDate: null,
    showCalendar: false,
  };

  renderCalendar(side) {
    let start = this.state.startDate;
    if (side) start = side;

    let month = start.month();
    let year = start.year();
    let hour = start.hour();
    let minute = start.minute();
    let second = start.second();

    //let daysInMonth = moment([year, month]).daysInMonth();
    let firstDay = moment([year, month, 1]);
    //let lastDay = moment([year, month, daysInMonth]);

    let lastMonth = moment(firstDay).subtract(1, "month").month();
    let lastYear = moment(firstDay).subtract(1, "month").year();

    let daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
    let dayOfWeek = firstDay.day();

    let startDay = daysInLastMonth - dayOfWeek + 2;
    console.log(daysInLastMonth, dayOfWeek);

    if (startDay > daysInLastMonth) startDay -= 7;
    if (dayOfWeek === 1) {
      startDay = 1;
      lastMonth = month;
    }

    let curDate = moment([lastYear, lastMonth, startDay, 12, minute]);

    const calendar = [];
    for (let i = 0; i < 6; i++) {
      calendar[i] = [];
    }

    for (
      let i = 0, col = 0, row = 0;
      i < 42;
      i++, col++, curDate = moment(curDate).add(24, "hour")
    ) {
      if (i > 0 && col % 7 === 0) {
        col = 0;
        row++;
      }
      calendar[row][col] = curDate
        .clone()
        .hour(hour)
        .minute(minute)
        .second(second);
      curDate.hour(12);
    }

    let table = [];
    for (let row = 0; row < 6; row++) {
      let tr = [];
      for (let col = 0; col < 7; col++) {
        tr.push(calendar[row][col]);
      }
      table.push(tr);
    }
    return table;
  }

  selectDate(item) {
    if (this.state.firstDate === "" && this.state.secondDate === "") {
      this.setState({
        firstDate: item,
      });
    } else if (this.state.firstDate !== "" && this.state.secondDate !== "") {
      this.setState({
        firstDate: item,
        secondDate: "",
      });
    } else {
      this.setState({
        secondDate: item,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    let updateObject = {};

    if (!state.isUpdated) {
      updateObject.firstDate =
        props.initialStartDate || moment().startOf("day");
      updateObject.secondDate = props.initialEndDate || moment().startOf("day");
      updateObject.isUpdated = true;
      updateObject.months = [state.startDate];
      updateObject.count = 2;
      if (props.months) {
        updateObject.count = props.months;
        state.endDate = moment()
          .startOf("day")
          .add(props.months - 1, "month");
        let date = state.startDate.clone();
        for (let i = 1; i < props.months - 1; i++) {
          let curDate = date.clone();
          curDate.add(i, "month");
          updateObject.months.push(curDate);
        }
        updateObject.months.push(state.endDate);
      } else {
        updateObject.months = [state.startDate, state.endDate];
      }
    }
    return updateObject;
  }

  render() {
    {
      this.props.onChangeValue(this.state.firstDate, this.state.secondDate);
    }
    return (
      <div className="dataRangePicker">
        <input
          className="dataRangePicker__input"
          type="text"
          value={`${
            this.state.firstDate
              ? this.state.firstDate.format("DD-MM-YY")
              : "Старт"
          } ${
            this.state.secondDate
              ? `- ${this.state.secondDate.format("DD-MM-YY")}`
              : "- Выберите вторую дату"
          }`}
          onFocus={() => {
            this.setState({
              showCalendar: !this.state.showCalendar,
            });
          }}
          onChange={() => {}}
        />
        {this.state.showCalendar && (
          <div className="dataRangePicker__calendar">
            <div className="dataRangePicker__calendar_controls">
              <div className="buttons">
                <button
                  onClick={() => {
                    this.setState({
                      startDate: this.state.startDate.subtract(
                        this.state.count - 1,
                        "month"
                      ),
                      endDate: this.state.endDate.subtract(
                        this.state.count - 1,
                        "month"
                      ),
                    });

                    if (this.props.months) {
                      let months = [this.state.startDate];
                      let date = this.state.startDate.clone();
                      for (let i = 1; i < this.props.months - 1; i++) {
                        let curDate = date.clone();
                        curDate.add(i, "month");
                        months.push(curDate);
                      }
                      months.push(this.state.endDate);

                      this.setState({
                        months: months,
                      });
                    }
                  }}
                >
                  Назад
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      showCalendar: false,
                    });
                  }}
                >
                  OK
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      startDate: this.state.startDate.add(
                        this.state.count - 1,
                        "month"
                      ),
                      endDate: this.state.endDate.add(
                        this.state.count - 1,
                        "month"
                      ),
                    });

                    if (this.props.months) {
                      let months = [this.state.startDate];
                      let date = this.state.startDate.clone();
                      for (let i = 1; i < this.props.months - 1; i++) {
                        let curDate = date.clone();
                        curDate.add(i, "month");
                        months.push(curDate);
                      }
                      months.push(this.state.endDate);

                      this.setState({
                        months: months,
                      });
                    }
                  }}
                >
                  Вперед
                </button>
                <div className="timePicker">
                  <label>Время </label>
                  <select
                    value={
                      this.state.firstDate
                        ? this.state.firstDate.hour()
                        : this.state.startDate.hour()
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const data = this.state.firstDate || this.state.startDate;
                      this.setState({
                        firstDate: data.hour(value),
                      });
                    }}
                  >
                    {HOURS.map((item) => (
                      <option key={`hour${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select
                    value={
                      this.state.firstDate
                        ? this.state.firstDate.minute()
                        : this.state.startDate.minute()
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const data = this.state.firstDate || this.state.startDate;
                      this.setState({
                        firstDate: data.minute(value),
                      });
                    }}
                  >
                    {MINUTES.map((item) => (
                      <option key={`minute${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="timePicker">
                  <label>Время </label>
                  <select
                    value={
                      this.state.secondDate
                        ? this.state.secondDate.hour()
                        : this.state.endDate.hour()
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const data = this.state.secondDate || this.state.endDate;
                      this.setState({
                        secondDate: data.hour(value),
                      });
                    }}
                  >
                    {HOURS.map((item) => (
                      <option key={`lastHour${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select
                    value={
                      this.state.secondDate
                        ? this.state.secondDate.minute()
                        : this.state.endDate.minute()
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const data = this.state.secondDate || this.state.endDate;
                      this.setState({
                        secondDate: data.minute(value),
                      });
                    }}
                  >
                    {MINUTES.map((item) => (
                      <option key={`lastMinute${item}`} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="dataRangePicker__calendar_content">
              {this.state.months.map((currentMonth) => (
                <div
                  key={`${currentMonth.month()}`}
                  className="dataRangePicker__calendarItem"
                >
                  <div className="monthLabel">
                    {currentMonth.format("MMMM YYYY")}
                  </div>
                  <table>
                    <tbody>
                      <tr className="weekDaysLabels">
                        <th>Пн</th>
                        <th>Вт</th>
                        <th>Ср</th>
                        <th>Чт</th>
                        <th>Пт</th>
                        <th>Сб</th>
                        <th>Вс</th>
                      </tr>
                      {this.renderCalendar(currentMonth).map(
                        (string, index) => (
                          <tr key={`${currentMonth.month()}week#${index}`}>
                            {string.map((cell, index2) => (
                              <td
                                data-item="day"
                                data-first-date={
                                  this.state.firstDate &&
                                  currentMonth.month() === cell.month() &&
                                  this.state.firstDate.format("MMMM D YYYY") ===
                                    cell.format("MMMM D YYYY")
                                    ? true
                                    : false
                                }
                                data-second-date={
                                  this.state.secondDate &&
                                  currentMonth.month() === cell.month() &&
                                  this.state.secondDate.format(
                                    "MMMM D YYYY"
                                  ) === cell.format("MMMM D YYYY")
                                    ? true
                                    : false
                                }
                                data-range={
                                  (cell >= this.state.firstDate &&
                                    cell <= this.state.secondDate) ||
                                  (cell >= this.state.firstDate &&
                                    cell <= this.state.secondDateTemp)
                                    ? true
                                    : false
                                }
                                data-other={
                                  cell.month() !== currentMonth.month()
                                    ? true
                                    : false
                                }
                                key={`${currentMonth.month()}week#${index}day#${index2}`}
                                className={index2 > 4 ? "holiday" : "d"}
                                onClick={() => {
                                  this.selectDate(cell);
                                }}
                                onMouseEnter={() => {
                                  if (
                                    this.state.firstDate !== "" &&
                                    this.state.secondDate === ""
                                  ) {
                                    this.setState({
                                      secondDateTemp: cell,
                                    });
                                  }
                                }}
                                onMouseOut={() => {
                                  if (this.state.firstDate !== "") {
                                    this.setState({
                                      secondDateTemp: "",
                                    });
                                  }
                                }}
                              >
                                {cell.date()}
                                {this.state.firstDate &&
                                cell.month() === currentMonth.month() &&
                                this.state.firstDate.format("MMMM D YYYY") ===
                                  cell.format("MMMM D YYYY") ? (
                                  <p className="label">Начало</p>
                                ) : (
                                  false
                                )}
                                {this.state.secondDate &&
                                cell.month() === currentMonth.month() &&
                                this.state.secondDate.format("MMMM D YYYY") ===
                                  cell.format("MMMM D YYYY") ? (
                                  <p className="label">Конец</p>
                                ) : (
                                  false
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const WRAPPER = () => {
  return (
    <DataRangePicker
      initialStartDate={moment()}
      initialEndDate={moment().add(1, "month")}
      months={2}
      onChangeValue={(dateFirst, dateSecond) => {
        /*console.log(dateFirst, dateSecond)*/
      }}
    />
  );
};

export default WRAPPER;
