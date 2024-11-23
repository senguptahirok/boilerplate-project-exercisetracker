const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser'); 
/* require('dotenv').config(); */

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended: false}));

/* POST /api/users */
 app.post('/api/users',function(req,res){
  let userNameStr = Object.values(req.body).toString();
  console.log('req.body = ' + userNameStr);
  if (!req.body) res.json({success: false, msg: 'please pass user name'});
  else {
    let newUser = new User({
      name: userNameStr
    })
  }
  /* save the user */
  newUser.save(function(err, data){
    if (err) res.json({success: false, msg: 'Username already exists'});
    else res.json({'username': userNameStr,'_id': _id});
  });
  /* res.json({'username': userNameStr,'_id': _id}); */
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
