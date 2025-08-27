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
  // let a = {id: host03[0], description: host03[1], duration: host03[2], date: host03[3]};

  /* to load the current date, if the date field is not filled-in */
  // console.log('host03[3] = ' + host03[3]);
  // console.log('type of host03[3] = ' + typeof(host03[3]));
  // console.log('length of host03[3] = ' + host03[3].length);
  // if (host03[3].length === 0)
  if (host03[3] === '')
    host03[3] = new Date().toISOString().substring(0,10);
  // console.log('---> host03[3] = ' + host03[3]);
  
  let a = {id: host03[0], description: host03[1], duration: host03[2], date: host03[3]};
  let b = new Exercise(a);
  b.save(function(err,data){
    if (err) console.log('error = ' + err);
    else console.log('data = ' + data);

    /* get username from the User Schema, based on the _id */
    let userId = data.id;
    User.findById({_id: userId}, function(err01,data01){
      if (err01) console.log('user id = ' + userId + 'is not present in User Schema, error = ' + err01);
      else console.log('data01 = ' + data01);
    /* to display the date in user readable format */
      let dateStr = new Date(data.date);
      dateStr = dateStr.toDateString();
      b_exercise = {"username": data01.name, "description": data.description, "duration": data.duration, "date": dateStr, "_id": data.id};
      res.json(b_exercise);
    });
    /* res.json(b_exercise); */
  });
});

/* get a list of all the Users */
app.get('/api/users', function(req,res){
  User.find()
  .exec(function(err, data){
    if (err)
      console.log('error msg, no user was found ... ');
    else
      console.log('list of users = ' + data);
    res.json(data);
  });
});

/* get a full exercise log of any user */
app.get('/api/users/:_id/logs', function(req,res){
  let logObj_name = '';
  let logObj_id = '';
  let logObj_count = 0;

/* get username from the User Schema, based on the _id */
  User.findById({_id: req.params._id}, function(err01, data01){
    if (err01) console.log('user id = ' + req.params._id + 'is not present in User Schema, error = ' + err01);
    else {
      logObj_name = data01.name;
      logObj_id = req.params._id;
    };
  });

  /* get the respective user's exercise log and count */
  Exercise.find({id: req.params._id}, function(err, data){
  //  const {description,duration,date} = data;
    if (err) console.log('user id = ' + req.params._id + 'does not have any exercises');
    else {
      // let logObj_dt = new Date(data.date);
      // logObj_dt = logObj_dt.toDateString();
      logObj_count = Object.keys(data).length;
    }
    let data01 = data.map(function(currentValue){
      let logObj_dt = new Date(currentValue.date);
      logObj_dt = logObj_dt.toDateString();
      return({'description': currentValue.description,'duration': currentValue.duration, 'date': logObj_dt});
    });
    res.json({'username':logObj_name,'count': logObj_count, '_id':logObj_id,'log': data01});
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})