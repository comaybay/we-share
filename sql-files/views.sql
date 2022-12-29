create or replace view view_post_question_top_level_comments as 
select post_question_comments.id, post_id, date_created, date_last_updated, content, author_id, profiles.username as author_username, 
  (
    select COUNT(*) from post_question_comments as replies
    where replies.top_level_comment_id = post_question_comments.id 
  ) as reply_count,
  (
    select COUNT(*) from post_question_comment_stars 
    where post_question_comment_stars.comment_id = post_question_comments.id
  ) as star_count
from post_question_comments inner join profiles on post_question_comments.author_id = profiles.id
where post_question_comments.top_level_comment_id IS NULL


create or replace view view_post_sharing_top_level_comments as 
select post_sharing_comments.id, post_id, date_created, date_last_updated, content, author_id, profiles.username as author_username, 
  (
    select COUNT(*) from post_sharing_comments as replies
    where replies.top_level_comment_id = post_sharing_comments.id 
  ) as reply_count,
  (
    select COUNT(*) from post_sharing_comment_stars 
    where post_sharing_comment_stars.comment_id = post_sharing_comments.id
  ) as star_count
from post_sharing_comments inner join profiles on post_sharing_comments.author_id = profiles.id
where post_sharing_comments.top_level_comment_id IS NULL


create or replace view view_post_team_top_level_comments as 
select post_team_comments.id, post_id, date_created, date_last_updated, content, author_id, profiles.username as author_username, 
  (
    select COUNT(*) from post_team_comments as replies
    where replies.top_level_comment_id = post_team_comments.id 
  ) as reply_count
from post_team_comments inner join profiles on post_team_comments.author_id = profiles.id
where post_team_comments.top_level_comment_id IS NULL


create or replace view view_user_stats as 
select
  id, username, name, quote, 
  (select COUNT(*) from post_question_stars as qs inner join post_questions as q 
    on qs.post_id = q.id and q.author_id = p.id) 
    as question_star_count,
  (select COUNT(*) from post_question_comment_stars as qcs inner join post_question_comments as qc 
    on qcs.comment_id = qc.id and qc.author_id = p.id) 
    as question_comment_star_count,
  (select COUNT(*) from post_questions as q inner join post_question_comments as qc
    on q.favorite_answer_id = qc.id and qc.author_id = p.id) 
    as favorite_answer_count,
  (select COUNT(*) from post_sharing_stars as ss inner join post_sharings as s 
    on ss.post_id = s.id and s.author_id = p.id) 
    as sharing_star_count,
  (select COUNT(*) from post_sharing_comment_stars as scs inner join post_sharing_comments sc
    on scs.comment_id = sc.id and sc.author_id = p.id) 
    as sharing_comment_star_count,
  (select COUNT(*) from post_sharing_bookmarks as sb inner join post_sharings s
    on sb.post_id = s.id and s.author_id = p.id) 
    as bookmark_count
from profiles as p
