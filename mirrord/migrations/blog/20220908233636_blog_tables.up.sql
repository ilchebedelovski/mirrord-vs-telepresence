CREATE TABLE public.blogposts
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 100 MINVALUE 100 ),
    title text NOT NULL,
    content text NOT NULL,
    published boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.blogposts
  OWNER to postgres;
