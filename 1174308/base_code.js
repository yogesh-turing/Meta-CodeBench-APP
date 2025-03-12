// `app.module.js`

const { Module, HttpModule } = require('@nestjs/common');
const { GraphQLModule } = require('@nestjs/graphql');
const { ResolverModule } = require('./resolver.module');

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    HttpModule,
    ResolverModule,
  ],
})
class AppModule {}

module.exports = { AppModule };
```
```javascript
// `resolver.module.js`

const { Module } = require('@nestjs/common');
const { Resolver } = require('./resolver');
const { MyService } = require('./my.service');

@Module({
  providers: [Resolver, MyService],
})
class ResolverModule {}

module.exports = { ResolverModule };
```

```javascript
// `my.service.js`

const { Injectable, HttpService } = require('@nestjs/common');

class MyService {
 
  async fetchData() {
    const firstApiResponse = await axios.get('https://example.com/api/first');
    const secondApiResponse = await axios.get('https://example.com/api/second');
    return {
      firstData: firstApiResponse.data,
      secondData: secondApiResponse.data,
    };
  }

  async createData(data) {
    const response = await axios.post('https://example.com/api/create', data);
    return response.data;
  }
}

module.exports = { MyService };
```


```javascript
// `resolver.js`

const { Resolver, Query, Mutation, Args } = require('@nestjs/graphql');
const { MyService } = require('./my.service');

@Resolver()
class Resolver {
  constructor(myService) {
    this.myService = myService;
  }

  @Query(() => String)
  async fetchExternalData() {
    const data = this.myService.fetchData();
    return JSON.stringify(data);
  }

  @Mutation(String)
  async createExternalData(@Args('data') data) {
    const createdData = await this.myService.createData(data);
    return JSON.stringify(createdData);
  }
}