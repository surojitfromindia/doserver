const router = require("express").Router();
const { SignIntoToSystem } = require("../Controllers/IntoSystem");

/**
 * Let the user login/sign in using there cred
 */
router.post("/", async (req, res) => {
  //use validation here.
  const credFromBody = req.body;
  try {
    let logInResponse = await SignIntoToSystem(credFromBody);
    if (logInResponse?.error) {
      res.status(404).send("error while logging in");
    } else if (logInResponse?.message) {
      res.send(logInResponse);
    } else {
      res.send(logInResponse.token);
    }
  } catch (err) {}
});

/**
 * Reset password
 */
router.post("/reset", (req, res) => {});

module.exports.LogInRouter = router;
