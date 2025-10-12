import {themes as prismThemes} from 'prism-react-renderer';

export default {
  title: 'consorcio.ai',
  tagline: 'Documentação técnica e produto',
  url: 'https://SEU_USUARIO.github.io',
  baseUrl: '/SEU_REPO/', // para GitHub Pages; se Vercel/Netlify use '/'
  favicon: 'img/favicon.ico',
  organizationName: 'SEU_USUARIO',
  projectName: 'consorcio.ai',
  i18n: { defaultLocale: 'pt-BR', locales: ['pt-BR'] },
  themeConfig: {
    navbar: {
      title: 'Projeto',
      items: [
        {to: '/docs/intro', label: 'Docs', position: 'left'},
        {to: '/docs/api/overview', label: 'API', position: 'left'},
        {href: 'https://github.com/SEU_USUARIO/SEU_REPO', label: 'GitHub', position: 'right'},
      ],
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  },
  presets: [
    ['classic', {
      docs: { sidebarPath: require.resolve('./sidebars.js') },
      blog: false,
      theme: { customCss: require.resolve('./src/css/custom.css') }
    }]
  ]
};