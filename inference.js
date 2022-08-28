require('dotenv').config();

export class inference{
     
    date;
    username;
    past_user_inputs = [];
    generated_responses = [];

    constructor(date, username){
        this.date = date;
        this.username = username;
    }

    async getname(){
        return this.username
    }

    async request(data){

        response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
            {
                headers: { Authorization: "Bearer " + process.env.HUGGING_FACE },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        result = await response.json();
        this.generated_responses.push(result.generated_text);
        return result.generated_text;
    }

    async generate_response(user_input){

        this.past_user_inputs.push(user_input);
        date = new Date();
        return query({"inputs" : {
            "past_user_inputs" : this.past_user_inputs,
            "generated_responses" : this.generated_responses,
            "text" : user_input
        }})
    }

    async flag_for_delete(){
        date = null;
        past_user_inputs = null;
        generated_responses = null;
    }

}

