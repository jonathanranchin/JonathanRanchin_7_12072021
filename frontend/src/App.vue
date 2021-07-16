<template>
  <div class="container">
      <Header @toggle-add-post="toggleAddPost" title="Post Tracker"  :showAddPost="showAddPost"/>
      <div v-show="showAddPost">
      <AddPost @add-post="addPost"/>
      </div>
      <Posts @toggle-reminder="toggleReminder" @delete-post="deletePost" :posts ="posts"   />
  </div>
</template>

<script>
import Header from './components/Header'
import Posts from './components/Posts'
import AddPost from './components/AddPost'
const postsUrl = "http://localhost:5000/posts/";

export default {
  name: 'App',
  components: {
    Header,
    AddPost,
    Posts
  },
  data() {
    return {
      posts : [],
      showAddPost :false
    }
  },
  methods: {
    toggleAddPost() {
      this.showAddPost = !this.showAddPost
    },
    addPost(post) {
      this.posts = [...this.posts, post ]
    },
    deletePost(id) {
      console.log('post'+id);
      if (confirm('Are you sure?')) {
        this.posts = this.posts.filter((post) => post.id !== id )
      }
    },
    toggleReminder(id) {
     this.posts = this.posts.map((post) =>
        post.id === id ? { ...post, reminder: !post.reminder } : post)
    },
    async fetchPosts() {
      const res = await fetch(postsUrl)

      const data = await res.json();
  
      return data
    }
  },
  async created() {
    this.posts =  await this.fetchPosts()
    
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Poppins', sans-serif;
}
.container {
  max-width: 500px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}
.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}
.btn:focus {
  outline: none;
}
.btn:active {
  transform: scale(0.98);
}
.btn-block {
  display: block;
  width: 100%;
}
</style>

