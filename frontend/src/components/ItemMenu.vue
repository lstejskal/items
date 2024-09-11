<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="itemTypes && itemTypes.length">
      <strong>Items:</strong>
      <a v-for="item in itemTypes" :key="item" href="#" @click.prevent="menuItemClick(item)">
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

