const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const getUserInfo = require("../lib/getUserInfo");
const router = express.Router();

router.post("/", async function (req, res, next) {
  const { username, password } = req.body;


   // Validación inicial de los datos de entrada
   if (!username || !password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "El correo electronico y la contraseña son obligatorios",
      })
    );
  }

  try {
    let user = new User();
    const userExists = await user.usernameExists(username);

    if (userExists) {
      user = await User.findOne({ username: username });

      const passwordCorrect = await user.isCorrectPassword(
        password,
        user.password
      );

      if (passwordCorrect) {
        const accessToken = user.createAccessToken();
        const refreshToken = await user.createRefreshToken();

        console.log({ accessToken, refreshToken });

        return res.json(
          jsonResponse(200, {
            accessToken,
            refreshToken,
            user: getUserInfo(user),
          })
        );
      } else {
        //res.status(401).json({ error: "username and/or password incorrect" });

        return res.status(401).json(
          jsonResponse(401, {
            error: "Correo electronico o contraseña incorrecta",
          })
        );
      }
    } else {
      return res.status(401).json(
        jsonResponse(401, {
          error: "El usuario no existe",
        })
      );
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(jsonResponse(500, { error: 'Internal server error' }));
  }
});

module.exports = router;
