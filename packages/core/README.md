[![npm](https://img.shields.io/npm/v/vue-use-route-query?style=for-the-badge)](https://www.npmjs.com/package/vue-use-route-query)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-use-route-query?style=for-the-badge)](https://bundlephobia.com/result?p=vue-use-route-query)
[![demo](https://img.shields.io/badge/demo-green?style=for-the-badge)](https://djaler.github.io/vue-use-route-query/#/)

# Vue Use Route Query

> A tiny Vue composable function to create a ref synced with vue router query.

## Install
> Works for Vue 2 and Vue 3 **within a single package** by the power of [vue-demi](https://github.com/vueuse/vue-demi)!

```sh
npm install --save vue-use-route-query
```

or

```sh
yarn add vue-use-route-query
```

or

```sh
pnpm install vue-use-route-query
```

## Usage

Simple example with a string parameter without any transformations

```ts
import { defineComponent } from 'vue'
import { useRouteQuery } from 'vue-use-route-query'

export default defineComponent({
    setup() {
        const foo = useRouteQuery('foo', ''); // Ref<string>
        const bar = useRouteQuery('bar', null); // Ref<string | null>

        foo.value = 'foo'; // Results in 'foo=foo' in the query
      
        return {
            foo,
            bar,
        }
    }
})
```

More complex example with a transformer

```ts
import { defineComponent } from 'vue'
import { useRouteQuery, RouteQueryTransformer } from 'vue-use-route-query'

export default defineComponent({
    setup() {
        // This transformer will reverse the string because why not
        const reverseTransformer: RouteQueryTransformer<string> = {
            fromQuery(query) {
                return query.split('').reverse().join('');
            },
            toQuery(value) {
                return value?.split('').reverse().join('');
            }
        }

        const foo = useRouteQuery('foo', '', reverseTransformer);

        foo.value = 'bar'; // Results in 'foo=rab' in the query

        return {
            foo,
        }
    }
})
```

A several transformers provided by the library out of the box:

* `integerTransformer`
    ```js
  const foo = useRouteQuery('foo', 0, integerTransformer); // Ref<number>
    ```
* `floatTransformer`
  ```js
  const foo = useRouteQuery('foo', 0, floatTransformer); // Ref<number>
  ```
* `booleanTransformer`
  ```js
  const foo = useRouteQuery('foo', false, booleanTransformer); // Ref<boolean>
  ```
* `enumTransformer` - stores the enum key in the query and maps it back to the enum value
  ```ts
  enum Foo {
    BAR,
    BAZ
  }
  
  const foo = useRouteQuery('foo', Foo.Bar, enumTransformer); // Ref<Foo>
  
  foo.value = Foo.BAZ; // Results in 'foo=BAZ' in the query
  ```
