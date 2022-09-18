try{
    const handlerSourcePath = process.env.FUNCTION_SOURCE_CODE_PATH;

    process.stdin.on('data', async (data) => {
        try{
            const result = await (await import(handlerSourcePath)).handler(JSON.parse(data.toString())) 
            ?? {
                statusCode: 404,
                headers: {},
                body: {}
            }
            
            console.log(JSON.stringify(result))
        }catch(err){
            console.log(JSON.stringify({
                statusCode: 502,
                headers: {},
                body: err
            }))
        }finally{
            process.exit()
        }

    });

}catch(err){
    console.log(err)
}