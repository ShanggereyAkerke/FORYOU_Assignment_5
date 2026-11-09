"""Original synthesized FORYOU interface chimes; no external samples."""
import math
from pathlib import Path
import struct
import wave
import zipfile

ROOT = Path(__file__).resolve().parent
RATE = 44100


def render(name, notes, duration, timbre):
    samples = []
    for index in range(round(RATE * duration)):
        time = index / RATE
        value = 0.0
        for frequency, start, length, level in notes:
            age = time - start
            if not 0 <= age < length:
                continue
            # Smooth attack and release avoid clicks at note boundaries.
            attack = min(1.0, age / 0.018)
            release = min(1.0, (length - age) / 0.075)
            envelope = math.sin(attack * math.pi / 2) ** 2
            envelope *= math.sin(release * math.pi / 2) ** 2
            envelope *= math.exp(-4.5 * age / length)
            phase = 2 * math.pi * frequency * age
            tone = math.sin(phase)
            if timbre == 'glass':
                tone += 0.15 * math.sin(2 * phase) + 0.035 * math.sin(3 * phase)
            elif timbre == 'wood':
                tone += 0.12 * math.sin(2 * phase) * math.exp(-18 * age)
            elif timbre == 'air':
                tone += 0.06 * math.sin(3 * phase)
            value += level * envelope * tone
        samples.append(value)
    peak = max(abs(sample) for sample in samples)
    gain = 0.22 / peak
    pcm = bytearray()
    for sample in samples:
        pcm.extend(struct.pack('<h', round(sample * gain * 32767)))
    with wave.open(str(ROOT / name), 'wb') as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(RATE)
        audio.writeframes(pcm)


render('01-warm-welcome.wav', [(523.25, 0, .56, 1), (659.25, .14, .62, .85)], .82, 'soft')
render('02-soft-glass.wav', [(783.99, 0, .48, 1), (1046.50, .12, .57, .7)], .76, 'glass')
render('03-wooden-touch.wav', [(392, 0, .32, 1), (493.88, .105, .38, .8)], .55, 'wood')
render('04-airy-rise.wav', [(587.33, 0, .55, 1), (880, .19, .65, .65)], .92, 'air')

for path in ROOT.glob('*.wav'):
    with wave.open(str(path), 'rb') as audio:
        assert audio.getnframes() / audio.getframerate() < 1
        assert audio.getnchannels() == 1
        print(f'{path.name}: {audio.getnframes() / audio.getframerate():.2f}s, 44.1 kHz, 16-bit WAV')

with zipfile.ZipFile(ROOT.parent / 'FORYOU_Sound_Variations.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(ROOT.glob('*.wav')):
        archive.write(path, path.name)
