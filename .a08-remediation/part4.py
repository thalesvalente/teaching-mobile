# Final candidate check after anchored migration; rejection remains mandatory.
p=ROOT/'tests/mobile-entregas-aula08.test.cjs'
s=p.read_text(encoding='utf-8')
a='/diferentes|quatro|contradiz/'
if s.count(a)!=1:raise RuntimeError('Expected exactly one evidence rejection assertion')
p.write_text(s.replace(a,'/diferentes|quatro|contradiz|sem registro real/'),encoding='utf-8')
