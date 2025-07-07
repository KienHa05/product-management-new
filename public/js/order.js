// (index) Order Cancel
const tableCancelOrder = document.querySelector("#table-cancel-order");
if (tableCancelOrder) {
  const buttonsCancelOrder = tableCancelOrder.querySelectorAll("[button-cancel-order]");
  if (buttonsCancelOrder.length > 0) {
    const formCancelOrder = document.querySelector("#form-cancel-order");
    const path = formCancelOrder.getAttribute("data-path");

    buttonsCancelOrder.forEach(button => {
      button.addEventListener("click", () => {

        const isConfirm = confirm("Bạn Có Chắc Muốn Hủy Đơn Hàng Này ?");
        if (isConfirm) {
          const id = button.getAttribute("data-id");

          const action = `${path}/${id}?_method=PATCH`;

          formCancelOrder.action = action;

          formCancelOrder.submit();
        }
      });
    });
  }
}
// End (index) Order Cancel

// (detail) Order Cancel
const formCancelOrderDetail = document.querySelector("#form-cancel-order");
if (formCancelOrderDetail) {
  const buttonCancelOrderDetail = formCancelOrderDetail.querySelector("[button-cancel-order]");
  if (buttonCancelOrderDetail) {
    const path = formCancelOrderDetail.getAttribute("data-path");

    buttonCancelOrderDetail.addEventListener("click", (e) => {
      e.preventDefault();

      const isConfirm = confirm("Bạn Có Chắc Muốn Hủy Đơn Hàng Này ?");
      if (isConfirm) {
        const id = buttonCancelOrderDetail.getAttribute("data-id");

        const action = `${path}/${id}?_method=PATCH`;

        formCancelOrderDetail.action = action;

        formCancelOrderDetail.submit();
      }
    });
  }
}
// End (detail) Order Cancel

