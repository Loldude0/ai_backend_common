require('dotenv').config();

module.exports =  class inference {

    date;
    username;
    past_user_inputs = [];
    generated_responses = [];

    constructor(date, username){

        this.date = date;
        this.username = username;
    }

    async request(data){

        var response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
            {
                headers: { Authorization: "Bearer " + process.env.HUGGING_FACE },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        var result = await response.json();
        this.generated_responses.push(result.generated_text);
        return result.generated_text;
    }

    async generate_response(user_input){

        this.past_user_inputs.push(user_input);
        this.date = new Date();
        return this.request({"inputs" : {
            "past_user_inputs" : this.past_user_inputs,
            "generated_responses" : this.generated_responses,
            "text" : user_input
        }})
    }

    async remove_response(){

        for(var i = 0;i < this.generated_responses.length-1;i++){
            this.past_user_inputs.pop();
            this.generated_responses.pop();
        }
    }
    
    async flag_for_delete(){
        this.date = null;
        this.past_user_inputs = null;
        this.generated_responses = null;
    }

};

