/**
 * This component renders table for managing producers/manufactories.
 * TODO: add state(or sth) to save existing record's data and pass to modal
 */
import React from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'

import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import { Button } from '@coreui/coreui'

import axios from 'axios'

import ProducerModal from './ProducerModal'

class Producer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      modalTitle: 'Thêm mới',
      // get data from api
      dataset: [
        {
          id: 102,
          avatar: { src: avatar1 },
          producer: {
            name: 'Nhà máy A',
            new: false,
            registered: 'Jan 8, 2020',
          },
          representative: 'Lê Thị A',
          address: 'Đông Anh, Hà Nội',
          launchDate: '...-2020',
          numberOfWorkers: 581,
          activity: '10 min ago',
        },
      ],
    }

    this.modalRef = React.createRef()
  }

  componentDidMount() {
    this.getAllProducersInfo()
  }

  // get data from api and setState
  getAllProducersInfo() {
    // axios.get('https://api.sampleapis.com/coffee/hot').then((res) => {
    //   this.setState({ dataset: res.data })
    // })
  }

  getSpecifiedProducer(id) {
    // axios.get('').then()
  }

  openModal(id) {
    if (typeof id === 'undefined') {
      // Add new producer; open without data
      if (this.modalRef.current) this.modalRef.current.toggle()
      else console.log('ref is null')
    } else {
      // send get req then setState
      axios.get('https://api.sampleapis.com/coffee/hot').then((res) => {
        if (this.modalRef.current) {
          this.modalRef.current.getProfile(res.data[0])
          this.modalRef.current.toggle()
        }
      })
    }
  }

  // This function only deletes the row of profile which has been removed in modal
  deleteProfile(id) {
    let rm_idx = 0
    let dataset = this.state.dataset.slice()
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].id === id) {
        dataset.splice(i, 1)
        break
      }
    }

    this.setState({ dataset: dataset })
  }

  render() {
    return (
      <>
        <CCard>
          <CCardHeader>
            <h4 className="float-start">Danh sách nhà máy</h4>
            <div className="float-end">
              <CButton
                className="btn-success"
                onClick={() => {
                  this.openModal()
                }}
              >
                Thêm
              </CButton>{' '}
            </div>
            <div className="left"></div>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center">STT</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Manufactory</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Người đại diện</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Ngày hoạt động</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Số lượng nhân công</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Địa chỉ</CTableHeaderCell>
                  <CTableHeaderCell>Activity</CTableHeaderCell>
                  <CTableHeaderCell></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {this.state.dataset.map((item, index) => (
                  <CTableRow
                    v-for="item in tableItems"
                    key={index}
                    onClick={() => this.openModal(item.id)}
                  >
                    <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                    <CTableDataCell>
                      <div>{item.producer.name}</div>
                      <div className="small text-medium-emphasis">
                        <span>{item.producer.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                        {item.producer.registered}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      <span>{' ' + item.representative}</span>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{item.launchDate}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.numberOfWorkers}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.address}</CTableDataCell>
                    <CTableDataCell>
                      <strong>{item.activity}</strong>
                    </CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <ProducerModal
          id="producer-profile"
          ref={this.modalRef}
          // data={}
          title={this.state.modalTitle}
          deleteProfile={(id) => this.deleteProfile(id)}
        >
          {' '}
        </ProducerModal>
      </>
    )
  }
}

export default Producer