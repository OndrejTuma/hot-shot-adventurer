export interface RouteConfig {
  routeId: string;
  name: string;
  description: string;
  points: number;
  position: { x: number; y: number }; // Percentage positions for fixed aspect ratio
}

export const ROUTES: RouteConfig[] = [
  {
    routeId: 'ancient-temple-ruins',
    name: 'Energetický chrám',
    description: 'Energetický chrám je zde! Stěny mluví tajemstvím zapomenutých civilizací.',
    points: 800,
    position: { x: 4, y: 57 },
  },
  {
    routeId: 'forbidden-crystal-cave',
    name: 'Kamenitá jeskyně',
    description: 'Kamenitá jeskyně odhaluje své poklady! Krystaly svítí světlem z jiného světa.',
    points: 200,
    position: { x: 62, y: 54 },
  },
  {
    routeId: 'lost-city-of-gold',
    name: 'Botanická zahrada',
    description: 'Botanická zahrada je zde! Legenda mluví o nepoznávaných pokladech skrytých uvnitř.',
    points: 300,
    position: { x: 12, y: 97 },
  },
  {
    routeId: 'mysterious-jungle-path',
    name: 'Modlitební místo',
    description: 'Modlitební místo je zde! Staré značky vás provedou skrytými cestami.',
    points: 1600,
    position: { x: 52, y: 95 },
  },
  {
    routeId: 'hidden-treasure-vault',
    name: 'Dřevěná bašta',
    description: 'Dřevěná bašta je zde! Stáří sbíraného bohatství svítí v oslíčku.',
    points: 600,
    position: { x: 92, y: 73 },
  },
  {
    routeId: 'sacred-mountain-peak',
    name: 'Elektrizující hory',
    description: 'Elektrizující hory jsou zde! Vzduch je plný starobylé energie.',
    points: 300,
    position: { x: 47, y: 50 },
  },
  {
    routeId: 'desert-oasis-secret',
    name: 'Posvátné vodopády',
    description: 'Posvátné vodní zdroje jsou zde! Skryté prameny tečou s krystalově čistou vodou.',
    points: 1000,
    position: { x: 62.5, y: 9 },
  },
  {
    routeId: 'underwater-archaeological-site',
    name: 'Arktické pláně',
    description: 'You\'ve discovered the underwater archaeological site! Sunken treasures await discovery.',
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

