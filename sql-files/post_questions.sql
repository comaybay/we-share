create table if not exists post_questions (
  id bigint primary key generated by default as identity,
  date_created timestamp with time zone not null, 
  date_last_updated timestamp with time zone, 
  title varchar(255) not null,
  slug varchar(255) not null,
  text_content varchar(30000) not null,
  content varchar(300000) not null,
  topics varchar(50)[] not null,
  view_count bigint not null default 0,

  favorite_answer_id bigint references post_question_comments(id),
  author_id uuid references profiles(id) not null
);
alter table post_questions enable row level security;


create policy "Public post_questions are viewable by everyone."
  on post_questions for select
  using ( true );

create policy "Users can insert their own post_questions."
  on post_questions for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own post_questions."
  on post_questions for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own post_questions."
  on post_questions for delete
  using ( auth.uid() = author_id );