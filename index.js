var express = require('express');
var cons = require('consolidate');
var app = express();

app.engine('html', cons.underscore);
app.set('port',(process.env.PORT || 50000));

app.use(express.static(__dirname+'/'));
app.set('views', __dirname+'/');
app.set('view engine', 'html');
// app.get('/', function(req, res){
//   res.render('potato.html');
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
