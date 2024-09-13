import SweetAlert from "sweetalert2";

const Swal = SweetAlert.mixin({
  showClass: {
    popup: "animate__animated animate__fadeInDown",
  },
  customClass: {
    title: "!text-2xl",
  },
  confirmButtonColor: "#28A745",
  allowOutsideClick: false,
});

export default Swal;
