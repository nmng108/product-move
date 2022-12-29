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

import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'
import { Button } from '@coreui/coreui'
// import ProductionModal from './ProductionModal'

class Production extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      showModal: false,
      modalTitle: 'Thêm mới',
      // get data from api
      dataset: [
        {
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
          activity: '10 sec ago',
        },
      ],
    }

    this.modalRef = React.createRef()
  }

  componentDidMount() {
    this.getData()
  }

  // get data from api and setState
  getData() {
    // fetch('')
    //   .then((res) => res.json())
    //   .then(res => this.setState({ dataset: }))
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
                  // this.setState({ showModal: !this.state.showModal })
                  this.modalRef.current.toggle()
                }}
              >
                Thêm
              </CButton>{' '}
              <CButton
                disabled={this.state.editMode}
                onClick={() => {
                  this.setState({ editMode: !this.state.editMode })
                }}
              >
                Sửa
              </CButton>{' '}
              <CButton
                className="btn-warning"
                hidden={!this.state.editMode}
                onClick={() => {
                  if (this.state.editMode) {
                    // send request, then:
                    this.setState({ editMode: false })
                  }
                }}
              >
                Xong
              </CButton>
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
                  <CTableRow v-for="item in tableItems" key={index}>
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
                    <CTableDataCell>
                      <CButton
                        className="btn-danger"
                        hidden={!this.state.editMode}
                        onClick={() => {
                          // show confirmation dialog
                          let isConfirmed = window.confirm('Bạn chắc chắn muốn xóa không?')
                          if (isConfirmed) {
                            // send DELETE request, then remove the record
                            let dataset = this.state.dataset.slice()
                            dataset.pop(index)
                            this.setState({ dataset: dataset })
                          }
                        }}
                      >
                        Xóa
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        {/*<ProducerModal*/}
        {/*  id="edit-profile"*/}
        {/*  ref={this.modalRef}*/}
        {/*  // visible={this.state.showModal}*/}
        {/*  title={this.state.modalTitle}*/}
        {/*>*/}
        {/*  {' '}*/}
        {/*</ProducerModal>*/}
      </>
    )
  }
}

export default Production
