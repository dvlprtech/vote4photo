
update contest set 
    end_timestamp = 1707945673915,
    status = 'active',
    winning_photo_id = null,
    user_draw_winning_id = null,
    total_prize = null
where id = 1;

delete from operations;