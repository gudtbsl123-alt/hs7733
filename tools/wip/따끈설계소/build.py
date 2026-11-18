import sys,os
D=os.path.dirname(os.path.abspath(__file__));S=D+'/src/'
order=['10_core.js','20_art_base.js','21_rooms.js','22_layers.js','23_heat.js','k_sound.js','30_items.js','40_figs.js','50_game.js','51_draw.js','60_screens.js']
bible=open(S+'00_bible.txt').read()
js=bible+'\n'.join(open(S+f).read() for f in order)
html=open(S+'head.html').read()+js+'\n</script>\n</body>\n</html>\n'
if len(sys.argv)>1 and sys.argv[1]=='dev':
    for k,v in {'__SUNB__':'file:///tmp/hs7733-fonts/Sunflower-Bold.ttf','__PEN__':'file:///tmp/hs7733-fonts/NanumPenScript-Regular.ttf','__ORBIT__':'file:///home/user/hs7733/docs/fonts/Orbit-Regular.ttf','__DOHYEON__':'file:///home/user/hs7733/docs/fonts/DoHyeon-Regular.ttf'}.items():html=html.replace('data:font/woff2;base64,'+k+') format("woff2")',v+')')
    open(D+'/dev.html','w').write(html)
else:open(D+'/src.html','w').write(html)
print(len(html))
