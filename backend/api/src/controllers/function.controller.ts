import { Body, Controller, Post, Res } from "@pyrjs/core";
import { Function, Runtime } from "../model/Function";
import { DatabaseService } from "../services/database.service";
import { Response } from "express";
import Path from "path";
import { expressjwt } from "express-jwt";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
const nanoid = require("nanoid");

@Controller("/function", [
  expressjwt({ secret: process.env.JWT_KEY, algorithms: ["HS256"] }),
])
export class FunctionController {
  constructor(private db: DatabaseService) {}

  @Post("/")
  public async createNewFunction(
    @Body() body: NewFunction,
    @Res() response: Response
  ) {
    try {
      const functionRepo = this.db.em.getRepository(Function);

      const codePath = `${body.name}-${nanoid()}`;

      const newFunction = new Function();

      newFunction.name = body.name;
      newFunction.created = new Date();
      newFunction.runtime = body.runtime;
      newFunction.codePath = codePath;

      // setup the code environment

      const environmentsPath = Path.resolve("src", "environments");

      let path;
      let extraPaths = [];

      switch (body.runtime) {
        case Runtime.NODEJS: {
          const root = Path.join(environmentsPath, "nodejs", "base-function");

          path = Path.join(root, "index.js");

          const packageJSON = Path.join(root, "package.json");

          extraPaths.push({filename: 'package.json', path: packageJSON});

          break;
        }
        case Runtime.PYTHON: {
          path = Path.join(
            environmentsPath,
            "python",
            "base-function",
            "index.py"
          );

          break;
        }
        default: {
          return response.status(400);
        }
      }

      // create the bucket!
      const createBucketResponse = await axios.post(
        `${process.env.BUCKET_ENDPOINT}`,
        { key: newFunction.codePath, public: false },
        {
          headers: {
            Authorization: `Bearer ${process.env.BUCKET_ACCESS_TOKEN}`,
          },
        }
      );

      let formData = new FormData();

      formData.append("file", fs.createReadStream(path));

      const baseCodeResponse = await axios.post(
        `${process.env.BUCKET_ENDPOINT}/${codePath}/index.js`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.BUCKET_ACCESS_TOKEN}`,
          },
        }
      );

      for(const extra of extraPaths){

        formData = new FormData();

        formData.append("file", fs.createReadStream(extra.path));
  
        const extraResponse = await axios.post(
          `${process.env.BUCKET_ENDPOINT}/${codePath}/${extra.filename}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.BUCKET_ACCESS_TOKEN}`,
            },
          }
        );
  
      }


      functionRepo.persistAndFlush(newFunction);

      return response.status(200).json({ success: true, data: newFunction });
    } catch (err) {
        console.error(err)
      return response
        .status(500)
        .json({ success: false, err: "failed to create a new function" });
    }
  }
}

export interface NewFunction {
  name: string;
  runtime: Runtime;
}
