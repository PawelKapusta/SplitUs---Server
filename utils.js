export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res
      .status(401)
      .send({ message: 'Invalid Admin Token, this user is not an Administrator in this service' });
  }
};
