const { vote } = require("../../models");

exports.getVotes = async () => {
  const data = await vote.findAll({
    order: [["id", "ASC"]],
  });
  return data;
};

exports.addVote = async (id) => {
  const votes = await vote.findOne({ where: { id } });

  if (votes) {
    const updatedVotes = await votes.increment("votes", { by: 1 });
    return updatedVotes;
  }

  throw new Error("Vote id not found!");
};
