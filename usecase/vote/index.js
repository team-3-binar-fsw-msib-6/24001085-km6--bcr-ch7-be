const voteRepo = require("../../repository/vote")

exports.getVotes = async () => {
  const data = await voteRepo.getVotes()
  return data
}

exports.createVote = async (payload) => {
  const data = await voteRepo.createVote(payload)
  return data
}
