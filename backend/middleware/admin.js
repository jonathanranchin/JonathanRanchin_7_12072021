module.exports = (req, res, next) => {
  try {
    console.log(getUserId(token));
    next();
    if (token) {
      console.log("You have admin priviledges!");
    } else {
      throw "Invalid user ID";
    }
  } catch {
    next();
    res.status(403).json({
      error: new Error("Invalid request!"),
    });
  }
};
