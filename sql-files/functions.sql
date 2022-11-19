create or replace function post_questions_count_duplicated_slug(_author_id uuid, _slug varchar)
returns int 
language sql 
as $$  
  select count(pq.id)
  from post_questions as pq
  where pq.author_id = _author_id and (pq.slug = _slug or pq.slug like concat(_slug, '--%')) ;
$$; 

create or replace function post_question_stars_count(post_questions) 
returns bigint
as $$
  select count(*) from post_question_stars where post_id = $1.id;
$$ stable language sql;
