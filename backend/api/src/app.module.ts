import { Module } from "@pyrjs/core";
import { AuthController } from "./controllers/auth.controller";
import { DatabaseService } from "./services/database.service";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [DatabaseService],
    exports: []
})
export class AppModule {
}
