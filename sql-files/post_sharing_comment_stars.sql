create table if not exists post_sharing_comment_stars (
  date_created timestamp with time zone not null default current_timestamp,

  user_id uuid references profiles(id),
  comment_id bigint references post_sharing_comments(id),
  primary key (user_id, comment_id)
);
alter table post_sharing_comment_stars enable row level security;


create policy "Public post_sharing_comment_stars are viewable by everyone."
  on post_sharing_comment_stars for select
  using ( true );

create policy "Users can insert their own post_sharing_comment_stars."
  on post_sharing_comment_stars for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own post_sharing_comment_stars."
  on post_sharing_comment_stars for delete
  using ( auth.uid() = user_id );