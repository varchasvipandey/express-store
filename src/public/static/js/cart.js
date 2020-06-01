// CART STATUS
let total_price = 0,
  total_items = 0;

// RENDER PRICE AT THE END

// RENDER PRODUCT AS THE LAST CHILD
const renderProducts = product => {
  document
    .getElementById("cart__list")
    .insertAdjacentHTML("beforeend", product);

  $("#total-price").html(total_price);
  $("#total-items").html(total_items);
};

// BUILD PRODUCT LIST ITEM HTML
const buildHTML = product => {
  total_price += parseInt(product.price);
  total_items += 1;
  localStorage.setItem("cart", total_items);
  console.log(`Total amount: ${total_price} Total items: ${total_items}`);
  let element = `<li class="list-group-item cart__item mb-2"><div><p class="cart__item--name">${product.name}</p><p class="cart__item--price">₹ <span>${product.price}</span></p></div><button onclick="removeItem('${product._id}')" class="btn cart__item--delete"><i class="fas fa-trash-alt"></i></button></li>`;
  renderProducts(element);
};

// FETCH CART PRODUCTS ONE-BY-ONE & SEND FOR RENDERING
const fetchAllCartProducts = async products => {
  products.map(async elem => {
    try {
      let elemId = elem.product;
      let response = await axios.post(`/products/cart-preview/${elemId}`);
      let product = response.data;
      await buildHTML(product);
    } catch (error) {
      console.log("Server error");
    }
  });
};

// FETCH CART OF A USER
const fetchCart = async () => {
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth")}`
      }
    };
    const response = await axios.post(`/cart`, null, config);
    const products = response.data;
    productsLength = products.length;
    fetchAllCartProducts(products);
  } catch (error) {
    console.log("Unable to fetch data from the server");
  }
};

// DELETE AN ITEM FROM CART
const removeItem = async item_id => {
  let currentUserId = localStorage.getItem("user_id");
  try {
    const response = await axios.delete(`/cart/${currentUserId}/${item_id}`);
    window.location.reload();
  } catch (error) {
    console.log(error.response.data);
  }
};

fetchCart();
