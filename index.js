const express = require('express')
const app = express()
//const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
let m_uri = process.env.MONGO_URI;
const cors = require('cors')

let User;
let m_connect = require('mongoose');
m_connect.connect(m_uri,{useNewUrlParser: true, useUnifiedTopology: true});

let userSchema = new m_connect.Schema({
  name:{
    type: String,
    required: true
  }
});

User = m_connect.model('User',userSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({extended: false}));
let host01 = '';
app.post('/api/users',function(req,res,done){
  host01 = Object.values(req.body);
  host01 = host01.toString();
  let a = {name: host01};
  let b = new User(a);
  console.log('a = ' + a);
  console.log('b = ' + b);
  b.save(function(err,data){
    if (err) console.log('error = '+ err);
    else console.log('data = ' + data);
    done(null, data);
  });
  res.json({"host": host01, "id": _id});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
