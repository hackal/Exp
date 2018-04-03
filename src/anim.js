var anim = function(A) {
    "use strict";
    
    A = function(n, g, t, e) {
      var a, o, c,
        q = [],
        cb = function(i) {
          if(i = q.shift()) i[1] ?
              A.apply(this, i).anim(cb) :
              i[0] > 0 ? setTimeout(cb, i[0]*1000) : (i[0](), cb())
        };
    
      if(n.charAt) n = document.getElementById(n);
      if(n > 0 || !n) g = {}, t = 0, cb(q = [].push([n || 0]));
      expand(g, {padding:0, margin:0, border:"Width"}, [T, R, B, L]);
      expand(g, {borderRadius:"Radius"}, [T+L, T+R, B+R, B+L]);
      ++mutex;
    
      for(a in g) {
        o = g[a];
        if(!o.to && o.to !== 0) o = g[a] = {to: o};  //shorthand {margin:0} => {margin:{to:0}}
    
        A.defs(o, n, a, e);  //set defaults, get initial values, selects animation fx
      }
    
      A.iter(g, t*1000, cb);
    
      return {
        //this allows us to queue multiple animations together in compact syntax
        anim: function() {
          q.push([].slice.call(arguments));
          return this
        }
      }
    };
    
    var T="Top", R="Right", B="Bottom", L="Left",
      mutex = 1,
    
      //{border:1} => {borderTop:1, borderRight:1, borderBottom:1, borderLeft:1}
      expand = function(g, dim, dir, a, i, d, o) {
        for(a in g) {  //for each animation property
          if(a in dim) {
            o = g[a];
            for(i = 0; d = dir[i]; i++)  //for each dimension (Top, Right, etc.)
              //margin => marginTop
              //borderWidth => borderTopWidth
              //borderRadius => borderTopRadius
              g[a.replace(dim[a], "") + d + (dim[a] || "")] = {
                to:(o.to === 0) ? o.to : (o.to || o), fr:o.fr, e:o.e
              };
            delete g[a];
          }
        }
      },
    
      timeout = function(w, a) {
        return w["r"+a] || w["webkitR"+a] || w["mozR"+a] || w["msR"+a] || w["oR"+a]
      }(window, "equestAnimationFrame");
    
    A.defs = function(o, n, a, e, s) {
      s = n.style;
      o.a = a;  //attribute
      o.n = n;  //node
      o.s = (a in s) ? s : n;  //= n.style || n
      o.e = o.e || e;  //easing
    
      o.fr = o.fr || (o.fr === 0 ? 0 : o.s == n ? n[a] :
            (window.getComputedStyle ? getComputedStyle(n, null) : n.currentStyle)[a]);
    
      o.u = (/\d(\D+)$/.exec(o.to) || /\d(\D+)$/.exec(o.fr) || [0, 0])[1];  //units (px, %)
    
      //which animation fx to use. Only color needs special treatment.
      o.fn = /color/i.test(a) ? A.fx.color : (A.fx[a] || A.fx._);
    
      //the mutex is composed of the animating property name and a unique number
      o.mx = "anim_" + a;
      n[o.mx] = o.mxv = mutex;
      if(n[o.mx] != o.mxv) o.mxv = null;  //test expando
    };
    
    A.iter = function(g, t, cb) {
      var _, i, o, p, e,
        z = +new Date + t,
    
      _ = function() {
        i = z - new Date().getTime();
    
        if(i < 50) {
          for(o in g)
            o = g[o],
            o.p = 1,
            o.fn(o, o.n, o.to, o.fr, o.a, o.e);
    
          cb && cb()
    
        } else {
    
          i = i/t;
    
          for(o in g) {
            o = g[o];
    
            if(o.n[o.mx] != o.mxv) return;  //if mutex not match then halt.
    
            e = o.e;
            p = i;
    
            if(e == "lin") {
              p = 1 - p
      
            } else if(e == "ease") {
              p = (0.5 - p)*2;
              p = 1 - ((p*p*p - p*3) + 2)/4
      
            } else if(e == "ease-in") {
              p = 1 - p;
              p = p*p*p
      
            } else {  //ease-out
              p = 1 - p*p*p
            }
            o.p = p;
            o.fn(o, o.n, o.to, o.fr, o.a, o.e)
          }
          timeout ? timeout(_) : setTimeout(_, 20)
        }
      }
      _();
    };
    
    A.fx = {  //CSS names which need special handling
    
      _: function(o, n, to, fr, a, e) {  //for generic fx
        fr = parseFloat(fr) || 0,
        to = parseFloat(to) || 0,
        o.s[a] = (o.p >= 1 ? to : (o.p*(to - fr) + fr)) + o.u
      },
    
      width: function(o, n, to, fr, a, e) {  //for width/height fx
        if(!(o._fr >= 0))
          o._fr = !isNaN(fr = parseFloat(fr)) ? fr : a == "width" ? n.clientWidth : n.clientHeight;
        A.fx._(o, n, to, o._fr, a, e)
      }
    };
    A.fx.height = A.fx.width;
    return A
}();

module.exports = anim;