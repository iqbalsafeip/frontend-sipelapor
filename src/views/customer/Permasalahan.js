import React, { useEffect, useState } from "react";
import Rating from "react-rating";
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
} from "@coreui/react";
import {
  createDataPegawai,
  getPegawaiById,
  updateDataPegawai,
} from "src/redux/dataPegawaiActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { buatLaporan, createUser, getPertanyaan } from "src/redux/actions";
import Typography from "../theme/typography/Typography";
import CIcon from "@coreui/icons-react";

const BuatLaporan = (props) => {
  const dispatch = useDispatch();
  const dataPegawai = useSelector((state) => state.dataPegawai);
  const user = useSelector((state) => state.auth.user);
  const [pertanyaan, setPertanyaan] = useState([]);
  const history = useHistory();
  const { id } = useParams();
  const [data, setData] = useState({
    nama: "",
    jenis_kelamin: "",
    email: "",
    alamat: "",
  });

  useEffect(() => {
    dispatch(getPertanyaan()).then((result) => {
      console.log(result);
      setPertanyaan((data) =>
        result.data.data.map((e) => ({ id: e.id, ...e.attributes }))
      );
    });
  }, []);

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

  return (
    <CCol xs="12" sm="12">
      <CCard>
        <CCardHeader>Buat Pelaporan</CCardHeader>
        <CCardBody>
          {pertanyaan.map((pert) => (
            <React.Fragment>
              <CRow>
                <CCol>
                  <p style={{ fontSize: 24 }}>{pert.pertanyaan}?</p>
                </CCol>
                <CCol>
                  <Rating
                    onChange={(e) => alert(e)}
                    emptySymbol={<CIcon name="cil-x-circle" size="lg" />}
                    fullSymbol={<CIcon name="cil-star" color="" size="lg" />}
                  />
                </CCol>
              </CRow>
            </React.Fragment>
          ))}
          <CRow>
            <CCol>
              <CFormGroup>
                <CLabel>*Tambahan</CLabel>
                <CTextarea></CTextarea>
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormGroup>
                <CLabel>*Gambar Tambahan</CLabel>
                <CInput type="file"></CInput>
              </CFormGroup>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default BuatLaporan;
