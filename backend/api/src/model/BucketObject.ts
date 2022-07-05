import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Bucket } from "./Bucket";
import { BucketFolder } from "./BucketFolder";

@Entity()
export class BucketObject{

    @PrimaryKey({autoincrement: true})
    id: number;

    @Property()
    name: string;

    @ManyToOne()
    folder: BucketFolder

}