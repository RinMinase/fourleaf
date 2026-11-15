import SweetAlert from "sweetalert2";

const Swal = SweetAlert.mixin({
  showClass: {
    popup: "animate__animated animate__headShake",
  },
  allowOutsideClick: false,
});

export default Swal;
