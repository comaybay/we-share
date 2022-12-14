create table if not exists post_sharing_stars (
  date_created timestamp with time zone default current_timestamp,

  user_id uuid references profiles(id),
  post_id bigint not null references post_sharings(id) on delete cascade,
  primary key (user_id, post_id)
);
alter table post_sharing_stars enable row level security;


create policy "Public post_sharing_stars are viewable by everyone."
  on post_sharing_stars for select
  using ( true );

create policy "Users can insert their own post_sharing_stars."
  on post_sharing_stars for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own post_sharing_stars."
  on post_sharing_stars for delete
  using ( auth.uid() = user_id );