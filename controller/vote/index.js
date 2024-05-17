const voteUsecase = require("../../usecase/vote")

exports.getVote = async (req, res, next) => {
  try {
    const data = await voteUsecase.getVotes()

    res.status(200).json({
      message: "Successs",
      data,
    })
  } catch (error) {
    next(error)
  }
}

exports.createVote = async (req, res, next) => {
  try {
    const { email, voteNumber } = req.body

    if (!email || email == "") {
      return next({
        message: "Vote number must be provided!",
        statusCode: 400,
      })
    }

    if (!voteNumber || voteNumber == "") {
      return next({
        message: "Vote number must be provided!",
        statusCode: 400,
      })
    }

    const data = await voteUsecase.createVote({ email, vote: voteNumber })

    res.status(201).json({
      message: "Success",
      data,
    })
  } catch (error) {
    next(error)
  }
}
