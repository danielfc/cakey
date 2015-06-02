Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});


Router.route('order', {
  name: 'order',
  controller: 'OrderController',
  action: 'action',
  where: 'client'
});