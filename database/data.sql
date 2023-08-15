insert into "places" ("placeId", "placeName", "title", "latitude", "longitude", "address")
values
    ('ChIJV5zdDGFZwokRpwGtHx6A2q8', 'Dog Park', 'Park', 37.7749, -122.4194, 'San Francisco, CA' ),
    ('ChIJM8mTvtRZzpQRRI1kO5n7k1o', 'Dog Beach', 'Beach', 32.7486, -117.2476, 'San Diego, CA' );

insert into "bookmarks" ("placeId")
values
    ('ChIJV5zdDGFZwokRpwGtHx6A2q8'),
    ('ChIJM8mTvtRZzpQRRI1kO5n7k1o');
