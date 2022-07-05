import { Module } from "@pyrjs/core";
import { AuthController } from "./controllers/auth.controller";
import { BucketController } from "./controllers/bucket.controller";
import { FunctionController } from "./controllers/function.controller";
import { ResourceController } from "./controllers/resource.controller";
import { DatabaseService } from "./services/database.service";

@Module({
    imports: [],
    controllers: [AuthController, FunctionController, ResourceController, BucketController],
    providers: [DatabaseService],
    exports: []
})
export class AppModule {
}
