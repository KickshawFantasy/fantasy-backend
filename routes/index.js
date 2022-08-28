const route = require("express").Router();
const Joi = require("joi");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 1;

const { connection } = require("../db/connect");

route.post("/", async (req, res, next) => {
  const schema = Joi.object().keys({
    address: Joi.string().required(),
    files: Joi.array().required(),
    league: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync({
      address: req.body.address,
      files: req.body.files,
      league: req.body.league,
    });

    //generate the mint ID

    bcrypt.hash(value.address, saltRounds, async function (err, hash) {
      const id =
        value.league[0].toUpperCase() +
        hash.slice(hash.length - 10, hash.length);

      const mint = { owner: value.address, mintid: id };
      const mintfile = {
        mintid: id,
        files: JSON.stringify({ files: value.files }),
      };

      const addmints = async () => {
        try {
          return connection.query(
            "INSERT INTO mints SET ?",
            mint,
            async (err, reponse) => {
              if (err) return next(err);

              return Promise.resolve(reponse);
            }
          );
        } catch (error) {
          next(error);
          return;
        }
      };

      const addmintsiles = () => {
        try {
          return connection.query(
            "INSERT INTO files SET ?",
            mintfile,
            async (err, reponse) => {
              if (err) return next(err);

              return Promise.resolve(reponse);
            }
          );
        } catch (error) {
          next(error);
        }
      };
      try {
        const [mintRowId, mintfilesRowId] = await Promise.all([
          //store the mint ID to the owner
          addmints(),
          //store the mint files to the mint ID
          addmintsiles(),
        ]);

        if (mintRowId && mintfilesRowId)
          res.status(200).send("update successfull");
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
});

route.get("/", async (req, res, next) => {
  res.status(200).send("ok");
});

//404 error handler
route.use((req, res, next) => {
  next(createError.NotFound("Not Found"));
});

//error handler
route.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = route;
