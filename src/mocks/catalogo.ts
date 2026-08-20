export interface Produto {
  id: string;
  slug: string;
  nome: string;
  familia: string;
  familiaSlug: string;
  descricao: string;
  descricaoLonga?: string;
  formato: string;
  preco: string | null;
  precoNumero: number | null;
  tag: string;
  dicaChef?: string;
  imagem: string;
  imagemThumb: string;
  imageFit?: string;
  imagePosition?: string;
  imageScale?: number;
  alergeneos: string[];
  ingredientes?: string[];
  conservacao?: string;
  validade?: string;
  antecedencia: string;
  disponibilidade: string;
  estado: "rascunho" | "publicado" | "arquivado";
  b2b: boolean;
  assinaturaChef: boolean;
  categoriasB2B?: string[];
  variacoes: { nome: string; preco: string; precoNumero: number }[];
}

export const familiasCatalogo = [
  { slug: "todas", nome: "Todas as famílias", count: 0 },
  { slug: "cheesecakes", nome: "Cheesecakes", count: 5 },
  { slug: "cremeux", nome: "Cremeux", count: 4 },
  { slug: "troncos", nome: "Troncos de Natal", count: 3 },
  { slug: "ovos-pascoa", nome: "Ovos de Páscoa de Colher", count: 6 },
  { slug: "bolos-eventos", nome: "Bolos & Eventos", count: 6 },
  { slug: "paves-tartes", nome: "Pavés, Tartes & Entremets", count: 5 },
  { slug: "profissionais", nome: "Para Profissionais", count: 4 },
];

