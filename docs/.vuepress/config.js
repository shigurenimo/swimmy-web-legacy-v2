const sidebar = (root = '') => {
  return {
    [root + '/guide/']: [{
      title: 'Guide',
      collapsable: false,
      children: [
        ''
      ]
    }],
    [root + '/hosting/']: [{
      title: 'Hosting',
      collapsable: false,
      children: [
        '',
        'phpstorm'
      ]
    }],
    [root + '/functions/']: [{
      title: 'Functions',
      collapsable: false,
      children: [
        '',
        'phpstorm',
        'faq'
      ]
    }]
  }
}

module.exports = {
  head: [
    ['meta', { name: 'robots', content: 'noindex' }]
  ],
  serviceWorker: true,
  locales: {
    '/': {
      lang: 'jp-JP',
      title: '取扱説明書',
      description: 'swimmy.io'
    }
  },
  themeConfig: {
    repo: 'RyukyuInteractive/docs',
    editLinks: true,
    locales: {
      '/': {
        label: '日本語',
        selectText: '言語',
        editLinkText: 'このページを編集する',
        nav: [{
          text: 'Guide',
          link: '/guide/'
        }, {
          text: 'Hosting',
          link: '/hosting/'
        }, {
          text: 'Functions',
          link: '/functions/'
        }],
        sidebar: sidebar()
      }
    }
  }
}
