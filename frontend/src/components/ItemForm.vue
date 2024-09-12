<template>
  <form @submit.prevent="submitForm">
    <div>
      <p>Item type: {{ itemType }}</p>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>

    <div v-for="(attrType, attrName) in itemAttributes" :key="attrName">
      <label for="name">{{ attrName }}:</label>
      <input
        :type="getAttrType(attrType)"
        :id="attrName"
        :name="attrName"
        :value="form[attrName]"
        @input="updateField(attrName, $event.target.value)"
      />
    </div>

    <div id="turnstile-widget"></div>

    <button type="submit">Add item</button>
  </form>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import axios from 'axios'

export default defineComponent({
  props: {
    itemType: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = ref({})
    const itemAttributes = ref({})
    const loading = ref(false)
    const error = ref(null)
    const turnstileToken = ref('')

    watch(
      () => props.itemType,
      (newValue, oldValue) => {
        console.log(`itemType changed from "${oldValue}" to "${newValue}"`)
        fetchItemAttributes()
      }
    )

    // Update field value
    const updateField = (key, value) => {
      form.value[key] = value
    }

    const fetchItemAttributes = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/item-types/${props.itemType}`)
        itemAttributes.value = response.data
      } catch (err) {
        error.value = 'Failed to load items attributes'
      } finally {
        loading.value = false
      }
    }

    // form submission method
    const submitForm = async () => {
      loading.value = true
      error.value = null

      if (!turnstileToken.value) {
        alert('Turnstile verification failed. Please complete the CAPTCHA.')
        return
      }

      try {
        const formPayload = {
          type: props.itemType,
          turnstile_token: turnstileToken.value
        }

        for (const key in itemAttributes.value) {
          if (form.value[key]) {
            formPayload[key] = form.value[key]
          }
        }

        console.log('formPayload: ', formPayload)

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/items`, formPayload)
        // TODO check response output

        // clear form after submission
        for (const key in itemAttributes.value) {
          form.value[key] = ''
        }

        emit('submit-form', form.value)
      } catch (err) {
        error.value = 'Failed to add item'
      } finally {
        loading.value = false
      }
    }

    const getAttrType = (attrType) => {
      if (attrType === 'number') {
        return 'number'
      }
      return 'text'
    }

    onMounted(() => {
      fetchItemAttributes()

      // load turnstile script
      const script = document.createElement('script')
      script.src = import.meta.env.VITE_TURNSTILE_URL
      script.onload = () => {
        window.turnstile.render('#turnstile-widget', {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY, // can site key have multiple keys?
          callback: (token) => {
            turnstileToken.value = token
          }
        })
      }
      document.body.appendChild(script)
    })

    return {
      form,
      itemAttributes,
      updateField,
      loading,
      error,
      submitForm,
      getAttrType
    }
  }
})
</script>

<style scoped>
form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input[type="text"], input[type="number"], input[type="email"], input[type="password"] {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button[type="submit"] {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #218838;
}

div[v-if="loading"] {
  font-style: italic;
  color: #007bff;
}

div[v-if="error"] {
  color: #dc3545;
  font-weight: bold;
}

form p {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #555;
}

#turnstile-widget {
  margin: 20px 0;
}
</style>