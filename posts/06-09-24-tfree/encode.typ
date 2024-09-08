#import "@preview/cetz:0.2.2"

#cetz.canvas({
    import cetz.draw: *
    // Your drawing code goes here


    let nested = (
        ("hello", ("_he", "hel", "ell", "llo", "lo_"), rgb(0, 0, 255)), 
        ("world", ("_wo", "wor", "orl", "rld", "ld_"), rgb(0, 255, 0)), 
        ("!", ("_!_",), rgb(255, 0, 0))
    )

    let i = 0
    for (j,(word, trigrams, color)) in nested.enumerate() {
         rect(
            (j*5+3,3), (j*5+3+1,4), 
            stroke:color, fill:color, 
            padding:0.1, radius:0.1, 
            name:"anchor"+str(j)
        )
 
        
        for (k,trigram) in trigrams.enumerate() {
            //content((i,0), text[#trigram], frame:"rect", stroke:none, fill:color, padding:0.1, radius:0.5)
            rect(
                (i*1.3,0), (i*1.3+1,1), 
                stroke:color, fill:color, 
                padding:0.1, radius:0.1, 
                name:"anchor"+str(j)+"-"+str(k)
            )
            content("anchor"+str(j)+"-"+str(k)+".center", text[*#trigram*])
            

            i += 1
        }
        i += .5
    }

    for i in range(-15,15,step:1) {
        rect("anchor1.center",(rel:(1,2)), offset:(0,-5), padding:0.1, radius:0.1)
    }
})

