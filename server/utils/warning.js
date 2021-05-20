function formateWarning(mtype, mdes) {
  return {
    message: { type: mtype, des: mdes },
  };
}

module.exports.fromatWarning = formateWarning;
