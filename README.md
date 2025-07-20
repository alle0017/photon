# 🌠 Photon
![logo](./docs/logo.png)
**Photon** is a lightweight, reactive, declarative UI framework with fine-grained reactivity and a powerful virtual DOM system — similar in spirit to [SolidJS](https://www.solidjs.com/), but with a unique syntax and scope control system inspired by modern CSS encapsulation and clean HTML semantics.

Photon embraces direct manipulation of DOM via signals, scoped styles, and declarative template literals.

---

## 🚀 Features

* ⚡ Fine-grained **reactivity** with `Signal`s and `Effect`s
* 🧠 Simple **component model** with `registerComponent`
* 🧬 Efficient **virtual DOM** rendering with `html`
* 🔬 **Lifecycle** control with `Ref`
* 🧩 **Context API** for dependency injection
* 🧪 Fully supports **Shadow DOM**
* 🛠️ **Plugin** architecture

---

> ### what is the difference?
> each node, in Photon, is responsible for it's reactive dependencies. The concept of component is only an abstraction on top of a `VNode` object, that encapsulate it's rendering result and the state. Similar to Solid, normally component function aren't rerendered, because signals triggers fine grained updates

## 📦 Installation

Photon is currently in development. To use Photon in your project:

```bash
npm install @alle0017!/photonjs
```

---

## 🧑‍💻 Basic Example

```js
import { html, $signal, $effect, GApp } from 'photon';

const counter = $signal(0);
const doubled = $effect(() => counter.value * 2, counter);

function App() {
  return html`
    <h1>Counter: ${counter}</h1>
    <h2>Doubled: ${doubled}</h2>
    <button ＠click=${() => counter.value++}>Increment</button>
  `;
}

GApp.createRoot(App, document.getElementById('root'));
```

---

## 📘 API Overview

### 🔁 `$signal`

Create reactive state:

```js
const count = $signal(0);
console.log(count.value); // 0
count.value++;
```

> Signals are **shallow** – changing properties inside an object won't trigger updates unless the entire object is reassigned.

---

### 👁 `$effect`

Computed or derived values that auto-update:

```js
const total = $effect(() => count.value + 1, count);
```

---

### 👂 `$watcher`

Side effects for logging, network requests, etc.

```js
$watcher(() => console.log(count.value), count);
```

---

### 🧬 `html`

Declare virtual DOM with tagged template literals:

```js
html`
  <div>Hello World</div>
  <p>${count}</p>
`
```

Returns an array of `VNode<HTMLElement>`.

---

### 📦 `registerComponent`

Define and register reusable components:

```js
GApp.registerComponent(({ label }) => {
  return html`<button>${label}</button>`;
}, 'CustomButton');
```

Use with:

```js
html`<CustomButton label="Click me" />`
```

---

### 🌳 `$ref`
This function can be used to access the underlying DOM element:

```js
const myRef = $ref<HTMLDivElement>();

html`<div ref=${myRef.bind}>Hello</div>`;

myRef.onLoad((el) => {
  el.style.background = 'lightgreen';
});
```

---

### 🧠 `createContext`

Simple dependency injection:

```js
const useTheme = createContext({ mode: 'dark' });

GApp.registerComponent(() => {
  const theme = useTheme();
  return html`<div>Theme: ${theme.mode}</div>`;
}, "ContextUser");
```

---

### 🌚 `Shadow`

Render content inside a shadow root:

```js
html`
  ${Shadow({
    mode: 'open',
    children: html`<style>:host { color: red; }</style><p>Hello Shadow</p>`
  })}
`
```

---

## 🗣️ `Directives`

directives are all attributes of html elements that are passed as functions but are not events. this attributes are used to attach behaviors on element creation. They are used by `Ref` internally.

---

## ⚙️ `GApp`

Central control API:

```ts
GApp
  .registerComponent(MyComponent, 'MyComponent')
  .createRoot(App, document.getElementById('root'))
  .use(plugin)
  .setDebug(true);
```

---

## 📄 Full Example

```js
import { html, css, $signal, $effect, GApp } from 'photon';

const key = css`
  p {
    font-weight: bold;
    color: purple;
  }
`;

function Counter() {
  const count = $signal(0);
  const double = $effect(() => count.value * 2, count);

  return html`
    <div scope=${key}>
      <p>Count: ${count}</p>
      <p>Double: ${double}</p>
      <button ＠click=${() => count.value++}>+</button>
    </div>
  `;
}

GApp
  .registerComponent(Counter, 'CounterApp')
  .createRoot(() => html`<CounterApp />`, document.getElementById('root'));
```

---

## 🧩 Plugins

Extend Photon using the `GApp.use(plugin)` API:

```ts
GApp.use((app) => {
  app.setDebug(true);
  // Add global helpers, devtools, etc.
});
```

---

## 🧪 Testing

Coming soon — Photon is designed with testing in mind and will ship with helpers for unit/component testing.

---

## 📚 Related Projects

* [SolidJS](https://solidjs.com) – Fine-grained reactivity for UI
* [Lit](https://lit.dev) – Web Components with declarative templates
* [ReactivityCore](https://github.com/vuejs/core) – Vue's reactivity engine

---

## 📜 License

MIT License

---

## ✨ Contributing

Pull requests and feedback welcome! Photon is young and evolving — your ideas shape the future of the framework.

---
