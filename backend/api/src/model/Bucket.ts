import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BucketFolder } from "./BucketFolder";
import { BucketObject } from "./BucketObject";



@Entity()
export class Bucket{

    @PrimaryKey({autoincrement: true})
    id: number;

    @Property()
    name: string;

    @Property()
    public: boolean

    @OneToMany(() => BucketFolder, bo => bo.bucket)
    folders = new Collection<BucketFolder>(this)

}