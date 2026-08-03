alter table public.promo_email_templates
  add column if not exists image_url text not null default '',
  add column if not exists background_color text not null default '#ffffff',
  add column if not exists text_color text not null default '#334155',
  add column if not exists accent_color text not null default '#004fe6';

do $$ begin
  alter table public.promo_email_templates
    add constraint promo_email_templates_background_color_check
    check (background_color ~ '^#[0-9a-fA-F]{6}$');
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.promo_email_templates
    add constraint promo_email_templates_text_color_check
    check (text_color ~ '^#[0-9a-fA-F]{6}$');
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.promo_email_templates
    add constraint promo_email_templates_accent_color_check
    check (accent_color ~ '^#[0-9a-fA-F]{6}$');
exception when duplicate_object then null;
end $$;

