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
        console.log(new Date() - huggingface_instance_list[i].date);
        if(huggingface_instance_list[i].getDate() == null || (new Date() - huggingface_instance_list[i].getDate()) > 300000){
            console.log("deleting" + huggingface_instance_list[i].username);
            huggingface_instance_list[i].flag_for_delete();
            huggingface_instance_list.splice(i, 1);
        }
    }

}

app.get('/huggingface', (req, res) => {

    clearold();
    if(search(req.body.username) == -1){
        console.log(huggingface_instance_list);
        huggingface_instance_list.push(new inference(new Date(), req.body.username));
        res.send("created");
    }else{
        huggingface_instance_list[search(req.body.username)].generate_response(req.body.user_input)
        .then((result) => {
            res.send(result);
        });
    }

})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

