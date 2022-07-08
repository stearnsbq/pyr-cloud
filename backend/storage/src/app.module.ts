import { Module } from "@pyrjs/core";
import { BucketController } from "./controllers/bucket.controller";


@Module({
    imports: [],
    controllers: [BucketController],
    providers: [],
    exports: []
})
export class AppModule {
}
