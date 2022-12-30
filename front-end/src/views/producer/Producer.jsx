/**
 * This component renders table for managing producers/manufactories.
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

import axios from 'axios'

import ProducerModal from './ProducerModal'
import './style.scss'

// Modal types
const [ADD, EDIT] = [0, 1]

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
            registered: 'Jan 8, 2020',
          },
          representative: 'Lê Thị A',
          contact: '0397591234',
          address: 'Đông Anh, Hà Nội',
          launchDate: '...-2020',
          numberOfWorkers: 581,
          username: 'producera',
          password: '1233',
        },
        {
          id: 189,
          avatar: { src: avatar2 },
          producer: {
            name: 'Nhà máy B',
            registered: 'Jan 8, 2021',
          },
          representative: 'Trần Văn B',
          contact: '0547290048',
          address: 'Đông Anh, Hà Nội',
          launchDate: '...-2021',
          numberOfWorkers: 800,
          username: 'producerb',
          password: '1233',
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

  /**
   * Open modal with 2 types/modes:
   * if id is undefined, modal is used for registering
   * else, modal is used for modifing
   * @param {string | number} id
   * @param {number} index
   */
  openModal(id, index = -1) {
    if (typeof id === 'undefined') {
      // Add new producer; open without data
      if (this.modalRef.current) {
        // this.modalRef.current.toggle()
        this.modalRef.current.toggle(true, ADD)
      } else console.log('ref is null')
    } else {
      // send get req then setState
      axios.get('https://api.sampleapis.com/coffee/hot').then((res) => {
        if (this.modalRef.current) {
          this.modalRef.current.toggle(true, EDIT, { data: res.data[1], index: index })
        }
      })
    }
  }

  /**
   * Modify an existing profile or add new profile to the list.
   * @param {id: string | number, avatar: { src: avatar1 }, producer: { name: string, registered: string,}, representative: string, contact: string, address: string, launchDate: string, numberOfWorkers: number, activity: string} modifiedRecord
   * @param {number | string} index Position of record in table|array. Value of -1 means that record is new and will be added.
   */
  setProfile(modifiedRecord, index) {
    let dataset = [...this.state.dataset]
    if (index === -1) dataset = [modifiedRecord, ...dataset]
    else dataset[index] = modifiedRecord
    this.setState({ dataset: dataset })
  }

  /**
   * This function only deletes the presense of row of profile
   * which has been commited to be removed in modal.
   * @param {number} index Index of the row in table
   */
  deleteProfile(index) {
    let dataset = [...this.state.dataset]
    dataset.splice(index, 1)
    this.setState({ dataset: dataset })
  }

  render() {
    // axios.get('http://127.0.0.1:8000').then((res) => console.log(res.data))
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
                  <CTableHeaderCell className="text-center">Ngày hoạt động</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Số lượng nhân công</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Người đại diện</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Thông tin liên hệ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Địa chỉ</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {this.state.dataset.map((item, index) => (
                  <CTableRow
                    v-for="item in tableItems"
                    className="table-item"
                    key={index}
                    onClick={() => this.openModal(item.id, index)}
                  >
                    <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                    <CTableDataCell>
                      <div>{item.producer.name}</div>
                      <div className="small text-medium-emphasis">
                        Registered: {item.producer.registered}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{item.launchDate}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.numberOfWorkers}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CAvatar size="md" src={item.avatar.src} />
                      <span>{' ' + item.representative}</span>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{item.contact}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.address}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <ProducerModal
          id="producer-profile"
          ref={this.modalRef}
          modalTypes={{ ADD: ADD, EDIT: EDIT }}
          title={this.state.modalTitle}
          setProfile={(idx) => this.setProfile(idx)}
          deleteProfile={(idx) => this.deleteProfile(idx)}
        >
          {' '}
        </ProducerModal>
      </>
    )
  }
}

export default Producer
