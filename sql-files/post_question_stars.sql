create table if not exists post_question_stars (
  date_created timestamp with time zone not null,

  user_id uuid references profiles(id),
  post_id bigint references post_questions(id),
  primary key (user_id, post_id)
);
alter table post_question_stars enable row level security;


create policy "Public post_question_stars are viewable by everyone."
  on post_question_stars for select
  using ( true );

create policy "Users can insert their own post_question_stars."
  on post_question_stars for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own post_question_stars."
  on post_question_stars for delete
  using ( auth.uid() = user_id );