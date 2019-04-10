const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json("invalid credentials");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("UNABLE TO GET USER"));
      } else {
        res.status(400).json("WRONG CREDENTIALS");
      }
    })
    .catch(err => res.status(400).json("DENIED"));
};

module.exports = {
  handleSignin: handleSignin
};
