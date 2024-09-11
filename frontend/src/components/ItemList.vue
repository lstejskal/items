<template>
  <div id="main-content">
    <ItemMenu @menu-link-clicked="onMenuLinkClick" />

    <hr />

    <ItemForm :itemType="itemType" @submit-form="onFormSubmit" />

    <hr />

    <h1>{{ itemType }} list</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-if="items && items.length">
      <li v-for="item in items" :key="item.id">
        <div v-for="attrName in Object.keys(itemAttributes)" :key="attrName">
          <p>{{ attrName }}: {{ item[attrName] }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ItemMenu from './ItemMenu.vue'
import ItemForm from './ItemForm.vue'

export default {
  name: 'ItemList',
  components: {
    ItemMenu,
    ItemForm
  },
  setup() {
    const itemType = ref('person') // SET DEFAULT itemType const
    const itemAttributes = ref({})
    const items = ref([])
    const loading = ref(false)
    const error = ref(null)

    const onMenuLinkClick = (newItemType) => {
      itemType.value = newItemType
      fetchItems()
      fetchItemAttributes()
    }

    // reload list of items after adding item
    const onFormSubmit = (form) => {
      // alert('SUBMITTED!')
      fetchItems()
      fetchItemAttributes()
    }

    const fetchItems = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/items/${itemType.value}`)
        items.value = response.data
      } catch (err) {
        error.value = 'Failed to load items data'
      } finally {
        loading.value = false
      }
    }

    // FIX duplicate
    const fetchItemAttributes = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/item-types/${itemType.value}`)
        itemAttributes.value = response.data
        console.log(response.data)
      } catch (err) {
        error.value = 'Failed to load items attributes'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchItems()
      fetchItemAttributes()
    })

    return {
      itemType,
      itemAttributes,
      items,
      loading,
      error,
      onMenuLinkClick,
      onFormSubmit
    }
  }
}
</script>
