<template>
  <header>
        <h1>
        {{title}}
        </h1>
        <Button @btn-click="$emit('toggle-add-post')" :text="showAddPost ? 'Close' : 'Add Post'"
      :color="showAddPost ? 'red' : 'green'"/>
    </header>
</template>

<script>

import Button from './Button.vue'
export default {
  components: { Button },
    name : 'Header',
    props : {
        title: {
            type: String,
        },
        showAddPost : Boolean,
    components: {
        Button
    }
    },
}
</script>

<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
</style>