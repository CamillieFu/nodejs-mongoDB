const fs = require('fs');

// data
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

/* handlers */
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
};

exports.createUser = (req, res) => {
  const newId = Math.random().toString(36).substring(2, 10);
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  if (!newUser) {
    res.status(500).json({
      status: 'error',
      message:
        'Invalid Request - Cannot create new user with provided credentials',
    });
  } else {
    fs.writeFile(
      `${__dirname}/../starter/dev-data/data/users.json`,
      JSON.stringify(users),
      (err) => {
        res.status(201).json({
          status: 'success',
          results: users.length,
          message: 'successfully added new user',
          data: { users },
        });
      }
    );
  }
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = users.find((user) => user.id === id);
  console.log(user);
  if (!user) {
    res.status(400).json({
      status: 'error',
      message: 'No user with that ID',
    });
  } else {
    res.status(200).json({
      status: 'successful',
      user,
    });
  }
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Request',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Request',
  });
};
