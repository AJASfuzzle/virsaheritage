
INSERT INTO public.heritage_sites
  (trail_slug, stop_index, name, place, lat, lng, radius_m, coin_reward)
VALUES
  -- Trail 1: Living Roots & Cloud Kingdoms (Northeast)
  ('living-roots-cloud-kingdoms',  1, 'Double-Decker Living Root Bridge', 'Nongriat, Meghalaya',           25.2548,  91.7138, 120, 25),
  ('living-roots-cloud-kingdoms',  2, 'Mawphlang Sacred Grove',           'Mawphlang, Meghalaya',          25.4439,  91.7558, 200, 25),
  ('living-roots-cloud-kingdoms',  3, 'Nongriat Village',                 'Nongriat, Meghalaya',           25.2570,  91.7160, 150, 25),
  ('living-roots-cloud-kingdoms',  4, 'Majuli Island',                    'Majuli, Assam',                 26.9510,  94.1700, 400, 25),
  ('living-roots-cloud-kingdoms',  5, 'Kamakhya Temple',                  'Guwahati, Assam',               26.1664,  91.7060, 150, 25),
  ('living-roots-cloud-kingdoms',  6, 'Ziro Valley',                      'Ziro, Arunachal Pradesh',       27.5450,  93.8290, 300, 25),
  ('living-roots-cloud-kingdoms',  7, 'Tawang Monastery',                 'Tawang, Arunachal Pradesh',     27.5860,  91.8650, 150, 25),
  ('living-roots-cloud-kingdoms',  8, 'Dzukou Valley',                    'Nagaland-Manipur border',       25.5800,  94.0830, 300, 25),
  ('living-roots-cloud-kingdoms',  9, 'Kisama Heritage Village',          'Kisama, Nagaland',              25.6045,  94.1010, 200, 25),
  ('living-roots-cloud-kingdoms', 10, 'Loktak Lake',                      'Moirang, Manipur',              24.5530,  93.7830, 400, 25),
  ('living-roots-cloud-kingdoms', 11, 'Unakoti',                          'Unakoti, Tripura',              24.3286,  92.0792, 200, 25),
  ('living-roots-cloud-kingdoms', 12, 'Reiek Village',                    'Reiek, Mizoram',                23.6900,  92.6170, 200, 25),

  -- Trail 2: Five Rivers Heritage (Punjab)
  ('five-rivers-heritage',  1, 'Golden Temple',           'Amritsar',           31.6200, 74.8765, 120, 25),
  ('five-rivers-heritage',  2, 'Jallianwala Bagh',        'Amritsar',           31.6207, 74.8800, 120, 25),
  ('five-rivers-heritage',  3, 'Partition Museum',        'Amritsar Town Hall', 31.6240, 74.8770, 100, 25),
  ('five-rivers-heritage',  4, 'Gobindgarh Fort',         'Amritsar',           31.6240, 74.8590, 150, 25),
  ('five-rivers-heritage',  5, 'Ram Tirath Temple',       'near Amritsar',      31.6470, 74.7340, 150, 25),
  ('five-rivers-heritage',  6, 'Pul Kanjari',             'near Wagah',         31.5860, 74.6190, 120, 25),
  ('five-rivers-heritage',  7, 'Virasat-e-Khalsa',        'Anandpur Sahib',     31.2370, 76.5050, 150, 25),
  ('five-rivers-heritage',  8, 'Ropar Wetlands',          'Ropar',              30.9670, 76.5230, 300, 25),
  ('five-rivers-heritage',  9, 'Qila Mubarak',            'Patiala',            30.3390, 76.3870, 120, 25),
  ('five-rivers-heritage', 10, 'Phulkari Craft Cluster',  'Patiala / Nabha',    30.3760, 76.1480, 200, 25),
  ('five-rivers-heritage', 11, 'Rural Haveli Stay',       'Hoshiarpur',         31.5320, 75.9170, 300, 25),
  ('five-rivers-heritage', 12, 'Wagah Border Ceremony',   'Attari-Wagah',       31.6050, 74.5730, 150, 25),

  -- Trail 3: Heart of India Civilisations (Central India)
  ('heart-of-india-civilisations',  1, 'Bhimbetka Rock Shelters',    'Raisen, Madhya Pradesh',     22.9377, 77.6128, 200, 25),
  ('heart-of-india-civilisations',  2, 'Sanchi Stupa',               'Raisen, Madhya Pradesh',     23.4795, 77.7395, 150, 25),
  ('heart-of-india-civilisations',  3, 'Udayagiri Caves',            'Vidisha, Madhya Pradesh',    23.5360, 77.7710, 150, 25),
  ('heart-of-india-civilisations',  4, 'Bhojpur Temple',             'Bhojpur, MP',                23.0930, 77.6160, 120, 25),
  ('heart-of-india-civilisations',  5, 'Gwalior Fort',               'Gwalior, MP',                26.2300, 78.1690, 250, 25),
  ('heart-of-india-civilisations',  6, 'Orchha',                     'Orchha, MP',                 25.3520, 78.6420, 200, 25),
  ('heart-of-india-civilisations',  7, 'Khajuraho Group',            'Khajuraho, MP',              24.8530, 79.9230, 200, 25),
  ('heart-of-india-civilisations',  8, 'Bhedaghat Marble Rocks',     'Jabalpur, MP',               23.1330, 79.8000, 200, 25),
  ('heart-of-india-civilisations',  9, 'Pachmarhi',                  'Pachmarhi, MP',              22.4675, 78.4336, 300, 25),
  ('heart-of-india-civilisations', 10, 'Bastar Tribal Experience',   'Jagdalpur, Chhattisgarh',    19.0830, 82.0289, 250, 25),
  ('heart-of-india-civilisations', 11, 'Sirpur Archaeological Site', 'Mahasamund, Chhattisgarh',   21.3460, 82.1850, 200, 25),
  ('heart-of-india-civilisations', 12, 'Ramgarh Hill & Sita Bengra', 'Surguja, Chhattisgarh',      23.0510, 83.0030, 200, 25)
ON CONFLICT (trail_slug, stop_index) DO UPDATE
SET name        = EXCLUDED.name,
    place       = EXCLUDED.place,
    lat         = EXCLUDED.lat,
    lng         = EXCLUDED.lng,
    radius_m    = EXCLUDED.radius_m,
    coin_reward = EXCLUDED.coin_reward;
