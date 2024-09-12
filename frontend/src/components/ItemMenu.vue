<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="hasItems">
      <strong>Items:</strong>
      <a v-for="item in itemTypes" 
        :key="item" 
        href="#" @click.prevent="menuItemClick(item)"
      >
        <strong>{{ item }}</strong>
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ItemMenu',
  data() {
    return {
      itemTypes: [],
      loading: false,
      error: null
    }
  },
  created() {
    this.fetchItemTypes()
  },
  computed: {
    hasItems() {
      return this.itemTypes && this.itemTypes.length > 0;
    }
  },
  methods: {
    async fetchItemTypes() {
      this.loading = true
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/item-types`)
        this.itemTypes = response.data
      } catch (error) {
        this.error = 'Failed to load items data'
      } finally {
        this.loading = false
      }
    },
    menuItemClick(item) {
      this.$emit('menu-link-clicked', item)
    }
  }
}
</script>
