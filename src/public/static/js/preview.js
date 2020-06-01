const product_id = window.location.search.slice(4);

// DOM ELEMENTS
const MODAL = {
  modalIcon: $("#to-cart-modal__icon"),
  modalMessage: $("#to-cart-modal__message")
};

// DOM
const renderProducts = element => {
  document
    .getElementById("preview-product-details")
    .insertAdjacentHTML("afterbegin", element);
};

const buildHTML = product => {
  localStorage.setItem("expressStore__current-product", product._id);
  let element = `<div class="col-lg-4 col-md-12 product-preview__image mb-4"><img class="img-fluid mx-auto d-block" src="/products/${product._id}/image" alt="product-display-image" /></div><div class="col-lg-7 offset-lg-1 col-md-12 product-preview__description"><h2 class="product-preview__title">${product.name}</h2><hr /><p class="product-preview__content mt-4"><span class="mt-4">DESCRIPTION:</span><br />${product.description}</p><hr /><p class="product-preview__price"><span>₹</span>${product.price}</p></div>`;
  renderProducts(element);
};

const responseModal = status => {
  let icon, message;
  if (status) {
    icon = `<i class="far fa-check-circle success"></i>`;
    message = "Added to cart";
    MODAL.modalIcon.html(icon);
    MODAL.modalMessage.html(message);
  } else {
    icon = `<i class="far fa-times-circle failure"></i>`;
    message = "Failed to add";
    MODAL.modalIcon.html(icon);
    MODAL.modalMessage.html(message);
  }
};

// FETCH THIS PRODUCT FROM DB
const fetchProduct = async () => {
  try {
    const response = await axios.post(`/products/preview/${product_id}`);
    const product = response.data;
    buildHTML(product);
  } catch (error) {
    console.log("Unable to fetch data from the server");
  }
};

// ADD THIS PRODUCT TO CART
const addToCart = async () => {
  console.log(localStorage.getItem("expressStore__current-product"));
  activeProductId = localStorage.getItem("expressStore__current-product");
  activeUserId = localStorage.getItem("user_id");
  // POST REQUEST TO ADD THIS PRODUCT
  try {
    const response = await axios.post(
      `/cart/${activeUserId}/${activeProductId}`
    );
    responseModal(true);
  } catch (error) {
    console.log(error.response.data);
    responseModal(false);
  }
};

// CALL ADD PRODUCT
$("#add-to-cart").click(addToCart);

fetchProduct();
