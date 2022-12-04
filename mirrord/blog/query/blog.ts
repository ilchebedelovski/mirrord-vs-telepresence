import { query } from 'iql';

export interface BlogPostPreview {
  id: string,
  title: string,
}

export const listBlogPreviews = query<BlogPostPreview, { authorised?: boolean }>`
SELECT id, title
  FROM public.blogposts
  ${(_, { authorised }) => !authorised ? 'WHERE published = true' : ''};
`;

export interface BlogPost {
  id: string,
  title: string,
  content: string,
}

export const findBlogPreviews = query<BlogPost, { id: string, authorised?: boolean }>`
SELECT id, title, content
  FROM public.blogposts
  WHERE id = ${'id'}
    ${(_, { authorised }) => !authorised ? 'AND published = true' : ''};
`;
