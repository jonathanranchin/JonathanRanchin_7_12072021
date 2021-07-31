import VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    name: "Connexion",
    component: () =>
      import(/* webpackChunkName: "connection" */ "../views/Connexion"),
  },
  {
    path: "/Admin",
    name: "Admin",
    component: () => import(/* webpackChunkName: "admin" */ "../views/Admin"),
  },
  {
    path: "/ModifyComment",
    name: "ModifyComment",
    component: () =>
      import(/* webpackChunkName: "ModifyComment" */ "../views/ModifyComment"),
  },
  {
    path: "/Modify",
    name: "Modify",
    component: () => import(/* webpackChunkName: "Modify" */ "../views/Modify"),
  },
  {
    path: "/Compte",
    name: "Compte",
    component: () => import(/* webpackChunkName: "compte" */ "../views/Compte"),
  },
  {
    path: "/Comment",
    name: "Comment",
    component: () =>
      import(/* webpackChunkName: "comment" */ "../views/Comment"),
  },
  {
    path: "/CommentsList",
    name: "CommentsList",
    component: () =>
      import(/* webpackChunkName: "commenrList" */ "../views/CommentsList"),
  },
  {
    path: "/create",
    name: "Create",
    component: () => import(/* webpackChunkName: "create" */ "../views/Create"),
  },
  {
    path: "/CreateComment",
    name: "CreateComment",
    component: () =>
      import(/* webpackChunkName: "createComment" */ "../views/CreateComment"),
  },
  {
    path: "/inscription",
    name: "Inscription",
    component: () =>
      import(/* webpackChunkName: "inscription" */ "../views/Inscription"),
  },
  {
    path: "/stream",
    name: "Stream",
    component: () => import(/* webpackChunkName: "stream" */ "../views/Stream"),
  },
  {
    path: "/UsersList",
    name: "UsersList",
    component: () =>
      import(/* webpackChunkName: "userList" */ "../views/UsersList"),
  },
];
const router = new VueRouter({
  mode: "history",
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/", "/inscription"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("userId");
  const loggedToken = localStorage.getItem("token");
  if (authRequired && !loggedIn && !loggedToken) {
    return next("/");
  }
  next();
});
export default router;
