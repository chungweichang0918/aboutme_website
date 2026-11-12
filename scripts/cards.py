"""Generate 1200x630 title cards (plus 640px list thumbnails) for every public project, post and research entry, per locale.

Used as each detail page's share image, and as the cover for entries without a real screenshot.
Usage: python cards.py <repo root>
"""
import json, os, re, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = sys.argv[1]
OUT = os.path.join(ROOT, 'src/content/media/og')
FONTS = 'C:/Windows/Fonts/'
W, H = 1200, 630
SECTION = {'projects': 'projects', 'posts': 'blog', 'research': 'research'}
LABEL = {'projects': {'zh-tw': '工程作品', 'en': 'Projects', 'ja': 'プロジェクト'},
         'posts': {'zh-tw': '技術文章', 'en': 'Writing', 'ja': '技術記事'},
         'research': {'zh-tw': '學術研究', 'en': 'Research', 'ja': '研究'}}
ACCENT = {'projects': (133, 184, 255), 'posts': (110, 220, 200), 'research': (190, 160, 255)}

def font(locale, size, text=''):
    cjk = re.search(r'[\u3040-\u30ff\u3400-\u9fff]', text)
    if locale == 'ja': return ImageFont.truetype(FONTS + 'YuGothB.ttc', size)
    if locale == 'en' and not cjk: return ImageFont.truetype(FONTS + 'segoeuib.ttf', size)
    return ImageFont.truetype(FONTS + 'msjhbd.ttc', size)

def frontmatter(path):
    text = open(path, encoding='utf-8').read().split('---')[1]
    data, key = {}, None
    for line in text.splitlines():
        m = re.match(r'^(\w+):\s*(.*)$', line)
        if m:
            key, value = m.group(1), m.group(2).strip()
            if value.startswith('[') or value.startswith('"'): data[key] = json.loads(value)
            elif value in ('true', 'false'): data[key] = value == 'true'
            elif value: data[key] = value
            else: data[key] = []
        elif key and line.strip().startswith('- '):
            item = line.strip()[2:].strip()
            data[key].append(json.loads(item) if item.startswith('"') else item)
    return data

def wrap(draw, text, fnt, width, latin):
    tokens = re.findall(r'\S+\s*', text) if latin else list(text)
    lines, cur = [], ''
    for tok in tokens:
        trial = cur + tok
        if draw.textlength(trial.rstrip(), font=fnt) <= width or not cur: cur = trial
        else: lines.append(cur.rstrip()); cur = tok.lstrip()
    if cur.strip(): lines.append(cur.rstrip())
    return lines

def background(accent):
    im = Image.new('RGB', (W, H))
    px = im.load()
    for y in range(H):
        for x in range(0, W):
            t = x / W
            px[x, y] = (int(11 + 14 * t), int(19 + 24 * t), int(38 + 70 * t))
    glow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(glow).ellipse((760, 60, 1260, 560), fill=150)
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    im = Image.composite(Image.new('RGB', (W, H), (40, 80, 160)), im, glow)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 60): d.line((x, 0, x, H), fill=(22, 38, 70))
    for y in range(0, H, 60): d.line((0, y, W, y), fill=(22, 38, 70))
    cx, cy = 1010, 315
    for r, col in ((250, (58, 86, 127)), (180, (70, 104, 150)), (110, accent)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=col, width=2)
    d.rounded_rectangle((cx - 52, cy - 52, cx + 52, cy + 52), radius=14, outline=accent, width=3, fill=(16, 32, 62))
    return im

def card(entry, collection, locale):
    accent = ACCENT[collection]
    im = background(accent)
    d = ImageDraw.Draw(im)
    left, width = 72, 700
    kicker = 'CWCHANG.ME  ·  ' + LABEL[collection][locale]
    d.line((left, 92, left + 28, 92), fill=accent, width=2)
    d.text((left + 42, 78), kicker, font=font(locale, 24, kicker), fill=accent)
    title = entry['title']
    latin = locale == 'en' and not re.search(r'[\u3400-\u9fff]', title)
    for size in (64, 56, 48, 42):
        fnt = font(locale, size, title)
        lines = wrap(d, title, fnt, width, latin)
        # Accept only if it fits in three lines and the last line is not a stranded one or two characters.
        if len(lines) <= 3 and (len(lines) == 1 or len(lines[-1]) > 2): break
    lines = lines[:3]
    y = 150
    for line in lines:
        d.text((left, y), line, font=fnt, fill=(247, 249, 255)); y += int(size * 1.28)
    sub = entry.get('category') or ''
    if sub:
        d.text((left, y + 14), sub, font=font(locale, 26, sub), fill=(177, 200, 238))
    x, ty = left, H - 92
    for tag in (entry.get('tags') or [])[:4]:
        tf = font(locale, 22, tag)
        tw = d.textlength(tag, font=tf)
        if x + tw + 28 > left + width + 60: break
        d.rounded_rectangle((x, ty, x + tw + 28, ty + 42), radius=21, outline=(58, 86, 127), width=2, fill=(15, 31, 58))
        d.text((x + 14, ty + 7), tag, font=tf, fill=(193, 209, 233)); x += tw + 40
    return im

os.makedirs(OUT, exist_ok=True)
count = 0
for collection in SECTION:
    folder = os.path.join(ROOT, 'src/content', collection)
    for name in sorted(os.listdir(folder)):
        if not name.endswith(('.md', '.mdx')): continue
        data = frontmatter(os.path.join(folder, name))
        if data.get('draft', True) or data.get('visibility') != 'public': continue
        target = os.path.join(OUT, f"{data['locale']}-{SECTION[collection]}-{data['slug']}.jpg")
        card(data, collection, data['locale']).save(target, 'JPEG', quality=86, optimize=True, progressive=True)
        count += 1
print(count, 'cards ->', OUT)

# Cards render about 360-600 CSS px wide; phones at ~2.6x density need ~950px. Write 640px and 960px WebP
# copies of every cover and card (<name>.webp and <name>-960.webp); the JPEG card stays the share image.
THUMBS = os.path.join(ROOT, 'src/content/media/thumbs')
os.makedirs(THUMBS, exist_ok=True)
made = 0
for folder in (OUT, os.path.join(ROOT, 'src/content/media/covers')):
    if not os.path.isdir(folder): continue
    for name in sorted(os.listdir(folder)):
        if not name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')): continue
        im = Image.open(os.path.join(folder, name)).convert('RGB')
        for width, suffix in ((640, ''), (960, '-960')):
            copy = im.resize((width, round(width * im.height / im.width)), Image.LANCZOS)
            copy.save(os.path.join(THUMBS, os.path.splitext(name)[0] + suffix + '.webp'), 'WEBP', quality=78, method=6)
            made += 1
print(made, 'thumbnails ->', THUMBS)
