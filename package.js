Package.describe({
  name: 'jkuester:admin',
  summary: 'A complete admin dashboard solution',
  version: '1.2.8',
  git: 'https://github.com/yogiben/meteor-admin'
})

Package.on_use(function (api) {
  const both = ['client', 'server']

  api.versionsFrom('METEOR@1.0')

  api.use(
    [
      'session',
      'ecmascript',
      'iron:router@1.0.9',
      'underscore',
      'reactive-var',
      'check',
      'aldeed:collection2@2.5.0',
      'aldeed:autoform@5.5.1',
      'aldeed:template-extension@4.0.0',
      'alanning:roles@1.2.13',
      'raix:handlebar-helpers@0.2.5',
      'reywood:publish-composite@1.4.2',
      'momentjs:moment@2.10.6',
      'aldeed:tabular@1.4.0',
      'meteorhacks:unblock@1.1.0',
      'zimme:active-route@2.3.2',
      //'mfactory:admin-lte@0.0.2'
    ],
    both)

  api.use(['less@1.0.0 || 2.5.0', 'session', 'jquery', 'templating'], 'client')

  api.use(['email'], 'server')

  api.add_files([
    'lib/both/router.js',
    'lib/both/utils.js',
    'lib/both/startup.js',
    'lib/both/collections.js'
  ], both)

  api.add_files([
    'lib/client/html/admin_templates.html',
    'lib/client/html/admin_widgets.html',
    'lib/client/html/admin_layouts.html',
    'lib/client/html/admin_sidebar.html',
    'lib/client/html/admin_header.html',
    'lib/client/css/admin-custom.less',
    'lib/client/css/dashboard.css',
    'lib/client/js/admin_layout.js',
    'lib/client/js/helpers.js',
    'lib/client/js/templates.js',
    'lib/client/js/events.js',
    'lib/client/js/slim_scroll.js',
    'lib/client/js/autoForm.js'
  ], 'client')

  api.add_files([
    'lib/server/publish.js',
    'lib/server/methods.js'
  ], 'server')

  api.mainModule('lib/both/AdminDashboard.js', both)
})
