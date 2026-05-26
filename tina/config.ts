import { defineConfig } from 'tinacms';
import type { TinaField } from 'tinacms';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.TINA_BRANCH ||
  process.env.HEAD ||
  'main';

const writingRouter = ({
  document,
}: {
  document: { _sys: { breadcrumbs: string[] } };
}) => `/writing/${document._sys.breadcrumbs.join('/')}/`;

const writingFilename = {
  slugify: (values: Record<string, unknown>) => {
    const title = values?.title;

    if (typeof title !== 'string' || title.trim().length === 0) {
      return 'new-article';
    }

    return title
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};

const writingDefaultItem = () => ({
  title: 'New Article',
  description: 'Short summary for lists, RSS, and search previews.',
  pubDate: new Date().toISOString(),
  draft: true,
  tags: [],
  author: 'Mike Roberts',
});

const writingFields: TinaField[] = [
  {
    type: 'string',
    name: 'title',
    label: 'Title',
    isTitle: true,
    required: true,
  },
  {
    type: 'string',
    name: 'description',
    label: 'Description',
    ui: {
      component: 'textarea',
    },
    required: true,
  },
  {
    type: 'datetime',
    name: 'pubDate',
    label: 'Published Date',
    required: true,
  },
  {
    type: 'datetime',
    name: 'updatedDate',
    label: 'Updated Date',
  },
  {
    type: 'boolean',
    name: 'draft',
    label: 'Draft',
    description: 'Drafts are editable in Tina but hidden from the production writing index, detail pages, and RSS feed.',
  },
  {
    type: 'string',
    name: 'tags',
    label: 'Tags',
    list: true,
    ui: {
      component: 'tags',
    },
  },
  {
    type: 'image',
    name: 'heroImage',
    label: 'Hero Image',
  },
  {
    type: 'string',
    name: 'author',
    label: 'Author',
  },
  {
    type: 'rich-text',
    name: 'body',
    label: 'Body',
    isBody: true,
  },
];

export default defineConfig({
  branch,
  clientId:
    process.env.NEXT_PUBLIC_TINA_CLIENT_ID ||
    process.env.TINA_CLIENT_ID ||
    'configure-tina-client-id',
  token: process.env.TINA_TOKEN || 'configure-tina-token',
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'img',
    },
  },
  schema: {
    collections: [
      {
        name: 'writing',
        label: 'Writing',
        path: 'src/content/writing',
        format: 'md',
        match: {
          include: '**/*',
        },
        ui: {
          router: writingRouter,
          filename: writingFilename,
        },
        defaultItem: writingDefaultItem,
        fields: writingFields,
      },
    ],
  },
});
