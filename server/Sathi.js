
import { OpenAI } from "openai";
import {messages} from "./constant.js"


async function main(prompt,SYSTEM_PROMPT){
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    messages.push({
    role: "system",
    content: SYSTEM_PROMPT
    })
    messages.push({
        role: "user",
        content: prompt
    })
    while(true){
        const response = await openai.chat.completions.create({
            model: "gpt-5.4",
            messages: messages,
            temperature:0.7,
            response_format:{type:"json_object"}  
        })
        const res=response.choices[0].message.content;
        const parsedRes=JSON.parse(res);
        messages.push({
            role: "assistant",
            content: parsedRes.message
        })
        if(parsedRes.step.toLowerCase()=="output"){
            return parsedRes.message;
        }
        
    }
        
    }

export default main