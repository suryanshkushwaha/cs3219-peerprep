declare module 'sharedb-mongo' {
    interface ShareDBMongoOptions {
      [key: string]: any;
    }
  
    class ShareDBMongo {
      constructor(connectionString: string, options?: ShareDBMongoOptions);
    }
  
    export = ShareDBMongo;
  }
  