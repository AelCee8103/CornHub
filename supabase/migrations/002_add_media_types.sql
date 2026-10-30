alter table public.watchlists
    add column media_type text not null default 'movie'
        check (media_type in ('movie', 'tv')),
    add column media_id integer;

update public.watchlists
set media_id = movie_id
where media_id is null;

alter table public.watchlists
    alter column media_id set not null,
    alter column movie_id drop not null;

alter table public.watchlists
    drop constraint if exists watchlists_user_id_movie_id_key;

alter table public.watchlists
    add constraint watchlists_user_media_unique unique (user_id, media_type, media_id);

alter table public.playlist_items
    add column media_type text not null default 'movie'
        check (media_type in ('movie', 'tv')),
    add column media_id integer;

update public.playlist_items
set media_id = movie_id
where media_id is null;

alter table public.playlist_items
    alter column media_id set not null,
    alter column movie_id drop not null;

alter table public.playlist_items
    drop constraint if exists playlist_items_playlist_id_movie_id_key;

alter table public.playlist_items
    add constraint playlist_items_playlist_media_unique unique (playlist_id, media_type, media_id);

create index watchlists_user_media_idx
    on public.watchlists(user_id, media_type, media_id);

create index playlist_items_media_idx
    on public.playlist_items(playlist_id, media_type, media_id);
