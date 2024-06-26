const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { user } = require("../../models");
const { uploader } = require("../../helper/cloudinary");
const { getData, setData } = require("../../helper/redis");

exports.createUser = async (payload) => {
  try {
    payload.password = bcrypt.hashSync(payload.password, 10);

    if (payload.picture) {
      const { picture } = payload;

      picture.publicId = crypto.randomBytes(16).toString("hex");

      picture.name = `${picture.publicId}${path.parse(picture.name).ext}`;

      const pictureUpload = await uploader(picture);
      payload.picture = pictureUpload.secure_url;
    }

    if (payload?.image) {
      payload.picture = payload?.image;
    }

    const data = await user.create(payload);

    const keyID = `user:${data.id}`;
    await setData(keyID, data, 300);

    const keyEmail = `user:${data.email}`;
    await setData(keyEmail, data, 300);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("User with that email already exists!");
  }
};

exports.getUserByID = async (id) => {
  const key = `user:${id}`;

  let data = await getData(key);
  if (data) {
    return data;
  }

  data = await user.findAll({
    where: {
      id,
    },
  });
  if (data.length > 0) {
    await setData(key, data[0], 300);

    return data[0];
  }

  throw new Error(`User is not found!`);
};

exports.getUserByEmail = async (email, returnError) => {
  const key = `user:${email}`;
  let data = await getData(key);
  if (data) {
    return data;
  }

  data = await user.findAll({
    where: {
      email,
    },
  });
  if (data.length > 0) {
    await setData(key, data[0], 300);

    return data[0];
  }

  if (returnError) {
    throw new Error(`User is not found!`);
  }

  return null;
};

exports.userVote = async (id, voteId) => {
  const key = `user:${id}`;
  const selectedUser = await user.findOne({ where: { id } });

  if (selectedUser) {
    const updatedUser = await selectedUser.update({ ...user, vote: voteId });
    await setData(key, updatedUser, 300);

    return updatedUser;
  }

  throw new Error(`User is not found!`);
};

exports.getGoogleAccessTokenData = async (accessToken) => {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
  );
  return response.data;
};
