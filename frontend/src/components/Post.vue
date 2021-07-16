<template>
    <div @dblclick="$emit('toggle-reminder', post.id)" :class="[post.reminder ? 'reminder' : '', 'post']">
        <h3>{{post.title}}
            <i @click="$emit('delete-post', post.id)" class="fas fa-times"></i>
        </h3>
        <p>{{post.publish_date}}</p>
    </div>
</template>

<script>
    export default {
        name: 'Post',
        props: {
            post: Object,
        },
    }
</script>

<style scope>
.fas {
  color: red;
}
.post {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
.post.reminder {
  border-left: 5px solid green;
}
.post h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>