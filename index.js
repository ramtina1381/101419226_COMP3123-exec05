const express = require('express');
const path = require('path')
const app = express();
const router = express.Router();
const fs = require('fs')


app.use(express.json());
app.use(express.static('public'));

router.get('/home', (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'))
});

app.use(router)


router.get('/profile', (req,res) => {
  const userFilePath = path.join(__dirname, 'user.json');

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if(err){
      return res.status(500).json({error: 'Failed to read user data.'})
    }

    res.json(JSON.parse(data));
  })
});


router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  fs.readFile('user.json', (err, data) => {
    if (err) {
      return res.status(500).send('Server Error');
    }
    
    const user = JSON.parse(data);
    
    if (username !== user.username) {
      return res.json({
        status: false,
        message: "User Name is invalid"
      });
    }
    
    if (password !== user.password) {
      return res.json({
        status: false,
        message: "Password is invalid"
      });
    }
    
    res.json({
      status: true,
      message: "User Is valid"
    });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.post('/logout', (req, res) => {
  const username = req.query.username || 'User'; // or req.params.username if using path parameter
  res.send(`<b>${username} successfully logged out.</b>`);
});



app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  res.status(500).send('Server Error'); // Send a 500 status and message
});


app.use('/', router);

app.listen(process.env.port || 8082);

