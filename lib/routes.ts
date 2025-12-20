export interface RouteConfig {
  routeId: string;
  name: string;
  description: string;
  points: number;
  image?: string;
  help?: string;
  position: { x: number; y: number }; // Percentage positions for fixed aspect ratio
}

export const ROUTES: RouteConfig[] = [
  {
    routeId: 'ancient-temple-ruins',
    name: 'Energetický chrám',
    description: 'Doufám, že se ti nemotá hlava z řídkého vzduchu. Výš při hledání pokladů už pravdepodobně nevystoupáš. Trochu si odpočiň a popadni dech, tahle výzva nebyla snadná. Ale odměna stojí za to!',
    points: 800,
    position: { x: 4, y: 57 },
  },
  {
    routeId: 'forbidden-crystal-cave',
    name: 'Kamenná jeskyně',
    description: 'Legenda praví, že tento kámen pochází ze staré čínské zdi. Snad jim tam nebude chybět. Tobě posloužil k získání pokladu Kamenné jeskyně a potvrzení starého českého přísloví: Není kámen, který leží nadarmo.',
    points: 200,
    position: { x: 62, y: 54 },
  },
  {
    routeId: 'lost-city-of-gold',
    name: 'Botanická zahrada',
    description: 'Překonal jsi liány, masožravky a podivný hmyz kolem zarostlé botanické zahrady a získal poklad. Vyměň tričko (a trenky?) a pokračuj dál!',
    points: 300,
    position: { x: 12, y: 97 },
  },
  {
    routeId: 'mysterious-jungle-path',
    name: 'Modlitební místo',
    description: 'Haleluja! Tohle byla opravdová zkouška, mít před sebou všechny ty staré svazky plné moudrosti, kdekdo by se začetl na desítky let. Ale ty jsi odolal, ukazuješ opravdovou sílu ducha! A protože církev je samé zlato, tento poklad budeš mít problém unést!',
    points: 1600,
    position: { x: 52, y: 95 },
  },
  {
    routeId: 'hidden-treasure-vault',
    name: 'Dřevěná bašta',
    description: 'Ovládl jsi Dřevěnou baštu! Doufám, že jsi přitom nevyházel polovinu poliček. Na oplátku jsi našel slušný počet mincí, jen tak dál!',
    points: 600,
    position: { x: 92, y: 73 },
  },
  {
    routeId: 'sacred-mountain-peak',
    name: 'Elektrizující hory',
    description: 'Tady šlo opravdu o krk! Jistá smrt na dosah ruky a zachovals chladnou hlavu. Vystoupal jsi na vrchol a našel zaslouženou odměnu. Jdeš příkladem všem dobrodruhům! A teď ukliď ty schůdky.',
    image: '/electric-mountains.webp',
    points: 300,
    position: { x: 47, y: 50 },
  },
  {
    routeId: 'desert-oasis-secret',
    name: 'Posvátné vodopády',
    description: 'Dobrá práce! Našel jsi poklad ukrytý pod zurčícími vodopády a keramickou bání. Tenhle poklad ukryli bájni Odpadníci pověstní svou důmyslností. Najít ho určitě nebylo snadné. Snad kolena pořád slouží!',
    help: 'Kde voda zurčí a klokotá',
    image: '/waterfalls.webp',
    points: 1000,
    position: { x: 62.5, y: 9 },
  },
  {
    routeId: 'underwater-archaeological-site',
    name: 'Arktické pláně',
    description: 'Gratuluji dobrodruhu! Překonal jsi magnetické nástrahy i nostalgii a nalezl ukrytý poklad. Snad ti přitom neumrzly prsty!',
    points: 200,
    position: { x: 96, y: 21 },
  },
];

// Helper function to get route by ID
export function getRouteById(routeId: string): RouteConfig | undefined {
  return ROUTES.find(r => r.routeId === routeId);
}

// Helper function to get all route IDs
export function getAllRouteIds(): string[] {
  return ROUTES.map(r => r.routeId);
}

// Helper function to get route points array for database initialization
export function getRoutePointsArray(): { routeId: string; points: number }[] {
  return ROUTES.map(r => ({ routeId: r.routeId, points: r.points }));
}

export function getTotalPoints(): number {
  return ROUTES.reduce((acc, r) => acc + r.points, 0);
}
