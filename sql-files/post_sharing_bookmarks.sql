create table if not exists post_sharing_bookmarks (
  date_created timestamp with time zone not null,

  user_id uuid references profiles(id),
  post_id bigint references post_sharings(id),
  primary key (user_id, post_id)
);
alter table post_sharing_bookmarks enable row level security;


create policy "Post_sharing_bookmarks are viewable by users who created them."
  on post_sharing_bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own post_sharing_bookmarks."
  on post_sharing_bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own post_sharing_bookmarks."
  on post_sharing_bookmarks for delete
  using ( auth.uid() = user_id );