import React from 'react'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const MONTH = 'Month'
const QUARTER = 'Quarter'
const YEAR = 'Year'
const CURRENT_DATE = new Date()
const CURRENT_MONTH = CURRENT_DATE.getMonth()
const CURRENT_QUARTER = parseInt(CURRENT_MONTH / 3)
const CURRENT_YEAR = CURRENT_DATE.getFullYear()

const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const quartersOfYear = ['First', 'Second', 'Third', 'Fourth']

var random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

var wait = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res(Array(30).fill(340))
    }, 2000)
  })
}

async function fakefetch() {
  var res = await wait()
  return res
}

class Statistic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // Stat on month with current month by default
      statTimeInterval: MONTH,
      statTimeChosen: [CURRENT_MONTH, CURRENT_YEAR],
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
        46,
      ],

      daysOfMonth: [...Array(new Date(CURRENT_YEAR, CURRENT_MONTH + 1, 0).getDate()).keys()],
    }

    this.years = [2020, 2021, 2022]

    this.progressExample = [
      { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
      { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
      { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
      { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
      { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
    ]

    // the size of this array can vary
    // Get data from api
    this.chartDatasets = [
      {
        label: 'My First dataset',
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

  // fatal error
  getData() {
    wait().then((res) => this.setState({ dataset: { res } }))
  }

  setLabels() {
    switch (this.state.statTimeInterval) {
      case MONTH:
        const [month, year] = this.state.statTimeChosen
        let labels = [...Array(new Date(year, month + 1, 0).getDate()).keys()]

        labels = labels.map((label, idx) => {
          label += 1
          return label.toString().concat('/', month + 1)
        })

        this.setState({ labels: labels })
        break

      case YEAR:
        this.setState({ labels: monthsOfYear })
        break

      default:
        break
    }
  }

  componentDidMount() {
    // this.getData()
    this.setLabels()
  }

  render() {
    return (
      <>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="" className="card-title mb-0">
                  Số lượng xe đã sản suất
                </h4>
                <br />
                <form>
                  <label
                    htmlFor="stat-by-year"
                    hidden={![YEAR, MONTH].includes(this.state.statTimeInterval)}
                  >
                    Năm:
                  </label>
                  {/* select year */}
                  <select
                    name=""
                    id="stat-by-year"
                    hidden={![YEAR, MONTH].includes(this.state.statTimeInterval)}
                    value={this.state.statTimeChosen[0]} //wrong var
                    onChange={(target) => {
                      this.getData()
                      let time = this.state.statTimeChosen
                      time[0] = target.value
                      this.setState({ statTimeChosen: time })
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
                  <label htmlFor="stat-by-quarter" hidden={this.state.statTimeInterval !== QUARTER}>
                    Thống kê quý:
                  </label>
                  {/* select quarter */}
                  <select
                    name=""
                    id="stat-by-quarter"
                    hidden={this.state.statTimeInterval !== QUARTER}
                    onChange={() => this.getData()}
                  >
                    {quartersOfYear.map((quarter, idx) => {
                      return (
                        <option key={idx} value={quarter} selected={CURRENT_QUARTER === idx}>
                          {quarter.concat(' quarter')}
                        </option>
                      )
                    })}
                  </select>
                  <label htmlFor="stat-by-month" hidden={this.state.statTimeInterval !== MONTH}>
                    Tháng:
                  </label>
                  {/* select month */}
                  <select name="" id="stat-by-month" hidden={this.state.statTimeInterval !== MONTH}>
                    <option value="0" selected={this.state.statTimeInterval === YEAR}>
                      All
                    </option>

                    {monthsOfYear.map((month, idx) => {
                      return (
                        <option key={idx} value={idx + 1} selected={CURRENT_MONTH === idx}>
                          {month}
                        </option>
                      )
                    })}
                  </select>
                </form>
                {/* <div className="small text-medium-emphasis">January - July 2021</div> */}
              </CCol>
              <CCol sm={7} className="d-none d-md-block">
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
                datasets: this.chartDatasets,
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
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: this.state.labels,
                datasets: [
                  {
                    label: 'GitHub Commits',
                    backgroundColor: '#f87979',
                    data: this.state.dataset,
                    // data: [23, 8, 3, 3, 3, 3, 3, 3, 3, 3, 6, 8],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </>
    )
  }
}

export default Statistic
