# vue3 响应式数据重置

:::info

这篇文章只针对复杂数据类型，简单数据类型直接覆盖即可。

:::

在开发中总是会面临需要重置数据的场景，比如提交表格之后需要重置表格，而 vue 是通过数据驱动视图，重置表格即视为重置数据。

重置数据很简单，如果需要重置的数据*比较少*，你可以像这样**一个一个手动重置**：

```ts{1-5,10-12}
const form = ref({
  username: "",
  password: "",
  password2: ""
});

const register = async () => {
  const res = await apiPostRegister(form.value);
  // 提示...
  form.value.username = "";
  form.value.password = "";
  form.value.password2 = "";
  // 跳转...
}
```

当然，如果你考虑得比较远，考虑以后会有更多的表单项（比如加一个验证码），或者想要更加优雅的写法，你会想要用 `Object.keys + forEach` 来实现数据重置：

```ts
const form = ref({
  username: "",
  password: "",
  password2: ""
});

const resetForm = () => { // [!code ++]
  const keys = Object.keys(form.value); // [!code ++]
  keys.forEach(key => { // [!code ++]
    form.value[key] = ""; // [!code ++]
  }); // [!code ++]
} // [!code ++]

const register = async () => {
  const res = await apiPostRegister(form.value);
  // 提示...
  form.value.username = ""; // [!code --]
  form.value.password = ""; // [!code --]
  form.value.password2 = ""; // [!code --]
  resetForm(); // [!code ++]
  // 跳转...
}
```

通过 `Object.keys + forEach` 确实会更加优雅，但是这种方法也有限制，**对于被重置的数据要求重置值统一**，如果不统一就需要针对某个值进行处理，这就造成重置方法 `resetForm` 不优雅，反而越加臃肿，比如下面这个例子：

```ts
const form = ref({
  username: "",
  password: "",
  password2: "",
  isMarried: false, // [!code ++]
  age: 0 // [!code ++]
});

const resetForm = () => {
  const keys = Object.keys(form.value);
  keys.forEach(key => {
    if (key === 'isMarried') {  // [!code ++]
      form.value[key] = false;  // [!code ++]
    } else if (key === 'age') {  // [!code ++]
      form.value[key] = 0;  // [!code ++]
    } else {  // [!code ++]
      form.value[key] = "";
    }  // [!code ++]
  });
}

const register = async () => {
  const res = await apiPostRegister(form.value);
  // 提示...
  resetForm();
  // 跳转...
}
```

## 源数据覆盖法

那么是否有一种既优雅又能应对多样的数据的重置方法呢？有的，当然有的，这种方法的实现思路就是**拿原始数据覆盖变量**，直接看代码：

```ts
const getOriginForm = () => ({ // [!code ++]
  username: "", // [!code ++]
  password: "", // [!code ++]
  password2: "", // [!code ++]
  isMarried: false, // [!code ++]
  age: 0 // [!code ++]
}) // [!code ++]

const form = ref({ // [!code --]
  username: "", // [!code --]
  password: "", // [!code --]
  password2: "", // [!code --]
  isMarried: false, // [!code --]
  age: 0 // [!code --]
}); // [!code --]

const form = ref(getOriginForm()) // [!code ++]

const resetForm = () => {
  const keys = Object.keys(form.value); // [!code --]
  keys.forEach(key => { // [!code --]
    if (key === 'isMarried') { // [!code --]
      form.value[key] = false; // [!code --]
    } else if (key === 'age') { // [!code --]
      form.value[key] = 0; // [!code --]
    } else { // [!code --]
      form.value[key] = ""; // [!code --]
    } // [!code --]
  }); // [!code --]
  form.value = getOriginForm(); // [!code ++]
}

const register = async () => {
  const res = await apiPostRegister(form.value);
  // 提示...
  resetForm();
  // 跳转...
}
```

不知你是否明白了这种方法的思路，是的，没错，就是**先保存初始数据，再在需要重置数据的时候用初始数据覆盖**

:::warning 注意

这种方法只能够处理 `ref` 声明的响应式数据，对于 `reactive` 声明的响应式数据无效。因为 `ref` 能够监听到一整个对象的变化，包含对象的变化和对象内属性的变化， `reactive` 只能监听对象里面属性的变化。

不过也无伤大雅，实际开发使用 `ref` 会比 `reactive` 多，实在需要用到 `reactive` ，再灵活处理。

:::

:::details 拓展

**获取原始数据必须通过方法，而不是直接访问原始数据对象。**

上面这句话是结论，但是为什么只能通过方法获取原始对象，而不是直接访问原始对象是重点。

先看看直接访问原始数据对象的代码：

```ts{8,12}
const originForm = {
  username: "",
  password: "",
  password2: "",
  isMarried: false,
  age: 0
}
const form = ref(originForm);

const resetForm = () => {
  console.log("resetForm 方法执行");
  form.value = originForm;
}

const register = async () => {
  const res = await apiPostRegister(form.value);
  // 提示...
  resetForm();
  // 跳转...
}
```

将上面的代码执行一下你会发现 `resetForm` 看起来没有效果，但实际上打开浏览器控制台，你又会看到*resetForm 方法执行*有被输出，那这到底是为什么呢？

要排查这个问题，你可以用 `watch` 监听 `form` ，也可以直接在 `resetForm` 里面输出 `form.value` 和 `originForm` 进行对比，但是无论哪种方法最后都会指向一个结论： `form` 没有被改变。 `watch` 监听不到由 `resetForm` 触发的改变， `form.value` 和 `originForm` 的值相等，也没有触发改变。

通过对比 `form.value` 和 `originForm` 其实已经可以看出问题所在了，<u>`originForm` 被修改了</u>。

但从代码上看，其实并没有对它显式赋值，如果不深入了解 vue 响应式原理，那是无法找到什么地方修改了原始对象，这里只说明结论：**vue 会劫持值为复杂数据类型的数据，按表现来说，就是访问 `form.value.username` 会读取 `originForm.username`，修改 `form.value.username` 会修改 `originForm.username`**

因为 vue 响应式数据会对被监听的复杂数据产生影响，所以在初始化/重置的时候不能使用同一个对象，提供数据的方式最好就是直接使用一个方法来返回，避免产生以上问题

:::

## 总结

这篇文章讲述了 vue3 里面需要重置数据的场景，并讲述了几种重置数据的方法，比如手动重置，通过 `Object.keys + forEach` 重置，通过源数据覆盖重置。

其中通过源数据重置这种方法需要注意提供源数据要通过函数，不能直接提供源数据。
