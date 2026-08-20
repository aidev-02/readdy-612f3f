# Manger.pt — Web App MVP

## 1. Descrição do Projeto
Central operacional da Manger.pt: pastelaria & culinária artesanal premium por assinatura do Chef Manuel Brito, com foco em take-away, delivery e clientes profissionais (restaurantes, hotéis, hostels).

O sistema não é apenas uma montra digital — é uma agenda inteligente de encomendas ligada ao catálogo, aos preços, aos clientes e à produção artesanal.

**Público-alvo:**
- Cliente particular (B2C): faz encomenda pelo telemóvel, paga sinal, acompanha.
- Cliente profissional (B2B): encomenda recorrente, preço sob consulta.
- Equipa Manger.pt: gere catálogo, encomendas, agenda de produção.
- Chef/Produção: consulta lista diária por produto.

## 2. Estrutura de Páginas
### Área Pública (B2C)
- `/` — Homepage / vitrine da marca
- `/catalogo` — Catálogo completo com filtros por família
- `/produto/:slug` — Detalhe do produto
- `/encomenda` — Fluxo de encomenda (multi-step)
- `/profissionais` — Landing B2B
- `/sobre` — História, Chef Manuel Brito
- `/contactos` — Contactos + morada + zonas de entrega ✅

### Área Interna (Backoffice)
- `/admin` — Login
- `/admin/dashboard` — Resumo do dia
- `/admin/catalogo` — Gestão de produtos
- `/admin/catalogo/:id` — Editar produto
- `/admin/encomendas` — Lista de encomendas
- `/admin/encomendas/:id` — Detalhe da encomenda
- `/admin/agenda` — Agenda semanal/diária
- `/admin/producao` — Lista de produção do dia
- `/admin/clientes` — CRM de clientes
- `/admin/clientes/:id` — Ficha do cliente

## 3. Funcionalidades Core

### Catálogo
- [ ] Famílias: Cheesecakes, Cremeux, Troncos de Natal, Bolos artesanais/eventos, Pavés/Tartes/Pudins/Entremets, Produtos profissionais
- [ ] Estados: Rascunho, Pronto para revisão, Publicado, Arquivado
- [ ] Preço base, por tamanho, por unidade, por pack, sob consulta
- [ ] Bloqueio de publicação se faltar preço, foto, descrição ou regra
- [ ] Disponibilidade: sempre / dia da semana / sazonal / stock limitado
- [ ] Antecedência mínima por produto

### Encomendas
- [ ] Fluxo público mobile-first
- [ ] Campos: cliente, produto+personalização, entrega, pagamento, produção, segurança alimentar
- [ ] Estados: Nova, A validar, A aguardar sinal, Confirmada, Em produção, Pronta, Entregue, Cancelada
- [ ] Controlo de sinal e valor pendente

### Clientes
- [ ] Criação/atualização automática por encomenda
- [ ] Histórico, preferências, alergias, datas importantes
- [ ] Segmentação B2C/B2B
- [ ] Repetir pedido antigo

### Produção
- [ ] Agenda diária/semanal
- [ ] Lista de produção agrupada por produto
- [ ] Capacidade diária por complexidade
- [ ] Alertas de excesso e informação incompleta

### B2B
- [ ] Marcar cliente como profissional
- [ ] Condições especiais e encomenda recorrente
- [ ] Preço sob consulta

## 4. Modelo de Dados (para fase de backend)

### produtos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| slug | text | url |
| nome | text | |
| familia | text | Cheesecakes/Cremeux/etc |
| descricao_curta | text | |
| descricao_longa | text | |
| assinatura_chef | boolean | |
| fotos | text[] | URLs |
| preco_base | numeric | pode ser null → sob consulta |
| variacoes | jsonb | tamanhos, formatos |
| alergeneos | text[] | |
| ingredientes | text[] | |
| conservacao | text | |
| validade | text | |
| antecedencia_dias | int | |
| disponibilidade | jsonb | tipo + regras |
| periodo_venda | jsonb | sazonais |
| estado | text | rascunho/publicado/arquivado |
| b2b_only | boolean | |
| historico_precos | jsonb | |

### encomendas
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| cliente_id | uuid | FK |
| itens | jsonb | array de produtos+variação |
| data_entrega | date | |
| horario | text | |
| tipo_entrega | text | levantamento/delivery |
| morada | text | |
| taxa_entrega | numeric | |
| valor_total | numeric | |
| valor_sinal | numeric | |
| estado_sinal | text | pendente/pago |
| valor_pendente | numeric | |
| metodo_pagamento | text | |
| comprovativo_url | text | |
| estado | text | nova/a_validar/a_aguardar_sinal/confirmada/em_producao/pronta/entregue/cancelada |
| notas_internas | text | |
| canal | text | site/whatsapp/instagram/telefone |
| criada_em | timestamp | |

### clientes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| nome | text | |
| telefone | text | |
| email | text | |
| nif | text | |
| tipo | text | particular/restaurante/hotel/hostel/empresa/evento |
| morada | text | |
| preferencias | text | |
| alergias | text | |
| datas_importantes | jsonb | |
| notas | text | |

### producao
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| encomenda_id | uuid | FK |
| produto_id | uuid | FK |
| data | date | |
| quantidade | int | |
| complexidade | text | simples/medio/complexo |
| responsavel | text | |
| checklist | jsonb | |
| estado | text | |

## 5. Integrações
- **Supabase** (fase 2+): base de dados, auth do backoffice, storage de fotos.
- **Stripe** (opcional, fase 3+): pagamento de sinal online.
- **Formulários Readdy**: contactos, pedido de orçamento B2B, subscrição.

## 6. Plano de Fases

### Fase 1 — Vitrine premium da marca ✅ (atual)
- Homepage completa com todos os módulos
- Header + Footer
- Reflete o tom artesanal, caloroso, com assinatura do Chef

### Fase 2 — Catálogo público
- Página `/catalogo` com filtros por família ✅
- Página `/produto/:slug` de detalhe ✅
- Dados mock com produtos do PRD (Cheesecakes, Cremeux, etc.) ✅

### Fase 3 — Fluxo de encomenda
- `/encomenda` multi-step mobile-first
- Formulário com todos os campos do PRD (cliente, produto, entrega, pagamento, alergias)
- Ligação a form Readdy inicial

### Fase 4 — Páginas B2B, Sobre, Contactos
- Landing profissionais
- História do Chef
- Zonas de entrega + mapa

### Fase 5 — Backoffice (requer Supabase)
- Login admin
- Gestão de catálogo (CRUD com regras de publicação)
- Lista e detalhe de encomendas + mudança de estados
- CRM de clientes

### Fase 6 — Agenda e Produção
- Agenda semanal/diária
- Lista de produção agrupada
- Capacidade e alertas

### Fase 7 — Refinamentos
- Repetição de pedidos
- Modo B2B avançado
- Relatórios básicos
- Impressão/exportação de fichas