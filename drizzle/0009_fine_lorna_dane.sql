ALTER TABLE operations ADD `message` text NOT NULL;
ALTER TABLE operations ADD `destination_address` text;
ALTER TABLE operations ADD `previous_operation_id` integer;