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
let Exercises;
let exeSchema = new m_connect.Schema({
  id:{type: String, required: true},
  description:{type: String, required: true},
  duration:{type: Number, required: true},
  date: {type: String, required: false}
});
Exercises = m_connect.model('Exercises',exeSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended: true}));
let host01 = '';

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
    res.json({"username": data.name, "id": data._id});
  });
});

//app.use(bodyParser.urlencoded({extended: true}));
let host02 = ''
app.post('/api/users/:_id/exercises', function(req,res){
  host02 = Object.values(req.body);
  host02 = host02.toString();
  console.log('host02 = ' + host02)
  let a = {id: host02[0], description: host02[1], duration: host02[2], date: host02[3]};
  let b = new User(a);
  console.log('a1 = ' + a);
  console.log('b1 = ' + b);
  b.save(function(err,data){
    if (err) console.log('error = ' + err);
    else console.log('data = ' + data);
    res.json(b);
  });
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
