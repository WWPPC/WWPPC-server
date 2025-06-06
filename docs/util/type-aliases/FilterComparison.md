[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [util](../README.md) / FilterComparison

# Type Alias: FilterComparison\<T\>

> **FilterComparison**\<`T`\>: `T` *extends* [`primitive`](primitive.md) ? \{`op`: `"="` \| `"!"`;`v`: `T` \| `T`[]; \} \| `T` *extends* `number` ? \{`op`: `">"` \| `"<"` \| `">="` \| `"<="`;`v`: `number`; \} \| \{`op`: `"><"` \| `"<>"` \| `"=><"` \| `"><="` \| `"=><="` \| `"=<>"` \| `"<>="` \| `"=<>="`;`v1`: `number`;`v2`: `number`; \} : `never` \| `T` *extends* `string` ? `object` : `never` \| `T` \| `T`[] : `never`

Flexible comparison type for filtering items. Allows for primitive comparisons (`=`, `!`),
numerical comparisons (`>`, `<`, `>=`, `<=`), range comparisons (`><`, `<>`, `=><`, `><=`, `=><=`, `=<>`, `<>=`, `=<>=`),
substring searches (`~`), as well as list searches using `Array` values.

### To be used with [filterCompare](../functions/filterCompare.md)

### Matching

```
primitive | primitive[]
```

If the value is a `primitive`, [filterCompare](../functions/filterCompare.md) will check exact matches.

If the value is a `primitive[]` (`Array` of `primitive`), [filterCompare](../functions/filterCompare.md) will check if the value is included in the array.

### Generic Comparison

```
{
    op: '=' | '!',
    v: primitive | primitive[]
}
```

If `v` is a `primitive`, [filterCompare](../functions/filterCompare.md) will check if the value exactly matches `v`.

If `v` is a `primitive[]` (`Array` of `primitive`), [filterCompare](../functions/filterCompare.md) will check if the value is included in `v`.

### Numerical Comparison

```
{
    op: '>' | '<' | '>=' | '<='
    v: number
}
```

[filterCompare](../functions/filterCompare.md) will perform a numerical comparison with `v` using `op` on the value. That is, `inputValue` `op` `v`.

### Range Comparison

```
{
    op: '><' | '<>' | '=><' | '><=' | '=><=' | '=<>' | '<>=' | '=<>='
    v1: number
    v2: number
}
```

[filterCompare](../functions/filterCompare.md) will perform two numerical comparisons using `v1` as the lower bound and `v2` as the upper bound for `op` on the value.

`{ op: '=><', v1: 10, v2: 24 }` is satisfied within the range [10, 24) (i.e. greater than or equal to 10 and less than 24).

### Substring Matching

```
{
    op: '~'
    v: string
}
```

[filterCompare](../functions/filterCompare.md) will check if `v` is a substring of the value.

## Type Parameters

• **T**

## Defined in

[util.ts:80](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/util.ts#L80)
