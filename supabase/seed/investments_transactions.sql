-- ============================================================
-- A-FUND — Seed : Investissements & Transactions (user démo)
-- User : jb.kouame@gmail.com
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- INVESTISSEMENTS
-- ─────────────────────────────────────────────────────────────
insert into investments (
  id, user_id, campaign_id, montant, roi_expected, roi_actual,
  date_investissement, date_retour_prev, status, created_at
) values

(
  'i0000001-0000-0000-0000-000000000001',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  (select id from campaigns where slug = 'tomates-cerises-bio-2024'),
  500000, 20, null,
  '2024-03-05', '2025-07-15', 'actif',
  '2024-03-05 00:00:00+00'
),
(
  'i0000002-0000-0000-0000-000000000002',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  (select id from campaigns where slug = 'mais-hybride-nzi-2024'),
  1000000, 22, null,
  '2024-01-20', '2025-06-20', 'actif',
  '2024-01-20 00:00:00+00'
),
(
  'i0000003-0000-0000-0000-000000000003',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  (select id from campaigns where slug = 'riz-paddy-comoe-2024'),
  750000, 17, 17.5,
  '2023-12-10', '2024-04-30', 'termine',
  '2023-12-10 00:00:00+00'
),
(
  'i0000004-0000-0000-0000-000000000004',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  (select id from campaigns where slug = 'anacarde-cote-ouest-2024'),
  2000000, 18, null,
  '2024-02-15', '2025-07-30', 'actif',
  '2024-02-15 00:00:00+00'
)

on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- TRANSACTIONS
-- ─────────────────────────────────────────────────────────────
insert into transactions (
  id, user_id, type, montant, status, description,
  reference, methode_paiement, campaign_id, created_at
) values

(
  't0000001-0000-0000-0000-000000000001',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  'depot', 1000000, 'valide',
  'Dépôt Orange Money',
  'DEP-2024-001234', 'orange_money', null,
  '2024-03-01 00:00:00+00'
),
(
  't0000002-0000-0000-0000-000000000002',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  'investissement', 500000, 'valide',
  'Investissement - Tomates cerises bio',
  'INV-2024-000456', null,
  (select id from campaigns where slug = 'tomates-cerises-bio-2024'),
  '2024-03-05 00:00:00+00'
),
(
  't0000003-0000-0000-0000-000000000003',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  'roi', 131250, 'valide',
  'ROI - Riz paddy Comoé (17.5%)',
  'ROI-2024-000789', null,
  (select id from campaigns where slug = 'riz-paddy-comoe-2024'),
  '2024-05-02 00:00:00+00'
),
(
  't0000004-0000-0000-0000-000000000004',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  'depot', 2000000, 'valide',
  'Dépôt Wave',
  'DEP-2024-005678', 'wave', null,
  '2024-02-10 00:00:00+00'
),
(
  't0000005-0000-0000-0000-000000000005',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  'investissement', 1000000, 'valide',
  'Investissement - Maïs hybride N''Zi',
  'INV-2024-000891', null,
  (select id from campaigns where slug = 'mais-hybride-nzi-2024'),
  '2024-01-20 00:00:00+00'
),
(
  't0000006-0000-0000-0000-000000000006',
  (select id from auth.users where email = 'jb.kouame@gmail.com'),
  'retrait', 500000, 'valide',
  'Retrait Orange Money',
  'WIT-2024-000123', 'orange_money', null,
  '2024-04-15 00:00:00+00'
)

on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- MISE À JOUR DU PROFIL INVESTISSEUR
-- ─────────────────────────────────────────────────────────────
update profiles
set
  solde_wallet  = 2450000,
  total_investi = 12500000,
  total_roi     = 2625000
where email = 'jb.kouame@gmail.com';
