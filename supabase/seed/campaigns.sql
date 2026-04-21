-- ============================================================
-- A-FUND — Seed : Campagnes
-- À exécuter via : Supabase Dashboard > SQL Editor
-- ou : supabase db reset (inclut automatiquement supabase/seed.sql)
-- ============================================================

insert into campaigns (
  id, titre, slug, description, description_courte,
  produit, variete, region, ville, lat, lng,
  cooperative_nom, cooperative_members,
  surface, rendement_attendu,
  montant_cible, montant_leve, nombre_investisseurs,
  roi_min, roi_max, duree_jours,
  date_debut, date_fin, date_recolte,
  status, risque, image,
  acheteur, prix_garanti_kg, quantite_contrat_tonnes,
  agronome, score_agronomique, assurance, tags, created_at
) values

-- c001 : Tomates cerises bio
(
  'c0000001-0000-0000-0000-000000000001',
  'Tomates cerises bio - Campagne printemps 2024',
  'tomates-cerises-bio-2024',
  'La Coopérative Agri-Bouaké lance sa 4ème campagne de production de tomates cerises biologiques certifiées. Nos terres argilo-limoneuses du centre de la Côte d''Ivoire offrent des conditions idéales pour une production de qualité premium. Nous travaillons avec un agronome senior certifié et avons un contrat d''achat ferme avec SOCOCÉ pour l''ensemble de la récolte.',
  'Production de tomates cerises bio avec contrat d''achat garanti par SOCOCÉ. Irrigation goutte-à-goutte installée.',
  'Tomates', 'Tomates cerises bio', 'Bouaké', 'Bouaké', 7.6833, -5.0333,
  'Coopérative Agri-Bouaké', 45,
  12, 180,
  8500000, 6120000, 127,
  18, 22, 90,
  '2024-03-01', '2025-05-30', '2025-07-15',
  'levee', 'faible',
  'https://images.unsplash.com/photo-1592997571659-0b21ff64313b?w=800',
  'SOCOCÉ', 950, 160,
  'Dr. Kouassi Emmanuel', 92, true,
  array['bio', 'certifié', 'irrigation'],
  '2024-02-15 00:00:00+00'
),

-- c002 : Maïs hybride
(
  'c0000002-0000-0000-0000-000000000002',
  'Maïs hybride - Vallée du N''Zi 2024',
  'mais-hybride-nzi-2024',
  'La Coopérative des Producteurs de la Vallée du N''Zi présente sa campagne de production de maïs hybride haute rendement. Les terres alluvionnaires de la vallée bénéficient d''une fertilité naturelle exceptionnelle. Contrat d''achat ferme avec Nestlé CI.',
  'Maïs hybride haute rendement dans la vallée du N''Zi avec contrat Nestlé CI.',
  'Maïs', 'Maïs hybride SEEDCO', 'Divo', 'Divo', 5.8364, -5.3573,
  'Coop. Vallée du N''Zi', 67,
  35, 2450,
  15000000, 15000000, 234,
  20, 25, 110,
  '2024-01-15', '2025-04-30', '2025-06-20',
  'production', 'faible',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  'Nestlé CI', 185, 2200,
  'M. Bamba Seydou', 88, true,
  array['hybride', 'haute-rendement'],
  '2024-01-01 00:00:00+00'
),

-- c003 : Sésame blanc
(
  'c0000003-0000-0000-0000-000000000003',
  'Sésame blanc export - Région de Korhogo',
  'sesame-blanc-korhogo-2024',
  'La Coopérative Sésame du Nord lance sa campagne annuelle de production de sésame blanc destiné à l''export vers l''Asie. La région de Korhogo bénéficie d''un climat semi-aride idéal. Nos producteurs appliquent les normes GlobalGAP pour les marchés japonais et coréens.',
  'Sésame blanc certifié GlobalGAP pour export vers le marché japonais et coréen.',
  'Sésame', 'Sésame blanc HF', 'Korhogo', 'Korhogo', 9.4580, -5.6294,
  'Coop. Sésame du Nord', 89,
  80, 480,
  12000000, 4200000, 89,
  22, 28, 120,
  '2024-04-01', '2025-06-30', '2025-09-15',
  'levee', 'modere',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
  'CARGILL Export', 1200, 400,
  'M. Coulibaly Ibrahim', 85, true,
  array['export', 'GlobalGAP', 'Asie'],
  '2024-03-15 00:00:00+00'
),

