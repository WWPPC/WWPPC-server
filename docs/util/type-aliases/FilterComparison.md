[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [util](../README.md) / FilterComparison

# Type alias: FilterComparison\<T\>

> **FilterComparison**\<`T`\>: `T` *extends* [`primitive`](primitive.md) ? `object` \| `object` \| `object` \| `T` \| `T`[] : `never`

Flexible comparison type for filtering items. Allows for primitive comparisons (`=`, `!`),
numerical comparisons (`>`, `<`, `>=`, `<=`), range comparisons (`><`, `<>`, `=><`, `><=`, `=><=`, `=<>`, `<>=`, `=<>=`),
as well as list searches using `Array` values.

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

## Type parameters

• **T**

## Source

[src/util.ts:60](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/util.ts#L60)
