const router = require("express").Router();
const { SignUpToSystem } = require("../Controllers/IntoSystem");

/**
 * Let the user login/sign in using there cred
 */

router.post("/", async (req, res) => {
  //use validatio here.
  let credFromBody = req.body;
  try {
    let signUpRespone = await SignUpToSystem(credFromBody);
    if (signUpRespone?.error) {
      res.status(404).send("Some error occured");
    } else if (signUpRespone?.message) {
      res.send(signUpRespone);
    } else {
      res.send(signUpRespone);
    }
  } catch (err) {
    console.log("Some error from signup post request");
  }
});

module.exports.SignUpRouter =  router ;
