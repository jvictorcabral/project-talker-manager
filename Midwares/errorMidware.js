const errorMidware = (err, _req, res, _next) => {
  res.status(400).json({ error: `${err}` });
};

module.exports = errorMidware;