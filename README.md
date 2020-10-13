<big><h1 align="center">Async Computed</h1></big>

A vue composition api compatible async computed. With this you can have async computed hooks in vue 3+ or vue 2+ with composition api.
For example:

```html
<script>
import { computed } from 'vue'
import asyncComputed from '@vue3-composables/async-computed'

export default {
  setup () {
    const userId = ref('foo')

    // This doesn't work
    const promise = computed(() => {
      return callApi('/users/' + userId.value)
        .then(response => response.data.name)
    })

    // This works
    const name = asyncComputed(() => {
      return callApi('/users/' + userId.value)
        .then(response => response.data.name)
    })
  }
}
</script>
```

## Installing

```sh
npm install --save @vue3-composables/async-computed
```
