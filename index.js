const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser'); 
const m_connect = require('mongoose');
require('dotenv').config();

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended: false}));

let m_uri = process.env.MONGO_URI;
m_connect.connect(m_uri,{useNewUrlParser: true, useUnifiedTopology: true});

let User;
let userSchema = new m_connect.Schema({
  username:{
    type: String,
    required: true
  }
});
User = m_connect.model('User',userSchema);

/* POST /api/users */
 app.post('/api/users',function(req,res){
  let userNameStr = Object.values(req.body).toString();
  console.log('req.body = ' + userNameStr);
  /* create a new User entry in User Schema of MongoDB */
  let createAndSaveUser = function(done){
    let a = userNameStr;
    let b = new User(a);
    b.save(function(err,data){
      if (err) console.log ('error = ' + err);
      else console.log('data = ' + data);
    });
    done(null);
  };

  /* find an User by name from the MongoDB database */
  let userN = userNameStr;
  let findUser = function(userN, done){
    User.find({username: userN},function(err,userFound){
      if (err) console.log('error in finding the user in User model in MongoDB');
      else {
        console.log('user was found = ' + userFound);
        res.json({'username': username,'_id': _id}); 
      }
    });
    done(null,data);
  };
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
