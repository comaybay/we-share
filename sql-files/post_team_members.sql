create table if not exists post_team_members (
  date_created timestamp with time zone not null default current_timestamp, 

  post_team_id bigint references post_teams(id) not null,
  member_id uuid references profiles(id) not null
  primary key (post_team_id, member_id)
);
alter table public.post_team_members enable row level security;


create policy "Public post_team_members are viewable by everyone."
  on post_team_members for select
  using ( true );

create policy "Authors can insert their own post_team_members."
  on post_team_members for insert
  with check ( auth.uid() = (select author_id from post_teams where post_teams.id = post_team_id) );

create policy "Authors can update their own post_team_members."
  on post_team_members for update
  using( auth.uid() = (select author_id from post_teams where post_teams.id = post_team_id) );

create policy "Authors can delete their own post_team_members."
  on post_team_members for delete
  using( auth.uid() = (select author_id from post_teams where post_teams.id = post_team_id) );
