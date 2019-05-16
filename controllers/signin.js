const jwt = require("jsonwebtoken");
const redis = require("redis");

// Redis Client Setup
const redisClient = redis.createClient(process.env.REDIS_HOST);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;

  // Validate format.
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }

  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => user[0])
          .catch(err => Promise.reject("unable to retrieve user"));
      } else {
        Promise.reject("incorrect credentials");
      }
    })
    .catch(err => Promise.reject("incorrect credentials"));
};

const getAuthTokenId = () => {
  console.log("auth ok");
};

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2 days" });
};

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
};

const createSessions = user => {
  console.log('creating session')
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token: token };
    })
    .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId()
    : handleSignin(db, bcrypt, req, res)
        .then(data => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then(session => {
          res.json(session);
        })
        .catch(err => {
          res.status(400).json("Issue signing in");
        });
};

module.exports = {
  signinAuthentication: signinAuthentication
};
