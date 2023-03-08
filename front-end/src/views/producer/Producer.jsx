/**
 * This component renders table for managing producers/manufactories.
 */
import React from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import axios from 'axios'

import ProducerModal from './ProducerModal'
import { ADD, EDIT, sendRequest } from '../../Utilities'
import './style.scss'

class Producer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      modalTitle: 'Thêm mới',
      // get data from api
      // example of typical returned data from api
      dataset: [
        {
          _id: 102,
          name: 'Nhà máy A',
          date_register: 'Jan 8, 2020',
          date_active: '...-2020',
          address: 'Đông Anh, Hà Nội',
          numberOfWorkers: 581,
          namePerson: 'Lê Thị A', // representative
          contact: '0397591234',
          representativeID: '02394081423',
          username: 'producera',
          password: '123',
        },
      ],
    }

    this.modalRef = React.createRef()
  }

  componentDidMount() {
    this.getAllProfiles()
  }

  // get data from api and setState
  getAllProfiles() {
    sendRequest('/admin/api/cssx/getAll', 'get').then((res) => {
      console.log(res.data)
      this.setState({ dataset: res.data })
    })
  }

  getSpecifiedProfile(id) {
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
      // send get req then setState/admin/api/cssx/ + id
      sendRequest(`/admin/api/cssx/getACSSX/${id}`, 'get').then((res) => {
        if (this.modalRef.current) {
          // console.log('response: \n', res.data)
          this.modalRef.current.toggle(true, EDIT, { data: res.data, index: index })
        }
      })
    }
  }

  /**
   * Modify an existing profile or add new profile to the list.
   * @param {_id: string | number, name: string, date_register: string, namePerson: string, contact: string, address: string, date_launch: string, numberOfWorkers: number} modifiedRecord
   * @param {number | string} index Position of record in table|array. Value of -1 means that record is new and will be added.
   */
  setProfile(modifiedRecord, index) {
    let dataset = [...this.state.dataset]
    if (index === -1) dataset = [modifiedRecord, ...dataset]
    else dataset[index] = modifiedRecord
    console.log(dataset)
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
                  <CTableHeaderCell className="text-center">Nhà máy</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Ngày hoạt động</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Số lượng nhân công</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Địa chỉ</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Người đại diện</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Số căn cước</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Thông tin liên hệ</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {this.state.dataset.map((item, index) =>
                  !item ? (
                    ''
                  ) : (
                    <CTableRow
                      v-for="item in tableItems"
                      className="table-item"
                      key={index}
                      onClick={() => this.openModal(item._id, index)}
                    >
                      <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div>{item.name}</div>
                        <div className="small text-medium-emphasis">
                          Registered: {item.date_register}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{item.date_active}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.numberOfWorkers}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{item.address}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.namePerson}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.representativeID}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{item.contact}</CTableDataCell>
                    </CTableRow>
                  ),
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <ProducerModal
          id="producer-profile"
          ref={this.modalRef}
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
