/**
 * This component renders table for managing productions.
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

import ProductionModal from './ProductionModal'
import { ADD, EDIT, sendRequest } from '../../Utilities'
import './style.scss'

class Production extends React.Component {
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
          name: 'Xe máy điện Klara',
          length: '150cm',
          width: '50cm',
          height: '90cm',
          weight: '30kg',
          speed: '50km/h', // representative
          image: '',
          color: 'đỏ',
          price: '20.000.000VND',
          brand: 'dòng sản phẩm 1',
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
    sendRequest('/admin/api/product/getAll', 'get').then((res) => {
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
      sendRequest(`/admin/api/product/${id}`, 'get').then((res) => {
        if (this.modalRef.current) {
          this.modalRef.current.toggle(true, EDIT, { data: res.data[1], index: index })
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
                  <CTableHeaderCell className="text-center">Tên mẫu xe</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Chiều dài (cm)</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Chiều rộng (cm)</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Chiều cao (cm)</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Cân nặng (kg)</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Tốc độ tối đa</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Màu</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Thuộc hãng/dòng sản phẩm
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Giá bán niêm yết (VND)
                  </CTableHeaderCell>
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
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{item.length}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.width}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.height}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.weight}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.speed}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.color}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.brand}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.price}</CTableDataCell>
                    </CTableRow>
                  ),
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <ProductionModal
          id="production-profile"
          ref={this.modalRef}
          title={this.state.modalTitle}
          setProfile={(idx) => this.setProfile(idx)}
          deleteProfile={(idx) => this.deleteProfile(idx)}
        >
          {' '}
        </ProductionModal>
      </>
    )
  }
}

export default Production
