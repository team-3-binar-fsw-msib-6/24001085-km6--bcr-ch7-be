const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createUser,
  getUserByEmail,
  getUserByID,
  getGoogleAccessTokenData,
} = require("../../repository/user");
const { createToken } = require("./util");

exports.register = async (payload) => {
  let user = await createUser(payload);

  // Delete object password from user
  delete user.dataValues.password;

  // Create token
  const jwtPayload = {
    id: user.id,
  };

  const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // return the user data and the token
  const data = {
    user,
    token,
  };

  return data;
};

exports.login = async (email, password) => {
  // get the user
  let user = await getUserByEmail(email);
  if (!user) {
    throw new Error(`User is not found!`);
  }

  // compare the password
  const isValid = await bcrypt.compare(password, user?.password);
  if (!isValid) {
    throw new Error(`Wrong password!`);
  }

  // delete password
  if (user?.dataValues?.password) {
    delete user?.dataValues?.password;
  } else {
    delete user?.password;
  }

  // Create token
  const jwtPayload = {
    id: user.id,
  };

  const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // return the user data and the token
  const data = {
    user,
    token,
  };

  return data;
};

exports.googleLogin = async (accessToken) => {
  // validate the token and get the data from google
  const googleData = await getGoogleAccessTokenData(accessToken);

  // get is there any existing user with the email
  let user = await getUserByEmail(googleData?.email);

  // if not found
  if (!user) {
    // Create new user based on google data that get by access_token
    user = await createUser({
      email: googleData?.email,
      password: "",
      name: googleData?.name,
      image: googleData?.picture,
    });
  }

  // Delete object password from user
  delete user?.dataValues?.password;

  // create token
  const data = createToken(user);

  return data;
};

exports.profile = async (id) => {
  // get the user
  let data = await getUserByID(id);
  if (!data) {
    throw new Error(`User is not found!`);
  }

  // delete password
  if (data?.dataValues?.password) {
    delete data?.dataValues?.password;
  } else {
    delete data?.password;
  }

  return data;
};
