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

<style scoped> 

div {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.loading {
  color: #007bff;
  font-style: italic;
  font-size: 16px;
  text-align: center;
}

.error {
  color: #dc3545;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

li p {
  margin: 5px 0;
  font-size: 16px;
  color: #555;
}

li p strong {
  font-weight: bold;
  color: #333;
}

</style>