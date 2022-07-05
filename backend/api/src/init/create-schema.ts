import { MikroORM } from '@mikro-orm/core';


(async () => {
  const orm = await MikroORM.init();
  const generator = orm.getSchemaGenerator();


  try{


      // or you can run those queries directly, but be sure to check them first!
    await generator.dropSchema();
    await generator.createSchema();

    // in tests it can be handy to use those:
    await generator.refreshDatabase(); // ensure db exists and is fresh
    await generator.clearDatabase(); // removes all data


    await orm.close(true);

  }catch(err){
    console.error(err)
    await orm.close(true);
  }




})();