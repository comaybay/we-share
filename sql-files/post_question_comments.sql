create table if not exists post_question_comments (
  id bigint primary key generated by default as identity,
  date_created timestamp with time zone not null default current_timestamp, 
  date_last_updated timestamp with time zone, 
  text_content varchar(30000) not null,
  content varchar not null,

  author_id uuid references profiles(id) not null,
  parent_comment_id bigint references post_question_comments(id),
  top_level_comment_id bigint references post_question_comments(id),
  post_id bigint references post_questions(id) not null
);
alter table public.post_question_comments enable row level security;


create policy "Public post_question_comments are viewable by everyone."
  on post_question_comments for select
  using ( true );

create policy "Users can insert their own post_question_comments."
  on post_question_comments for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own post_question_comments."
  on post_question_comments for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own post_question_comments."
  on post_question_comments for delete
  using ( auth.uid() = author_id );