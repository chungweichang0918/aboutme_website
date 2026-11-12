const field = (name, widget = 'string', options = {}) => ({
  label: name.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()),
  name, widget, ...options,
});
const optional = (name, widget = 'string', options = {}) => field(name, widget, { required: false, ...options });
const select = (name, options, extra = {}) => field(name, 'select', { options, ...extra });
const key = (name) => field(name, 'string', { pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Use lowercase ASCII letters, digits and single hyphens.'] });
const date = (name, required = true) => field(name, 'datetime', { required, date_format: 'YYYY-MM-DD', time_format: false, format: 'YYYY-MM-DD' });
const locales = ['zh-tw','en','ja'];
const common = [
  key('contentId'), key('slug'), select('locale', locales, { default: 'zh-tw' }), field('title'),
  field('summary', 'text', { pattern: ['^[\\s\\S]{1,350}$', 'Enter up to 350 characters.'] }),
  date('date'), date('updatedAt', false),
  field('featured', 'boolean', { default: false }), field('draft', 'boolean', { default: true }),
  select('visibility', ['private','public'], { default: 'private' }),
  optional('tags', 'list'), optional('cover', 'image'), optional('coverAlt'),
  optional('links', 'list', { fields: [field('label'), field('url')] }),
];
const experience = [field('organization'),field('role'),optional('team'),date('endDate',false)];
const content = [
  ['projects','Projects',[select('category',['AI / Machine Learning','Cybersecurity','IoT','Embedded Systems','Web Development','Software Engineering','Others']),
    select('status',['in-progress','completed','maintained','archived']),optional('github'),optional('demo')]],
  ['research','Research',[field('category'),select('status',['published','accepted','under-review','preprint','unpublished','in-progress']),
    optional('authors','list'),optional('advisor'),optional('doi'),optional('citation','text')]],
  ['awards','Awards',[optional('organizer'),field('category'),optional('project'),field('role'),select('status',['planned','participant','shortlisted','finalist','winner','other'])]],
  ['skills','Skills',[select('category',['Programming Languages','Frameworks & Libraries','AI & Machine Learning','Cybersecurity','IoT & Embedded Systems','Databases','Cloud & DevOps','Developer Tools']),optional('projects','list'),optional('icon','image')]],
  ['experience','Experience',[...experience,select('status',['current','completed'])]],
  ['education','Education',[...experience,select('status',['enrolled','graduated','expected'])]],
  ['posts','Posts',[field('category')]],
  ['certifications','Certifications',[field('issuer'),date('expires',false),optional('verification'),optional('credentialId'),select('status',['earned','in-progress','planned','expired'])]],
  ['timeline','Timeline',[optional('milestone')]],
  ['now','Now',[optional('category')]],
];
const translations = (name, required = true) => field(name, 'object', {
  required, fields: locales.map((locale) => field(locale, 'text')),
});

export function cmsConfig({ origin, local, branch = 'main' }) {
  return {
    backend: {
      name: 'github', repo: 'chungweichang0918/aboutme_website', branch,
      base_url: origin, auth_endpoint: 'api/auth/login', auth_scope: 'public_repo',
    },
    publish_mode: 'editorial_workflow',
    ...(local ? { local_backend: { url: 'http://localhost:8081/api/v1', allowed_hosts: ['127.0.0.1'] } } : {}),
    media_folder: 'src/content/media',
    public_folder: '/media',
    site_url: origin,
    collections: [
      ...content.map(([name, label, fields]) => ({
        name, label, folder: 'src/content/' + name, create: true,
        identifier_field: 'slug', slug: '{{fields.locale}}-{{fields.slug}}',
        extension: name === 'posts' ? 'mdx' : 'md', format: 'frontmatter',
        summary: '{{title}} · {{locale}}',
        editor: { preview: false },
        view_filters: locales.map((locale) => ({ label: locale, field: 'locale', pattern: '^' + locale + '$' })),
        fields: [...common, ...fields, optional('body','markdown',{ modes: ['raw'] })],
      })),
      { name: 'settings', label: 'Site settings', files: [{
        name: 'site', label: 'Profile and website', file: 'src/content/settings.json', format: 'json',
        fields: [
          field('siteName'),field('englishName'),field('localName'),field('email'),field('github'),optional('linkedin'),
          optional('photo','image'),optional('shareImage','image'),translations('descriptions'),translations('biography',false),
          optional('focus','object',{ fields: locales.map((locale) => field(locale,'list')) }),
          translations('footer',false),select('defaultLocale',['zh-tw']),select('theme',['system','light','dark']),
          optional('resumes','object',{ fields: locales.map((locale) => optional(locale,'file')) }),
        ],
      }] },
    ],
  };
}
