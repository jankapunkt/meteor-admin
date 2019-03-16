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
      'ecmascript',
      'iron:router@1.0.9',
      'underscore',
      'reactive-var',
      'check',
      'aldeed:collection2@2.5.0',
      'aldeed:autoform@5.5.1',
      'aldeed:template-extension@4.0.0',
      'alanning:roles@1.2.13',
      'reywood:publish-composite@1.4.2',
      'momentjs:moment@2.10.6',
      'aldeed:tabular@1.4.0',
      'meteorhacks:unblock@1.1.0'
    ],
    both)

  api.use(['less@1.0.0 || 2.5.0', 'jquery', 'templating'], 'client')

  api.use(['email'], 'server')

  api.add_files([
    'lib/both/router.js',
    'lib/both/utils.js',
    'lib/both/startup.js',
    'lib/both/collections.js'
  ], both)

  api.add_files([
    'lib/client/templates/components/components.html',
    'lib/client/templates/components/components.js',
    'lib/client/templates/widgets/widgets.html',
    'lib/client/templates/widgets/widgets.js',
    'lib/client/templates/layout/layout.html',
    'lib/client/templates/layout/layout.js',
    'lib/client/templates/sidebar/sidebar.html',
    'lib/client/templates/sidebar/sidebar.css',
    'lib/client/templates/sidebar/sidebar.js',
    'lib/client/templates/header/header.html',
    'lib/client/templates/header/header.js',
    'lib/client/js/helpers.js',
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
