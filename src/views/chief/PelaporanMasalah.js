import React, { useEffect, useState } from "react";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CTextarea,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CDataTable,
  CCollapse,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import {
  createDataPegawai,
  getPegawaiById,
  updateDataPegawai,
} from "src/redux/dataPegawaiActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  buatLaporan,
  createUser,
  getLaporan,
  getLaporanAll,
  getUser,
} from "src/redux/actions";
import { Link } from "react-router-dom";

const fields = [
  "no",
  "nama_kostumer",
  "nama_teknisi",
  "status",
  "aksi",
  "tanggal_buat",
  "show_details",
];

const Pelaporan = (props) => {
  const dispatch = useDispatch();
  const dataPegawai = useSelector((state) => state.dataPegawai);
  const user = useSelector((state) => state.auth.user);
  const history = useHistory();
  const { id } = useParams();
  const [modalTeknisi, setModalTeknisi] = useState(false);
  const [data, setData] = useState([]);
  const [details, setDetails] = React.useState([]);
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  React.useEffect(() => {
    dispatch(getLaporanAll())
      .then((res) => {
        console.log(res);
        setData((data) =>
          res.data.data.map((e) => ({ id: e.id, ...e.attributes }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteData = (id) => {
    // Swal.fire({
    //   title: "Apakah Anda Yakin ?",
    //   text: "Jika dihapus maka data tidak dapat dikembalikan",
    //   icon: "warning",
    //   confirmButtonText: "Yakin!",
    //   cancelButtonText: "Tutup",
    //   showCancelButton: true,
    // }).then((res) => {
    //   if (res.isConfirmed) {
    //     dispatch(deletePertanyaan(id)).then(() => {
    //       Swal.fire({
    //         title: "Berhasil",
    //         text: "berhasil menghapus data",
    //         icon: "success",
    //         confirmButtonText: "Tutup",
    //       });
    //       dispatch(getLaporan("Staff"))
    //         .then((res) => {
    //           console.log(res);
    //           setData((data) =>
    //             res.data.data.map((e) => ({ id: e.id, ...e.attributes }))
    //           );
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     });
    //   }
    // });
  };

  const handleLaporan = (_) => {
    Swal.fire({
      title: "Apakah Anda Akan Melakukan Pelaporan ?",
      text: "Anda akan diarahkan kehalaman buat laporan",
      icon: "info",
      confirmButtonText: "Yakin!",
      cancelButtonText: "Tutup",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(
          buatLaporan({
            user: user.id,
            tanggal: Date.now().toString(),
          })
        ).then((res) => {
          const id = res.data.data.id;
          history.push("/permasalahan/" + id);
          console.log(res.data.data.id);
          //   Swal.fire({
          //     title: "Berhasil",
          //     text: "berhasil membuat pelaporan",
          //     icon: "success",
          //     confirmButtonText: "Tutup",
          //   });
          //   dispatch(getUser("Customer"))
          //     .then((res) => {
          //       console.log(res);
          //       setData((data) => res.data);
          //     })
          //     .catch((err) => {
          //       console.log(err);
          //     });
        });
      }
    });
  };

  const getStatus = (status) => {
    switch (status) {
      case 1:
        return <CBadge color="secondary">Dalam Peninjauan</CBadge>;
      case 2:
        return <CBadge color="primary">Sedang ditindak</CBadge>;
      case 3:
        return <CBadge color="success">Selesai</CBadge>;
      default:
        return <CBadge color="secondary">Dalam Peninjauan</CBadge>;
    }
  };

  return (
    <CCol xs="12" sm="12">
      <CCard>
        <CCardHeader>
          Pelaporan Masalah Masyarakat
          <div className="card-header-actions">
            {/* <CButton className="btn btn-success" onClick={handleLaporan}>
                Buat Laporan
              </CButton> */}
          </div>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={data}
            fields={fields}
            itemsPerPage={5}
            pagination
            tableFilter
            itemsPerPageSelect
            hover
            sorter
            scopedSlots={{
              show_details: (item, index) => {
                return (
                  <td className="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      onClick={() => {
                        toggleDetails(index);
                      }}
                    >
                      {details.includes(index) ? "Hide" : "Show"}
                    </CButton>
                  </td>
                );
              },
              details: (item, index) => {
                return (
                  <>
                    <CCollapse show={details.includes(index)}>
                      <CCardBody>
                        <p className="text-muted">
                          Tanggal Buat: {item.createdAt}
                        </p>
                        <p className="text-muted">
                          Tanggal Update: {item.updatedAt}
                        </p>
                        <Link
                          className="btn btn-success "
                          to={`permasalahan/${item.id}`}
                        >
                          Tinjau
                        </Link>
                      </CCardBody>
                    </CCollapse>
                  </>
                );
              },
              no: (item, index) => <td>{index + 1}</td>,
              tanggal_buat: (item) => <td>{item.createdAt}</td>,
              status: (item) => <td>{getStatus(item.status)}</td>,
              nama_teknisi: (item) => (
                <td>
                  <CRow>
                    {!item.teknisi.data ? (
                      <CButton
                        className="btn btn-primary btn-sm mr-2"
                        onClick={() => setModalTeknisi(!modalTeknisi)}
                      >
                        Assign To Technicians
                      </CButton>
                    ) : (
                      <p>{item.teknisi.data.attributes.nama}</p>
                    )}
                  </CRow>
                </td>
              ),
              aksi: (item) => (
                <td>
                  <CRow>
                    <Link
                      className="btn btn-success btn-sm"
                      to={`permasalahan/${item.id}`}
                    >
                      Tinjau
                    </Link>
                  </CRow>
                </td>
              ),
              nama_kostumer: (item) => (
                <td>{item.user.data.attributes.nama}</td>
              ),
            }}
          />
        </CCardBody>
      </CCard>
      <Modal
        modalShown={modalTeknisi}
        toggle={() => setModalTeknisi(!modalTeknisi)}
      />
    </CCol>
  );
};

const Modal = (props) => {
  const dispatch = useDispatch();
  const [nama, setNama] = React.useState("");
  const [teknisi, setTeknisi] = React.useState([]);
  const cb = () => {
    setNama("");
  };

  React.useEffect(() => {
    dispatch(getUser("Technician"))
      .then((res) => {
        console.log("teknisi", res);
        setTeknisi((data) => res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.modalShown]);

  return (
    <CModal show={props.modalShown} onClose={props.toggle}>
      <CModalHeader closeButton>Assign Laporan to Teknisi</CModalHeader>
      <CModalBody>
        <CFormGroup>
          <CLabel htmlFor="nf-nama">Nama Teknisi</CLabel>
          <CSelect>
            {teknisi.map((tek) => (
              <option value={tek.id}>{tek.nama}</option>
            ))}
          </CSelect>
        </CFormGroup>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" disabled={props.disabled}>
          Assign
        </CButton>{" "}
        <CButton color="secondary" onClick={props.toggle}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Pelaporan;
