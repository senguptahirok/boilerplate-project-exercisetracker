const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const m_connect = require('mongoose');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended: false}));
/*
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
*/
/* POST /api/users */
app.post('/api/users',function(req,res){
  console.log('req.body = ' + req.body);
/*  let createAndSaveUser = function(done){
    let a = req.body;
    let b = new User(a);
    b.save(function(err,data){
      if (err) console.log ('error = ' + err);
      else console.log('data = ' + data);
    });
    done(null);
  }; */
  res.send({'user info': req.body});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
