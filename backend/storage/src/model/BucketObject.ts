import { Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from "@mikro-orm/core";
import { Bucket } from "./Bucket";

@Entity()
export class BucketObject{

    @PrimaryKey()
    key: string;

    @Property()
    filesize: number;

    @Property()
    uploaded: Date;

    @ManyToOne(() => Bucket, {primary: true})
    bucket: Bucket;

    [PrimaryKeyType]?: [number, string];

}