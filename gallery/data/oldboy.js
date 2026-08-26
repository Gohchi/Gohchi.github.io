export default [
  {
    "id": "oldboy001",
    "title": "Hammer Fight",
    "mood": ["intense", "claustrophobic"],
    "visualTags": ["hallway", "single-take", "muted-colors"],
    "extraTags": ["cult-classic", "many-characters"],
    "image":
      "./images/oldboy-hammer-fight.png"
  },
  {
    "id": "oldboy002",
    "title": "Police Station Confrontation",
    "mood": ["intense", "claustrophobic"],
    "visualTags": ["interior", "confrontational", "faces"],
    "extraTags": ["four-characters"],
    "image":
      "./images/oldboy-police-station.png"
  },
  {
    "id": "oldboy003",
    "title": "TV Touch",
    "mood": ["intense", "claustrophobic"],
    "visualTags": ["interior", "confrontational", "faces"],
    "extraTags": ["single-characters"],
    "image":
      "./images/oldboy-tv-touch.png"
  },
  {
    "id": "oldboy004",
    "title": "Sunglasses",
    "mood": ["intense", "fashionable"],
    "visualTags": ["close-up", "accessory", "dark"],
    "extraTags": ["single-characters"],
    "image":
      "./images/oldboy-sunglasses.png"
  },
  {
    "id": "oldboy005",
    "title": "Boss Elevator",
    "mood": ["intense", "claustrophobic"],
    "visualTags": ["interior", "confrontational", "faces"],
    "extraTags": ["three-characters", "elevator"],
    "image":
      "./images/oldboy-boss-elevator.png"
  },
  {
    "id": "oldboy006",
    "title": "Elevator",
    "mood": ["intense", "claustrophobic"],
    "visualTags": ["parking", "confrontational"],
    
    "extraTags": ["many-characters", "elevator"],
    "image":
      "./images/oldboy-elevator.png"
  }
].map(img => ({
  "show": "Oldboy",
  "year": 2003,
  "director": "Park Chan-wook",
  "movieTags": ["thriller", "action", "mystery", "cult-classic"],
  ...img,
}));