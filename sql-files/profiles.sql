create table if not exists public.profiles (
  id uuid references auth.users not null,
  username varchar(15),
  name varchar(70),
  quote varchar(255),
  primary key (id)
);
alter table public.profiles add constraint valid_username check ( username ~ '^[a-zA-Z0-9_\-]+$' );
alter table public.profiles add constraint unique_username unique;

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

-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();