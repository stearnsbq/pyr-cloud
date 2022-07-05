import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BucketObject } from "./BucketObject";



@Entity()
export class Bucket{

    @PrimaryKey()
    key: string;

    @Property()
    created: Date

    @Property()
    public: boolean

    @OneToMany(() => BucketObject, bo => bo.bucket)
    objects = new Collection<BucketObject>(this);

}