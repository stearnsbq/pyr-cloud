import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Resource } from "./Resource";


@Entity()
export class Function{
    
    @PrimaryKey({autoincrement: true})
    id: number;

    @Property({nullable: false})
    name: string;

    @Property({nullable: false})
    codePath: string;

    @Enum(() => Runtime)
    runtime: Runtime;

    @Property({nullable: false})
    created: Date;

    @OneToMany(() => Resource, resource => resource.function)
    resources = new Collection<Resource>(this);

}


export enum Runtime{
    NODEJS,
    PYTHON
}