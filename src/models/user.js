const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true
    },
    lastname: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email address");
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error(
            `We'll suggest you to stay away from the word "password"`
          );
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    cart: [
      {
        product: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// HIDE USER'S SENSITIVE DATA
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// GENERATE TOKEN FOR A USER
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  // geenrate token
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  // add this token to the user's token array
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// FIND A USER BY CREDENTIALS
userSchema.statics.findByCredentails = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Couldn't find the user");
  // CHECK PASSWORD IF EMAIL IS ACCEPTED
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect password, try again");

  return user;
};

// HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
