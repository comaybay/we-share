create or replace function post_questions_count_duplicated_slug(_author_id uuid, _slug varchar)
returns int 
language sql 
as $$  
  select count(pq.id)
  from post_questions as pq
  where pq.author_id = _author_id and (pq.slug = _slug or pq.slug like concat(_slug, '--%')) ;
$$; 

