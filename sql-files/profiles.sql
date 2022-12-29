create table if not exists public.profiles (
  id uuid references auth.users not null on delete cascade,
  role varchar(255) not null,
  email varchar(254) not null,
  username varchar(15) not null,
  name varchar(70),
  quote varchar(255),
  primary key (id)
);
alter table public.profiles add constraint valid_username check ( username ~ '^[a-zA-Z0-9_\-]+$' );
alter table public.profiles add constraint unique_username unique ( username );
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );


