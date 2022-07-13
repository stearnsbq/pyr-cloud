import express from 'express';
import {json} from 'body-parser'
import child_process from 'child_process'

const app = express()

app.use(json())




app.post("", (req, res) => {

    // handle the func

    const functionSourceCodeFIle = process.env.FUNCTION_SOURCE_CODE_PATH;
    const environment = process.env.CODE_ENVIRONMENT;

    const command = [];


    switch(environment){

    }





})




app.listen(8080, () => console.log('runner is running!'))



