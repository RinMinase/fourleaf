import SweetAlert from "sweetalert2";

const Swal = SweetAlert.mixin({
  showClass: {
    popup: "animate__animated animate__fadeInDown",
  },
  customClass: {
    popup: "!pb-3",
    title: "!text-base !pt-3 !font-medium",
    input: "!text-sm !h-9 !shadow-none !mt-3 !px-2 !py-1.5 !text-center",
    actions: "!mt-2",
    cancelButton: "!py-2 !my-0 !w-24 !text-sm !leading-tight",
    closeButton: "!py-2 !my-0 !w-24 !text-sm !leading-tight",
    confirmButton: "!py-2 !my-0 !w-24 !text-sm !leading-tight",
    denyButton: "!py-2 !my-0 !w-24 !text-sm !leading-tight",
    validationMessage:
      "!text-sm !leading-none !font-normal before:!hidden !mb-2 !bg-red-100",
  },
  confirmButtonColor: "#28A745",
  allowOutsideClick: false,
});

export const OpenErrorSwal = async () => {
  const response = await Swal.fire({
    title: "An error occured, please reload the page",
    confirmButtonColor: "#f87171",
  });

  if (response.isConfirmed) {
    location.reload();
  }
};

export default Swal;
