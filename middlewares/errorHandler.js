exports.errorHandler = function (error) {
  let errorNames;
  if (error.errors) {
    errorNames = Object.keys(error.errors);
  }

  if (errorNames?.length > 0) {
    return error.errors[errorNames[0]].properties.message;
  } else {
    return error.message || error;
  }
};
