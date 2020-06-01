// -----------DOM HANDLER------------

// DOM MARKUPS
const unauthenticated = `<a class="nav-link" href="#" data-toggle="modal" data-target="#authentication-modal"><i class="far fa-user-circle user__nav-icon"></i></a>`;
const authenticated = `<a class="nav-link" href="#" data-toggle="modal" data-target="#user-modal"><i class="fas fa-user-circle user__nav-icon"></i></a>`;

// DOM ELEMENTS
const DOM = {
  // NAV BUTTON
  navItems: document.getElementById("nav-items"),
  userNav: $("#user-nav"),
  // FORM INPUTS
  loginForm: $("#login-form"),
  signupForm: $("#signup-form"),
  loginToggle: $("#login-toggle"),
  signupToggle: $("#signup-toggle"),
  // FROM FIELDS FOR API
  loginEmail: $("#login-email"),
  loginPassword: $("#login-password"),
  signupFirstname: $("#signup-firstname"),
  signupLastname: $("#signup-lastname"),
  signupEmail: $("#signup-email"),
  signupPassword: $("#signup-password"),
  // ERROR FIELDS
  loginError: $("#login-error"),
  signupError: $("#signup-error"),
  // USER ELEMENTS
  username: $("#username"),
  cartNumber: $("#cart-number")
};

// SETUP PAGE
const setup = () => {
  DOM.signupForm.hide();
  if (!localStorage.getItem("auth")) {
    DOM.userNav.html(unauthenticated);
    localStorage.setItem("user_id", 0);
    localStorage.setItem("username", "Guest");
    localStorage.setItem("cart", 0);
  } else {
    DOM.userNav.html(authenticated);
    DOM.username.html(localStorage.getItem("username"));
    DOM.cartNumber.html(localStorage.getItem("cart"));
  }
};

// Toggle login form
DOM.loginToggle.click(() => {
  DOM.loginForm.show();
  DOM.signupForm.hide();
});

// Toggle signup form
DOM.signupToggle.click(() => {
  DOM.loginForm.hide();
  DOM.signupForm.show();
});

// ---------API HANDLERS-----------
// SIGNUP
const signup = async () => {
  // FETCH DATA FROM FIELDS
  let data = {
    firstname: DOM.signupFirstname.val(),
    lastname: DOM.signupLastname.val(),
    email: DOM.signupEmail.val(),
    password: DOM.signupPassword.val()
  };

  try {
    let response = await axios.post("/users", data);
    if (response.status === 201) {
      localStorage.setItem("auth", response.data.token);
      localStorage.setItem("user_id", response.data.user._id);
      localStorage.setItem("username", response.data.user.firstname);
      localStorage.setItem("cart", response.data.user.cart.length);
      DOM.loginError.html("Welcome").css("color", "green");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error) {
    DOM.signupError.html(error.response.data);
  }
};

// LOGIN
const login = async () => {
  // FETCH DATA FROM FIELDS
  let data = {
    email: DOM.loginEmail.val(),
    password: DOM.loginPassword.val()
  };

  try {
    let response = await axios.post("/users/login", data);
    if (response.status === 200) {
      localStorage.setItem("auth", response.data.token);
      localStorage.setItem("user_id", response.data.user._id);
      localStorage.setItem("username", response.data.user.firstname);
      localStorage.setItem("cart", response.data.user.cart.length);
      DOM.loginError.html("Welcome").css("color", "green");
      DOM.loginEmail.css("border", "none");
      DOM.loginPassword.css("border", "none");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error) {
    DOM.loginError.html(error.response.data);
    if (error.response.data === "Couldn't find the user") {
      DOM.loginEmail.css("border", "1px solid red");
      DOM.loginPassword.css("border", "none");
    } else {
      DOM.loginEmail.css("border", "none");
      DOM.loginPassword.css("border", "1px solid red");
    }
  }
};

// LOGOUT
const logout = async () => {
  let config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth")}`
    }
  };
  try {
    let response = await axios.patch("/users/logout", null, config);
    localStorage.clear();
    window.location.reload();
  } catch (error) {
    console.log(error.response.data);
  }
};

// DELETE
const delete_account = async () => {
  let config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth")}`
    }
  };
  console.log(`Bearer ${localStorage.getItem("auth")}`);
  try {
    let response = await axios.patch("/users/me", null, config);
    localStorage.clear();
    if (response.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

setup();
