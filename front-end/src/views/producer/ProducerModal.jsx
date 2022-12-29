/**
 * This component renders a modal for add new producer/manufactory or alter an existing one.
 * TODO: get record's data and render to form inputs
 */
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react'
import React from 'react'
import { PropTypes } from 'prop-types'
import axios from 'axios'

class ProducerModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: '',
      data: null,
      editMode: false,
    }
  }

  // executed after rendering
  componentDidMount() {
    // this.setState({
    //   isShown: this.props.show,
    //   title: this.props.title,
    // })
  }

  toggle() {
    this.setState({ visible: !this.state.visible })
  }

  getProfile(data) {
    if (!data) {
      console.log('profile not found')
      return
    }

    this.setState({ data: data }, () => console.log(data))
  }

  handleConfirmButton() {
    // axios.post('').then((res) => {
    //   if (res.status === 204) {
    //     this.toggle()
    //   }
    // })
    this.toggle()
  }

  render() {
    const { description, id, image, ingredients, title } = this.state.data || Array(4).fill('')

    return (
      // turn to form or able to edit when open edit mode
      <CModal id={this.props.id} visible={this.state.visible}>
        <CModalHeader closeButton>
          <CButton
            // disabled={this.state.editMode}
            color="warning"
            onClick={() => {
              this.setState({ editMode: !this.state.editMode })
            }}
          >
            Sửa
          </CButton>{' '}
          <CButton
            className="btn-danger"
            onClick={() => {
              // show confirmation dialog
              let isConfirmed = window.confirm('Bạn chắc chắn muốn xóa không?')
              if (isConfirmed) {
                // send DELETE request, then remove the record
                axios.delete('').then((res) => {
                  if (true || res.status === 204) {
                    this.toggle()
                    this.props.deleteProfile(id)
                  }
                })
              }
            }}
          >
            Xóa
          </CButton>{' '}
          {this.state.title}
        </CModalHeader>
        <CModalBody>
          <form action="" id="producer-info">
            <CRow>
              <label htmlFor="">Field1</label>
              <input type="text" defaultValue={title} disabled={!this.state.editMode} />
            </CRow>
            <CRow>
              <label htmlFor="">Field2</label>
              <input type="text" defaultValue={description} disabled={!this.state.editMode} />
            </CRow>
            <CRow>
              <label htmlFor="">Field4</label>
              <input type="text" defaultValue={id} disabled={!this.state.editMode} />
            </CRow>
            <CRow>
              <label htmlFor="">Field5</label>
              <input type="text" defaultValue={image} disabled={!this.state.editMode} />
            </CRow>
          </form>
        </CModalBody>
        <CModalFooter>
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
          </CButton>{' '}
          <CButton color="secondary" onClick={() => this.toggle()}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }
}

ProducerModal.propsTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
}

export default ProducerModal
