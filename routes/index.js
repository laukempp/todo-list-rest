// By Lauri and Kaarle

var express = require('express');
var router = express.Router();
const uuid = require('uuid');
const fs = require('fs');

var list = [];

try {
  var updateList = fs.readFileSync(__dirname + '/../public/list.json');
  list = JSON.parse(updateList);
} catch (error) {
  fs.writeFileSync(__dirname+'/../public/list.json', '[]', function(err) {
    if (err) throw err;
  });
  throw error;
}

// GET by Lauri
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// Get pyyntö, joka hakee listan
router.get('/api/list', (req, res) => {
  res.status(200).json(list);
})


router.get('/api/list/:id', (req, res) => {
  const itemFound = list.some(listItem => listItem.id === parseInt(req.params.id));

  if (itemFound) {
    res.json(list.filter(listItem => listItem.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No list item with the id of ${req.params.id}` });
  }
});

// DELETE by Lauri
router.delete('/api/list/:id', (req, res) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id == req.params.id) {
      list.splice(i, 1);
      res.json({ msg: "deleted: " + req.params.id })
      saveToList();
      console.log(list);
      return;
    }
  }
  res.json({ msg: "Could not find " });
})
function saveToList() {
  fs.writeFileSync(__dirname+'/../public/list.json', JSON.stringify(list, null, 2), () => {
  })
}

// POST by Kaarle & Lauri
router.post('/api/list', function(req, res, next) {
  const newitem = {
    id: uuid(),
    title: req.body.title,
    deadline: req.body.deadline,
    completed: req.body.completed,
    priority: req.body.priority
  };

  list.push(newitem);
  console.log(list);
  
  const jsonList = JSON.stringify(list, null, 2);
  fs.writeFileSync(__dirname+'/../public/list.json', jsonList, function(err) {
    if (err) throw err;
  });
  res.status(201);
  res.json(list);
})

// PUT by Kaarle
router.put('/api/list/:id', function(req, res, next) {
  const id = req.params.id;

  let item = list.filter(item => {
    return item.id == id;
  })[0];

  const index = list.indexOf(item);

  const keys = Object.keys(req.body);

  keys.forEach(key => {
    item[key] = req.body[key];
  });
  
  list[index] = item;

  const jsonList = JSON.stringify(list, null, 2);
  fs.writeFileSync(__dirname+'/../public/list.json', jsonList, function(err) {
    if (err) throw err;
  });

  res.status(200);
  res.json(list);
});

//Kaarle / Checkbox's patch request handling, almost the same as PUT handling
router.patch('/api/list/:id', function(req, res, next) {
  const id = req.params.id;

  let item = list.filter(item => {
    return item.id == id;
  })[0];

  const index = list.indexOf(item);

  const keys = Object.keys(req.body);

  keys.forEach(key => {
    item[key] = req.body[key];
  });
  
  list[index] = item;

  const jsonList = JSON.stringify(list, null, 2);
  fs.writeFileSync(__dirname+'/../public/list.json', jsonList, function(err) {
    if (err) throw err;
  });

  res.status(200);
  res.json(list);
});

module.exports = router;
