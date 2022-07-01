import { Entity, PrimaryKey, Property } from "@mikro-orm/core";



@Entity()
export class Bucket{

    @PrimaryKey({autoincrement: true})
    id: number;

    @Property()
    name: string;

}