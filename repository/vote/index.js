const { vote } = require("../../models")

exports.getVotes = async () => {
  const data = await vote.findAll()
  return data
}

exports.createVote = async (payload) => {
  const data = await vote.create(payload)
  return data
}
