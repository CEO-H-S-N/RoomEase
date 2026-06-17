import os

critical_files = [
    r'c:\Users\hassa\OneDrive\Desktop\FYP\RoomEase\backend\app\agents\profile_reader_agent.py',
    r'c:\Users\hassa\OneDrive\Desktop\FYP\RoomEase\backend\app\models\user.py',
    r'c:\Users\hassa\OneDrive\Desktop\FYP\RoomEase\backend\app\routes\users\routes.py',
]

replacements = [
    ('\xa0', ' '),
    ('\u2014', '-'),
    ('\u2013', '-'),
    ('\u2019', "'"),
    ('\u2018', "'"),
    ('\u201c', '"'),
    ('\u201d', '"'),
    ('\u26a0', '[WARNING]'),
    ('\u274c', '[X]'),
    ('\u2705', '[OK]'),
    ('\ufffd', '?'),
]

for fp in critical_files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content
        for old, new in replacements:
            content = content.replace(old, new)
        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed: {os.path.basename(fp)}')
        else:
            print(f'No changes needed: {os.path.basename(fp)}')
    except Exception as e:
        print(f'Error on {fp}: {e}')

print('All done.')
