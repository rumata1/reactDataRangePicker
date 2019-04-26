import React, { Component } from 'react';
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
        endDate: moment().endOf('day').add(1, 'month'),
        firstDate: null,
        secondDate: null,
        showCalendar: false
    }

    renderCalendar(side) {
        let start = this.state.startDate;
        if (side === 'right') start = this.state.endDate;
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
            updateObject.secondDate = props.initialEndDate || moment().endOf('day');
            updateObject.isUpdated = true;
        }

        return updateObject;
    }

    componentDidMount() {
        let nodeList = document.querySelectorAll('td[data-item=day]');
        for(let i of nodeList) {
            i.addEventListener('mouseover', ()=>{
                console.log(1);
            })
        }
    }

    render() {
        this.props.onChangeValue(this.state.firstDate, this.state.secondDate);
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
                />
                {this.state.showCalendar && <div className="content" style={{display: 'flex', justifyContent: 'space-around'}}>
                    <div>
                        <button onClick={() => {
                            this.setState({
                                startDate: this.state.startDate.subtract(1, 'month'),
                                endDate: this.state.endDate.subtract(1, 'month')
                            })
                        }}>Назад</button>
                        <div className="monthLabel">
                            {this.state.startDate.format("MMMM YYYY")}
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
                            {this.renderCalendar().map((item, index)=>
                                <tr key={`week#${index}`}>{item.map((item, index2)=>
                                    <td
                                        data-item="day"
                                        data-first-date={
                                            this.state.firstDate &&
                                            item.month() === this.state.startDate.month() &&
                                            this.state.firstDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ? true : false
                                        }
                                        data-second-date={
                                            this.state.secondDate &&
                                            item.month() === this.state.startDate.month() &&
                                            this.state.secondDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ? true : false
                                        }
                                        data-range={
                                            item >= this.state.firstDate &&
                                            item <= this.state.secondDate ||
                                            item >= this.state.firstDate &&
                                            item <= this.state.secondDateTemp ? true : false
                                        }
                                        data-other={
                                            item.month() !== this.state.startDate.month() ? true : false
                                        }
                                        key={`week#${index}day#${index2}`}
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
                                        item.month() === this.state.startDate.month() &&
                                        this.state.firstDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ?
                                            <p className="label">Начало</p> : false}
                                        {this.state.secondDate &&
                                        item.month() === this.state.startDate.month() &&
                                        this.state.secondDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ?
                                            <p className="label">Конец</p> : false}
                                    </td>)}
                                </tr>)}
                            </tbody>
                        </table>
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
                    </div>
                    <div>
                        <button onClick={() => {
                            this.setState({
                                startDate: this.state.startDate.add(1, 'month'),
                                endDate: this.state.endDate.add(1, 'month')
                            })
                        }}>Вперед</button>
                        <div className="monthLabel">
                            {this.state.endDate.format("MMMM YYYY")}
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
                            {this.renderCalendar('right').map((item, index)=>
                                <tr key={`week2#${index}`}>{item.map((item, index2)=>
                                    <td
                                        data-item="day"
                                        data-first-date={
                                            this.state.firstDate &&
                                            item.month() === this.state.endDate.month() &&
                                            this.state.firstDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ? true : false
                                        }
                                        data-second-date={
                                            this.state.secondDate &&
                                            item.month() === this.state.endDate.month() &&
                                            this.state.secondDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ? true : false
                                        }
                                        data-range={
                                            item >= this.state.firstDate &&
                                            item <= this.state.secondDate ||
                                            item >= this.state.firstDate &&
                                            item <= this.state.secondDateTemp ? true : false
                                        }
                                        data-other={
                                            item.month() !== this.state.endDate.month() ? true : false
                                        }
                                        key={`week2#${index}day#${index2}`}
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
                                        item.month() === this.state.endDate.month() &&
                                        this.state.firstDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ?
                                            <p className="label">Начало</p> : false}
                                        {this.state.secondDate &&
                                        item.month() === this.state.endDate.month() &&
                                        this.state.secondDate.format('MMMM D YYYY') === item.format('MMMM D YYYY') ?
                                            <p className="label">Конец</p> : false}
                                    </td>)}
                                </tr>)}
                            </tbody>
                        </table>
                        <div className="timePicker">
                            <label>Время </label>
                            <select
                                value={this.state.secondDate ? this.state.secondDate.hour() : this.state.startDate.hour()}
                                onChange={(e)=> {
                                    const value = e.target.value;
                                    const data = this.state.secondDate || this.state.startDate;
                                    this.setState({
                                        secondDate: data.hour(value)
                                    });
                                }}
                            >
                                {HOURS.map(item=> <option
                                    key={`hourNext${item}`}
                                    value={item}>{item}</option>)}
                            </select>
                            <select
                                value={this.state.secondDate ? this.state.secondDate.minute() : this.state.startDate.minute()}
                                onChange={(e)=> {
                                    const value = e.target.value;
                                    const data = this.state.secondDate || this.state.endDate;
                                    this.setState({
                                        secondDate: data.minute(value)
                                    });
                                }}
                            >
                                {MINUTES.map(item=> <option
                                    key={`minuteNext${item}`}
                                    value={item}>{item}</option>)}
                            </select>
                        </div>
                        <button onClick={()=>{
                            this.setState({
                                showCalendar: !this.state.showCalendar
                            })
                        }}>Закрыть</button>
                    </div>
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
            onChangeValue={(dateFirst, dateSecond)=>{console.log(dateFirst, dateSecond)}}
        />
    );
}

export default WRAPPER;