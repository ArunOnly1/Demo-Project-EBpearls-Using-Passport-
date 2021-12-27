exports.respondSuccess = (res, statusCode, title, message, data = []) =>
  res.status(statusCode).send({
    title,
    message,
    data,
  })

exports.respondError = (res, statusCode, title, message) =>
  res.status(statusCode).send({
    title,
    message,
  })