-- c004 : Anacarde premium
(
  'c0000004-0000-0000-0000-000000000004',
  'Anacarde premium - Côte Ouest 2024',
  'anacarde-cote-ouest-2024',
  'Rejoignez la Coopérative Anacarde Ouest pour notre campagne de production d''anacarde de qualité premium. La Côte d''Ivoire est le 1er exportateur mondial d''anacarde brut. Notre coopérative produit des noix W210 et W240 destinées aux transformateurs locaux et à l''export.',
  'Noix de cajou W210/W240 premium pour transformateurs locaux et export international.',
  'Anacarde', 'Anacarde W210/W240', 'San-Pédro', 'San-Pédro', 4.7485, -6.6363,
  'Coop. Anacarde Ouest', 123,
  200, 600,
  25000000, 18750000, 312,
  15, 20, 180,
  '2024-02-01', '2025-04-30', '2025-07-30',
  'production', 'faible',
  'https://images.unsplash.com/photo-1602575668981-a5a68b37a83b?w=800',
  'OLAM CI', 450, 550,
  'Mme. Touré Aïssatou', 94, true,
  array['premium', 'export', 'W210'],
  '2024-01-20 00:00:00+00'
),

-- c005 : Cacao
(
  'c0000005-0000-0000-0000-000000000005',
  'Cacao fin de goût - Région d''Abengourou',
  'cacao-abengourou-2024',
  'Investissez dans la production de cacao fin de goût certifié Rainforest Alliance. Abengourou est reconnu pour la qualité aromatique exceptionnelle de ses fèves. Notre programme de fermentation contrôlée garantit un profil aromatique premium apprécié par les chocolatiers européens.',
  'Cacao certifié Rainforest Alliance avec fermentation contrôlée pour chocolatiers européens.',
  'Cacao', 'Cacao Forestaro', 'Abengourou', 'Abengourou', 6.7290, -3.4962,
  'Coop. Cacao Centre-Est', 156,
  150, 375,
  20000000, 1500000, 28,
  18, 23, 150,
  '2025-05-01', '2025-08-31', '2025-11-30',
  'levee', 'modere',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800',
  'Barry Callebaut', 3200, 300,
  'Dr. N''Dri Jean-Paul', 96, true,
  array['Rainforest Alliance', 'premium', 'Europe'],
  '2024-04-15 00:00:00+00'
),

-- c006 : Riz paddy
(
  'c0000006-0000-0000-0000-000000000006',
  'Riz paddy - Plaines de la Comoé',
  'riz-paddy-comoe-2024',
  'La Coopérative Rizicole de la Comoé développe la production rizicole irriguée dans les plaines alluviales de la Comoé. Dans le cadre du Programme National de Développement Rizicole, notre coopérative bénéficie d''un accompagnement technique de l''ANADER.',
  'Riz paddy irrigué avec accompagnement ANADER dans le programme national rizicole.',
  'Riz', 'Riz IR841', 'Abengourou', 'Aboisso', 5.4669, -3.2076,
  'Coop. Rizicole Comoé', 78,
  60, 2400,
  9000000, 9000000, 145,
  16, 19, 100,
  '2023-12-01', '2024-02-29', '2024-04-30',
  'terminee', 'faible',
  'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800',
  'Société OLICO', 220, 2200,
  'M. Kassi Théodore', 91, false,
  array['irrigué', 'ANADER'],
  '2023-11-15 00:00:00+00'
),

-- c007 : Soja certifié
(
  'c0000007-0000-0000-0000-000000000007',
  'Soja certifié - Nord Côte d''Ivoire',
  'soja-nord-ci-2024',
  'La Coopérative Soja du Nord produit du soja certifié non-OGM destiné aux huileries industrielles de la sous-région. Avec la montée en puissance de l''industrie agroalimentaire en Afrique de l''Ouest, la demande en soja local est en forte croissance.',
  'Soja certifié non-OGM pour huileries industrielles ouest-africaines. Demande croissante.',
  'Soja', 'Soja TGx 1835-10E', 'Korhogo', 'Ferkessédougou', 9.5926, -5.1954,
  'Coop. Soja du Nord', 56,
  45, 1350,
  11000000, 7700000, 156,
  17, 21, 95,
  '2024-03-15', '2025-06-15', '2025-08-30',
  'levee', 'faible',
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800',
  'COSMIVOIRE', 350, 1200,
  'Mme. Diallo Fatoumata', 89, true,
  array['non-OGM', 'certifié'],
  '2024-03-01 00:00:00+00'
)

on conflict (id) do nothing;
