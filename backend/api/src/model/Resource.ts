import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";



@Entity()
export class Resource{
    
    @PrimaryKey({autoincrement: true})
    id: number;

    @Property({nullable: false})
    route: string

    @Enum(() => HTTPMethods)
    method: HTTPMethods

    @ManyToOne()
    parent: Resource

    @OneToMany(() => Resource, resource => resource.parent)
    children = new Collection<Resource>(this);

    @ManyToOne({nullable: true})
    function: Function

}


export enum HTTPMethods{
    GET,
    POST,
    PUT,
    DELETE
}