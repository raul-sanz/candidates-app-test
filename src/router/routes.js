
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Candidates.vue') },
      { path: '/view/:id', component: () => import('pages/ViewCandidate.vue') },
      { path: '/edit/:id', component: () => import('pages/EditCandidate.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
