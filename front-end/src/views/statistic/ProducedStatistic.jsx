/**
 * This component renders statistical chart for number of produced products.
 * Controlflow: choose filter -> getdata -> set label & set chart line/bar
 * TODO: GET list of producers
 */
import React from 'react'
import PropTypes, { string } from 'prop-types'

import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import {
  MONTH,
  QUARTER,
  YEAR,
  CURRENT_MONTH,
  CURRENT_QUARTER,
  CURRENT_YEAR,
  monthsOfYear,
  quartersOfYear,
  random,
} from '../../Utilities.js'

var wait = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res(Array(30).fill(340))
    }, 2000)
  })
}

class ProducedStatistic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      /**
       * Stat number of products on a [month, quarter, year] with current month by default
       * MONTH: unit of day
       * QUARTER: unit of day
       * YEAR: unit of month
       */
      statTimeInterval: MONTH,

      /**
       * Select specific time to show stat
       * MONTH: (default) CURRENT_MONTH, CURRENT_YEAR
       * QUARTER: (default) CURRENT_QUARTER, CURRENT_YEAR
       * YEAR: (default) CURRENT_YEAR
       */
      statTimeChosen: [CURRENT_MONTH, CURRENT_YEAR],
      producer: ['All'],
      labels: null,
      // May get from db
      dataset: [
        12,
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        46,
      ],

      datasetLabel: 'unchanged',

      daysOfMonth: [...Array(new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 0).getDate()).keys()],
    }

    // get from db
    this.years = [2020, 2021, 2022]
  }

  // executed after rendering
  componentDidMount() {
    // this.getData()
    this.setLabels()
  }

  // validate props elements's types
  static get propsTypes() {
    return {
      monthsOfYear: PropTypes.array,
    }
  }

  // Gets data from api and then set year list, state vars: dataset
  // TODO: determine if the returned value should be Promise (may be more appropriate,
  //       cuz data can be of boolean or json) or data
  getData() {
    // fetch('')
    //   .then((res) => res.json())
    //   .then(res => this.setState({ dataset: }))
    wait().then((res) => {
      this.setState({ dataset: res })
      console.log(this.state.dataset)
    })
  }

  getChartDatasets() {
    return [
      {
        label: this.state.datasetLabel,
        // backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        // put data received from res here
        data: this.state.dataset,
        fill: true,
      },
      // {
      //   label: 'My Second dataset',
      //   backgroundColor: 'transparent',
      //   borderColor: getStyle('--cui-success'),
      //   pointHoverBackgroundColor: getStyle('--cui-success'),
      //   borderWidth: 2,
      //   data: [
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //     random(50, 200),
      //   ],
      // },
      {
        label: 'My Third dataset',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-danger'),
        pointHoverBackgroundColor: getStyle('--cui-danger'),
        borderWidth: 1,
        borderDash: [8, 5],
        data: Array(12).fill(0),
      },
    ]
  }

  // Set label on chart | may need to be tested to work correctly
  setLabels() {
    switch (this.state.statTimeInterval) {
      case MONTH:
        let [month, year] = this.state.statTimeChosen
        // get number of days
        let labels = [...Array(new Date(year, month + 1, 0).getDate()).keys()]

        labels = labels.map((label, idx) => {
          label += 1
          return label.toString().concat('/', month + 1)
        })

        this.setState({ labels: labels })
        break

      // case QUARTER:
      //   let [quarter, year_] = this.state.statTimeChosen
      //   let firstMonth = [...Array(new Date(year_, quarter * 3 + 1, 0).getDate()).keys()]
      //   firstMonth = firstMonth.map((value, idx) =>
      //     value.toString().concat('/' + (quarter * 3 + 1).toString()),
      //   )
      //   console.log(firstMonth)
      //   let secondMonth = [...Array(new Date(year_, quarter * 3 + 2, 0).getDate()).keys()]
      //   secondMonth = secondMonth.map((value, idx) =>
      //     value.toString().concat('/' + (quarter * 3 + 2).toString()),
      //   )
      //   let thirdMonth = [...Array(new Date(year_, quarter * 3 + 3, 0).getDate()).keys()]
      //   thirdMonth = thirdMonth.map((value, idx) =>
      //     value.toString().concat('/' + (quarter * 3 + 3).toString()),
      //   )

      //   let labels_ = [...firstMonth, secondMonth, thirdMonth]

      //   this.setState({ labels: labels_ })
      //   break
      case YEAR:
        this.setState({ labels: this.props.monthsOfYear })
        break

      default:
        break
    }
  }

  // determine whether the quarter selection field is hidden
  hideQuarterSelection() {
    return this.state.statTimeInterval !== QUARTER
  }

  // determine whether the month selection field is hidden
  hideMonthSelection() {
    return this.state.statTimeInterval !== MONTH
  }

  handleYearSelection(target) {
    this.getData()
    let time = this.state.statTimeChosen
    time[0] = target.value
    this.setState({ statTimeChosen: time })
  }

  getDefaultMonth() {
    return this.state.statTimeInterval === YEAR ? 0 : CURRENT_MONTH + 1
  }

  getDefaultQuarter() {
    return this.state.statTimeInterval === YEAR ? 0 : CURRENT_QUARTER + 1
  }

  render() {
    return (
      <>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 className="card-title mb-0">Số lượng xe đã sản suất</h4>
                <br />
                <form>
                  <label htmlFor="stat-in-year">Năm:</label>
                  {/* select year */}
                  <select
                    name=""
                    id="stat-in-year"
                    // hidden={![YEAR, MONTH].includes(this.state.statTimeInterval)}
                    defaultValue={CURRENT_YEAR} // may be wrong, need to be considered
                    onChange={(target) => {
                      this.handleYearSelection(target)
                    }}
                  >
                    {this.years.map((year, idx) => {
                      return (
                        <option key={idx} value={year} selected={CURRENT_YEAR === year}>
                          {year}
                        </option>
                      )
                    })}
                  </select>
                  <br />
                  <label htmlFor="stat-in-quarter" hidden={this.hideQuarterSelection()}>
                    Quý:
                  </label>
                  {/* select quarter */}
                  <select
                    name="selected-quarter"
                    id="stat-in-quarter"
                    value={this.getDefaultQuarter()}
                    hidden={this.hideQuarterSelection()}
                    // TODO: refine this function
                    onChange={() => this.getData()}
                  >
                    {quartersOfYear.map((quarter, idx) => {
                      return (
                        <option key={idx} value={quarter}>
                          {quarter.concat(' quarter')}
                        </option>
                      )
                    })}
                  </select>
                  <label htmlFor="stat-in-month" hidden={this.hideMonthSelection()}>
                    Tháng:
                  </label>
                  {/* select month */}
                  <select
                    name="selected-month"
                    id="stat-in-month"
                    value={this.getDefaultMonth()}
                    hidden={this.hideMonthSelection()}
                    // TODO: refine this function
                    onChange={() => this.getData()}
                  >
                    {monthsOfYear.map((month, idx) => {
                      return (
                        <option key={idx} value={idx}>
                          {month}
                        </option>
                      )
                    })}
                  </select>
                </form>
                <label htmlFor="stat-for-producer">Nhà sản xuất</label>
                <select name="selected-producer" id="stat-for-producer" className="">
                  {/* TODO: get list of producers and render */}
                  <option value="">All</option>
                  <option value="">p alkldf 1</option>
                  <option value="">pdfg ghd 2</option>
                </select>
              </CCol>
              <CCol sm={7} className="d-md-block">
                <CButton color="primary" className="float-end">
                  <CIcon icon={cilCloudDownload} />
                </CButton>
                <CButtonGroup className="float-end me-3">
                  {[MONTH, QUARTER, YEAR].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === this.state.statTimeInterval}
                      onClick={() => {
                        // TODO: get data then do next steps below
                        this.setState({ statTimeInterval: value }, () => this.setLabels())
                      }}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </CCol>
            </CRow>
            <CChartLine
              style={{ height: '300px', marginTop: '40px' }}
              data={{
                labels: this.state.labels,
                datasets: this.getChartDatasets(),
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      stepSize: Math.ceil(250 / 5),
                      max: 250,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          </CCardBody>
          {/* <CCardFooter>
            <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
              {this.progressExample.map((item, index) => (
                <CCol className="mb-sm-2 mb-0" key={index}>
                  <div className="text-medium-emphasis">{item.title}</div>
                  <strong>
                    {item.value} ({item.percent}%)
                  </strong>
                  <CProgress thin className="mt-2" color={item.color} value={item.percent} />
                </CCol>
              ))}
            </CRow>
          </CCardFooter> */}
        </CCard>
      </>
    )
  }
}

export default ProducedStatistic
