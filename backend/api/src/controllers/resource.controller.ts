import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from "@pyrjs/core";
import { DatabaseService } from "../services/database.service";
import jwt from "express-jwt";
import { Resource, HTTPMethods } from "../model/Resource";
import { Response } from "express";

@Controller("/resource", [
  jwt.expressjwt({ secret: process.env.JWT_KEY, algorithms: ["HS256"] }),
])
export class ResourceController {
  constructor(private db: DatabaseService) {}

  @Post("/")
  public async createNewResource(
    @Body() body: NewResource,
    @Res() response: Response
  ) {
    try {
      const resourceRepo = this.db.em.getRepository(Resource);

      const newResource = new Resource();

      newResource.method = body.method;
      newResource.route = body.route;

      if (body.parent) {
        const parentResource = await resourceRepo.findOne({ id: body.parent });

        if (!parentResource) {
          return response
            .status(404)
            .json({ success: false, err: "parent resource does not exist!" });
        }

        newResource.parent = parentResource;
      }

      resourceRepo.persistAndFlush(newResource);

      return response.status(200).json({ success: true, data: Resource });
    } catch (err) {
      return response
        .status(500)
        .json({ success: false, err: "failed to create resource!" });
    }
  }

  @Get("/all")
  public async getAllResources(@Res() response: Response) {
    try {
      const resourceRepo = this.db.em.getRepository(Resource);

      return response
        .status(200)
        .json({ success: true, data: await resourceRepo.findAll() });
    } catch (err) {
      return response
        .status(500)
        .json({ success: false, err: "failed to get all resources!" });
    }
  }

  @Get("/:id")
  public async getResourceByID(
    @Res() response: Response,
    @Param("id") id: string
  ) {
    try {
      const resourceRepo = this.db.em.getRepository(Resource);

      return response
        .status(200)
        .json({
          success: true,
          data: await resourceRepo.find({ id: parseInt(id) }),
        });
    } catch (err) {
      return response
        .status(500)
        .json({ success: false, err: `failed to get resource ${id}` });
    }
  }

  @Put("/:id")
  public async updateResourceByID(
    @Res() response: Response,
    @Param("id") id: string,
    @Body() body: NewResource
  ) {
    try {
      const resourceRepo = this.db.em.getRepository(Resource);

      const dbResource = await resourceRepo.findOne({ id: parseInt(id) });

      if (!dbResource) {
        return response
          .status(404)
          .json({ success: false, err: "resource does not exist!" });
      }

      dbResource.method = body.method;
      dbResource.route = body.route;

      if (body.parent) {
        const parentResource = await resourceRepo.findOne({ id: body.parent });

        if (!parentResource) {
          return response
            .status(404)
            .json({ success: false, err: "parent resource does not exist!" });
        }

        dbResource.parent = parentResource;
      }

      return response.status(200).json({ success: true, data: dbResource });
    } catch (err) {
      return response
        .status(500)
        .json({ success: false, err: "failed to update resource" });
    }
  }

  @Delete("/:id")
  public async deleteResourceByID(
    @Res() response: Response,
    @Param("id") id: string
  ) {
    try {
      const resourceRepo = this.db.em.getRepository(Resource);

      return response
        .status(200)
        .json({
          success: true,
          data: await resourceRepo.remove({ id: parseInt(id) }),
        });
    } catch (err) {
      return response
        .status(500)
        .json({ success: false, err: `failed to get resource ${id}` });
    }
  }
}

export interface NewResource {
  route: string;
  method: HTTPMethods;
  parent?: number;
}
