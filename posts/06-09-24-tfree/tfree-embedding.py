import drawsvg as dw
import numpy   as np
import random

d = dw.Drawing(2200,2000)
colors = ["rgb(230, 148, 0)", "rgb(228, 0, 58)", "rgb(182, 0, 113)"]
paths = [
            [
                dw.Path(stroke=colors[0] , fill='none' , stroke_width=3),
                dw.Path(stroke=colors[1] , fill='none' , stroke_width=3),
                dw.Path(stroke=colors[2] , fill='none' , stroke_width=3),
            ],
            [
                dw.Path(stroke=colors[0] , fill='none' , stroke_width=3, stroke_dasharray='20,10'),
                dw.Path(stroke=colors[1] , fill='none' , stroke_width=3, stroke_dasharray='20,10'),
                dw.Path(stroke=colors[2] , fill='none' , stroke_width=3, stroke_dasharray='20,10'),
            ],
            
            ]

text_color = "rgb(255,255,255)"
emb_color = "rgb(55, 149, 189)"
helloworld_color = "rgb(55, 149, 189)"

def trigrams(text):
    text = f"_{text}_"
    return [text[i:i+3] for i in range(len(text)-2)]

ys = [80, 300, 550, 900, 1500, 1700]

l0 = dw.Text("hello world !" , font_size=50, x=d.width//2, y=ys[0], text_anchor="middle", fill=text_color)
l0_rec = dw.Rectangle(l0.args["x"]-300, ys[0]-60, 600, 90, rx='10', ry='10', stroke='none', fill=helloworld_color )


l1 = [dw.Text(tag, font_size=50, x=x, y=ys[1], text_anchor="middle", fill=text_color) for x,tag in zip(np.linspace(400, d.width-400,3), ["hello", "world", "!"])]
l1_rec = [dw.Rectangle(x.args["x"]-150, ys[1]-60, 300, 90, rx='10', ry='10', stroke='none', fill=color) for x,color in zip(l1, colors)]

l01_lines = [path.M(l0.args["x"], ys[0]+20).C(l0.args["x"], ys[1], word.args["x"], ys[0], word.args["x"], ys[1]) for path,word in zip(paths[0],l1)]

trigrams_cache = []
trigrams_rec_cache = []
for word,rec in zip(l1,l1_rec):
    text = word.escaped_text
    x    = word.args["x"]
    tris = trigrams(text)
    trigrams_cache.append([])
    trigrams_rec_cache.append([])
    for x,trigram in zip(np.linspace(0,500,len(tris)) + x - 500//2 if len(tris) > 1 else [x], tris):
        trigrams_cache[-1].append(dw.Text(trigram, font_size=50, x=x, y=ys[2], text_anchor="middle", fill=text_color))
        trigrams_rec_cache[-1].append(dw.Rectangle(x-60, ys[2]-60, 120, 90, rx='10', ry='10', stroke='none', fill=rec.args["fill"]))


l12_lines = [path.M(word.args["x"], ys[1]).C(word.args["x"], ys[1] + 200, tri.args["x"], ys[2]-200,tri.args["x"], ys[2]) for (path,word), cache in zip(zip(paths[0],l1), trigrams_cache) for tri in cache]

l3 = [dw.Rectangle(x, ys[3], 30, 200, rx='10', ry='10', stroke='none', fill=emb_color) for x in np.linspace(50,d.width-50,60)]

l23_lines = []
l3_recs = []
for group,tricache in zip(zip(*paths),trigrams_rec_cache):
    l3_recs.append([])
    for path in group:
        for tri in tricache:
            emb = random.choice(l3)
            line = path.M(tri.args["x"]+tri.args["width"]/2, ys[2]).C(tri.args["x"]+tri.args["width"]/2, ys[2]+100, emb.args["x"]+emb.args["width"]/2, ys[3]-100, emb.args["x"]+emb.args["width"]/2, ys[3])
            l23_lines.append(line)
            rec = dw.Rectangle(emb.args["x"], emb.args["y"], emb.args["width"], emb.args["height"], fill=path.args["stroke"])
            l3_recs[-1].append(rec)

l4_circ = [dw.Circle(word.args["x"] + word.args["width"]/2,ys[4],70, fill=word.args["fill"]) for word in l1_rec]
l4_text = [dw.Text("sum", text_anchor="middle", font_size=50, x=word.args["x"] + word.args["width"]/2, y=ys[4]+10, fill=text_color) for word in l1_rec]

l34_lines = [path.M(rec.args["x"]+rec.args["width"]/2,rec.args["y"]+rec.args["height"]).C(rec.args["x"],rec.args["y"]+rec.args["height"]+100,circ.args["cx"],circ.args["cy"]-circ.args["r"]-100,circ.args["cx"],circ.args["cy"]-circ.args["r"]) for path,recs,circ in zip(paths[0], l3_recs, l4_circ) for rec in recs]

l5_rect = [dw.Rectangle(w.args["x"]+w.args["width"]/2- 15, ys[5], 30, 200, fill=w.args["fill"]) for w in l1_rec]
l45_lines = [path.M(circ.args["cx"], circ.args["cy"] + circ.args["r"]).C(circ.args["cx"], circ.args["cy"] + circ.args["r"],rect.args["x"]+rect.args["width"]/2, ys[5],rect.args["x"]+rect.args["width"]/2, ys[5]) for circ,rect,path in zip(l4_circ,l5_rect,paths[0])]


d.extend(l34_lines)
d.extend(l23_lines)
d.extend(l12_lines)
d.extend(l1_rec)
for cache in trigrams_rec_cache:d.extend(cache)
d.append(l0_rec)
for cache in trigrams_cache:d.extend(cache)
d.append(l0)
d.extend(l3)
d.extend(l1)
for recs in l3_recs: d.extend(recs)
d.extend(l4_circ)
d.extend(l4_text)
d.extend(l5_rect)

d.save_png('encode.png')
