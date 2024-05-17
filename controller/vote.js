const voteUsecase = require("../usecase/vote");

exports.getVotes = async (req, res, next) => {
  try {
    const data = await voteUsecase.getVotes();

    res.status(200).json({
      message: "Successs",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.addVote = async (req, res, next) => {
  try {
    const { voteId } = req.body;

    if (!voteId || voteId === null) {
      return next({
        message: "Vote id must be provided!",
        statusCode: 400,
      });
    }

    const data = await voteUsecase.addVote(voteId);

    res.status(201).json({
      message: "You have voted successfully!",
      data,
    });
  } catch (error) {
    next(error);
  }
};
