const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const app = express();

const cors = require("cors"); // for cors error solution the below 3 lines are added
app.use(bodyParser.json());   //cors Solution 2
app.use(cors());

app.use(bodyParser.json());
let todos =[];
function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get('/todos', (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));// we are parsing here coz we want an object not a string  
  });
});

app.get('/todos/:id', (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.json(todos[todoIndex]);
    }
  });
});

app.post('/todos', (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    title: req.body.title,
    description: req.body.description
  };
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.put('/todos/:id', (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      const updatedTodo = {
        id: todos[todoIndex].id,
        title: req.body.title,
        description: req.body.description
      };
      todos[todoIndex] = updatedTodo;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).json(updatedTodo);
      });
    }
  });
});

app.delete('/todos/:id', (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
     const  updatedtodos = removeAtIndex(todos, todoIndex);
      fs.writeFile("todos.json", JSON.stringify(updatedtodos), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  });
});
// app.delete('/todos/:id', (req, res) => {                                       es line of code my error aa rha hai
//   fs.readFile("todos.json", "utf8", (err, data) => {                      kyunki mai todos ko globaly bhi declare kr 
//     if (err) throw err;                                                     chuka hu, phir usi ko mai if else me bhi use kr rha hu 
//     const todos = JSON.parse(data);                                        with same name so .... I need to change it, to avoid eror
//     const todoIndex = findIndex(todos, parseInt(req.params.id));
//     if (todoIndex === -1) {
//       res.status(404).send();
//     } else {
//       todos = removeAtIndex(todos, todoIndex);
//       fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
//         if (err) throw err;
//         res.status(200).send();
//       });
//     }
//   });
// });

// for all other routes, return 404



//below code beacuse of MIME error , kuch css file ka problem aa rha tha.
app.get('/style.css', (req, res) => {   
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/style.css');
});


app.get("/",(req,res)=>{   //to send same url as backend, Cors Solution 1
  res.sendFile(path.join(__dirname,"index.html"));
})
//app.use((req, res, next) => {
//  res.status(404).send();
//});
 
app.listen(3000);
