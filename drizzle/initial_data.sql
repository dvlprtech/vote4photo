delete from "user";
insert into "user" 
(email, password, role, full_name, remaining_votes, funds, last_used_account, creation_timestamp) 
values 
('robertosanchez@uoc.edu', 'dd091e0de37e0b8e818655e5ea126a6e$WdpUdCxjZG0CVglUgZtyQBP8CL2DGtES6Fi8oSb+rNg=', 
'admin', 'Admin', 0, 0, '0x0000000000000000000000000000000000000000', CURRENT_TIMESTAMP);

delete from "votes_pricing";
insert into "votes_pricing" (num_votes, price) values (1, 0.5);
insert into "votes_pricing" (num_votes, price) values (10, 0.35);
insert into "votes_pricing" (num_votes, price) values (35, 0.25);
insert into "votes_pricing" (num_votes, price) values (100, 0.15);

