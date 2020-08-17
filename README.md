# ToJson

> @ToJson : property decorator for Typescript. 

[![NPM version][npm-image]][npm-url] [![build][build-image]][build-url] [![publish][publish-image]][publish-url] [![codecov][codecov-image]][codecov-url]

---

## Getting Started

### Prerequisites

- Node 10+
- Typescript 1.5+

### Installation

```console
npm install tojson
# or
yarn add tojson
```
### Sample

```ts
import { ToJson, JsonValueFormat, fromObject, toJSON } from "tojson";

class UserInfoEntity {
  @ToJson({ name: "one" })
  info1: number;

  @ToJson({ name: "two" })
  info2: string;

  @ToJson({ name: "secret", format: JsonValueFormat.BYTE_LENGTH })
  secret: string;
}

class UserEntity {
  @ToJson() // default
  id: number;
  
  @ToJson({ name: "Name" }) // rename key
  name: string;

  // custom value format
  @ToJson({ custom: (v: any) => v.substring(0, 2).padEnd(v.length, "*") })
  phone: string;

  // exclude of toJSON
  password: string;

  // date format (YYYY-MM-DD)
  @ToJson({ format: JsonValueFormat.DT_YMD })
  createdAt: Date;

  // date format (YYYY-MM-DD HH:mm:ss)
  @ToJson({ format: JsonValueFormat.DT_YMD_HMS })
  updatedAt: Date;

  // format by toJSON
  @ToJson({ format: JsonValueFormat.JSON })
  info: UserInfoEntity;
}

const info = { info1: 1, info2: "2", secret: "SECRET" }; // object
const userInfoEntity = fromObject(UserInfoEntity, info); // object to instance

const user = {
  id: 1,
  name: "user",
  phone: "1234567890",
  password: "0987654321",
  createdAt: new Date(),
  updatedAt: new Date(),
  info: userInfoEntity,
}; // objet
const userEntity = fromObject(UserEntity, user); // object to instance

const json = toJSON(userEntity);
console.log(json);
// {
//   id: 1,
//   Name: 'user',
//   phone: '12********',
//   createdAt: '2020-08-17',
//   updatedAt: '2020-08-17 22:37:42',
//   info: { one: 1, two: '2', secret: 6 }
// }
```

## Support & Contributions

## License

ToJson is licensed under a [MIT License](https://github.com/muperro/tojson/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/tojson
[npm-url]: https://www.npmjs.com/package/tojson
[build-image]: https://github.com/muperro/tojson/workflows/build/badge.svg
[build-url]: https://github.com/muperro/tojson/actions
[publish-image]: https://github.com/muperro/tojson/workflows/publish/badge.svg
[publish-url]: https://github.com/muperro/tojson/actions
[codecov-image]: https://codecov.io/gh/muperro/tojson/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/muperro/tojson
