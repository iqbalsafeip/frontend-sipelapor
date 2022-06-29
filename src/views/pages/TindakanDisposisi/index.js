import React from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CCollapse,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormGroup,
  CLabel,
  CInput,
  CTextarea,
  CSelect,
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { useDispatch, useSelector } from 'react-redux'
import { createData, getAll, deleteData, updateData } from 'src/redux/dataMasterActions'

const fields = ['no','tindakan','keterangan', 'is_active', 'show_details']

const TindakanDisposisi = () => {
    const dispatch = useDispatch()
    const dataMaster = useSelector(state => state.dataMaster)
    const [details, setDetails] = React.useState([])
    const [modalTambah, setModalTambah] = React.useState(false);
    const [modalUpdate, setModalUpdate] = React.useState(false);
    const [modalAlert, setModalAlert ] = React.useState([]);
    const [currData, setCurrData ] = React.useState(0);

    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
          newDetails.splice(position, 1)
        } else {
          newDetails = [...details, index]
        }
        setDetails(newDetails)
    }

    const onCreate = (tindakan, keterangan, is_active, cb) => {
        dispatch(createData({pathAPI: 'tindakan_disposisi', actionType: 'CREATE_TINDAKAN_DISPOSISI', data: {
            tindakan: tindakan,
            keterangan: keterangan,
            is_active: is_active
        }})).then(res => {
            cb();
            setModalTambah(false)
            setModalAlert([...modalAlert, {modalShown: false}])
        }).catch(err => {
            cb();
            setModalTambah(false)
        })
    }

    const onUpdate = (tindakan, keterangan, is_active, cb) => {
        dispatch(updateData({pathAPI: 'tindakan_disposisi', actionType: 'UPDATE_TINDAKAN_DISPOSISI', id: currData , data: {
            tindakan: tindakan,
            keterangan: keterangan,
            is_active: is_active
        }})).then(res => {
            cb();
            setModalUpdate(false)
        }).catch(err => {
            cb();
            setModalUpdate(false)
        })
    }

    const onDelete = (id, index) => {
        dispatch(deleteData({pathAPI: 'tindakan_disposisi', actionType: 'DELETE_TINDAKAN_DISPOSISI', data: {
            id: id
        }})).then(res => {
            console.log(res);
            toggleDetails(index)
            const temp = modalAlert.map((d, idx)=> idx === index ? {shownModal: !modalAlert[index].shownModal}: d)
            setModalAlert(temp)
        }).catch(err => {
            console.log(err);
            toggleDetails(index)
            const temp = modalAlert.map((d, idx)=> idx === index ? {shownModal: !modalAlert[index].shownModal}: d)
            setModalAlert(temp)
        })
        
    }

    const toggleModalAlert = index => {
        const temp = modalAlert.map((d, idx)=> idx === index ? {shownModal: !modalAlert[index].shownModal}: d)
        setModalAlert(temp)
    }

    const updateToggle = (index) => {
        setCurrData(index) 
        setModalUpdate(!modalUpdate)
    }

    React.useEffect(()=> {
        dispatch(getAll({ pathAPI : 'tindakan_disposisi', actionType: 'SET_TINDAKAN_DISPOSISI' })).then((res)=>{
            console.log(res.data.data);
            setModalAlert(res.data.data.map(data => ({ shownModal : false })))
        }).catch(err => {
            console.log(err);
        })
    },[])
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader >
              tindakan Surat
              <div className='card-header-actions'>
                <CButton color="primary" onClick={()=> setModalTambah(!modalTambah)} >
                    Tambah Data
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={dataMaster.tindakan_disposisi}
              fields={fields}
              itemsPerPage={5}
              pagination
                tableFilter
                itemsPerPageSelect
                hover
                sorter
                pagination
              scopedSlots = {{
                'actions':
                  (item)=>(
                    <td>
                      <CButton width={6}  >
                          <CIcon name="cil-trash"  />
                      </CButton>
                    </td>
                  ),
                'show_details':
                  (item, index)=>{
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={()=>{toggleDetails(index)}}
                        >
                          {details.includes(index) ? 'Hide' : 'Show'}
                        </CButton>
                      </td>
                      )
                  },
                  'details':
                    (item, index)=>{
                        return (
                            <>
                            <CCollapse show={details.includes(index)}>
                                <CCardBody>
                                <p className="text-muted">Tanggal Buat: {item.createdAt}</p>
                                <p className="text-muted">Tanggal Update: {item.updatedAt}</p>
                                <CButton size="sm" color="info" onClick={()=> updateToggle(item.id)  } >
                                    Update
                                </CButton>
                                <CButton size="sm" color="danger" className="ml-1" onClick={()=> toggleModalAlert(index)}  >
                                    Delete
                                </CButton>
                                </CCardBody>
                            </CCollapse>
                            <TindakanDisposisi.ModalAlert show={modalAlert[index] ? modalAlert[index].shownModal : false} onClick={()=> onDelete(item.id, index)} toggle={()=> toggleModalAlert(index)} disabled={dataMaster.is_loading} />
                            </>
                        )
                    },
                    'is_active' : 
                    (item) => (
                        <td>
                        <CBadge color={item.is_active == 1 ? 'success' : 'secondary'}>
                            {item.is_active == 1 ? 'Aktif' : 'Tidak Aktif'}
                        </CBadge>
                        </td>
                    ),
                    'no' :
                    (item,index) => (
                        <td>
                            {index+1}
                        </td>
                    )
                        
                }
              }
            />
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>
      <TindakanDisposisi.Modal modalShown={modalTambah} toggle={()=> setModalTambah(!modalTambah)} onSubmit={onCreate} disabled={dataMaster.is_loading} />
      <TindakanDisposisi.Modal modalShown={modalUpdate} toggle={()=> setModalUpdate(!modalUpdate)} onSubmit={onUpdate} disabled={dataMaster.is_loading} isUpdate data={dataMaster.tindakan_disposisi.filter(d => d.id == currData)[0]} />
      
    </>
  )
}

