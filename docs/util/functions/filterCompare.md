[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [util](../README.md) / filterCompare

# Function: filterCompare()

> **filterCompare**\<`T`\>(`v`, `c`): `boolean`

Compare a value using a `FilterComparison` ([FilterComparison](../type-aliases/FilterComparison.md)).

**Examples:**

```
filterCompare<string>('baz', ['foo', 'bar', 'baz', 'buh']); // true, since "baz" is in the array
```
```
filterCompare<number>(22, { op: '<=', v: 22 }); // true, since 22 is less than or equal to 22
```
```
filterCompare<number>(33.33, { op: '><=', v1: 34, v2: 100 }); // false, since 33.33 is not within the range (34, 100]
```
```
filterCompare<number>(-5, { op: '<>', v1: -1, v2: 1}); // true, since -5 is out of the range (-1, 1)
```

## Type parameters

• **T**

## Parameters

• **v**: `T` & [`primitive`](../type-aliases/primitive.md)

Value to compare

• **c**: [`FilterComparison`](../type-aliases/FilterComparison.md)\<`T`\>

Comparison

## Returns

`boolean`

Comparison result

## Source

[src/util.ts:219](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L219)
