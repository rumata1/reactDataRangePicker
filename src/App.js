import React, { Component, useEffect } from 'react';
import styles from './App.css';
const moment = require('moment');

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
        startDate: moment().startOf('day'),
        endDate: moment().startOf('day').add(1, 'month'),
        firstDate: null,
        secondDate: null,
        showCalendar: false
    }

    renderCalendar(side) {
        let start = this.state.startDate;
        if (side) start = side;

        let month = start.month();
        let year = start.year();
        let hour = start.hour();
        let minute = start.minute();
        let second = start.second();

        let daysInMonth = moment([year, month]).daysInMonth();
        let firstDay = moment([year, month, 1]);
        let lastDay = moment([year, month, daysInMonth]);

        let lastMonth = moment(firstDay).subtract(1, 'month').month();
        let lastYear = moment(firstDay).subtract(1, 'month').year();

        let daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        let dayOfWeek = firstDay.day();

        let startDay = daysInLastMonth - dayOfWeek + 2;

        if (startDay > daysInLastMonth) startDay -= 7;

        let curDate = moment([
            lastYear,
            lastMonth,
            startDay,
            12,
            minute
        ]);

        const calendar = [];
        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }

        let col, row;

        let startIndex = firstDay.day();
        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
        }

        let html = [];
        for (let row = 0; row < 6; row++) {
            let tr = [];
            for (let col = 0; col < 7; col++) {
                tr.push(calendar[row][col]);
            }
            html.push(tr);
        }
        return html;
    }

    selectDate(item) {

        if (this.state.firstDate === "" && this.state.secondDate === "") {
            this.setState({
                firstDate: item
            });
        }
        else if (this.state.firstDate !== "" && this.state.secondDate !== "") {
            this.setState({
                firstDate: item,
                secondDate: ''
            });
        }
        else {
            this.setState({
                secondDate: item
            });
        }
    }

    static getDerivedStateFromProps(props, state) {
        let updateObject = {};

        if(!state.isUpdated) {
            updateObject.firstDate = props.initialStartDate || moment().startOf('day');
            updateObject.secondDate = props.initialEndDate || moment().startOf('day');
            updateObject.isUpdated = true;
            updateObject.months = [state.startDate];
            updateObject.count = 2;
            if(props.months) {
                updateObject.count = props.months;
                state.endDate = moment().startOf('day').add(props.months-1, 'month');
                let date = state.startDate.clone();
                for(let i = 1; i < props.months-1; i++) {
                    let curDate = date.clone();
                    curDate.add(i, 'month');
                    updateObject.months.push(curDate);
                }
                updateObject.months.push(state.endDate);
            }

            else {
                updateObject.months = [state.startDate, state.endDate]
            }
        }
        return updateObject;
    }


    render() {
        {this.props.onChangeValue(this.state.firstDate, this.state.secondDate)}
        return (
            <div className="App">
                <input
                    type="text"
                    value={`${this.state.firstDate ? this.state.firstDate.format("DD-MM-YY") : 'Старт'} ${this.state.secondDate ? `- ${this.state.secondDate.format("DD-MM-YY")}` : '- Выберите вторую дату'}`}
                    onFocus={()=>{
                        this.setState({
                            showCalendar: !this.state.showCalendar
                        });
                    }}
                    onChange={()=>{}}
                />
                {this.state.showCalendar &&
                <div className="content" style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div>
                        <div className="buttons">
                            <button onClick={() => {
                                this.setState({
                                    startDate: this.state.startDate.subtract(this.state.count-1, 'month'),
                                    endDate: this.state.endDate.subtract(this.state.count-1, 'month')
                                });

                                if (this.props.months) {
                                    let months = [this.state.startDate];
                                    let date = this.state.startDate.clone();
                                    for(let i = 1; i < this.props.months-1; i++) {
                                        let curDate = date.clone();
                                        curDate.add(i, 'month');
                                        months.push(curDate);
                                    }
                                    months.push(this.state.endDate);

                                    this.setState({
                                        months: months
                                    });
                                }

                            }}>Назад</button>
                            <button onClick={() => {
                                this.setState({
                                    startDate: this.state.startDate.add(this.state.count-1, 'month'),
                                    endDate: this.state.endDate.add(this.state.count-1, 'month')
                                });

                                if (this.props.months) {
                                    let months = [this.state.startDate];
                                    let date = this.state.startDate.clone();
                                    for(let i = 1; i < this.props.months-1; i++) {
                                        let curDate = date.clone();
                                        curDate.add(i, 'month');
                                        months.push(curDate);
                                    }
                                    months.push(this.state.endDate);

                                    this.setState({
                                        months: months
                                    });
                                }

                            }}>Вперед</button>
                            <div className="timePicker">
                                <label>Время </label>
                                <select
                                    value={this.state.firstDate ? this.state.firstDate.hour() : this.state.startDate.hour()}
                                    onChange={(e)=> {
                                        const value = e.target.value;
                                        const data = this.state.firstDate || this.state.startDate;
                                        this.setState({
                                            firstDate: data.hour(value)
                                        });
                                    }}
                                >
                                    {HOURS.map(item =>
                                        <option
                                            key={`hour${item}`}
                                            value={item}
                                        >{item}</option>)}
                                </select>
                                <select
                                    value={this.state.firstDate ? this.state.firstDate.minute() : this.state.startDate.minute()}
                                    onChange={(e)=> {
                                        const value = e.target.value;
                                        const data = this.state.firstDate || this.state.startDate;
                                        this.setState({
                                            firstDate: data.minute(value)
                                        });
                                    }}
                                >
                                    {MINUTES.map(item=> <option
                                        key={`minute${item}`}
                                        value={item}>{item}</option>)}
                                </select>
                            </div>
                            <div className="timePicker">
                                <label>Время </label>
                                <select
                                    value={this.state.secondDate ? this.state.secondDate.hour() : this.state.endDate.hour()}
                                    onChange={(e)=> {
                                        const value = e.target.value;
                                        const data = this.state.secondDate || this.state.endDate;
                                        this.setState({
                                            secondDate: data.hour(value)
                                        });
                                    }}
                                >
                                    {HOURS.map(item =>
                                        <option
                                            key={`lastHour${item}`}
                                            value={item}
                                        >{item}</option>)}
                                </select>
                                <select
                                    value={this.state.secondDate ? this.state.secondDate.minute() : this.state.endDate.minute()}
                                    onChange={(e)=> {
                                        const value = e.target.value;
                                        const data = this.state.secondDate || this.state.endDate;
                                        this.setState({
                                            secondDate: data.minute(value)
                                        });
                                    }}
                                >
                                    {MINUTES.map(item=> <option
                                        key={`lastMinute${item}`}
                                        value={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    {this.state.months.map(currentMonth => (
                        <div key={`${currentMonth.month()}`}>
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
                                {this.renderCalendar(currentMonth).map((item, index)=>
                                    <tr key={`${currentMonth.month()}week#${index}`}>{item.map((item, index2)=>
                                        <td
                                            data-item="day"
                                            data-first-date={
                                                this.state.firstDate &&
                                                currentMonth.month() === item.month() &&
                                                this.state.firstDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ? true : false
                                            }
                                            data-second-date={
                                                this.state.secondDate &&
                                                currentMonth.month() === item.month() &&
                                                this.state.secondDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ? true : false
                                            }
                                            data-range={
                                                item >= this.state.firstDate &&
                                                item <= this.state.secondDate ||
                                                item >= this.state.firstDate &&
                                                item <= this.state.secondDateTemp ? true : false
                                            }
                                            data-other={
                                                item.month() !== currentMonth.month() ? true : false
                                            }
                                            key={`${currentMonth.month()}week#${index}day#${index2}`}
                                            className={index2 > 4 ? 'holiday' : 'd'}
                                            onClick={()=> {
                                                this.selectDate(item);
                                            }}
                                            onMouseEnter={()=> {
                                                if(this.state.firstDate !== '' && this.state.secondDate === '') {
                                                    this.setState({
                                                        secondDateTemp: item
                                                    });
                                                }
                                            }}
                                            onMouseOut={()=> {
                                                if(this.state.firstDate !== '') {
                                                    this.setState({
                                                        secondDateTemp: ''
                                                    });
                                                }
                                            }}
                                        >{item.date()}
                                            {this.state.firstDate &&
                                            item.month() === currentMonth.month() &&
                                            this.state.firstDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ?
                                                <p className="label">Начало</p> : false}
                                            {this.state.secondDate &&
                                            item.month() === currentMonth.month() &&
                                            this.state.secondDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ?
                                                <p className="label">Конец</p> : false}
                                        </td>)}
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>}
            </div>
        );
    }
}

const WRAPPER =()=> {
    return(
        <DataRangePicker
            //initialStartDate={moment()}
            //initialEndDate={moment().add(1, 'month')}
            months={4}
            onChangeValue={(dateFirst, dateSecond)=>{/*console.log(dateFirst, dateSecond)*/}}
        />
    );
}

export default WRAPPER;