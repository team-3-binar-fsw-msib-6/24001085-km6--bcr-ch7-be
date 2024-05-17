const { getTokenFromHeaders, extractToken } = require("../helper/auth");
const {
  register,
  login,
  googleLogin,
  profile,
  userVote,
} = require("../usecase/auth");

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req?.body;

    const picture = req?.files?.picture;

    if (email == "" || !email) {
      return next({
        message: "Email must be filled!",
        statusCode: 400,
      });
    }
    if (password == "" || !password) {
      return next({
        message: "Password must be filled!",
        statusCode: 400,
      });
    }
    if (name == "" || !name) {
      return next({
        message: "Name must be filled!",
        statusCode: 400,
      });
    }

    const data = await register({
      email,
      password,
      name,
      picture,
    });

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email == "" || !email) {
      return next({
        message: "Email must be filled!",
        statusCode: 400,
      });
    }
    if (password == "" || !password) {
      return next({
        message: "Password must be filled!",
        statusCode: 400,
      });
    }

    const data = await login(email, password);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return next({
        statusCode: 400,
        message: "Access token must be provided!",
      });
    }

    const data = await googleLogin(access_token);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req.headers);
    const extractedToken = extractToken(token);
    const data = await profile(extractedToken?.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.userVote = async (req, res, next) => {
  try {
    const { id, voteId } = req.body;

    const data = await userVote(id, voteId);
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
