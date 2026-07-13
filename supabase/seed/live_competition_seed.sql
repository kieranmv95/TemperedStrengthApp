-- Seed the Arena Games live competition stub data.
-- Run after the migration. Safe to re-run: clears existing rows first.

delete from public.competition_entry;
delete from public.active_competition;

insert into public.active_competition (
  id,
  title,
  description,
  additional_info,
  link_text,
  order_by,
  theme_border_color,
  theme_bg_color,
  theme_copy_color,
  theme_link_color,
  theme_link_text_color,
  active_in_test,
  active_in_production
)
values (
  1,
  'Arena Games Live Competition',
  'Get down to the Tempered Strength Vendor Stand and join the competition.',
  'The competition is a max grißp strength competition, try as many times as you want, how hard can you squeeze the Grip Strengt Tester',
  'View The Leaderboard',
  'weight',
  '#FF3801',
  '#FF3801',
  '#000000',
  '#000000',
  '#ffffff',
  true,
  false
);

insert into public.competition_entry (
  competition_id,
  name,
  score,
  category
)
values
  (1, 'Alex Carter', 142, 'Male'),
  (1, 'Sam O''Neill', 128, 'Male'),
  (1, 'Chris Nguyen', 121, 'Male'),
  (1, 'Jordan Lee', 95, 'Female'),
  (1, 'Mia Brooks', 88, 'Female'),
  (1, 'Taylor Shaw', 82, 'Female');
