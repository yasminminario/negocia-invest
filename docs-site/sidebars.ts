/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introdução',
    },
    {
      type: 'category',
      label: 'Produto',
      items: [
        {
          type: 'doc',
          id: 'visao_produto/contexto_problematica',
          label: 'Contexto e problemática',
        },
        {
          type: 'doc',
          id: 'visao_produto/personas',
          label: 'Personas',
        },
      ],
    },
    {
      type: 'category',
      label: 'Solução Técnica',
      items: [
        {
          type: 'doc',
          id: 'tecnica/solucao_tecnica',
          label: 'Solução Técnica',
        }
      ],
    },
    {
      type: 'category',
      label: 'Modelo de negócio',
      items: [
        {
          type: 'doc',
          id: 'modelo_negocio/negocio',
          label: 'Modelo de negócio',
        }
      ],
    },
    
  ],
};