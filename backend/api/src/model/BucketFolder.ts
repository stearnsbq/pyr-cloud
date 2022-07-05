import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Bucket } from "./Bucket";
import { BucketObject } from "./BucketObject";

@Entity()
export class BucketFolder{

    @PrimaryKey({autoincrement: true})
    id: number;

    @Property()
    name: string;

    @ManyToOne()
    bucket: Bucket

    @ManyToOne({nullable: true})
    parentFolder = new Collection<BucketFolder>(this)

    @OneToMany(() => BucketFolder, bo => bo.bucket)
    folders = new Collection<BucketFolder>(this)

    @OneToMany(() => BucketObject, bo => bo.folder)
    objects = new Collection<BucketObject>(this)

}