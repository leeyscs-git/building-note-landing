// Tweaks panel for buildingnote landing
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "redTone": "brick",
  "density": "spacious",
  "showStickyCTA": true,
  "showTicker": true,
  "heroVariant": "split"
}/*EDITMODE-END*/;

const RED_TONES = {
  brick:  { 700: '#a8312a', 800: '#8a2622', 500: '#c95048' },
  bold:   { 700: '#c8102e', 800: '#9e0b24', 500: '#e23051' },
  wine:   { 700: '#8b1a1a', 800: '#6b1313', 500: '#a83838' },
  vivid:  { 700: '#e63946', 800: '#b8202b', 500: '#f25b67' },
};

const Tweaks = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = RED_TONES[t.redTone] || RED_TONES.brick;
    document.documentElement.style.setProperty('--red-700', r[700]);
    document.documentElement.style.setProperty('--red-800', r[800]);
    document.documentElement.style.setProperty('--red-500', r[500]);

    document.documentElement.style.setProperty('--pad-x',
      t.density === 'spacious' ? 'clamp(20px, 5vw, 80px)' :
      t.density === 'tight' ? 'clamp(16px, 3vw, 40px)' :
      'clamp(20px, 5vw, 60px)'
    );
  }, [t.redTone, t.density]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Brand">
        <TweakRadio
          label="Red tone"
          value={t.redTone}
          onChange={v => setTweak('redTone', v)}
          options={[
            { value: 'brick', label: 'Brick' },
            { value: 'bold', label: 'Bold' },
            { value: 'wine', label: 'Wine' },
            { value: 'vivid', label: 'Vivid' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Layout">
        <TweakRadio
          label="Density"
          value={t.density}
          onChange={v => setTweak('density', v)}
          options={[
            { value: 'spacious', label: 'Spacious' },
            { value: 'normal', label: 'Normal' },
            { value: 'tight', label: 'Tight' },
          ]}
        />
        <TweakToggle
          label="Sticky CTA"
          value={t.showStickyCTA}
          onChange={v => setTweak('showStickyCTA', v)}
        />
        <TweakToggle
          label="Ticker bar"
          value={t.showTicker}
          onChange={v => setTweak('showTicker', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
};

window.Tweaks = Tweaks;
window.useGlobalTweaks = () => useTweaks(TWEAK_DEFAULTS)[0];
