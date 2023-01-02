import express from 'express';
import {json} from 'body-parser'
import dotenv from 'dotenv';
import Path from 'path'

const app = express()

app.use(json())

dotenv.config()


app.listen(8080, () => console.log('runner is running!'))



