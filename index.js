const express = require('express')
const app = express()
//const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
let m_uri = process.env.MONGO_URI;
const cors = require('cors')

let m_connect = require('mongoose');
m_connect.connect(m_uri,{useNewUrlParser: true, useUnifiedTopology: true});

/* User Schema */
let User;
let userSchema = new m_connect.Schema({
  name:{
    type: String,
    required: true
  }
});
User = m_connect.model('User',userSchema);

/* Exercise Schema */
let Exercise;
let exeSchema = new m_connect.Schema({
  id:{type: String, required: true},
  description:{type: String, required: true},
  duration:{type: Number, required: true},
  date: {type: String, required: false}
});
Exercise = m_connect.model('Exercise',exeSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended: true}));

/* POST Section for Schema: User */
let host01 = '';
let b_user = {};
app.post('/api/users',function(req,res){
  host01 = Object.values(req.body);
  host01 = host01.toString();
  console.log('host01 = ' + host01);
  let a = {name: host01};
  let b = new User(a);
  console.log('a = ' + a);
  console.log('b = ' + b);
  b.save(function(err,data){
    if (err) console.log('error = '+ err);
    else console.log('data = ' + data);
  //  done(null, data);
    b_user = {"username": data.name, "_id": data._id};
    res.json(b_user);
  });
});

/* POST Section for Schema: Exercise */
let host02 = '';
let host03 = [];
let b_exercise = {};
app.post('/api/users/:_id/exercises', function(req,res){
  host02 = Object.values(req.body);
  host02 = host02.toString();
  host03 = host02.split(',');
  // for (value in host01) {host02.push(host01[value])};
  // console.log(' **** in exercise area **** ');
  // console.log('host02 = ' + host02);
  // console.log('type of host02 = ' + typeof(host02));
  // console.log('host03 = ' + host03);
  // console.log('type of host03 = ' + typeof(host03));
  let a = {id: host03[0], description: host03[1], duration: host03[2], date: host03[3]};
  let b = new Exercise(a);
  console.log('a1 = ' + a);
  console.log('b1 = ' + b);
  b.save(function(err,data){
    if (err) console.log('error = ' + err);
    else console.log('data = ' + data);

    /* get username from the User Schema, based on the _id */
    let userId = data.id;
    console.log('userId = ' + userId);
    let userN = '';
    User.findById({_id: userId, function(err01,data01){
      console.log(' ***** in function findById ****** ');
      if (err01) console.log('user id = ' + userId + 'is not present in User Schema, error = ' + err01);
      else console.log('data01 = ' + data01);
      userN = data01.name;
      console.log('userN = ' + userN);         
    }});
    b_exercise = {"username": userN, "description": data.description, 
                  "duration": data.duration, "date": data.date,
                  "_id": data.id};
    res.json(b_exercise);
  });
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})