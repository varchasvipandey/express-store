let productsLength;

const no_product =
  '<div class="no-products" id="no-products"><img src = "/static/img/no-product.png" alt = "no product found" class="no-products__image"/></div>';

const checkDOM = () => {
  let elements = $(".product-snippet").get();
  let presence = elements.filter(elem => elem.style.display === "none");
  console.log(presence);
  if (presence.length === productsLength) {
    let error = [no_product];
    renderProducts(error);
  } else {
    $("#no-products").hide();
    return;
  }
};

const renderProducts = productsHTMLArray => {
  const productsHTMLString = productsHTMLArray.join("");
  document
    .getElementById("list-all-products")
    .insertAdjacentHTML("afterbegin", productsHTMLString);
};

const buildHTML = (products, productsHTMLArray) => {
  products.map(product => {
    let element = `<div class="col-lg-4 col-md-6 col-sm-12 mb-4 product-snippet ${product.category}" data-price="${product.price}"><a href="/products/preview/?id=${product._id}" class="product-snippet__anchor"><div class="card" style="width: 100%;"><img class="img-fluid mx-auto d-block" src="/products/${product._id}/image" class="card-img-top product-snippet__image" alt="product-image"/><div class="card-body"><h3 class="product-snippet__name">${product.name}</h3><hr /><p class="card-text product-snippet__description">${product.brief}</p><hr /><p class="product-snippet__price" id="test-para"><span>₹</span>${product.price}</p></div></div></a></div>`;
    productsHTMLArray.push(element);
  });
  renderProducts(productsHTMLArray);
};

const fetchProducts = async (category = "0", price = 0) => {
  try {
    const response = await axios.post("/get-products");
    const products = response.data;
    productsLength = products.length;
    const productsHTMLArray = [];
    buildHTML(products, productsHTMLArray);
  } catch (error) {
    console.log("Unable to fetch data from the server");
  }
};

const fetchQuery = () => {
  let category = document.getElementById("category").value;
  let price = parseInt(document.getElementById("price").value);
  console.log(productsLength);
  return { category, price };
};

const filterProductsByPrice = (elements, price) => {
  elements.get().map(elem => {
    let productPrice = parseInt($(elem).attr("data-price"));
    if (price === 10000 && productPrice > 10000) elem.style.display = "none";
    else if (price === 20000 && (productPrice < 10000 || productPrice > 20000))
      elem.style.display = "none";
    else if (price === 50000 && (productPrice < 20000 || productPrice > 50000))
      elem.style.display = "none";
    else if (price === 100000 && productPrice <= 50000)
      elem.style.display = "none";
  });

  //check products
  checkDOM();
};

const filterProductsByCategory = (category, price) => {
  //if category is none and only price is altered
  if (category === "none" && price !== 0) {
    filterProductsByPrice($(".product-snippet"), price);
    return;
  }

  // hide products not matching with the category asked
  $(".product-snippet")
    .not("." + category)
    .hide();

  // hide products with matching category and unwanted price range
  if (price !== 0) {
    filterProductsByPrice($("." + category), price);
    return;
  }

  //check products
  checkDOM();
};

document.getElementById("query-btn").onclick = () => {
  let query = fetchQuery();
  $(".product-snippet").show();
  if (query.category === "none" && query.price === 0) return;
  filterProductsByCategory(query.category, query.price);
};

fetchProducts();
