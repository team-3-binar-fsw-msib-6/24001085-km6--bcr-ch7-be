const voteRepo = require("../../repository/vote");

exports.getVotes = async () => {
  const data = await voteRepo.getVotes();
  return data;
};

exports.addVote = async (id) => {
  const data = await voteRepo.addVote(id);
  return data;
};