export const produtos: Produto[] = [
  {
    id: "cheesecake-frutos-vermelhos",
    slug: "cheesecake-frutos-vermelhos",
    nome: "Cheesecake Frutos Vermelhos",
    familia: "Cheesecakes",
    familiaSlug: "cheesecakes",
    descricao:
      "Cheesecake cremoso com base de bolacha e cobertura generosa de frutos vermelhos frescos. Assinatura do Chef Manuel Brito.",
    formato: "26 cm · 12 fatias",
    preco: "38,00 €",
    precoNumero: 38,
    tag: "Assinatura do Chef",
    imagem:
      "https://readdy.ai/api/search-image?query=Whole%20round%20artisanal%20cheesecake%20with%20fresh%20red%20berry%20topping%20raspberry%20blackberry%20strawberry%20on%20matte%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20window%20light%2C%20warm%20cream%20linen%20surface%2C%20subtle%20terracotta%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20high%20texture%20detail%20on%20berries%20and%20cream%20cheese%20surface%2C%20clean%20premium%20composition&width=900&height=1100&seq=cat-cheese-frutos&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Whole%20round%20artisanal%20cheesecake%20with%20fresh%20red%20berry%20topping%20raspberry%20blackberry%20strawberry%20on%20matte%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20window%20light%2C%20warm%20cream%20linen%20surface%2C%20subtle%20terracotta%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20high%20texture%20detail%20on%20berries%20and%20cream%20cheese%20surface%2C%20clean%20premium%20composition&width=600&height=500&seq=cat-cheese-frutos-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    ingredientes: [
      "Queijo creme artesanal",
      "Natas frescas nacionais",
      "Bolacha tostada",
      "Manteiga sem sal",
      "Açúcar mascavado",
      "Ovos biológicos",
      "Frutos vermelhos frescos (morango, framboesa, mirtilo, amora)",
      "Sumo de limão siciliano",
      "Baunilha natural",
    ],
    conservacao: "Conservar no frigorífico entre 2–6 °C. Retirar 20 minutos antes de servir para atingir a temperatura ideal de degustação.",
    validade: "3 dias no frigorífico após entrega",
    antecedencia: "48 horas",
    disponibilidade: "Sempre disponível",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "26 cm (12 fatias)", preco: "38,00 €", precoNumero: 38 },
      { nome: "18 cm (6 fatias)", preco: "24,00 €", precoNumero: 24 },
    ],
  },
  {
    id: "cheesecake-goiabada",
    slug: "cheesecake-goiabada",
    nome: "Cheesecake Goiabada",
    familia: "Cheesecakes",
    familiaSlug: "cheesecakes",
    descricao:
      "Cheesecake com camada de goiabada artesanal e cobertura de pistácio moído. O encontro entre Portugal e o clássico americano.",
    descricaoLonga:
      "O Cheesecake Goiabada é onde a tradição portuguesa encontra a pastelaria americana. A base de bolacha tostada sustenta um creme de queijo sedoso, coroado por uma camada generosa de goiabada artesanal feita com goiabas selecionadas. A finalização com pistácio moído traz um crocante inesperado e uma cor vibrante que faz deste cheesecake uma peça única no catálogo.",
    formato: "22 cm · 10 fatias",
    preco: "32,00 €",
    precoNumero: 32,
    tag: "Popular",
    imagem:
      "https://readdy.ai/api/search-image?query=Artisanal%20guava%20cheesecake%20with%20pistachio%20crumb%20topping%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20terracotta%20and%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20smooth%20cheese%20surface%20with%20guava%20glaze%20layer%2C%20high%20detail%20food%20styling%2C%20rustic%20elegant%20mood&width=900&height=1100&seq=cat-cheese-goiabada&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Artisanal%20guava%20cheesecake%20with%20pistachio%20crumb%20topping%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20terracotta%20and%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20smooth%20cheese%20surface%20with%20guava%20glaze%20layer%2C%20high%20detail%20food%20styling%2C%20rustic%20elegant%20mood&width=600&height=500&seq=cat-cheese-goiabada-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "48 horas",
    disponibilidade: "Sempre disponível",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "22 cm (10 fatias)", preco: "32,00 €", precoNumero: 32 },
      { nome: "18 cm (6 fatias)", preco: "22,00 €", precoNumero: 22 },
    ],
  },
  {
    id: "cheesecake-caramelo",
    slug: "cheesecake-caramelo",
    nome: "Cheesecake Caramelo Salgado",
    familia: "Cheesecakes",
    familiaSlug: "cheesecakes",
    descricao:
      "Cheesecake com camada de caramelo salgado artesanal e crocante de amendoim. Doce e salgado em equilíbrio perfeito.",
    formato: "22 cm · 10 fatias",
    preco: "34,00 €",
    precoNumero: 34,
    tag: "Recomendado",
    imagem:
      "https://readdy.ai/api/search-image?query=Salted%20caramel%20cheesecake%20with%20peanut%20brittle%20topping%20and%20caramel%20drizzle%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20terracotta%20and%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20glossy%20caramel%20layer%2C%20high%20detail%20food%20styling%2C%20artisanal%20mood&width=900&height=1100&seq=cat-cheese-caramelo&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Salted%20caramel%20cheesecake%20with%20peanut%20brittle%20topping%20and%20caramel%20drizzle%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20terracotta%20and%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20glossy%20caramel%20layer%2C%20high%20detail%20food%20styling%2C%20artisanal%20mood&width=600&height=500&seq=cat-cheese-caramelo-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Amendoim"],
    antecedencia: "48 horas",
    disponibilidade: "Sempre disponível",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "22 cm (10 fatias)", preco: "34,00 €", precoNumero: 34 }],
  },
  {
    id: "cheesecake-pistacio",
    slug: "cheesecake-pistacio",
    nome: "Cheesecake Pistácio",
    familia: "Cheesecakes",
    familiaSlug: "cheesecakes",
    descricao:
      "Cheesecake com pasta de pistácio siciliano e cobertura de pistácio crocante. Intenso, elegante e memorável.",
    formato: "22 cm · 10 fatias",
    preco: "36,00 €",
    precoNumero: 36,
    tag: "Premium",
    imagem:
      "https://readdy.ai/api/search-image?query=Pistachio%20cheesecake%20with%20crushed%20pistachio%20topping%20and%20green%20pistachio%20cream%20layer%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20terracotta%20and%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20smooth%20surface%2C%20high%20detail%20food%20styling%2C%20artisanal%20elegant%20mood&width=900&height=1100&seq=cat-cheese-pistacio&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Pistachio%20cheesecake%20with%20crushed%20pistachio%20topping%20and%20green%20pistachio%20cream%20layer%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20terracotta%20and%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20smooth%20surface%2C%20high%20detail%20food%20styling%2C%20artisanal%20elegant%20mood&width=600&height=500&seq=cat-cheese-pistacio-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "48 horas",
    disponibilidade: "Sempre disponível",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "22 cm (10 fatias)", preco: "36,00 €", precoNumero: 36 }],
  },
  {
    id: "cheesecake-chocolate-coracao",
    slug: "cheesecake-chocolate-coracao",
    nome: "Cheesecake Chocolate Coração",
    familia: "Cheesecakes",
    familiaSlug: "cheesecakes",
    descricao:
      "Cheesecake de chocolate em forma de coração, com ganache brilhante e raspas de chocolate. Perfeito para datas especiais.",
    formato: "Formato coração · 20 cm",
    preco: "34,00 €",
    precoNumero: 34,
    tag: "Ocasião especial",
    imagem:
      "https://readdy.ai/api/search-image?query=Heart%20shaped%20dark%20chocolate%20cheesecake%20with%20glossy%20ganache%20top%20and%20chocolate%20curls%20decoration%20on%20cream%20ceramic%20plate%2C%20warm%20candle%20light%2C%20cream%20linen%20background%2C%20romantic%20artisanal%20portuguese%20patisserie%20mood%2C%20editorial%20food%20photography%2C%20terracotta%20accents&width=900&height=1100&seq=cat-cheese-coracao&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Heart%20shaped%20dark%20chocolate%20cheesecake%20with%20glossy%20ganache%20top%20and%20chocolate%20curls%20decoration%20on%20cream%20ceramic%20plate%2C%20warm%20candle%20light%2C%20cream%20linen%20background%2C%20romantic%20artisanal%20portuguese%20patisserie%20mood%2C%20editorial%20food%20photography%2C%20terracotta%20accents&width=600&height=500&seq=cat-cheese-coracao-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "Coração 20 cm", preco: "34,00 €", precoNumero: 34 }],
  },
  {
    id: "cremeux-chocolate",
    slug: "cremeux-chocolate",
    nome: "Cremeux de Chocolate",
    familia: "Cremeux",
    familiaSlug: "cremeux",
    descricao:
      "Cremeux de chocolate negro 70% com camada de brownie e ganache aveludada. Textura intensa em copo individual.",
    descricaoLonga:
      "O Cremeux de Chocolate é uma experiência intensa em cada colherada. Camadas de mousse de chocolate negro 70% origem Equador alternam com um brownie húmido e uma ganache aveludada, tudo servido num copo de vidro que revela a arquitetura do sabor. A textura é simultaneamente aerada e densa — o equilíbrio que só o Chef Manuel Brito consegue alcançar.",
    formato: "Copo individual · 180 g",
    preco: "6,50 €",
    precoNumero: 6.5,
    tag: "Clássico",
    imagem:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20chocolate%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20layered%20dark%20chocolate%20mousse%20and%20brownie%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=900&height=1100&seq=cat-crem-choco&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20chocolate%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20layered%20dark%20chocolate%20mousse%20and%20brownie%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=600&height=500&seq=cat-crem-choco-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "24 horas",
    disponibilidade: "Stock diário",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "Individual", preco: "6,50 €", precoNumero: 6.5 },
      { nome: "Pack 4", preco: "22,00 €", precoNumero: 22 },
    ],
  },
  {
    id: "cremeux-maracuja",
    slug: "cremeux-maracuja",
    nome: "Cremeux de Maracujá",
    familia: "Cremeux",
    familiaSlug: "cremeux",
    descricao:
      "Cremeux de maracujá com camada de gelatina de maracujá fresco e crumble de coco. Tropical e refrescante.",
    formato: "Copo individual · 180 g",
    preco: "6,50 €",
    precoNumero: 6.5,
    tag: "Popular",
    imagem:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20passion%20fruit%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20yellow%20passion%20fruit%20jelly%20layer%20and%20coconut%20crumble%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=900&height=1100&seq=cat-crem-maracuja&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20passion%20fruit%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20yellow%20passion%20fruit%20jelly%20layer%20and%20coconut%20crumble%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=600&height=500&seq=cat-crem-maracuja-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "24 horas",
    disponibilidade: "Stock diário",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "Individual", preco: "6,50 €", precoNumero: 6.5 },
      { nome: "Pack 4", preco: "22,00 €", precoNumero: 22 },
    ],
  },
  {
    id: "cremeux-tangerina",
    slug: "cremeux-tangerina",
    nome: "Cremeux de Tangerina",
    familia: "Cremeux",
    familiaSlug: "cremeux",
    descricao:
      "Cremeux de tangerina com camada de confit de tangerina e crumble de amêndoa. Cítrico, luminoso e leve.",
    formato: "Copo individual · 180 g",
    preco: "6,00 €",
    precoNumero: 6,
    tag: "Novo",
    imagem:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20tangerine%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20orange%20citrus%20jelly%20layer%20and%20almond%20crumble%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=900&height=1100&seq=cat-crem-tangerina&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20tangerine%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20orange%20citrus%20jelly%20layer%20and%20almond%20crumble%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=600&height=500&seq=cat-crem-tangerina-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "24 horas",
    disponibilidade: "Stock diário",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "Individual", preco: "6,00 €", precoNumero: 6 },
      { nome: "Pack 4", preco: "20,00 €", precoNumero: 20 },
    ],
  },
  {
    id: "cremeux-frutos-vermelhos",
    slug: "cremeux-frutos-vermelhos",
    nome: "Cremeux Frutos Vermelhos",
    familia: "Cremeux",
    familiaSlug: "cremeux",
    descricao:
      "Cremeux de frutos vermelhos com camada de coulis de framboesa e crumble de bolacha. Fresco, frutado e elegante.",
    formato: "Copo individual · 180 g",
    preco: "6,50 €",
    precoNumero: 6.5,
    tag: "Clássico",
    imagem:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20red%20berry%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20raspberry%20coulis%20layer%20and%20biscuit%20crumble%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=900&height=1100&seq=cat-crem-frutos&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Elegant%20individual%20red%20berry%20cremeux%20dessert%20in%20clear%20glass%20cup%20with%20raspberry%20coulis%20layer%20and%20biscuit%20crumble%20base%2C%20warm%20cream%20linen%20background%2C%20soft%20diffused%20window%20light%2C%20editorial%20patisserie%20photography%2C%20clean%20minimalist%20composition%20with%20natural%20wood%20surface&width=600&height=500&seq=cat-crem-frutos-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "24 horas",
    disponibilidade: "Stock diário",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "Individual", preco: "6,50 €", precoNumero: 6.5 },
      { nome: "Pack 4", preco: "22,00 €", precoNumero: 22 },
    ],
  },
  {
    id: "tronco-ruby",
    slug: "tronco-ruby",
    nome: "Tronco Frutos Vermelhos & Chocolate Ruby",
    familia: "Troncos de Natal",
    familiaSlug: "troncos",
    descricao:
      "Tronco de Natal com mousse de chocolate ruby e frutos vermelhos frescos. Cobertura brilhante e decoração de ouro comestível.",
    formato: "Tamanho familiar · 10 pessoas",
    preco: "48,00 €",
    precoNumero: 48,
    tag: "Edição Limitada",
    imagem:
      "https://readdy.ai/api/search-image?query=Christmas%20yule%20log%20dessert%20with%20ruby%20chocolate%20glaze%20and%20red%20berry%20topping%2C%20gold%20leaf%20decoration%20on%20rustic%20wooden%20board%2C%20warm%20cream%20background%2C%20cozy%20artisanal%20holiday%20mood%2C%20editorial%20patisserie%20photography%20with%20warm%20candle%20light%20and%20terracotta%20accents&width=900&height=1100&seq=cat-tronco-ruby&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Christmas%20yule%20log%20dessert%20with%20ruby%20chocolate%20glaze%20and%20red%20berry%20topping%2C%20gold%20leaf%20decoration%20on%20rustic%20wooden%20board%2C%20warm%20cream%20background%2C%20cozy%20artisanal%20holiday%20mood%2C%20editorial%20patisserie%20photography%20with%20warm%20candle%20light%20and%20terracotta%20accents&width=600&height=500&seq=cat-tronco-ruby-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Dez)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "Familiar 10 pessoas", preco: "48,00 €", precoNumero: 48 }],
  },
  {
    id: "tronco-chocolate",
    slug: "tronco-chocolate",
    nome: "Tronco de Chocolate",
    familia: "Troncos de Natal",
    familiaSlug: "troncos",
    descricao:
      "Tronco de Natal clássico com mousse de chocolate negro 70%, ganache aveludada e textura de brownie. Tradição reinventada.",
    formato: "Tamanho familiar · 10 pessoas",
    preco: "44,00 €",
    precoNumero: 44,
    tag: "Edição Limitada",
    imagem:
      "https://readdy.ai/api/search-image?query=Classic%20chocolate%20yule%20log%20dessert%20with%20dark%20chocolate%20ganache%20glaze%20and%20chocolate%20curls%20decoration%20on%20rustic%20wooden%20board%2C%20warm%20cream%20background%2C%20cozy%20artisanal%20holiday%20mood%2C%20editorial%20patisserie%20photography%20with%20warm%20candle%20light%20and%20terracotta%20accents&width=900&height=1100&seq=cat-tronco-choco&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Classic%20chocolate%20yule%20log%20dessert%20with%20dark%20chocolate%20ganache%20glaze%20and%20chocolate%20curls%20decoration%20on%20rustic%20wooden%20board%2C%20warm%20cream%20background%2C%20cozy%20artisanal%20holiday%20mood%2C%20editorial%20patisserie%20photography%20with%20warm%20candle%20light%20and%20terracotta%20accents&width=600&height=500&seq=cat-tronco-choco-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Dez)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "Familiar 10 pessoas", preco: "44,00 €", precoNumero: 44 }],
  },
  {
    id: "tronco-maracuja-dourado",
    slug: "tronco-maracuja-dourado",
    nome: "Tronco Maracujá Dourado",
    familia: "Troncos de Natal",
    familiaSlug: "troncos",
    descricao:
      "Tronco de maracujá com cobertura dourada comestível e confit de maracujá. Exótico, sofisticado e inesquecível.",
    formato: "Tamanho familiar · 10 pessoas",
    preco: "46,00 €",
    precoNumero: 46,
    tag: "Edição Limitada",
    imagem:
      "https://readdy.ai/api/search-image?query=Passion%20fruit%20yule%20log%20dessert%20with%20golden%20edible%20glitter%20glaze%20and%20tropical%20fruit%20decoration%20on%20rustic%20wooden%20board%2C%20warm%20cream%20background%2C%20cozy%20artisanal%20holiday%20mood%2C%20editorial%20patisserie%20photography%20with%20warm%20candle%20light%20and%20terracotta%20accents&width=900&height=1100&seq=cat-tronco-maracuja&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Passion%20fruit%20yule%20log%20dessert%20with%20golden%20edible%20glitter%20glaze%20and%20tropical%20fruit%20decoration%20on%20rustic%20wooden%20board%2C%20warm%20cream%20background%2C%20cozy%20artisanal%20holiday%20mood%2C%20editorial%20patisserie%20photography%20with%20warm%20candle%20light%20and%20terracotta%20accents&width=600&height=500&seq=cat-tronco-maracuja-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Dez)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "Familiar 10 pessoas", preco: "46,00 €", precoNumero: 46 }],
  },
  {
    id: "ovo-pistacio",
    slug: "ovo-pistacio",
    nome: "Ovo de Chocolate Valrhona 55% recheado com Cremeux de Pistácio",
    familia: "Ovos de Páscoa de Colher",
    familiaSlug: "ovos-pascoa",
    descricao:
      "Ovo de chocolate negro Valrhona 55% recheado com cremeux de pistácio siciliano, decorado com pistácio moído e crocante de chocolate. Edição limitada de Páscoa.",
    formato: "350 g · Ovo de colher",
    preco: "28,00 €",
    precoNumero: 28,
    tag: "Edição Páscoa",
    imagem:
      "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/b55aa571-59f4-41de-baea-4dcb0a31e701_compressed_ovo-recheio-pistachio.webp",
    imagemThumb:
      "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/b55aa571-59f4-41de-baea-4dcb0a31e701_compressed_ovo-recheio-pistachio.webp",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Soja", "Frutos de casca rija"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Mar–Abr)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "350 g", preco: "28,00 €", precoNumero: 28 }],
  },
  {
    id: "ovo-chocolate-gold",
    slug: "ovo-chocolate-gold",
    nome: "Ovo de Chocolate Callebaut Gold recheado com Cremeux de Chocolate",
    familia: "Ovos de Páscoa de Colher",
    familiaSlug: "ovos-pascoa",
    descricao:
      "Ovo de chocolate dourado Callebaut Gold recheado com cremeux de chocolate negro 70%, finalizado com ganache e lascas de chocolate temperado.",
    formato: "350 g · Ovo de colher",
    preco: "26,00 €",
    precoNumero: 26,
    tag: "Edição Páscoa",
    imagem:
      "https://readdy.ai/api/search-image?query=Luxury%20golden%20Callebaut%20Gold%20chocolate%20Easter%20egg%20half-open%20in%20elegant%20white%20rectangular%20gift%20box%20with%20wooden%20spoon%20beside%2C%20filled%20with%20dark%20chocolate%2070%25%20cremeux%20mousse%20and%20gold%20drizzle%2C%20dark%20textured%20artistic%20oil-paint%20background%2C%20editorial%20artisanal%20patisserie%20photography%2C%20warm%20dramatic%20lighting%2C%20high%20detail%20texture%20on%20golden%20chocolate%20shell&width=900&height=1100&seq=cat-ovo-gold&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Luxury%20golden%20Callebaut%20Gold%20chocolate%20Easter%20egg%20half-open%20in%20elegant%20white%20rectangular%20gift%20box%20with%20wooden%20spoon%20beside%2C%20filled%20with%20dark%20chocolate%2070%25%20cremeux%20mousse%20and%20gold%20drizzle%2C%20dark%20textured%20artistic%20oil-paint%20background%2C%20editorial%20artisanal%20patisserie%20photography%2C%20warm%20dramatic%20lighting%2C%20high%20detail%20texture%20on%20golden%20chocolate%20shell&width=600&height=500&seq=cat-ovo-gold-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Soja"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Mar–Abr)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "350 g", preco: "26,00 €", precoNumero: 26 }],
  },
  {
    id: "ovo-caramelo",
    slug: "ovo-caramelo",
    nome: "Ovo de Chocolate Valrhona 55% recheado com Cremeux de Caramelo",
    familia: "Ovos de Páscoa de Colher",
    familiaSlug: "ovos-pascoa",
    descricao:
      "Ovo de chocolate negro Valrhona 55% recheado com cremeux de caramelo salgado artesanal, finalizado com flor de sal e crocante de amendoim.",
    formato: "350 g · Ovo de colher",
    preco: "26,00 €",
    precoNumero: 26,
    tag: "Edição Páscoa",
    imagem:
      "https://readdy.ai/api/search-image?query=Luxury%20dark%20Valrhona%2055%25%20chocolate%20Easter%20egg%20half-open%20in%20elegant%20white%20rectangular%20gift%20box%20with%20wooden%20spoon%20beside%2C%20filled%20with%20golden%20salted%20caramel%20cremeux%20and%20caramel%20drizzle%20with%20sea%20salt%20flakes%2C%20dark%20textured%20artistic%20oil-paint%20background%2C%20editorial%20artisanal%20patisserie%20photography%2C%20warm%20dramatic%20lighting%2C%20high%20detail%20texture%20on%20chocolate%20shell&width=900&height=1100&seq=cat-ovo-caramelo&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Luxury%20dark%20Valrhona%2055%25%20chocolate%20Easter%20egg%20half-open%20in%20elegant%20white%20rectangular%20gift%20box%20with%20wooden%20spoon%20beside%2C%20filled%20with%20golden%20salted%20caramel%20cremeux%20and%20caramel%20drizzle%20with%20sea%20salt%20flakes%2C%20dark%20textured%20artistic%20oil-paint%20background%2C%20editorial%20artisanal%20patisserie%20photography%2C%20warm%20dramatic%20lighting%2C%20high%20detail%20texture%20on%20chocolate%20shell&width=600&height=500&seq=cat-ovo-caramelo-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Soja", "Amendoim"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Mar–Abr)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "350 g", preco: "26,00 €", precoNumero: 26 }],
  },
  {
    id: "ovo-tiramisu",
    slug: "ovo-tiramisu",
    nome: "Ovo de Chocolate Valrhona 55% recheado com Tiramisu",
    familia: "Ovos de Páscoa de Colher",
    familiaSlug: "ovos-pascoa",
    descricao:
      "Ovo de chocolate negro Valrhona 55% recheado com tiramisu artesanal em camadas — mascarpone, café expresso e biscoito champagne, polvilhado com cacau em pó.",
    formato: "350 g · Ovo de colher",
    preco: "26,00 €",
    precoNumero: 26,
    tag: "Edição Páscoa",
    imagem:
      "https://readdy.ai/api/search-image?query=Luxury%20dark%20Valrhona%2055%25%20chocolate%20Easter%20egg%20half-open%20in%20elegant%20white%20rectangular%20gift%20box%20with%20wooden%20spoon%20beside%2C%20filled%20with%20layered%20Italian%20tiramisu%20cream%20mascarpone%20coffee%20and%20biscuit%20layers%20dusted%20with%20cocoa%20powder%2C%20dark%20textured%20artistic%20oil-paint%20background%2C%20editorial%20artisanal%20patisserie%20photography%2C%20warm%20dramatic%20lighting%2C%20high%20detail%20texture%20on%20chocolate%20shell&width=900&height=1100&seq=cat-ovo-tiramisu&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Luxury%20dark%20Valrhona%2055%25%20chocolate%20Easter%20egg%20half-open%20in%20elegant%20white%20rectangular%20gift%20box%20with%20wooden%20spoon%20beside%2C%20filled%20with%20layered%20Italian%20tiramisu%20cream%20mascarpone%20coffee%20and%20biscuit%20layers%20dusted%20with%20cocoa%20powder%2C%20dark%20textured%20artistic%20oil-paint%20background%2C%20editorial%20artisanal%20patisserie%20photography%2C%20warm%20dramatic%20lighting%2C%20high%20detail%20texture%20on%20chocolate%20shell&width=600&height=500&seq=cat-ovo-tiramisu-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Soja"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Mar–Abr)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "350 g", preco: "26,00 €", precoNumero: 26 }],
  },
  {
    id: "ovo-maracuja-coco",
    slug: "ovo-maracuja-coco",
    nome: "Ovo de Chocolate Branco Callebaut com Coco Queimado recheado com Cremeux de Maracujá",
    familia: "Ovos de Páscoa de Colher",
    familiaSlug: "ovos-pascoa",
    descricao:
      "Ovo de chocolate branco Callebaut com cobertura de coco queimado, recheado com cremeux de maracujá fresco e gelatina de maracujá. Tropical e sofisticado.",
    formato: "350 g · Ovo de colher",
    preco: "28,00 €",
    precoNumero: 28,
    tag: "Edição Páscoa",
    imagem:
      "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/78fdeeb7-36a2-43b4-8562-5eaeb3c4e7df_compressed_ovo-rechado-cremux-maracuja.webp",
    imagemThumb:
      "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/78fdeeb7-36a2-43b4-8562-5eaeb3c4e7df_compressed_ovo-rechado-cremux-maracuja.webp",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Soja"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Mar–Abr)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "350 g", preco: "28,00 €", precoNumero: 28 }],
  },
  {
    id: "ovo-framboesa",
    slug: "ovo-framboesa",
    nome: "Ovo de Chocolate Valrhona 55% recheado com Cremeux de Framboesa",
    familia: "Ovos de Páscoa de Colher",
    familiaSlug: "ovos-pascoa",
    descricao:
      "Ovo de chocolate negro Valrhona 55% recheado com cremeux de framboesa fresca, finalizado com coulis de framboesa e pétalas de chocolate branco.",
    formato: "350 g · Ovo de colher",
    preco: "26,00 €",
    precoNumero: 26,
    tag: "Edição Páscoa",
    imagem:
      "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/9af9f7a0-3fd9-4579-90ce-150d3d6dedf9_compressed_Ovo-recheado-cremux-franboesa.webp",
    imagemThumb:
      "https://storage.readdy-site.link/project_files/8e7f210d-e51b-4dea-9427-5d72308fd0bb/9af9f7a0-3fd9-4579-90ce-150d3d6dedf9_compressed_Ovo-recheado-cremux-franboesa.webp",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Soja"],
    antecedencia: "5 dias",
    disponibilidade: "Sazonal (Mar–Abr)",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "350 g", preco: "26,00 €", precoNumero: 26 }],
  },
  {
    id: "bolo-cenoura",
    slug: "bolo-cenoura",
    nome: "Bolo de Cenoura",
    familia: "Bolos & Eventos",
    familiaSlug: "bolos-eventos",
    descricao:
      "Bolo de cenoura húmido com cobertura de cream cheese e nozes. Conforto caseiro elevado à pastelaria artesanal.",
    formato: "20 cm · 12 fatias",
    preco: "28,00 €",
    precoNumero: 28,
    tag: "Clássico",
    imagem:
      "https://readdy.ai/api/search-image?query=Moist%20carrot%20cake%20with%20cream%20cheese%20frosting%20and%20walnut%20pieces%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20rustic%20artisanal%20mood%2C%20terracotta%20accents%2C%20high%20detail%20texture&width=900&height=1100&seq=cat-bolo-cenoura&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Moist%20carrot%20cake%20with%20cream%20cheese%20frosting%20and%20walnut%20pieces%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20portuguese%20patisserie%20photography%2C%20rustic%20artisanal%20mood%2C%20terracotta%20accents%2C%20high%20detail%20texture&width=600&height=500&seq=cat-bolo-cenoura-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "20 cm (12 fatias)", preco: "28,00 €", precoNumero: 28 },
      { nome: "26 cm (20 fatias)", preco: "38,00 €", precoNumero: 38 },
    ],
  },
  {
    id: "bolo-chocolate-pistacio",
    slug: "bolo-chocolate-pistacio",
    nome: "Bolo Chocolate & Pistácio",
    familia: "Bolos & Eventos",
    familiaSlug: "bolos-eventos",
    descricao:
      "Bolo de camadas com mousse de chocolate negro e creme de pistácio siciliano. Decoração com pistácio e ganache.",
    formato: "22 cm · 14 fatias",
    preco: "42,00 €",
    precoNumero: 42,
    tag: "Premium",
    imagem:
      "https://readdy.ai/api/search-image?query=Layered%20chocolate%20pistachio%20cake%20with%20dark%20chocolate%20mousse%20and%20pistachio%20cream%2C%20decorated%20with%20crushed%20pistachio%20and%20ganache%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20premium%20artisanal%20mood%2C%20terracotta%20accents&width=900&height=1100&seq=cat-bolo-choc-pist&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Layered%20chocolate%20pistachio%20cake%20with%20dark%20chocolate%20mousse%20and%20pistachio%20cream%2C%20decorated%20with%20crushed%20pistachio%20and%20ganache%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20premium%20artisanal%20mood%2C%20terracotta%20accents&width=600&height=500&seq=cat-bolo-choc-pist-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "22 cm (14 fatias)", preco: "42,00 €", precoNumero: 42 },
      { nome: "26 cm (20 fatias)", preco: "52,00 €", precoNumero: 52 },
    ],
  },
  {
    id: "bolo-floresta-negra",
    slug: "bolo-floresta-negra",
    nome: "Bolo Floresta Negra",
    familia: "Bolos & Eventos",
    familiaSlug: "bolos-eventos",
    descricao:
      "Bolo de chocolate com camadas de chantilly e cereja calda. Clássico alemão com toque português do Chef.",
    formato: "22 cm · 14 fatias",
    preco: "38,00 €",
    precoNumero: 38,
    tag: "Popular",
    imagem:
      "https://readdy.ai/api/search-image?query=Black%20forest%20cake%20with%20chocolate%20layers%20whipped%20cream%20and%20cherry%20compote%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20classic%20artisanal%20mood%2C%20terracotta%20accents%2C%20cherry%20decoration%20on%20top&width=900&height=1100&seq=cat-bolo-floresta&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Black%20forest%20cake%20with%20chocolate%20layers%20whipped%20cream%20and%20cherry%20compote%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20classic%20artisanal%20mood%2C%20terracotta%20accents%2C%20cherry%20decoration%20on%20top&width=600&height=500&seq=cat-bolo-floresta-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "22 cm (14 fatias)", preco: "38,00 €", precoNumero: 38 },
      { nome: "26 cm (20 fatias)", preco: "48,00 €", precoNumero: 48 },
    ],
  },
  {
    id: "bolo-mousse-chocolate",
    slug: "bolo-mousse-chocolate",
    nome: "Bolo Mousse de Chocolate",
    familia: "Bolos & Eventos",
    familiaSlug: "bolos-eventos",
    descricao:
      "Bolo de mousse de chocolate aerada com base crocante de brownie e decoração minimalista de chocolate temperado.",
    formato: "20 cm · 12 fatias",
    preco: "36,00 €",
    precoNumero: 36,
    tag: "Recomendado",
    imagem:
      "https://readdy.ai/api/search-image?query=Airy%20chocolate%20mousse%20cake%20with%20brownie%20base%20and%20tempered%20chocolate%20decoration%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20minimalist%20artisanal%20mood%2C%20terracotta%20accents%2C%20glossy%20surface&width=900&height=1100&seq=cat-bolo-mousse&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Airy%20chocolate%20mousse%20cake%20with%20brownie%20base%20and%20tempered%20chocolate%20decoration%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20minimalist%20artisanal%20mood%2C%20terracotta%20accents%2C%20glossy%20surface&width=600&height=500&seq=cat-bolo-mousse-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "20 cm (12 fatias)", preco: "36,00 €", precoNumero: 36 },
      { nome: "26 cm (20 fatias)", preco: "46,00 €", precoNumero: 46 },
    ],
  },
  {
    id: "bolo-branco-limao-framboesa",
    slug: "bolo-branco-limao-framboesa",
    nome: "Bolo Branco, Limão & Framboesa",
    familia: "Bolos & Eventos",
    familiaSlug: "bolos-eventos",
    descricao:
      "Bolo branco de limão siciliano com camadas de framboesa fresca e buttercream de limão. Fresco, luminoso e elegante.",
    formato: "22 cm · 14 fatias",
    preco: "34,00 €",
    precoNumero: 34,
    tag: "Novo",
    imagem:
      "https://readdy.ai/api/search-image?query=White%20lemon%20cake%20with%20raspberry%20layers%20and%20lemon%20buttercream%20on%20cream%20ceramic%20cake%20stand%2C%20fresh%20raspberries%20on%20top%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20elegant%20artisanal%20mood%2C%20terracotta%20accents%2C%20bright%20clean%20composition&width=900&height=1100&seq=cat-bolo-limao&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=White%20lemon%20cake%20with%20raspberry%20layers%20and%20lemon%20buttercream%20on%20cream%20ceramic%20cake%20stand%2C%20fresh%20raspberries%20on%20top%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20elegant%20artisanal%20mood%2C%20terracotta%20accents%2C%20bright%20clean%20composition&width=600&height=500&seq=cat-bolo-limao-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [
      { nome: "22 cm (14 fatias)", preco: "34,00 €", precoNumero: 34 },
      { nome: "26 cm (20 fatias)", preco: "44,00 €", precoNumero: 44 },
    ],
  },
  {
    id: "pave-pistacio",
    slug: "pave-pistacio",
    nome: "Pavé de Pistácio",
    familia: "Pavés, Tartes & Entremets",
    familiaSlug: "paves-tartes",
    descricao:
      "Pavé em camadas com creme de pistácio siciliano, base crocante e cobertura de pistácio moído. Intenso e elegante.",
    formato: "Tamanho familiar · 8 pessoas",
    preco: "42,00 €",
    precoNumero: 42,
    tag: "Popular",
    imagem:
      "https://readdy.ai/api/search-image?query=Layered%20pistachio%20pave%20dessert%20with%20cream%20layers%20and%20chopped%20pistachio%20on%20top%2C%20rectangular%20shape%20on%20cream%20ceramic%20platter%2C%20warm%20natural%20window%20light%2C%20cream%20linen%20background%20with%20subtle%20terracotta%20accents%2C%20editorial%20artisanal%20patisserie%20photography%2C%20fresh%20green%20pistachio%20detail&width=900&height=1100&seq=cat-pave-pist&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Layered%20pistachio%20pave%20dessert%20with%20cream%20layers%20and%20chopped%20pistachio%20on%20top%2C%20rectangular%20shape%20on%20cream%20ceramic%20platter%2C%20warm%20natural%20window%20light%2C%20cream%20linen%20background%20with%20subtle%20terracotta%20accents%2C%20editorial%20artisanal%20patisserie%20photography%2C%20fresh%20green%20pistachio%20detail&width=600&height=500&seq=cat-pave-pist-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "48 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "Familiar 8 pessoas", preco: "42,00 €", precoNumero: 42 }],
  },
  {
    id: "tarte-rhubarb",
    slug: "tarte-rhubarb",
    nome: "Tarte Rhubarb",
    familia: "Pavés, Tartes & Entremets",
    familiaSlug: "paves-tartes",
    descricao:
      "Tarte de ruibarbo com creme de amêndoa e decoração de ruibarbo cristalizado. Conforto de domingo com técnica de alta pastelaria.",
    formato: "26 cm · 8 fatias",
    preco: "32,00 €",
    precoNumero: 32,
    tag: "Clássico",
    imagem:
      "https://readdy.ai/api/search-image?query=Rustic%20rhubarb%20tart%20with%20frangipane%20almond%20cream%20and%20crystallized%20rhubarb%20decoration%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20cream%20linen%20background%2C%20editorial%20patisserie%20photography%2C%20artisanal%20detail%2C%20terracotta%20ceramic%20accents%2C%20natural%20wood%20surface%20texture&width=900&height=1100&seq=cat-tarte-rhubarb&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Rustic%20rhubarb%20tart%20with%20frangipane%20almond%20cream%20and%20crystallized%20rhubarb%20decoration%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20cream%20linen%20background%2C%20editorial%20patisserie%20photography%2C%20artisanal%20detail%2C%20terracotta%20ceramic%20accents%2C%20natural%20wood%20surface%20texture&width=600&height=500&seq=cat-tarte-rhubarb-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo", "Frutos de casca rija"],
    antecedencia: "48 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "26 cm (8 fatias)", preco: "32,00 €", precoNumero: 32 }],
  },
  {
    id: "pudim-leite",
    slug: "pudim-leite",
    nome: "Pudim de Leite",
    familia: "Pavés, Tartes & Entremets",
    familiaSlug: "paves-tartes",
    descricao:
      "Pudim de leite condensado artesanal com caramelo caseiro e textura sedosa. A sobremesa portuguesa reinventada pelo Chef.",
    formato: "Tamanho familiar · 8 pessoas",
    preco: "28,00 €",
    precoNumero: 28,
    tag: "Clássico",
    imagem:
      "https://readdy.ai/api/search-image?query=Traditional%20portuguese%20caramel%20flan%20pudding%20on%20cream%20ceramic%20plate%20with%20caramel%20sauce%20pool%2C%20warm%20natural%20light%2C%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20artisanal%20detail%2C%20terracotta%20accents%2C%20smooth%20silky%20texture&width=900&height=1100&seq=cat-pudim-leite&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Traditional%20portuguese%20caramel%20flan%20pudding%20on%20cream%20ceramic%20plate%20with%20caramel%20sauce%20pool%2C%20warm%20natural%20light%2C%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20artisanal%20detail%2C%20terracotta%20accents%2C%20smooth%20silky%20texture&width=600&height=500&seq=cat-pudim-leite-thumb&orientation=landscape",
    alergeneos: ["Lactose", "Ovo"],
    antecedencia: "48 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "Familiar 8 pessoas", preco: "28,00 €", precoNumero: 28 }],
  },
  {
    id: "entremet-caramelo-salgado",
    slug: "entremet-caramelo-salgado",
    nome: "Entremet de Caramelo Salgado",
    familia: "Pavés, Tartes & Entremets",
    familiaSlug: "paves-tartes",
    descricao:
      "Entremet com mousse de caramelo salgado, insert de brownie e glaçage espelhado. Arquitetura de sabor em cada fatia.",
    formato: "22 cm · 10 fatias",
    preco: "40,00 €",
    precoNumero: 40,
    tag: "Premium",
    imagem:
      "https://readdy.ai/api/search-image?query=Salted%20caramel%20entremet%20cake%20with%20mirror%20glaze%20and%20brownie%20insert%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20artisanal%20detail%2C%20terracotta%20accents%2C%20glossy%20mirror%20surface%2C%20architectural%20layers&width=900&height=1100&seq=cat-entremet-caram&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Salted%20caramel%20entremet%20cake%20with%20mirror%20glaze%20and%20brownie%20insert%20on%20cream%20ceramic%20plate%2C%20warm%20natural%20light%2C%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20artisanal%20detail%2C%20terracotta%20accents%2C%20glossy%20mirror%20surface%2C%20architectural%20layers&width=600&height=500&seq=cat-entremet-caram-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "72 horas",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [{ nome: "22 cm (10 fatias)", preco: "40,00 €", precoNumero: 40 }],
  },
  {
    id: "bolo-bombons",
    slug: "bolo-bombons",
    nome: "Bolo de Bombons",
    familia: "Bolos & Eventos",
    familiaSlug: "bolos-eventos",
    descricao:
      "Bolo decorado com bombons artesanais de chocolate, perfeito para ocasiões especiais e festas de aniversário.",
    formato: "22 cm · Personalizado",
    preco: null,
    precoNumero: null,
    tag: "Sob consulta",
    imagem:
      "https://readdy.ai/api/search-image?query=Decorated%20cake%20with%20artisanal%20chocolate%20truffles%20and%20bonbons%20on%20top%2C%20celebration%20birthday%20cake%20style%2C%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20festive%20artisanal%20mood%2C%20terracotta%20accents%2C%20luxury%20decoration&width=900&height=1100&seq=cat-bolo-bombons&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Decorated%20cake%20with%20artisanal%20chocolate%20truffles%20and%20bonbons%20on%20top%2C%20celebration%20birthday%20cake%20style%2C%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20festive%20artisanal%20mood%2C%20terracotta%20accents%2C%20luxury%20decoration&width=600&height=500&seq=cat-bolo-bombons-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "7 dias",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: false,
    assinaturaChef: true,
    variacoes: [],
  },
  {
    id: "sobremesa-restaurante",
    slug: "sobremesa-restaurante",
    nome: "Sobremesa Individual — Linha Profissional",
    familia: "Para Profissionais",
    familiaSlug: "profissionais",
    descricao:
      "Cremeux e entremets em formato individual para restaurantes. Apresentação impecável, sabor consistente, entrega diária.",
    formato: "Individual · 150 g",
    preco: null,
    precoNumero: null,
    tag: "Preço sob consulta",
    imagem:
      "https://readdy.ai/api/search-image?query=Professional%20restaurant%20plated%20dessert%20individual%20cremeux%20with%20berry%20garnish%20on%20elegant%20white%20ceramic%20plate%2C%20fine%20dining%20setting%20with%20warm%20cream%20tablecloth%2C%20soft%20restaurant%20light%2C%20editorial%20patisserie%20photography%2C%20premium%20artisanal%20quality%20mood%2C%20golden%20cutlery%20detail&width=900&height=1100&seq=cat-prof-indiv&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Professional%20restaurant%20plated%20dessert%20individual%20cremeux%20with%20berry%20garnish%20on%20elegant%20white%20ceramic%20plate%2C%20fine%20dining%20setting%20with%20warm%20cream%20tablecloth%2C%20soft%20restaurant%20light%2C%20editorial%20patisserie%20photography%2C%20premium%20artisanal%20quality%20mood%2C%20golden%20cutlery%20detail&width=600&height=500&seq=cat-prof-indiv-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "48 horas",
    disponibilidade: "Encomenda recorrente",
    estado: "publicado",
    b2b: true,
    assinaturaChef: true,
    variacoes: [],
  },
  {
    id: "pack-restaurante",
    slug: "pack-restaurante",
    nome: "Pack Semanal — Restaurante",
    familia: "Para Profissionais",
    familiaSlug: "profissionais",
    descricao:
      "Pack semanal de sobremesas variadas para restaurante: 20 unidades, mix de sabores, entrega às 2ª e 5ª feiras.",
    formato: "Pack 20 unidades",
    preco: null,
    precoNumero: null,
    tag: "Preço sob consulta",
    imagem:
      "https://readdy.ai/api/search-image?query=Restaurant%20dessert%20display%20with%20multiple%20individual%20cremeux%20and%20entremets%20on%20white%20ceramic%20plates%2C%20professional%20catering%20presentation%2C%20warm%20cream%20tablecloth%2C%20soft%20restaurant%20light%2C%20editorial%20patisserie%20photography%2C%20premium%20quality%20mood%2C%20variety%20of%20flavors&width=900&height=1100&seq=cat-prof-pack&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Restaurant%20dessert%20display%20with%20multiple%20individual%20cremeux%20and%20entremets%20on%20white%20ceramic%20plates%2C%20professional%20catering%20presentation%2C%20warm%20cream%20tablecloth%2C%20soft%20restaurant%20light%2C%20editorial%20patisserie%20photography%2C%20premium%20quality%20mood%2C%20variety%20of%20flavors&width=600&height=500&seq=cat-prof-pack-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "48 horas",
    disponibilidade: "Encomenda recorrente",
    estado: "publicado",
    b2b: true,
    assinaturaChef: true,
    variacoes: [],
  },
  {
    id: "pack-hotel",
    slug: "pack-hotel",
    nome: "Pack Hotel & Hostel",
    familia: "Para Profissionais",
    familiaSlug: "profissionais",
    descricao:
      "Sobremesas individuais para hotel e hostel: entrega diária, apresentação premium, preço de volume sob consulta.",
    formato: "Pack 30 unidades",
    preco: null,
    precoNumero: null,
    tag: "Preço sob consulta",
    imagem:
      "https://readdy.ai/api/search-image?query=Hotel%20buffet%20dessert%20display%20with%20individual%20cups%20and%20small%20pastries%20on%20elegant%20white%20platters%2C%20professional%20hospitality%20setting%2C%20warm%20cream%20background%2C%20soft%20ambient%20light%2C%20editorial%20patisserie%20photography%2C%20premium%20quality%20mood%2C%20organized%20display&width=900&height=1100&seq=cat-prof-hotel&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Hotel%20buffet%20dessert%20display%20with%20individual%20cups%20and%20small%20pastries%20on%20elegant%20white%20platters%2C%20professional%20hospitality%20setting%2C%20warm%20cream%20background%2C%20soft%20ambient%20light%2C%20editorial%20patisserie%20photography%2C%20premium%20quality%20mood%2C%20organized%20display&width=600&height=500&seq=cat-prof-hotel-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "48 horas",
    disponibilidade: "Encomenda recorrente",
    estado: "publicado",
    b2b: true,
    assinaturaChef: true,
    variacoes: [],
  },
  {
    id: "bolo-evento-personalizado",
    slug: "bolo-evento-personalizado",
    nome: "Bolo de Evento Personalizado",
    familia: "Para Profissionais",
    familiaSlug: "profissionais",
    descricao:
      "Bolos personalizados para eventos corporativos, casamentos e celebrações. Desde 30 pessoas, decoração personalizada.",
    formato: "Personalizado · +30 pessoas",
    preco: null,
    precoNumero: null,
    tag: "Orçamento",
    imagem:
      "https://readdy.ai/api/search-image?query=Elegant%20tiered%20wedding%20cake%20with%20minimal%20decoration%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20premium%20artisanal%20mood%2C%20terracotta%20accents%2C%20celebration%20event%20cake&width=900&height=1100&seq=cat-prof-evento&orientation=portrait",
    imagemThumb:
      "https://readdy.ai/api/search-image?query=Elegant%20tiered%20wedding%20cake%20with%20minimal%20decoration%20on%20cream%20ceramic%20cake%20stand%2C%20soft%20natural%20light%2C%20warm%20cream%20background%2C%20editorial%20patisserie%20photography%2C%20premium%20artisanal%20mood%2C%20terracotta%20accents%2C%20celebration%20event%20cake&width=600&height=500&seq=cat-prof-evento-thumb&orientation=landscape",
    alergeneos: ["Glúten", "Lactose", "Ovo"],
    antecedencia: "7 dias",
    disponibilidade: "Por encomenda",
    estado: "publicado",
    b2b: true,
    assinaturaChef: true,
    variacoes: [],
  },
];