const Modal = props => {

    const [tindakan, setTindakan] = React.useState('');
    const [keterangan, setKeterangan] = React.useState('');
    const [is_active, setIsActive] = React.useState(0);

    const cb = () => {
        setTindakan('')
        setKeterangan('')
        setIsActive(0)
    }

    React.useEffect(()=> {
        if(props.isUpdate && props.modalShown) {
            const {tindakan, keterangan, is_active } = props.data
            setTindakan(tindakan);
            setKeterangan(keterangan);
            setIsActive(is_active);
        }
    },[props.modalShown])

    return (
        <CModal
        show={props.modalShown}
        onClose={props.toggle}
      >
        <CModalHeader closeButton>{props.isUpdate ? 'Update' : 'Tambah'} Data</CModalHeader>
        <CModalBody>
            <CFormGroup>
                <CLabel htmlFor="nf-nama">Nama tindakan</CLabel>
                <CInput
                    type="text"
                    value={tindakan}
                    onChange={e => setTindakan(e.target.value)}
                    id="nf-nama"
                    name="nf-nama"
                    placeholder="Masukan Nama tindakan..."
                    required
                />
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor="nf-nama">Keterangan</CLabel>
                <CTextarea
                    rows={5}
                    required
                    onChange={e => setKeterangan(e.target.value)}
                    value={keterangan}
                ></CTextarea>
            </CFormGroup>
            <CFormGroup>
                <CLabel>Is Active ?</CLabel>
                <CSelect custom id="is_active" onChange={e => setIsActive(e.target.value)} value={is_active} >
                    <option value={0}  >Tidak Aktif</option>
                    <option value={1}  >Aktif</option>
                </CSelect>
            </CFormGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={()=> props.onSubmit(tindakan,keterangan,is_active, cb)} disabled={props.disabled} > {props.disabled ? <CSpinner size='sm' /> : null} {props.isUpdate ? 'Update' : 'Tambah'}</CButton>{' '}
          <CButton
            color="secondary"
            onClick={props.toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    )
}

TindakanDisposisi.ModalAlert = props => {
    return (
        <CModal
            show={props.show}
            onClose={props.toggle}
        >
            <CModalHeader closeButton >Yakin Hapus Data?</CModalHeader>
            <CModalBody>Jika Dihaspus maka data tidak dapat dikembalikan</CModalBody>
            <CModalFooter>
                <CButton color="danger" onClick={props.onClick} disabled={props.disabled} > {props.disabled ? <CSpinner size='sm' /> : null} Yakin</CButton>{' '}
                <CButton
                    color="secondary"
                    onClick={props.toggle}
                >Cancel</CButton>
            </CModalFooter>
        </CModal>
    )
}

TindakanDisposisi.Modal = Modal

export default TindakanDisposisi
