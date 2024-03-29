/* Load MySQL with RTTM Data

   This is not meant to be run as a normal SQL file. It's more of a step-by-step of how I got the
   data in MySQL
*/

CREATE DATABASE blued;

mysql -u root -p blued < ~/code/MassDOTHack/MassDOT-RTTM-Data/MassDOT_pairs_10-1-12_to_1-1-13.sql
mysql -u root -p -U blued --force < ~/code/MassDOTHack/MassDOT-RTTM-Data/MassDOT_pairs_10-1-12_to_1-1-13.sql
mysql -u root -U blued --force < ~/code/MassDOTHack/MassDOT-RTTM-Data/MassDOT_pairs_4-1-13_to_6-1-13.sql
mysql -u root -U blued --force < ~/code/MassDOTHack/MassDOT-RTTM-Data/MassDOT_pairs_6-1-12_to_10-1-12.sql
mysql -u root -U blued --force < ~/code/MassDOTHack/MassDOT-RTTM-Data/MassDOT_pairs_6-1-13_to_8-1-13.sql
mysql -u root -U blued --force < ~/code/MassDOTHack/MassDOT-RTTM-Data/MassDOT_pairs_8-1-13_to_10-1-13.sql

/* Load MySQL with pair_definitions.csv */

CREATE TABLE pair_definitions
(pair_id integer, 
Description varchar(2000), 
Direction varchar(2000), 
Origin varchar(2000), 
Destination varchar(2000),
Distance float);


-- Get out of MySQL and restart using this argument:
mysql -u tableau -p --local-infile blued

-- SQL Query
load data local infile '/home/tyler/code/MassDOThack/Road_RTTM_Volume/pair_definitions.csv' 
into table pair_definitions 
fields terminated by ','
enclosed by '"'
lines terminated by '\n'
IGNORE 1 LINES
(pair_id, Description, Direction, Origin, Destination, Distance)
;

