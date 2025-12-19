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
    name: 'Ancient Temple Ruins',
    description: 'You\'ve discovered the ancient temple ruins! The walls whisper secrets of forgotten civilizations.',
    points: 800,
    position: { x: 25, y: 20 },
  },
  {
    routeId: 'forbidden-crystal-cave',
    name: 'Forbidden Crystal Cave',
    description: 'The forbidden crystal cave reveals its treasures! The crystals shimmer with otherworldly light.',
    points: 700,
    position: { x: 75, y: 25 },
  },
  {
    routeId: 'lost-city-of-gold',
    name: 'Lost City of Gold',
    description: 'The lost city of gold stands before you! Legends speak of untold riches hidden within.',
    points: 650,
    position: { x: 30, y: 50 },
  },
  {
    routeId: 'mysterious-jungle-path',
    name: 'Mysterious Jungle Path',
    description: 'You\'ve found the mysterious jungle path! Ancient markers guide your way through the dense foliage.',
    points: 650,
    position: { x: 70, y: 55 },
  },
  {
    routeId: 'hidden-treasure-vault',
    name: 'Hidden Treasure Vault',
    description: 'The hidden treasure vault opens! Centuries of accumulated wealth glimmer in the torchlight.',
    points: 600,
    position: { x: 20, y: 75 },
  },
  {
    routeId: 'sacred-mountain-peak',
    name: 'Sacred Mountain Peak',
    description: 'You\'ve reached the sacred mountain peak! The view is breathtaking, and the air is filled with ancient energy.',
    points: 600,
    position: { x: 50, y: 15 },
  },
  {
    routeId: 'desert-oasis-secret',
    name: 'Desert Oasis Secret',
    description: 'The desert oasis secret is revealed! A hidden spring flows with crystal-clear water.',
    points: 550,
    position: { x: 80, y: 70 },
  },
  {
    routeId: 'underwater-archaeological-site',
    name: 'Underwater Archaeological Site',
    description: 'You\'ve discovered the underwater archaeological site! Sunken treasures await discovery.',
    points: 450,
    position: { x: 45, y: 80 },
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

