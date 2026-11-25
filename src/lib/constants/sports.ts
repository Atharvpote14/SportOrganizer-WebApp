// Supported sports for Sport Organizer
export const SPORTS = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' },
  { id: 'table_tennis', name: 'Table Tennis', icon: '🏓' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'rugby', name: 'Rugby', icon: '🏉' },
] as const

export type SportId = typeof SPORTS[number]['id']

export const getSportById = (id: string) => {
  return SPORTS.find(sport => sport.id === id)
}

export const getSportName = (id: string) => {
  const sport = getSportById(id)
  return sport?.name || id
}
