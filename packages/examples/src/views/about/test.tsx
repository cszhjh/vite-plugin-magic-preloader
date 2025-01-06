import { defineComponent } from 'vue'

const TestComponent = defineComponent({
  name: 'TestComponent',
  setup() {
    console.log('Hello, Vue with JSX!')
    console.warn('You must install vue jsx plugin')
    return () => (
      <div>
        <h1>Hello, Vue with JSX!</h1>
        <p>This is a simple component using JSX in Vue.js</p>
      </div>
    )
  }
})

export default TestComponent
