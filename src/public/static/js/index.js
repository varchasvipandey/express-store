const renderProducts = productsHTMLArray => {
  const productsHTMLString = productsHTMLArray.join("");
  document
    .getElementById("home-products-list")
    .insertAdjacentHTML("afterbegin", productsHTMLString);
};

const buildHTML = (products, productsHTMLArray) => {
  products.map(product => {
    let element = `<div class="col-sm-6 mb-4"><a href="/products/preview/?id=${product._id}"><div class="card bg-dark text-white product-card"><img src="http://localhost:3000/products/${product._id}/image" class="card-img product-image" alt="..."/><div class="card-img-overlay"><h5 class="card-title product-name">${product.name}</h5><p class="card-text product-desc">${product.brief}</p><p class="card-text price-tag">₹${product.price}</p><template id="product-id">${product._id}</template></div></div></a></div>`;
    productsHTMLArray.push(element);
  });
  renderProducts(productsHTMLArray);
};

const fetchHomeProducts = async () => {
  try {
    const response = await axios.post("/get-home-products");
    const products = response.data;
    const productsHTMLArray = [];
    buildHTML(products, productsHTMLArray);
  } catch (error) {
    console.log("Unable to fetch data from the server");
  }
};

fetchHomeProducts();
