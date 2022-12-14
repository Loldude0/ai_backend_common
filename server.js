const express = require('express');
const bodyparser = require('body-parser');

const inference = require('./inference');
require('dotenv').config();
huggingface_instance_list = [];

app = express();
app.use(bodyparser.urlencoded({ extended : true}));
app.use(bodyparser.json());
app.use(express.static('public'))

const port = 3000;

console.log("10:52:00 1/9/2022");

function search(val){

    for(var i = 0;i < huggingface_instance_list.length;i++){
        if(huggingface_instance_list[i].username == val){
            return i;
        }
    }
    return -1;
}

function clearold(){

    for(var i = 0;i < huggingface_instance_list.length;i++){
        if(huggingface_instance_list[i].date == null || (new Date() - huggingface_instance_list[i].date) > 300000){
            console.log("ended a chat with " + huggingface_instance_list[i].username);
            huggingface_instance_list[i].flag_for_delete();
            huggingface_instance_list.splice(i, 1);
        }
    }

}

app.post('/huggingface', (req, res) => {

    clearold();
    if(search(req.body.username) == -1){
        huggingface_instance_list.push(new inference(new Date(), req.body.username));
        console.log("started a chat with " + req.body.username);
        huggingface_instance_list[search(req.body.username)].generate_response(req.body.user_input)
        .then((result) => {
            res.send({result});
        });
    }else{
        huggingface_instance_list[search(req.body.username)].generate_response(req.body.user_input)
        .then((result) => {
            res.send({result});
        });
    }

})

app.get('/huggingfacelist', (req, res) => {
    clearold();
    listToReturn = [];
    for(var i = 0;i < huggingface_instance_list.length;i++){
        listToReturn.push(huggingface_instance_list[i].username);
    }
    res.send({listToReturn});
})

app.post('/huggingfaceremove', (req, res) => {
    clearold();
    if(search(req.body.username) != -1){
        huggingface_instance_list[search(req.body.username)].remove_response();
        res.send({"result" : "success"});
    } else {
        res.send({"result" : "null user"});
    }
})

app.post('/huggingfacedelete', (req, res) => {
    clearold();
    if(search(req.body.username) != -1){
        var i = search(req.body.username);
        huggingface_instance_list[i].flag_for_delete();
        huggingface_instance_list.splice(i, 1);
        res.send({"result" : "success"});
    } else {
        res.send({"result" : "already deleted automatically"});
    }
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

