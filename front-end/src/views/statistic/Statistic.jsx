/**
 * This component renders statistic page for number of some types(produced, instock, sold...) of products.
 */
import React from 'react'

import { CButton, CButtonGroup, CCard, CCardHeader, CCardBody, CCol, CRow } from '@coreui/react'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import ProducedStatistic from './ProducedStatistic'

import { MONTH, YEAR, CURRENT_MONTH, CURRENT_YEAR, monthsOfYear, random } from '../../Utilities.js'

var wait = () => {
  return new Promise((res) => {
    setTimeout(() => {
      res(Array(30).fill(340))
    }, 2000)
  })
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

      datasetLabel: 'unchanged',

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
  }

  componentDidMount() {
    this.getData()
    this.setLabels()
  }

  // fatal error
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

  setLabels() {
    switch (this.state.statTimeInterval) {
      case MONTH:
        const [month, year] = this.state.statTimeChosen
        // get number of days
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

  render() {
    return (
      <>
        <ProducedStatistic></ProducedStatistic>
        {/* <CCard className="mb-4">
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
        </CCard> */}
      </>
    )
  }
}

export default Statistic
