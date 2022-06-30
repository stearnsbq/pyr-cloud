import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User{

    @PrimaryKey({autoincrement: true})
    id: number;

    @Property()
    username: string;

    @Property()
    password: string;

    @Property()
    lastLogin: Date;
    
}