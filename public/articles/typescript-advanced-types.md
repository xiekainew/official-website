# TypeScript 高级类型系统详解

TypeScript的类型系统非常强大，提供了许多高级特性来帮助我们编写更安全、更可维护的代码。本文将深入探讨这些高级类型特性。

## 泛型（Generics）

泛型允许我们创建可重用的组件，这些组件可以处理多种类型：

```typescript
// 基础泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 使用泛型
const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

## 条件类型（Conditional Types）

条件类型允许我们根据类型条件来选择类型：

```typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false

// 实用的条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = T extends string 
  ? { message: T } 
  : T extends number 
  ? { code: T } 
  : { data: T };
```

## 映射类型（Mapped Types）

映射类型允许我们基于现有类型创建新类型：

```typescript
// 基础映射类型
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 自定义映射类型
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// 结果: { getName: () => string; getAge: () => number; }
```

## 模板字面量类型（Template Literal Types）

模板字面量类型允许我们创建基于字符串模板的类型：

```typescript
// 基础模板字面量类型
type Greeting = `Hello, ${string}!`;

// 结合联合类型
type Color = "red" | "green" | "blue";
type Quantity = "one" | "two" | "three";

type ColorfulQuantity = `${Quantity} ${Color}`;
// 结果: "one red" | "one green" | "one blue" | "two red" | ...

// 实际应用：事件名称
type EventName<T extends string> = `on${Capitalize<T>}`;

type ButtonEvents = EventName<"click" | "hover" | "focus">;
// 结果: "onClick" | "onHover" | "onFocus"
```

## 工具类型（Utility Types）

TypeScript 提供了许多内置的工具类型：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Pick - 选择特定属性
type UserPreview = Pick<User, "id" | "name">;

// Omit - 排除特定属性
type CreateUser = Omit<User, "id">;

// Record - 创建记录类型
type UserRoles = Record<string, "admin" | "user" | "guest">;

// ReturnType - 获取函数返回类型
function getUser(): User {
  return { id: 1, name: "John", email: "john@example.com", age: 30 };
}

type UserType = ReturnType<typeof getUser>; // User

// Parameters - 获取函数参数类型
function updateUser(id: number, data: Partial<User>): void {}

type UpdateUserParams = Parameters<typeof updateUser>;
// [number, Partial<User>]
```

## 高级模式

### 递归类型

```typescript
// JSON 类型定义
type Json = 
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

### 类型守卫

```typescript
// 自定义类型守卫
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isUser(obj: any): obj is User {
  return obj && typeof obj.id === "number" && typeof obj.name === "string";
}

// 使用类型守卫
function processValue(value: unknown) {
  if (isString(value)) {
    // value 的类型现在是 string
    console.log(value.toUpperCase());
  }
}
```

### 品牌类型（Branded Types）

```typescript
// 创建品牌类型防止类型混淆
type UserId = number & { readonly brand: unique symbol };
type ProductId = number & { readonly brand: unique symbol };

function createUserId(id: number): UserId {
  return id as UserId;
}

function createProductId(id: number): ProductId {
  return id as ProductId;
}

// 这样可以防止意外的类型混用
function getUser(id: UserId): User { /* ... */ }
function getProduct(id: ProductId): Product { /* ... */ }

const userId = createUserId(123);
const productId = createProductId(456);

getUser(userId);     // ✅ 正确
getUser(productId);  // ❌ 类型错误
```

## 实际应用示例

### API 响应类型

```typescript
// 通用 API 响应类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// 分页响应类型
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 使用示例
type UserListResponse = PaginatedResponse<User>;
type UserDetailResponse = ApiResponse<User>;
```

### 状态管理类型

```typescript
// Redux-like 状态管理类型
interface Action<T = any> {
  type: string;
  payload?: T;
}

type Reducer<S, A extends Action> = (state: S, action: A) => S;

// 创建类型安全的 action creators
function createAction<T extends string, P = void>(
  type: T
): P extends void 
  ? () => { type: T }
  : (payload: P) => { type: T; payload: P };

// 使用示例
const increment = createAction<'INCREMENT'>();
const setUser = createAction<'SET_USER', User>();
```

## 最佳实践

1. **渐进式采用**：从简单类型开始，逐步使用高级特性
2. **避免过度工程化**：不要为了使用高级类型而使用
3. **文档化复杂类型**：为复杂的类型定义添加注释
4. **利用工具**：使用 TypeScript 编辑器插件获得更好的开发体验

## 总结

TypeScript 的高级类型系统为我们提供了强大的工具来构建类型安全的应用程序。通过合理使用这些特性，我们可以在编译时捕获更多错误，提高代码质量和开发效率。
