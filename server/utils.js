exports.calculateRating = (upvoteCount, downvoteCount) => {
  rating = Math.round(upvoteCount / (upvoteCount + downvoteCount) * 100);
  return isNaN(rating) ? null : rating;
};
