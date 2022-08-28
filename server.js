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
            huggingface_instance_list[i].flag_for_delete();
            huggingface_instance_list.splice(i, 1);
        }
    }

}

app.get('/huggingface', (req, res) => {

    clearold();
    if(search(req.body.username) == -1){
        huggingface_instance_list.push(new inference(new Date(), req.body.username));
        huggingface_instance_list[search(req.body.username)].generate_response(req.body.user_input)
        .then((result) => {
            res.send({"response" : result});
        });
    }else{
        huggingface_instance_list[search(req.body.username)].generate_response(req.body.user_input)
        .then((result) => {
            res.send({"response" : result});
        });
    }

})

app.get('/huggingfacelist', (req, res) => {
    clearold();
    listToReturn = [];
    for(var i = 0;i < huggingface_instance_list.length;i++){
        listToReturn.push(huggingface_instance_list[i].username);
    }
    res.send({"list" : listToReturn});
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

