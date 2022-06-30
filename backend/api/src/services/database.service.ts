import { AnyEntity, EntitySchema, MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import {Injectable} from '@pyrjs/core'
import config from '../mikro-orm.config';
@Injectable()
export class DatabaseService{

    private _orm: MikroORM<PostgreSqlDriver>;

    constructor(){
        MikroORM.init<PostgreSqlDriver>().then((orm) => {
            this._orm = orm
        })

        process.on('SIGINT', async () => {
            await this._orm.close(true)

            process.exit()
        
        });
    }


    get orm(){
        return this._orm;
    }

    get em(){
        return this._orm.em.fork();
    }




}