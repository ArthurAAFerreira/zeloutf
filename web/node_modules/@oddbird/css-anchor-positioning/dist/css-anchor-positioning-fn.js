var So = Object.defineProperty, yo = Object.defineProperties;
var bo = Object.getOwnPropertyDescriptors;
var En = Object.getOwnPropertySymbols;
var xo = Object.prototype.hasOwnProperty, Co = Object.prototype.propertyIsEnumerable;
var $n = (t, e, n) => e in t ? So(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, U = (t, e) => {
  for (var n in e || (e = {}))
    xo.call(e, n) && $n(t, n, e[n]);
  if (En)
    for (var n of En(e))
      Co.call(e, n) && $n(t, n, e[n]);
  return t;
}, G = (t, e) => yo(t, bo(e));
var R = (t, e, n) => new Promise((s, r) => {
  var o = (u) => {
    try {
      l(n.next(u));
    } catch (i) {
      r(i);
    }
  }, a = (u) => {
    try {
      l(n.throw(u));
    } catch (i) {
      r(i);
    }
  }, l = (u) => u.done ? s(u.value) : Promise.resolve(u.value).then(o, a);
  l((n = n.apply(t, e)).next());
});
const nn = Math.min, Gt = Math.max, Te = Math.round, pe = Math.floor, St = (t) => ({
  x: t,
  y: t
});
function wo(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function To(t) {
  return U({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, t);
}
function Ao(t) {
  return typeof t != "number" ? To(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function Ae(t) {
  const {
    x: e,
    y: n,
    width: s,
    height: r
  } = t;
  return {
    width: s,
    height: r,
    top: n,
    left: e,
    right: e + s,
    bottom: n + r,
    x: e,
    y: n
  };
}
function vo(t, e) {
  return R(this, null, function* () {
    var n;
    e === void 0 && (e = {});
    const {
      x: s,
      y: r,
      platform: o,
      rects: a,
      elements: l,
      strategy: u
    } = t, {
      boundary: i = "clippingAncestors",
      rootBoundary: c = "viewport",
      elementContext: h = "floating",
      altBoundary: f = !1,
      padding: p = 0
    } = wo(e, t), g = Ao(p), k = l[f ? h === "floating" ? "reference" : "floating" : h], S = Ae(yield o.getClippingRect({
      element: (n = yield o.isElement == null ? void 0 : o.isElement(k)) == null || n ? k : k.contextElement || (yield o.getDocumentElement == null ? void 0 : o.getDocumentElement(l.floating)),
      boundary: i,
      rootBoundary: c,
      strategy: u
    })), x = h === "floating" ? {
      x: s,
      y: r,
      width: a.floating.width,
      height: a.floating.height
    } : a.reference, A = yield o.getOffsetParent == null ? void 0 : o.getOffsetParent(l.floating), M = (yield o.isElement == null ? void 0 : o.isElement(A)) ? (yield o.getScale == null ? void 0 : o.getScale(A)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    }, et = Ae(o.convertOffsetParentRelativeRectToViewportRelativeRect ? yield o.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements: l,
      rect: x,
      offsetParent: A,
      strategy: u
    }) : x);
    return {
      top: (S.top - et.top + g.top) / M.y,
      bottom: (et.bottom - S.bottom + g.bottom) / M.y,
      left: (S.left - et.left + g.left) / M.x,
      right: (et.right - S.right + g.right) / M.x
    };
  });
}
function Re() {
  return typeof window != "undefined";
}
function te(t) {
  return _s(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function it(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function bt(t) {
  var e;
  return (e = (_s(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function _s(t) {
  return Re() ? t instanceof Node || t instanceof it(t).Node : !1;
}
function ct(t) {
  return Re() ? t instanceof Element || t instanceof it(t).Element : !1;
}
function yt(t) {
  return Re() ? t instanceof HTMLElement || t instanceof it(t).HTMLElement : !1;
}
function Ln(t) {
  return !Re() || typeof ShadowRoot == "undefined" ? !1 : t instanceof ShadowRoot || t instanceof it(t).ShadowRoot;
}
const Eo = /* @__PURE__ */ new Set(["inline", "contents"]);
function he(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: s,
    display: r
  } = ut(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + s + n) && !Eo.has(r);
}
const $o = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Lo(t) {
  return $o.has(te(t));
}
const Po = [":popover-open", ":modal"];
function Ie(t) {
  return Po.some((e) => {
    try {
      return t.matches(e);
    } catch (n) {
      return !1;
    }
  });
}
const Oo = ["transform", "translate", "scale", "rotate", "perspective"], Ro = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Io = ["paint", "layout", "strict", "content"];
function kn(t) {
  const e = Sn(), n = ct(t) ? ut(t) : t;
  return Oo.some((s) => n[s] ? n[s] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || Ro.some((s) => (n.willChange || "").includes(s)) || Io.some((s) => (n.contain || "").includes(s));
}
function _o(t) {
  let e = Pt(t);
  for (; yt(e) && !Qt(e); ) {
    if (kn(e))
      return e;
    if (Ie(e))
      return null;
    e = Pt(e);
  }
  return null;
}
function Sn() {
  return typeof CSS == "undefined" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const No = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Qt(t) {
  return No.has(te(t));
}
function ut(t) {
  return it(t).getComputedStyle(t);
}
function _e(t) {
  return ct(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function Pt(t) {
  if (te(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    Ln(t) && t.host || // Fallback.
    bt(t)
  );
  return Ln(e) ? e.host : e;
}
function Ns(t) {
  const e = Pt(t);
  return Qt(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : yt(e) && he(e) ? e : Ns(e);
}
function le(t, e, n) {
  var s;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const r = Ns(t), o = r === ((s = t.ownerDocument) == null ? void 0 : s.body), a = it(r);
  if (o) {
    const l = sn(a);
    return e.concat(a, a.visualViewport || [], he(r) ? r : [], l && n ? le(l) : []);
  }
  return e.concat(r, le(r, [], n));
}
function sn(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function Ds(t) {
  const e = ut(t);
  let n = parseFloat(e.width) || 0, s = parseFloat(e.height) || 0;
  const r = yt(t), o = r ? t.offsetWidth : n, a = r ? t.offsetHeight : s, l = Te(n) !== o || Te(s) !== a;
  return l && (n = o, s = a), {
    width: n,
    height: s,
    $: l
  };
}
function yn(t) {
  return ct(t) ? t : t.contextElement;
}
function qt(t) {
  const e = yn(t);
  if (!yt(e))
    return St(1);
  const n = e.getBoundingClientRect(), {
    width: s,
    height: r,
    $: o
  } = Ds(e);
  let a = (o ? Te(n.width) : n.width) / s, l = (o ? Te(n.height) : n.height) / r;
  return (!a || !Number.isFinite(a)) && (a = 1), (!l || !Number.isFinite(l)) && (l = 1), {
    x: a,
    y: l
  };
}
const Do = /* @__PURE__ */ St(0);
function Fs(t) {
  const e = it(t);
  return !Sn() || !e.visualViewport ? Do : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Fo(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== it(t) ? !1 : e;
}
function Dt(t, e, n, s) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const r = t.getBoundingClientRect(), o = yn(t);
  let a = St(1);
  e && (s ? ct(s) && (a = qt(s)) : a = qt(t));
  const l = Fo(o, n, s) ? Fs(o) : St(0);
  let u = (r.left + l.x) / a.x, i = (r.top + l.y) / a.y, c = r.width / a.x, h = r.height / a.y;
  if (o) {
    const f = it(o), p = s && ct(s) ? it(s) : s;
    let g = f, m = sn(g);
    for (; m && s && p !== g; ) {
      const k = qt(m), S = m.getBoundingClientRect(), x = ut(m), A = S.left + (m.clientLeft + parseFloat(x.paddingLeft)) * k.x, M = S.top + (m.clientTop + parseFloat(x.paddingTop)) * k.y;
      u *= k.x, i *= k.y, c *= k.x, h *= k.y, u += A, i += M, g = it(m), m = sn(g);
    }
  }
  return Ae({
    width: c,
    height: h,
    x: u,
    y: i
  });
}
function Ne(t, e) {
  const n = _e(t).scrollLeft;
  return e ? e.left + n : Dt(bt(t)).left + n;
}
function Ms(t, e) {
  const n = t.getBoundingClientRect(), s = n.left + e.scrollLeft - Ne(t, n), r = n.top + e.scrollTop;
  return {
    x: s,
    y: r
  };
}
function Mo(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: s,
    strategy: r
  } = t;
  const o = r === "fixed", a = bt(s), l = e ? Ie(e.floating) : !1;
  if (s === a || l && o)
    return n;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, i = St(1);
  const c = St(0), h = yt(s);
  if ((h || !h && !o) && ((te(s) !== "body" || he(a)) && (u = _e(s)), yt(s))) {
    const p = Dt(s);
    i = qt(s), c.x = p.x + s.clientLeft, c.y = p.y + s.clientTop;
  }
  const f = a && !h && !o ? Ms(a, u) : St(0);
  return {
    width: n.width * i.x,
    height: n.height * i.y,
    x: n.x * i.x - u.scrollLeft * i.x + c.x + f.x,
    y: n.y * i.y - u.scrollTop * i.y + c.y + f.y
  };
}
function jo(t) {
  return Array.from(t.getClientRects());
}
function Bo(t) {
  const e = bt(t), n = _e(t), s = t.ownerDocument.body, r = Gt(e.scrollWidth, e.clientWidth, s.scrollWidth, s.clientWidth), o = Gt(e.scrollHeight, e.clientHeight, s.scrollHeight, s.clientHeight);
  let a = -n.scrollLeft + Ne(t);
  const l = -n.scrollTop;
  return ut(s).direction === "rtl" && (a += Gt(e.clientWidth, s.clientWidth) - r), {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
const Pn = 25;
function Uo(t, e) {
  const n = it(t), s = bt(t), r = n.visualViewport;
  let o = s.clientWidth, a = s.clientHeight, l = 0, u = 0;
  if (r) {
    o = r.width, a = r.height;
    const c = Sn();
    (!c || c && e === "fixed") && (l = r.offsetLeft, u = r.offsetTop);
  }
  const i = Ne(s);
  if (i <= 0) {
    const c = s.ownerDocument, h = c.body, f = getComputedStyle(h), p = c.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, g = Math.abs(s.clientWidth - h.clientWidth - p);
    g <= Pn && (o -= g);
  } else i <= Pn && (o += i);
  return {
    width: o,
    height: a,
    x: l,
    y: u
  };
}
const Wo = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function zo(t, e) {
  const n = Dt(t, !0, e === "fixed"), s = n.top + t.clientTop, r = n.left + t.clientLeft, o = yt(t) ? qt(t) : St(1), a = t.clientWidth * o.x, l = t.clientHeight * o.y, u = r * o.x, i = s * o.y;
  return {
    width: a,
    height: l,
    x: u,
    y: i
  };
}
function On(t, e, n) {
  let s;
  if (e === "viewport")
    s = Uo(t, n);
  else if (e === "document")
    s = Bo(bt(t));
  else if (ct(e))
    s = zo(e, n);
  else {
    const r = Fs(t);
    s = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return Ae(s);
}
function js(t, e) {
  const n = Pt(t);
  return n === e || !ct(n) || Qt(n) ? !1 : ut(n).position === "fixed" || js(n, e);
}
function Ho(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let s = le(t, [], !1).filter((l) => ct(l) && te(l) !== "body"), r = null;
  const o = ut(t).position === "fixed";
  let a = o ? Pt(t) : t;
  for (; ct(a) && !Qt(a); ) {
    const l = ut(a), u = kn(a);
    !u && l.position === "fixed" && (r = null), (o ? !u && !r : !u && l.position === "static" && !!r && Wo.has(r.position) || he(a) && !u && js(t, a)) ? s = s.filter((c) => c !== a) : r = l, a = Pt(a);
  }
  return e.set(t, s), s;
}
function Vo(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: s,
    strategy: r
  } = t;
  const a = [...n === "clippingAncestors" ? Ie(e) ? [] : Ho(e, this._c) : [].concat(n), s], l = a[0], u = a.reduce((i, c) => {
    const h = On(e, c, r);
    return i.top = Gt(h.top, i.top), i.right = nn(h.right, i.right), i.bottom = nn(h.bottom, i.bottom), i.left = Gt(h.left, i.left), i;
  }, On(e, l, r));
  return {
    width: u.right - u.left,
    height: u.bottom - u.top,
    x: u.left,
    y: u.top
  };
}
function Go(t) {
  const {
    width: e,
    height: n
  } = Ds(t);
  return {
    width: e,
    height: n
  };
}
function qo(t, e, n) {
  const s = yt(e), r = bt(e), o = n === "fixed", a = Dt(t, !0, o, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = St(0);
  function i() {
    u.x = Ne(r);
  }
  if (s || !s && !o)
    if ((te(e) !== "body" || he(r)) && (l = _e(e)), s) {
      const p = Dt(e, !0, o, e);
      u.x = p.x + e.clientLeft, u.y = p.y + e.clientTop;
    } else r && i();
  o && !s && r && i();
  const c = r && !s && !o ? Ms(r, l) : St(0), h = a.left + l.scrollLeft - u.x - c.x, f = a.top + l.scrollTop - u.y - c.y;
  return {
    x: h,
    y: f,
    width: a.width,
    height: a.height
  };
}
function Fe(t) {
  return ut(t).position === "static";
}
function Rn(t, e) {
  if (!yt(t) || ut(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return bt(t) === n && (n = n.ownerDocument.body), n;
}
function Bs(t, e) {
  const n = it(t);
  if (Ie(t))
    return n;
  if (!yt(t)) {
    let r = Pt(t);
    for (; r && !Qt(r); ) {
      if (ct(r) && !Fe(r))
        return r;
      r = Pt(r);
    }
    return n;
  }
  let s = Rn(t, e);
  for (; s && Lo(s) && Fe(s); )
    s = Rn(s, e);
  return s && Qt(s) && Fe(s) && !kn(s) ? n : s || _o(t) || n;
}
const Ko = function(t) {
  return R(this, null, function* () {
    const e = this.getOffsetParent || Bs, n = this.getDimensions, s = yield n(t.floating);
    return {
      reference: qo(t.reference, yield e(t.floating), t.strategy),
      floating: {
        x: 0,
        y: 0,
        width: s.width,
        height: s.height
      }
    };
  });
};
function Qo(t) {
  return ut(t).direction === "rtl";
}
const H = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Mo,
  getDocumentElement: bt,
  getClippingRect: Vo,
  getOffsetParent: Bs,
  getElementRects: Ko,
  getClientRects: jo,
  getDimensions: Go,
  getScale: qt,
  isElement: ct,
  isRTL: Qo
};
function Us(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function Yo(t, e) {
  let n = null, s;
  const r = bt(t);
  function o() {
    var l;
    clearTimeout(s), (l = n) == null || l.disconnect(), n = null;
  }
  function a(l, u) {
    l === void 0 && (l = !1), u === void 0 && (u = 1), o();
    const i = t.getBoundingClientRect(), {
      left: c,
      top: h,
      width: f,
      height: p
    } = i;
    if (l || e(), !f || !p)
      return;
    const g = pe(h), m = pe(r.clientWidth - (c + f)), k = pe(r.clientHeight - (h + p)), S = pe(c), A = {
      rootMargin: -g + "px " + -m + "px " + -k + "px " + -S + "px",
      threshold: Gt(0, nn(1, u)) || 1
    };
    let M = !0;
    function et(w) {
      const C = w[0].intersectionRatio;
      if (C !== u) {
        if (!M)
          return a();
        C ? a(!1, C) : s = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      C === 1 && !Us(i, t.getBoundingClientRect()) && a(), M = !1;
    }
    try {
      n = new IntersectionObserver(et, G(U({}, A), {
        // Handle <iframe>s
        root: r.ownerDocument
      }));
    } catch (w) {
      n = new IntersectionObserver(et, A);
    }
    n.observe(t);
  }
  return a(!0), o;
}
function rn(t, e, n, s) {
  s === void 0 && (s = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: o = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: l = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = s, i = yn(t), c = r || o ? [...i ? le(i) : [], ...le(e)] : [];
  c.forEach((S) => {
    r && S.addEventListener("scroll", n, {
      passive: !0
    }), o && S.addEventListener("resize", n);
  });
  const h = i && l ? Yo(i, n) : null;
  let f = -1, p = null;
  a && (p = new ResizeObserver((S) => {
    let [x] = S;
    x && x.target === i && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var A;
      (A = p) == null || A.observe(e);
    })), n();
  }), i && !u && p.observe(i), p.observe(e));
  let g, m = u ? Dt(t) : null;
  u && k();
  function k() {
    const S = Dt(t);
    m && !Us(m, S) && n(), m = S, g = requestAnimationFrame(k);
  }
  return n(), () => {
    var S;
    c.forEach((x) => {
      r && x.removeEventListener("scroll", n), o && x.removeEventListener("resize", n);
    }), h == null || h(), (S = p) == null || S.disconnect(), p = null, u && cancelAnimationFrame(g);
  };
}
const Xo = vo;
let zt = null;
class q {
  static createItem(e) {
    return {
      prev: null,
      next: null,
      data: e
    };
  }
  constructor() {
    this.head = null, this.tail = null, this.cursor = null;
  }
  createItem(e) {
    return q.createItem(e);
  }
  // cursor helpers
  allocateCursor(e, n) {
    let s;
    return zt !== null ? (s = zt, zt = zt.cursor, s.prev = e, s.next = n, s.cursor = this.cursor) : s = {
      prev: e,
      next: n,
      cursor: this.cursor
    }, this.cursor = s, s;
  }
  releaseCursor() {
    const { cursor: e } = this;
    this.cursor = e.cursor, e.prev = null, e.next = null, e.cursor = zt, zt = e;
  }
  updateCursors(e, n, s, r) {
    let { cursor: o } = this;
    for (; o !== null; )
      o.prev === e && (o.prev = n), o.next === s && (o.next = r), o = o.cursor;
  }
  *[Symbol.iterator]() {
    for (let e = this.head; e !== null; e = e.next)
      yield e.data;
  }
  // getters
  get size() {
    let e = 0;
    for (let n = this.head; n !== null; n = n.next)
      e++;
    return e;
  }
  get isEmpty() {
    return this.head === null;
  }
  get first() {
    return this.head && this.head.data;
  }
  get last() {
    return this.tail && this.tail.data;
  }
  // convertors
  fromArray(e) {
    let n = null;
    this.head = null;
    for (let s of e) {
      const r = q.createItem(s);
      n !== null ? n.next = r : this.head = r, r.prev = n, n = r;
    }
    return this.tail = n, this;
  }
  toArray() {
    return [...this];
  }
  toJSON() {
    return [...this];
  }
  // array-like methods
  forEach(e, n = this) {
    const s = this.allocateCursor(null, this.head);
    for (; s.next !== null; ) {
      const r = s.next;
      s.next = r.next, e.call(n, r.data, r, this);
    }
    this.releaseCursor();
  }
  forEachRight(e, n = this) {
    const s = this.allocateCursor(this.tail, null);
    for (; s.prev !== null; ) {
      const r = s.prev;
      s.prev = r.prev, e.call(n, r.data, r, this);
    }
    this.releaseCursor();
  }
  reduce(e, n, s = this) {
    let r = this.allocateCursor(null, this.head), o = n, a;
    for (; r.next !== null; )
      a = r.next, r.next = a.next, o = e.call(s, o, a.data, a, this);
    return this.releaseCursor(), o;
  }
  reduceRight(e, n, s = this) {
    let r = this.allocateCursor(this.tail, null), o = n, a;
    for (; r.prev !== null; )
      a = r.prev, r.prev = a.prev, o = e.call(s, o, a.data, a, this);
    return this.releaseCursor(), o;
  }
  some(e, n = this) {
    for (let s = this.head; s !== null; s = s.next)
      if (e.call(n, s.data, s, this))
        return !0;
    return !1;
  }
  map(e, n = this) {
    const s = new q();
    for (let r = this.head; r !== null; r = r.next)
      s.appendData(e.call(n, r.data, r, this));
    return s;
  }
  filter(e, n = this) {
    const s = new q();
    for (let r = this.head; r !== null; r = r.next)
      e.call(n, r.data, r, this) && s.appendData(r.data);
    return s;
  }
  nextUntil(e, n, s = this) {
    if (e === null)
      return;
    const r = this.allocateCursor(null, e);
    for (; r.next !== null; ) {
      const o = r.next;
      if (r.next = o.next, n.call(s, o.data, o, this))
        break;
    }
    this.releaseCursor();
  }
  prevUntil(e, n, s = this) {
    if (e === null)
      return;
    const r = this.allocateCursor(e, null);
    for (; r.prev !== null; ) {
      const o = r.prev;
      if (r.prev = o.prev, n.call(s, o.data, o, this))
        break;
    }
    this.releaseCursor();
  }
  // mutation
  clear() {
    this.head = null, this.tail = null;
  }
  copy() {
    const e = new q();
    for (let n of this)
      e.appendData(n);
    return e;
  }
  prepend(e) {
    return this.updateCursors(null, e, this.head, e), this.head !== null ? (this.head.prev = e, e.next = this.head) : this.tail = e, this.head = e, this;
  }
  prependData(e) {
    return this.prepend(q.createItem(e));
  }
  append(e) {
    return this.insert(e);
  }
  appendData(e) {
    return this.insert(q.createItem(e));
  }
  insert(e, n = null) {
    if (n !== null)
      if (this.updateCursors(n.prev, e, n, e), n.prev === null) {
        if (this.head !== n)
          throw new Error("before doesn't belong to list");
        this.head = e, n.prev = e, e.next = n, this.updateCursors(null, e);
      } else
        n.prev.next = e, e.prev = n.prev, n.prev = e, e.next = n;
    else
      this.updateCursors(this.tail, e, null, e), this.tail !== null ? (this.tail.next = e, e.prev = this.tail) : this.head = e, this.tail = e;
    return this;
  }
  insertData(e, n) {
    return this.insert(q.createItem(e), n);
  }
  remove(e) {
    if (this.updateCursors(e, e.prev, e, e.next), e.prev !== null)
      e.prev.next = e.next;
    else {
      if (this.head !== e)
        throw new Error("item doesn't belong to list");
      this.head = e.next;
    }
    if (e.next !== null)
      e.next.prev = e.prev;
    else {
      if (this.tail !== e)
        throw new Error("item doesn't belong to list");
      this.tail = e.prev;
    }
    return e.prev = null, e.next = null, e;
  }
  push(e) {
    this.insert(q.createItem(e));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(e) {
    this.prepend(q.createItem(e));
  }
  shift() {
    return this.head !== null ? this.remove(this.head) : null;
  }
  prependList(e) {
    return this.insertList(e, this.head);
  }
  appendList(e) {
    return this.insertList(e);
  }
  insertList(e, n) {
    return e.head === null ? this : (n != null ? (this.updateCursors(n.prev, e.tail, n, e.head), n.prev !== null ? (n.prev.next = e.head, e.head.prev = n.prev) : this.head = e.head, n.prev = e.tail, e.tail.next = n) : (this.updateCursors(this.tail, e.tail, null, e.head), this.tail !== null ? (this.tail.next = e.head, e.head.prev = this.tail) : this.head = e.head, this.tail = e.tail), e.head = null, e.tail = null, this);
  }
  replace(e, n) {
    "head" in n ? this.insertList(n, e) : this.insert(n, e), this.remove(e);
  }
}
function ve(t) {
  const e = {};
  for (const n of Object.keys(t)) {
    let s = t[n];
    s && (Array.isArray(s) || s instanceof q ? s = s.map(ve) : s.constructor === Object && (s = ve(s))), e[n] = s;
  }
  return e;
}
const vt = 0, d = 1, T = 2, z = 3, _ = 4, Tt = 5, Jo = 6, Q = 7, at = 8, L = 9, b = 10, F = 11, E = 12, W = 13, De = 14, nt = 15, X = 16, tt = 17, ft = 18, ee = 19, ce = 20, I = 21, y = 22, ht = 23, Yt = 24, Y = 25, Zo = 0;
function rt(t) {
  return t >= 48 && t <= 57;
}
function Xt(t) {
  return rt(t) || // 0 .. 9
  t >= 65 && t <= 70 || // A .. F
  t >= 97 && t <= 102;
}
function bn(t) {
  return t >= 65 && t <= 90;
}
function ta(t) {
  return t >= 97 && t <= 122;
}
function ea(t) {
  return bn(t) || ta(t);
}
function na(t) {
  return t >= 128;
}
function Ee(t) {
  return ea(t) || na(t) || t === 95;
}
function Ws(t) {
  return Ee(t) || rt(t) || t === 45;
}
function sa(t) {
  return t >= 0 && t <= 8 || t === 11 || t >= 14 && t <= 31 || t === 127;
}
function $e(t) {
  return t === 10 || t === 13 || t === 12;
}
function Ft(t) {
  return $e(t) || t === 32 || t === 9;
}
function kt(t, e) {
  return !(t !== 92 || $e(e) || e === Zo);
}
function Me(t, e, n) {
  return t === 45 ? Ee(e) || e === 45 || kt(e, n) : Ee(t) ? !0 : t === 92 ? kt(t, e) : !1;
}
function je(t, e, n) {
  return t === 43 || t === 45 ? rt(e) ? 2 : e === 46 && rt(n) ? 3 : 0 : t === 46 ? rt(e) ? 2 : 0 : rt(t) ? 1 : 0;
}
function zs(t) {
  return t === 65279 || t === 65534 ? 1 : 0;
}
const on = new Array(128), ra = 128, ye = 130, Hs = 131, xn = 132, Vs = 133;
for (let t = 0; t < on.length; t++)
  on[t] = Ft(t) && ye || rt(t) && Hs || Ee(t) && xn || sa(t) && Vs || t || ra;
function Be(t) {
  return t < 128 ? on[t] : xn;
}
function Kt(t, e) {
  return e < t.length ? t.charCodeAt(e) : 0;
}
function an(t, e, n) {
  return n === 13 && Kt(t, e + 1) === 10 ? 2 : 1;
}
function Gs(t, e, n) {
  let s = t.charCodeAt(e);
  return bn(s) && (s = s | 32), s === n;
}
function Le(t, e, n, s) {
  if (n - e !== s.length || e < 0 || n > t.length)
    return !1;
  for (let r = e; r < n; r++) {
    const o = s.charCodeAt(r - e);
    let a = t.charCodeAt(r);
    if (bn(a) && (a = a | 32), a !== o)
      return !1;
  }
  return !0;
}
function ia(t, e) {
  for (; e >= 0 && Ft(t.charCodeAt(e)); e--)
    ;
  return e + 1;
}
function de(t, e) {
  for (; e < t.length && Ft(t.charCodeAt(e)); e++)
    ;
  return e;
}
function Ue(t, e) {
  for (; e < t.length && rt(t.charCodeAt(e)); e++)
    ;
  return e;
}
function Jt(t, e) {
  if (e += 2, Xt(Kt(t, e - 1))) {
    for (const s = Math.min(t.length, e + 5); e < s && Xt(Kt(t, e)); e++)
      ;
    const n = Kt(t, e);
    Ft(n) && (e += an(t, e, n));
  }
  return e;
}
function ge(t, e) {
  for (; e < t.length; e++) {
    const n = t.charCodeAt(e);
    if (!Ws(n)) {
      if (kt(n, Kt(t, e + 1))) {
        e = Jt(t, e) - 1;
        continue;
      }
      break;
    }
  }
  return e;
}
function qs(t, e) {
  let n = t.charCodeAt(e);
  if ((n === 43 || n === 45) && (n = t.charCodeAt(e += 1)), rt(n) && (e = Ue(t, e + 1), n = t.charCodeAt(e)), n === 46 && rt(t.charCodeAt(e + 1)) && (e += 2, e = Ue(t, e)), Gs(
    t,
    e,
    101
    /* e */
  )) {
    let s = 0;
    n = t.charCodeAt(e + 1), (n === 45 || n === 43) && (s = 1, n = t.charCodeAt(e + 2)), rt(n) && (e = Ue(t, e + 1 + s + 1));
  }
  return e;
}
function We(t, e) {
  for (; e < t.length; e++) {
    const n = t.charCodeAt(e);
    if (n === 41) {
      e++;
      break;
    }
    kt(n, Kt(t, e + 1)) && (e = Jt(t, e));
  }
  return e;
}
function Ks(t) {
  if (t.length === 1 && !Xt(t.charCodeAt(0)))
    return t[0];
  let e = parseInt(t, 16);
  return (e === 0 || // If this number is zero,
  e >= 55296 && e <= 57343 || // or is for a surrogate,
  e > 1114111) && (e = 65533), String.fromCodePoint(e);
}
const Qs = [
  "EOF-token",
  "ident-token",
  "function-token",
  "at-keyword-token",
  "hash-token",
  "string-token",
  "bad-string-token",
  "url-token",
  "bad-url-token",
  "delim-token",
  "number-token",
  "percentage-token",
  "dimension-token",
  "whitespace-token",
  "CDO-token",
  "CDC-token",
  "colon-token",
  "semicolon-token",
  "comma-token",
  "[-token",
  "]-token",
  "(-token",
  ")-token",
  "{-token",
  "}-token",
  "comment-token"
], oa = 16 * 1024;
function Pe(t = null, e) {
  return t === null || t.length < e ? new Uint32Array(Math.max(e + 1024, oa)) : t;
}
const In = 10, aa = 12, _n = 13;
function Nn(t) {
  const e = t.source, n = e.length, s = e.length > 0 ? zs(e.charCodeAt(0)) : 0, r = Pe(t.lines, n), o = Pe(t.columns, n);
  let a = t.startLine, l = t.startColumn;
  for (let u = s; u < n; u++) {
    const i = e.charCodeAt(u);
    r[u] = a, o[u] = l++, (i === In || i === _n || i === aa) && (i === _n && u + 1 < n && e.charCodeAt(u + 1) === In && (u++, r[u] = a, o[u] = l), a++, l = 1);
  }
  r[n] = a, o[n] = l, t.lines = r, t.columns = o, t.computed = !0;
}
class la {
  constructor(e, n, s, r) {
    this.setSource(e, n, s, r), this.lines = null, this.columns = null;
  }
  setSource(e = "", n = 0, s = 1, r = 1) {
    this.source = e, this.startOffset = n, this.startLine = s, this.startColumn = r, this.computed = !1;
  }
  getLocation(e, n) {
    return this.computed || Nn(this), {
      source: n,
      offset: this.startOffset + e,
      line: this.lines[e],
      column: this.columns[e]
    };
  }
  getLocationRange(e, n, s) {
    return this.computed || Nn(this), {
      source: s,
      start: {
        offset: this.startOffset + e,
        line: this.lines[e],
        column: this.columns[e]
      },
      end: {
        offset: this.startOffset + n,
        line: this.lines[n],
        column: this.columns[n]
      }
    };
  }
}
const dt = 16777215, gt = 24, Mt = new Uint8Array(32);
Mt[T] = y;
Mt[I] = y;
Mt[ee] = ce;
Mt[ht] = Yt;
function Dn(t) {
  return Mt[t] !== 0;
}
class ca {
  constructor(e, n) {
    this.setSource(e, n);
  }
  reset() {
    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
  }
  setSource(e = "", n = () => {
  }) {
    e = String(e || "");
    const s = e.length, r = Pe(this.offsetAndType, e.length + 1), o = Pe(this.balance, e.length + 1);
    let a = 0, l = -1, u = 0, i = e.length;
    this.offsetAndType = null, this.balance = null, o.fill(0), n(e, (c, h, f) => {
      const p = a++;
      if (r[p] = c << gt | f, l === -1 && (l = h), o[p] = i, c === u) {
        const g = o[i];
        o[i] = p, i = g, u = Mt[r[g] >> gt];
      } else Dn(c) && (i = p, u = Mt[c]);
    }), r[a] = vt << gt | s, o[a] = a;
    for (let c = 0; c < a; c++) {
      const h = o[c];
      if (h <= c) {
        const f = o[h];
        f !== c && (o[c] = f);
      } else h > a && (o[c] = a);
    }
    this.source = e, this.firstCharOffset = l === -1 ? 0 : l, this.tokenCount = a, this.offsetAndType = r, this.balance = o, this.reset(), this.next();
  }
  lookupType(e) {
    return e += this.tokenIndex, e < this.tokenCount ? this.offsetAndType[e] >> gt : vt;
  }
  lookupTypeNonSC(e) {
    for (let n = this.tokenIndex; n < this.tokenCount; n++) {
      const s = this.offsetAndType[n] >> gt;
      if (s !== W && s !== Y && e-- === 0)
        return s;
    }
    return vt;
  }
  lookupOffset(e) {
    return e += this.tokenIndex, e < this.tokenCount ? this.offsetAndType[e - 1] & dt : this.source.length;
  }
  lookupOffsetNonSC(e) {
    for (let n = this.tokenIndex; n < this.tokenCount; n++) {
      const s = this.offsetAndType[n] >> gt;
      if (s !== W && s !== Y && e-- === 0)
        return n - this.tokenIndex;
    }
    return vt;
  }
  lookupValue(e, n) {
    return e += this.tokenIndex, e < this.tokenCount ? Le(
      this.source,
      this.offsetAndType[e - 1] & dt,
      this.offsetAndType[e] & dt,
      n
    ) : !1;
  }
  getTokenStart(e) {
    return e === this.tokenIndex ? this.tokenStart : e > 0 ? e < this.tokenCount ? this.offsetAndType[e - 1] & dt : this.offsetAndType[this.tokenCount] & dt : this.firstCharOffset;
  }
  substrToCursor(e) {
    return this.source.substring(e, this.tokenStart);
  }
  isBalanceEdge(e) {
    return this.balance[this.tokenIndex] < e;
  }
  isDelim(e, n) {
    return n ? this.lookupType(n) === L && this.source.charCodeAt(this.lookupOffset(n)) === e : this.tokenType === L && this.source.charCodeAt(this.tokenStart) === e;
  }
  skip(e) {
    let n = this.tokenIndex + e;
    n < this.tokenCount ? (this.tokenIndex = n, this.tokenStart = this.offsetAndType[n - 1] & dt, n = this.offsetAndType[n], this.tokenType = n >> gt, this.tokenEnd = n & dt) : (this.tokenIndex = this.tokenCount, this.next());
  }
  next() {
    let e = this.tokenIndex + 1;
    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.tokenEnd, e = this.offsetAndType[e], this.tokenType = e >> gt, this.tokenEnd = e & dt) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = vt, this.tokenStart = this.tokenEnd = this.source.length);
  }
  skipSC() {
    for (; this.tokenType === W || this.tokenType === Y; )
      this.next();
  }
  skipUntilBalanced(e, n) {
    let s = e, r = 0, o = 0;
    t:
      for (; s < this.tokenCount; s++) {
        if (r = this.balance[s], r < e)
          break t;
        switch (o = s > 0 ? this.offsetAndType[s - 1] & dt : this.firstCharOffset, n(this.source.charCodeAt(o))) {
          case 1:
            break t;
          case 2:
            s++;
            break t;
          default:
            Dn(this.offsetAndType[s] >> gt) && (s = r);
        }
      }
    this.skip(s - this.tokenIndex);
  }
  forEachToken(e) {
    for (let n = 0, s = this.firstCharOffset; n < this.tokenCount; n++) {
      const r = s, o = this.offsetAndType[n], a = o & dt, l = o >> gt;
      s = a, e(l, r, a, n);
    }
  }
  dump() {
    const e = new Array(this.tokenCount);
    return this.forEachToken((n, s, r, o) => {
      e[o] = {
        idx: o,
        type: Qs[n],
        chunk: this.source.substring(s, r),
        balance: this.balance[o]
      };
    }), e;
  }
}
function Ys(t, e) {
  function n(h) {
    return h < l ? t.charCodeAt(h) : 0;
  }
  function s() {
    if (i = qs(t, i), Me(n(i), n(i + 1), n(i + 2))) {
      c = E, i = ge(t, i);
      return;
    }
    if (n(i) === 37) {
      c = F, i++;
      return;
    }
    c = b;
  }
  function r() {
    const h = i;
    if (i = ge(t, i), Le(t, h, i, "url") && n(i) === 40) {
      if (i = de(t, i + 1), n(i) === 34 || n(i) === 39) {
        c = T, i = h + 4;
        return;
      }
      a();
      return;
    }
    if (n(i) === 40) {
      c = T, i++;
      return;
    }
    c = d;
  }
  function o(h) {
    for (h || (h = n(i++)), c = Tt; i < t.length; i++) {
      const f = t.charCodeAt(i);
      switch (Be(f)) {
        // ending code point
        case h:
          i++;
          return;
        // EOF
        // case EofCategory:
        // This is a parse error. Return the <string-token>.
        // return;
        // newline
        case ye:
          if ($e(f)) {
            i += an(t, i, f), c = Jo;
            return;
          }
          break;
        // U+005C REVERSE SOLIDUS (\)
        case 92:
          if (i === t.length - 1)
            break;
          const p = n(i + 1);
          $e(p) ? i += an(t, i + 1, p) : kt(f, p) && (i = Jt(t, i) - 1);
          break;
      }
    }
  }
  function a() {
    for (c = Q, i = de(t, i); i < t.length; i++) {
      const h = t.charCodeAt(i);
      switch (Be(h)) {
        // U+0029 RIGHT PARENTHESIS ())
        case 41:
          i++;
          return;
        // EOF
        // case EofCategory:
        // This is a parse error. Return the <url-token>.
        // return;
        // whitespace
        case ye:
          if (i = de(t, i), n(i) === 41 || i >= t.length) {
            i < t.length && i++;
            return;
          }
          i = We(t, i), c = at;
          return;
        // U+0022 QUOTATION MARK (")
        // U+0027 APOSTROPHE (')
        // U+0028 LEFT PARENTHESIS (()
        // non-printable code point
        case 34:
        case 39:
        case 40:
        case Vs:
          i = We(t, i), c = at;
          return;
        // U+005C REVERSE SOLIDUS (\)
        case 92:
          if (kt(h, n(i + 1))) {
            i = Jt(t, i) - 1;
            break;
          }
          i = We(t, i), c = at;
          return;
      }
    }
  }
  t = String(t || "");
  const l = t.length;
  let u = zs(n(0)), i = u, c;
  for (; i < l; ) {
    const h = t.charCodeAt(i);
    switch (Be(h)) {
      // whitespace
      case ye:
        c = W, i = de(t, i + 1);
        break;
      // U+0022 QUOTATION MARK (")
      case 34:
        o();
        break;
      // U+0023 NUMBER SIGN (#)
      case 35:
        Ws(n(i + 1)) || kt(n(i + 1), n(i + 2)) ? (c = _, i = ge(t, i + 1)) : (c = L, i++);
        break;
      // U+0027 APOSTROPHE (')
      case 39:
        o();
        break;
      // U+0028 LEFT PARENTHESIS (()
      case 40:
        c = I, i++;
        break;
      // U+0029 RIGHT PARENTHESIS ())
      case 41:
        c = y, i++;
        break;
      // U+002B PLUS SIGN (+)
      case 43:
        je(h, n(i + 1), n(i + 2)) ? s() : (c = L, i++);
        break;
      // U+002C COMMA (,)
      case 44:
        c = ft, i++;
        break;
      // U+002D HYPHEN-MINUS (-)
      case 45:
        je(h, n(i + 1), n(i + 2)) ? s() : n(i + 1) === 45 && n(i + 2) === 62 ? (c = nt, i = i + 3) : Me(h, n(i + 1), n(i + 2)) ? r() : (c = L, i++);
        break;
      // U+002E FULL STOP (.)
      case 46:
        je(h, n(i + 1), n(i + 2)) ? s() : (c = L, i++);
        break;
      // U+002F SOLIDUS (/)
      case 47:
        n(i + 1) === 42 ? (c = Y, i = t.indexOf("*/", i + 2), i = i === -1 ? t.length : i + 2) : (c = L, i++);
        break;
      // U+003A COLON (:)
      case 58:
        c = X, i++;
        break;
      // U+003B SEMICOLON (;)
      case 59:
        c = tt, i++;
        break;
      // U+003C LESS-THAN SIGN (<)
      case 60:
        n(i + 1) === 33 && n(i + 2) === 45 && n(i + 3) === 45 ? (c = De, i = i + 4) : (c = L, i++);
        break;
      // U+0040 COMMERCIAL AT (@)
      case 64:
        Me(n(i + 1), n(i + 2), n(i + 3)) ? (c = z, i = ge(t, i + 1)) : (c = L, i++);
        break;
      // U+005B LEFT SQUARE BRACKET ([)
      case 91:
        c = ee, i++;
        break;
      // U+005C REVERSE SOLIDUS (\)
      case 92:
        kt(h, n(i + 1)) ? r() : (c = L, i++);
        break;
      // U+005D RIGHT SQUARE BRACKET (])
      case 93:
        c = ce, i++;
        break;
      // U+007B LEFT CURLY BRACKET ({)
      case 123:
        c = ht, i++;
        break;
      // U+007D RIGHT CURLY BRACKET (})
      case 125:
        c = Yt, i++;
        break;
      // digit
      case Hs:
        s();
        break;
      // name-start code point
      case xn:
        r();
        break;
      // EOF
      // case EofCategory:
      // Return an <EOF-token>.
      // break;
      // anything else
      default:
        c = L, i++;
    }
    e(c, u, u = i);
  }
}
const Fn = 45;
function ua(t, e) {
  return e = e || 0, t.length - e >= 2 && t.charCodeAt(e) === Fn && t.charCodeAt(e + 1) === Fn;
}
const ln = 92, Xs = 34, ha = 39;
function Js(t) {
  const e = t.length, n = t.charCodeAt(0), s = n === Xs || n === ha ? 1 : 0, r = s === 1 && e > 1 && t.charCodeAt(e - 1) === n ? e - 2 : e - 1;
  let o = "";
  for (let a = s; a <= r; a++) {
    let l = t.charCodeAt(a);
    if (l === ln) {
      if (a === r) {
        a !== e - 1 && (o = t.substr(a + 1));
        break;
      }
      if (l = t.charCodeAt(++a), kt(ln, l)) {
        const u = a - 1, i = Jt(t, u);
        a = i - 1, o += Ks(t.substring(u + 1, i));
      } else
        l === 13 && t.charCodeAt(a + 1) === 10 && a++;
    } else
      o += t[a];
  }
  return o;
}
function fa(t, e) {
  const s = Xs;
  let r = "", o = !1;
  for (let a = 0; a < t.length; a++) {
    const l = t.charCodeAt(a);
    if (l === 0) {
      r += "�";
      continue;
    }
    if (l <= 31 || l === 127) {
      r += "\\" + l.toString(16), o = !0;
      continue;
    }
    l === s || l === ln ? (r += "\\" + t.charAt(a), o = !1) : (o && (Xt(l) || Ft(l)) && (r += " "), r += t.charAt(a), o = !1);
  }
  return '"' + r + '"';
}
const pa = 32, cn = 92, da = 34, ga = 39, ma = 40, Zs = 41;
function ka(t) {
  const e = t.length;
  let n = 4, s = t.charCodeAt(e - 1) === Zs ? e - 2 : e - 1, r = "";
  for (; n < s && Ft(t.charCodeAt(n)); )
    n++;
  for (; n < s && Ft(t.charCodeAt(s)); )
    s--;
  for (let o = n; o <= s; o++) {
    let a = t.charCodeAt(o);
    if (a === cn) {
      if (o === s) {
        o !== e - 1 && (r = t.substr(o + 1));
        break;
      }
      if (a = t.charCodeAt(++o), kt(cn, a)) {
        const l = o - 1, u = Jt(t, l);
        o = u - 1, r += Ks(t.substring(l + 1, u));
      } else
        a === 13 && t.charCodeAt(o + 1) === 10 && o++;
    } else
      r += t[o];
  }
  return r;
}
function Sa(t) {
  let e = "", n = !1;
  for (let s = 0; s < t.length; s++) {
    const r = t.charCodeAt(s);
    if (r === 0) {
      e += "�";
      continue;
    }
    if (r <= 31 || r === 127) {
      e += "\\" + r.toString(16), n = !0;
      continue;
    }
    r === pa || r === cn || r === da || r === ga || r === ma || r === Zs ? (e += "\\" + t.charAt(s), n = !1) : (n && Xt(r) && (e += " "), e += t.charAt(s), n = !1);
  }
  return "url(" + e + ")";
}
const { hasOwnProperty: Cn } = Object.prototype, ne = function() {
};
function Mn(t) {
  return typeof t == "function" ? t : ne;
}
function jn(t, e) {
  return function(n, s, r) {
    n.type === e && t.call(this, n, s, r);
  };
}
function ya(t, e) {
  const n = e.structure, s = [];
  for (const r in n) {
    if (Cn.call(n, r) === !1)
      continue;
    let o = n[r];
    const a = {
      name: r,
      type: !1,
      nullable: !1
    };
    Array.isArray(o) || (o = [o]);
    for (const l of o)
      l === null ? a.nullable = !0 : typeof l == "string" ? a.type = "node" : Array.isArray(l) && (a.type = "list");
    a.type && s.push(a);
  }
  return s.length ? {
    context: e.walkContext,
    fields: s
  } : null;
}
function ba(t) {
  const e = {};
  for (const n in t.node)
    if (Cn.call(t.node, n)) {
      const s = t.node[n];
      if (!s.structure)
        throw new Error("Missed `structure` field in `" + n + "` node type definition");
      e[n] = ya(n, s);
    }
  return e;
}
function Bn(t, e) {
  const n = t.fields.slice(), s = t.context, r = typeof s == "string";
  return e && n.reverse(), function(o, a, l, u) {
    let i;
    r && (i = a[s], a[s] = o);
    for (const c of n) {
      const h = o[c.name];
      if (!c.nullable || h) {
        if (c.type === "list") {
          if (e ? h.reduceRight(u, !1) : h.reduce(u, !1))
            return !0;
        } else if (l(h))
          return !0;
      }
    }
    r && (a[s] = i);
  };
}
function Un({
  StyleSheet: t,
  Atrule: e,
  Rule: n,
  Block: s,
  DeclarationList: r
}) {
  return {
    Atrule: {
      StyleSheet: t,
      Atrule: e,
      Rule: n,
      Block: s
    },
    Rule: {
      StyleSheet: t,
      Atrule: e,
      Rule: n,
      Block: s
    },
    Declaration: {
      StyleSheet: t,
      Atrule: e,
      Rule: n,
      Block: s,
      DeclarationList: r
    }
  };
}
function xa(t) {
  const e = ba(t), n = {}, s = {}, r = /* @__PURE__ */ Symbol("break-walk"), o = /* @__PURE__ */ Symbol("skip-node");
  for (const i in e)
    Cn.call(e, i) && e[i] !== null && (n[i] = Bn(e[i], !1), s[i] = Bn(e[i], !0));
  const a = Un(n), l = Un(s), u = function(i, c) {
    function h(S, x, A) {
      const M = f.call(k, S, x, A);
      return M === r ? !0 : M === o ? !1 : !!(g.hasOwnProperty(S.type) && g[S.type](S, k, h, m) || p.call(k, S, x, A) === r);
    }
    let f = ne, p = ne, g = n, m = (S, x, A, M) => S || h(x, A, M);
    const k = {
      break: r,
      skip: o,
      root: i,
      stylesheet: null,
      atrule: null,
      atrulePrelude: null,
      rule: null,
      selector: null,
      block: null,
      declaration: null,
      function: null
    };
    if (typeof c == "function")
      f = c;
    else if (c && (f = Mn(c.enter), p = Mn(c.leave), c.reverse && (g = s), c.visit)) {
      if (a.hasOwnProperty(c.visit))
        g = c.reverse ? l[c.visit] : a[c.visit];
      else if (!e.hasOwnProperty(c.visit))
        throw new Error("Bad value `" + c.visit + "` for `visit` option (should be: " + Object.keys(e).sort().join(", ") + ")");
      f = jn(f, c.visit), p = jn(p, c.visit);
    }
    if (f === ne && p === ne)
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    h(i);
  };
  return u.break = r, u.skip = o, u.find = function(i, c) {
    let h = null;
    return u(i, function(f, p, g) {
      if (c.call(this, f, p, g))
        return h = f, r;
    }), h;
  }, u.findLast = function(i, c) {
    let h = null;
    return u(i, {
      reverse: !0,
      enter(f, p, g) {
        if (c.call(this, f, p, g))
          return h = f, r;
      }
    }), h;
  }, u.findAll = function(i, c) {
    const h = [];
    return u(i, function(f, p, g) {
      c.call(this, f, p, g) && h.push(f);
    }), h;
  }, u;
}
const mt = 43, st = 45, be = 110, It = !0, Ca = !1;
function xe(t, e) {
  let n = this.tokenStart + t;
  const s = this.charCodeAt(n);
  for ((s === mt || s === st) && (e && this.error("Number sign is not allowed"), n++); n < this.tokenEnd; n++)
    rt(this.charCodeAt(n)) || this.error("Integer is expected", n);
}
function Ht(t) {
  return xe.call(this, 0, t);
}
function At(t, e) {
  if (!this.cmpChar(this.tokenStart + t, e)) {
    let n = "";
    switch (e) {
      case be:
        n = "N is expected";
        break;
      case st:
        n = "HyphenMinus is expected";
        break;
    }
    this.error(n, this.tokenStart + t);
  }
}
function ze() {
  let t = 0, e = 0, n = this.tokenType;
  for (; n === W || n === Y; )
    n = this.lookupType(++t);
  if (n !== b)
    if (this.isDelim(mt, t) || this.isDelim(st, t)) {
      e = this.isDelim(mt, t) ? mt : st;
      do
        n = this.lookupType(++t);
      while (n === W || n === Y);
      n !== b && (this.skip(t), Ht.call(this, It));
    } else
      return null;
  return t > 0 && this.skip(t), e === 0 && (n = this.charCodeAt(this.tokenStart), n !== mt && n !== st && this.error("Number sign is expected")), Ht.call(this, e !== 0), e === st ? "-" + this.consume(b) : this.consume(b);
}
const wa = "AnPlusB", Ta = {
  a: [String, null],
  b: [String, null]
};
function tr() {
  const t = this.tokenStart;
  let e = null, n = null;
  if (this.tokenType === b)
    Ht.call(this, Ca), n = this.consume(b);
  else if (this.tokenType === d && this.cmpChar(this.tokenStart, st))
    switch (e = "-1", At.call(this, 1, be), this.tokenEnd - this.tokenStart) {
      // -n
      // -n <signed-integer>
      // -n ['+' | '-'] <signless-integer>
      case 2:
        this.next(), n = ze.call(this);
        break;
      // -n- <signless-integer>
      case 3:
        At.call(this, 2, st), this.next(), this.skipSC(), Ht.call(this, It), n = "-" + this.consume(b);
        break;
      // <dashndashdigit-ident>
      default:
        At.call(this, 2, st), xe.call(this, 3, It), this.next(), n = this.substrToCursor(t + 2);
    }
  else if (this.tokenType === d || this.isDelim(mt) && this.lookupType(1) === d) {
    let s = 0;
    switch (e = "1", this.isDelim(mt) && (s = 1, this.next()), At.call(this, 0, be), this.tokenEnd - this.tokenStart) {
      // '+'? n
      // '+'? n <signed-integer>
      // '+'? n ['+' | '-'] <signless-integer>
      case 1:
        this.next(), n = ze.call(this);
        break;
      // '+'? n- <signless-integer>
      case 2:
        At.call(this, 1, st), this.next(), this.skipSC(), Ht.call(this, It), n = "-" + this.consume(b);
        break;
      // '+'? <ndashdigit-ident>
      default:
        At.call(this, 1, st), xe.call(this, 2, It), this.next(), n = this.substrToCursor(t + s + 1);
    }
  } else if (this.tokenType === E) {
    const s = this.charCodeAt(this.tokenStart), r = s === mt || s === st;
    let o = this.tokenStart + r;
    for (; o < this.tokenEnd && rt(this.charCodeAt(o)); o++)
      ;
    o === this.tokenStart + r && this.error("Integer is expected", this.tokenStart + r), At.call(this, o - this.tokenStart, be), e = this.substring(t, o), o + 1 === this.tokenEnd ? (this.next(), n = ze.call(this)) : (At.call(this, o - this.tokenStart + 1, st), o + 2 === this.tokenEnd ? (this.next(), this.skipSC(), Ht.call(this, It), n = "-" + this.consume(b)) : (xe.call(this, o - this.tokenStart + 2, It), this.next(), n = this.substrToCursor(o + 1)));
  } else
    this.error();
  return e !== null && e.charCodeAt(0) === mt && (e = e.substr(1)), n !== null && n.charCodeAt(0) === mt && (n = n.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(t, this.tokenStart),
    a: e,
    b: n
  };
}
function er(t) {
  if (t.a) {
    const e = t.a === "+1" && "n" || t.a === "1" && "n" || t.a === "-1" && "-n" || t.a + "n";
    if (t.b) {
      const n = t.b[0] === "-" || t.b[0] === "+" ? t.b : "+" + t.b;
      this.tokenize(e + n);
    } else
      this.tokenize(e);
  } else
    this.tokenize(t.b);
}
const Aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: er,
  name: wa,
  parse: tr,
  structure: Ta
}, Symbol.toStringTag, { value: "Module" }));
function Wn() {
  return this.Raw(this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function va() {
  for (let t = 1, e; e = this.lookupType(t); t++) {
    if (e === Yt)
      return !0;
    if (e === ht || e === z)
      return !1;
  }
  return !1;
}
const Ea = "Atrule", $a = "atrule", La = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function nr(t = !1) {
  const e = this.tokenStart;
  let n, s, r = null, o = null;
  switch (this.eat(z), n = this.substrToCursor(e + 1), s = n.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== ht && this.tokenType !== tt && (this.parseAtrulePrelude ? r = this.parseWithFallback(this.AtrulePrelude.bind(this, n, t), Wn) : r = Wn.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case tt:
      this.next();
      break;
    case ht:
      hasOwnProperty.call(this.atrule, s) && typeof this.atrule[s].block == "function" ? o = this.atrule[s].block.call(this, t) : o = this.Block(va.call(this));
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(e, this.tokenStart),
    name: n,
    prelude: r,
    block: o
  };
}
function sr(t) {
  this.token(z, "@" + t.name), t.prelude !== null && this.node(t.prelude), t.block ? this.node(t.block) : this.token(tt, ";");
}
const Pa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: sr,
  name: Ea,
  parse: nr,
  structure: La,
  walkContext: $a
}, Symbol.toStringTag, { value: "Module" })), Oa = "AtrulePrelude", Ra = "atrulePrelude", Ia = {
  children: [[]]
};
function rr(t) {
  let e = null;
  return t !== null && (t = t.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, t) && typeof this.atrule[t].prelude == "function" ? e = this.atrule[t].prelude.call(this) : e = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== ht && this.tokenType !== tt && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function ir(t) {
  this.children(t);
}
const _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ir,
  name: Oa,
  parse: rr,
  structure: Ia,
  walkContext: Ra
}, Symbol.toStringTag, { value: "Module" })), Na = 36, or = 42, Ce = 61, Da = 94, un = 124, Fa = 126;
function Ma() {
  this.eof && this.error("Unexpected end of input");
  const t = this.tokenStart;
  let e = !1;
  return this.isDelim(or) ? (e = !0, this.next()) : this.isDelim(un) || this.eat(d), this.isDelim(un) ? this.charCodeAt(this.tokenStart + 1) !== Ce ? (this.next(), this.eat(d)) : e && this.error("Identifier is expected", this.tokenEnd) : e && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(t, this.tokenStart),
    name: this.substrToCursor(t)
  };
}
function ja() {
  const t = this.tokenStart, e = this.charCodeAt(t);
  return e !== Ce && // =
  e !== Fa && // ~=
  e !== Da && // ^=
  e !== Na && // $=
  e !== or && // *=
  e !== un && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), e !== Ce && (this.isDelim(Ce) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(t);
}
const Ba = "AttributeSelector", Ua = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function ar() {
  const t = this.tokenStart;
  let e, n = null, s = null, r = null;
  return this.eat(ee), this.skipSC(), e = Ma.call(this), this.skipSC(), this.tokenType !== ce && (this.tokenType !== d && (n = ja.call(this), this.skipSC(), s = this.tokenType === Tt ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === d && (r = this.consume(d), this.skipSC())), this.eat(ce), {
    type: "AttributeSelector",
    loc: this.getLocation(t, this.tokenStart),
    name: e,
    matcher: n,
    value: s,
    flags: r
  };
}
function lr(t) {
  this.token(L, "["), this.node(t.name), t.matcher !== null && (this.tokenize(t.matcher), this.node(t.value)), t.flags !== null && this.token(d, t.flags), this.token(L, "]");
}
const Wa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lr,
  name: Ba,
  parse: ar,
  structure: Ua
}, Symbol.toStringTag, { value: "Module" })), za = 38;
function cr() {
  return this.Raw(null, !0);
}
function zn() {
  return this.parseWithFallback(this.Rule, cr);
}
function Hn() {
  return this.Raw(this.consumeUntilSemicolonIncluded, !0);
}
function Ha() {
  if (this.tokenType === tt)
    return Hn.call(this, this.tokenIndex);
  const t = this.parseWithFallback(this.Declaration, Hn);
  return this.tokenType === tt && this.next(), t;
}
const Va = "Block", Ga = "block", qa = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function ur(t) {
  const e = t ? Ha : zn, n = this.tokenStart;
  let s = this.createList();
  this.eat(ht);
  t:
    for (; !this.eof; )
      switch (this.tokenType) {
        case Yt:
          break t;
        case W:
        case Y:
          this.next();
          break;
        case z:
          s.push(this.parseWithFallback(this.Atrule.bind(this, t), cr));
          break;
        default:
          t && this.isDelim(za) ? s.push(zn.call(this)) : s.push(e.call(this));
      }
  return this.eof || this.eat(Yt), {
    type: "Block",
    loc: this.getLocation(n, this.tokenStart),
    children: s
  };
}
function hr(t) {
  this.token(ht, "{"), this.children(t, (e) => {
    e.type === "Declaration" && this.token(tt, ";");
  }), this.token(Yt, "}");
}
const Ka = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: hr,
  name: Va,
  parse: ur,
  structure: qa,
  walkContext: Ga
}, Symbol.toStringTag, { value: "Module" })), Qa = "Brackets", Ya = {
  children: [[]]
};
function fr(t, e) {
  const n = this.tokenStart;
  let s = null;
  return this.eat(ee), s = t.call(this, e), this.eof || this.eat(ce), {
    type: "Brackets",
    loc: this.getLocation(n, this.tokenStart),
    children: s
  };
}
function pr(t) {
  this.token(L, "["), this.children(t), this.token(L, "]");
}
const Xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: pr,
  name: Qa,
  parse: fr,
  structure: Ya
}, Symbol.toStringTag, { value: "Module" })), Ja = "CDC", Za = [];
function dr() {
  const t = this.tokenStart;
  return this.eat(nt), {
    type: "CDC",
    loc: this.getLocation(t, this.tokenStart)
  };
}
function gr() {
  this.token(nt, "-->");
}
const tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: gr,
  name: Ja,
  parse: dr,
  structure: Za
}, Symbol.toStringTag, { value: "Module" })), el = "CDO", nl = [];
function mr() {
  const t = this.tokenStart;
  return this.eat(De), {
    type: "CDO",
    loc: this.getLocation(t, this.tokenStart)
  };
}
function kr() {
  this.token(De, "<!--");
}
const sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: kr,
  name: el,
  parse: mr,
  structure: nl
}, Symbol.toStringTag, { value: "Module" })), rl = 46, il = "ClassSelector", ol = {
  name: String
};
function Sr() {
  return this.eatDelim(rl), {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(d)
  };
}
function yr(t) {
  this.token(L, "."), this.token(d, t.name);
}
const al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: yr,
  name: il,
  parse: Sr,
  structure: ol
}, Symbol.toStringTag, { value: "Module" })), ll = 43, Vn = 47, cl = 62, ul = 126, hl = "Combinator", fl = {
  name: String
};
function br() {
  const t = this.tokenStart;
  let e;
  switch (this.tokenType) {
    case W:
      e = " ";
      break;
    case L:
      switch (this.charCodeAt(this.tokenStart)) {
        case cl:
        case ll:
        case ul:
          this.next();
          break;
        case Vn:
          this.next(), this.eatIdent("deep"), this.eatDelim(Vn);
          break;
        default:
          this.error("Combinator is expected");
      }
      e = this.substrToCursor(t);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(t, this.tokenStart),
    name: e
  };
}
function xr(t) {
  this.tokenize(t.name);
}
const pl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xr,
  name: hl,
  parse: br,
  structure: fl
}, Symbol.toStringTag, { value: "Module" })), dl = 42, gl = 47, ml = "Comment", kl = {
  value: String
};
function Cr() {
  const t = this.tokenStart;
  let e = this.tokenEnd;
  return this.eat(Y), e - t + 2 >= 2 && this.charCodeAt(e - 2) === dl && this.charCodeAt(e - 1) === gl && (e -= 2), {
    type: "Comment",
    loc: this.getLocation(t, this.tokenStart),
    value: this.substring(t + 2, e)
  };
}
function wr(t) {
  this.token(Y, "/*" + t.value + "*/");
}
const Sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: wr,
  name: ml,
  parse: Cr,
  structure: kl
}, Symbol.toStringTag, { value: "Module" })), yl = /* @__PURE__ */ new Set([X, y, vt]), bl = "Condition", xl = {
  kind: String,
  children: [[
    "Identifier",
    "Feature",
    "FeatureFunction",
    "FeatureRange",
    "SupportsDeclaration"
  ]]
};
function Gn(t) {
  return this.lookupTypeNonSC(1) === d && yl.has(this.lookupTypeNonSC(2)) ? this.Feature(t) : this.FeatureRange(t);
}
const Cl = {
  media: Gn,
  container: Gn,
  supports() {
    return this.SupportsDeclaration();
  }
};
function Tr(t = "media") {
  const e = this.createList();
  t: for (; !this.eof; )
    switch (this.tokenType) {
      case Y:
      case W:
        this.next();
        continue;
      case d:
        e.push(this.Identifier());
        break;
      case I: {
        let n = this.parseWithFallback(
          () => Cl[t].call(this, t),
          () => null
        );
        n || (n = this.parseWithFallback(
          () => {
            this.eat(I);
            const s = this.Condition(t);
            return this.eat(y), s;
          },
          () => this.GeneralEnclosed(t)
        )), e.push(n);
        break;
      }
      case T: {
        let n = this.parseWithFallback(
          () => this.FeatureFunction(t),
          () => null
        );
        n || (n = this.GeneralEnclosed(t)), e.push(n);
        break;
      }
      default:
        break t;
    }
  return e.isEmpty && this.error("Condition is expected"), {
    type: "Condition",
    loc: this.getLocationFromList(e),
    kind: t,
    children: e
  };
}
function Ar(t) {
  t.children.forEach((e) => {
    e.type === "Condition" ? (this.token(I, "("), this.node(e), this.token(y, ")")) : this.node(e);
  });
}
const wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Ar,
  name: bl,
  parse: Tr,
  structure: xl
}, Symbol.toStringTag, { value: "Module" })), vr = 33, Tl = 35, Al = 36, vl = 38, El = 42, $l = 43, qn = 47;
function Ll() {
  return this.Raw(this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function Pl() {
  return this.Raw(this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function Ol() {
  const t = this.tokenIndex, e = this.Value();
  return e.type !== "Raw" && this.eof === !1 && this.tokenType !== tt && this.isDelim(vr) === !1 && this.isBalanceEdge(t) === !1 && this.error(), e;
}
const Rl = "Declaration", Il = "declaration", _l = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function Er() {
  const t = this.tokenStart, e = this.tokenIndex, n = Nl.call(this), s = ua(n), r = s ? this.parseCustomProperty : this.parseValue, o = s ? Pl : Ll;
  let a = !1, l;
  this.skipSC(), this.eat(X);
  const u = this.tokenIndex;
  if (s || this.skipSC(), r ? l = this.parseWithFallback(Ol, o) : l = o.call(this, this.tokenIndex), s && l.type === "Value" && l.children.isEmpty) {
    for (let i = u - this.tokenIndex; i <= 0; i++)
      if (this.lookupType(i) === W) {
        l.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
  }
  return this.isDelim(vr) && (a = Dl.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== tt && this.isBalanceEdge(e) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(t, this.tokenStart),
    important: a,
    property: n,
    value: l
  };
}
function $r(t) {
  this.token(d, t.property), this.token(X, ":"), this.node(t.value), t.important && (this.token(L, "!"), this.token(d, t.important === !0 ? "important" : t.important));
}
function Nl() {
  const t = this.tokenStart;
  if (this.tokenType === L)
    switch (this.charCodeAt(this.tokenStart)) {
      case El:
      case Al:
      case $l:
      case Tl:
      case vl:
        this.next();
        break;
      // TODO: not sure we should support this hack
      case qn:
        this.next(), this.isDelim(qn) && this.next();
        break;
    }
  return this.tokenType === _ ? this.eat(_) : this.eat(d), this.substrToCursor(t);
}
function Dl() {
  this.eat(L), this.skipSC();
  const t = this.consume(d);
  return t === "important" ? !0 : t;
}
const Fl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: $r,
  name: Rl,
  parse: Er,
  structure: _l,
  walkContext: Il
}, Symbol.toStringTag, { value: "Module" })), Ml = 38;
function He() {
  return this.Raw(this.consumeUntilSemicolonIncluded, !0);
}
const jl = "DeclarationList", Bl = {
  children: [[
    "Declaration",
    "Atrule",
    "Rule"
  ]]
};
function Lr() {
  const t = this.createList();
  for (; !this.eof; )
    switch (this.tokenType) {
      case W:
      case Y:
      case tt:
        this.next();
        break;
      case z:
        t.push(this.parseWithFallback(this.Atrule.bind(this, !0), He));
        break;
      default:
        this.isDelim(Ml) ? t.push(this.parseWithFallback(this.Rule, He)) : t.push(this.parseWithFallback(this.Declaration, He));
    }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function Pr(t) {
  this.children(t, (e) => {
    e.type === "Declaration" && this.token(tt, ";");
  });
}
const Ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Pr,
  name: jl,
  parse: Lr,
  structure: Bl
}, Symbol.toStringTag, { value: "Module" })), Wl = "Dimension", zl = {
  value: String,
  unit: String
};
function Or() {
  const t = this.tokenStart, e = this.consumeNumber(E);
  return {
    type: "Dimension",
    loc: this.getLocation(t, this.tokenStart),
    value: e,
    unit: this.substring(t + e.length, this.tokenStart)
  };
}
function Rr(t) {
  this.token(E, t.value + t.unit);
}
const Hl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Rr,
  name: Wl,
  parse: Or,
  structure: zl
}, Symbol.toStringTag, { value: "Module" })), Vl = 47, Gl = "Feature", ql = {
  kind: String,
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", "Function", null]
};
function Ir(t) {
  const e = this.tokenStart;
  let n, s = null;
  if (this.eat(I), this.skipSC(), n = this.consume(d), this.skipSC(), this.tokenType !== y) {
    switch (this.eat(X), this.skipSC(), this.tokenType) {
      case b:
        this.lookupNonWSType(1) === L ? s = this.Ratio() : s = this.Number();
        break;
      case E:
        s = this.Dimension();
        break;
      case d:
        s = this.Identifier();
        break;
      case T:
        s = this.parseWithFallback(
          () => {
            const r = this.Function(this.readSequence, this.scope.Value);
            return this.skipSC(), this.isDelim(Vl) && this.error(), r;
          },
          () => this.Ratio()
        );
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  return this.eof || this.eat(y), {
    type: "Feature",
    loc: this.getLocation(e, this.tokenStart),
    kind: t,
    name: n,
    value: s
  };
}
function _r(t) {
  this.token(I, "("), this.token(d, t.name), t.value !== null && (this.token(X, ":"), this.node(t.value)), this.token(y, ")");
}
const Kl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: _r,
  name: Gl,
  parse: Ir,
  structure: ql
}, Symbol.toStringTag, { value: "Module" })), Ql = "FeatureFunction", Yl = {
  kind: String,
  feature: String,
  value: ["Declaration", "Selector"]
};
function Xl(t, e) {
  const s = (this.features[t] || {})[e];
  return typeof s != "function" && this.error(`Unknown feature ${e}()`), s;
}
function Nr(t = "unknown") {
  const e = this.tokenStart, n = this.consumeFunctionName(), s = Xl.call(this, t, n.toLowerCase());
  this.skipSC();
  const r = this.parseWithFallback(
    () => {
      const o = this.tokenIndex, a = s.call(this);
      return this.eof === !1 && this.isBalanceEdge(o) === !1 && this.error(), a;
    },
    () => this.Raw(null, !1)
  );
  return this.eof || this.eat(y), {
    type: "FeatureFunction",
    loc: this.getLocation(e, this.tokenStart),
    kind: t,
    feature: n,
    value: r
  };
}
function Dr(t) {
  this.token(T, t.feature + "("), this.node(t.value), this.token(y, ")");
}
const Jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Dr,
  name: Ql,
  parse: Nr,
  structure: Yl
}, Symbol.toStringTag, { value: "Module" })), Kn = 47, Zl = 60, Qn = 61, tc = 62, ec = "FeatureRange", nc = {
  kind: String,
  left: ["Identifier", "Number", "Dimension", "Ratio", "Function"],
  leftComparison: String,
  middle: ["Identifier", "Number", "Dimension", "Ratio", "Function"],
  rightComparison: [String, null],
  right: ["Identifier", "Number", "Dimension", "Ratio", "Function", null]
};
function Ve() {
  switch (this.skipSC(), this.tokenType) {
    case b:
      return this.isDelim(Kn, this.lookupOffsetNonSC(1)) ? this.Ratio() : this.Number();
    case E:
      return this.Dimension();
    case d:
      return this.Identifier();
    case T:
      return this.parseWithFallback(
        () => {
          const t = this.Function(this.readSequence, this.scope.Value);
          return this.skipSC(), this.isDelim(Kn) && this.error(), t;
        },
        () => this.Ratio()
      );
    default:
      this.error("Number, dimension, ratio or identifier is expected");
  }
}
function Yn(t) {
  if (this.skipSC(), this.isDelim(Zl) || this.isDelim(tc)) {
    const e = this.source[this.tokenStart];
    return this.next(), this.isDelim(Qn) ? (this.next(), e + "=") : e;
  }
  if (this.isDelim(Qn))
    return "=";
  this.error(`Expected ${t ? '":", ' : ""}"<", ">", "=" or ")"`);
}
function Fr(t = "unknown") {
  const e = this.tokenStart;
  this.skipSC(), this.eat(I);
  const n = Ve.call(this), s = Yn.call(this, n.type === "Identifier"), r = Ve.call(this);
  let o = null, a = null;
  return this.lookupNonWSType(0) !== y && (o = Yn.call(this), a = Ve.call(this)), this.skipSC(), this.eat(y), {
    type: "FeatureRange",
    loc: this.getLocation(e, this.tokenStart),
    kind: t,
    left: n,
    leftComparison: s,
    middle: r,
    rightComparison: o,
    right: a
  };
}
function Mr(t) {
  this.token(I, "("), this.node(t.left), this.tokenize(t.leftComparison), this.node(t.middle), t.right && (this.tokenize(t.rightComparison), this.node(t.right)), this.token(y, ")");
}
const sc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Mr,
  name: ec,
  parse: Fr,
  structure: nc
}, Symbol.toStringTag, { value: "Module" })), rc = "Function", ic = "function", oc = {
  name: String,
  children: [[]]
};
function jr(t, e) {
  const n = this.tokenStart, s = this.consumeFunctionName(), r = s.toLowerCase();
  let o;
  return o = e.hasOwnProperty(r) ? e[r].call(this, e) : t.call(this, e), this.eof || this.eat(y), {
    type: "Function",
    loc: this.getLocation(n, this.tokenStart),
    name: s,
    children: o
  };
}
function Br(t) {
  this.token(T, t.name + "("), this.children(t), this.token(y, ")");
}
const ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Br,
  name: rc,
  parse: jr,
  structure: oc,
  walkContext: ic
}, Symbol.toStringTag, { value: "Module" })), lc = "GeneralEnclosed", cc = {
  kind: String,
  function: [String, null],
  children: [[]]
};
function Ur(t) {
  const e = this.tokenStart;
  let n = null;
  this.tokenType === T ? n = this.consumeFunctionName() : this.eat(I);
  const s = this.parseWithFallback(
    () => {
      const r = this.tokenIndex, o = this.readSequence(this.scope.Value);
      return this.eof === !1 && this.isBalanceEdge(r) === !1 && this.error(), o;
    },
    () => this.createSingleNodeList(
      this.Raw(null, !1)
    )
  );
  return this.eof || this.eat(y), {
    type: "GeneralEnclosed",
    loc: this.getLocation(e, this.tokenStart),
    kind: t,
    function: n,
    children: s
  };
}
function Wr(t) {
  t.function ? this.token(T, t.function + "(") : this.token(I, "("), this.children(t), this.token(y, ")");
}
const uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Wr,
  name: lc,
  parse: Ur,
  structure: cc
}, Symbol.toStringTag, { value: "Module" })), hc = "XXX", fc = "Hash", pc = {
  value: String
};
function zr() {
  const t = this.tokenStart;
  return this.eat(_), {
    type: "Hash",
    loc: this.getLocation(t, this.tokenStart),
    value: this.substrToCursor(t + 1)
  };
}
function Hr(t) {
  this.token(_, "#" + t.value);
}
const dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Hr,
  name: fc,
  parse: zr,
  structure: pc,
  xxx: hc
}, Symbol.toStringTag, { value: "Module" })), gc = "Identifier", mc = {
  name: String
};
function Vr() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(d)
  };
}
function Gr(t) {
  this.token(d, t.name);
}
const kc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Gr,
  name: gc,
  parse: Vr,
  structure: mc
}, Symbol.toStringTag, { value: "Module" })), Sc = "IdSelector", yc = {
  name: String
};
function qr() {
  const t = this.tokenStart;
  return this.eat(_), {
    type: "IdSelector",
    loc: this.getLocation(t, this.tokenStart),
    name: this.substrToCursor(t + 1)
  };
}
function Kr(t) {
  this.token(L, "#" + t.name);
}
const bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Kr,
  name: Sc,
  parse: qr,
  structure: yc
}, Symbol.toStringTag, { value: "Module" })), xc = 46, Cc = "Layer", wc = {
  name: String
};
function Qr() {
  let t = this.tokenStart, e = this.consume(d);
  for (; this.isDelim(xc); )
    this.eat(L), e += "." + this.consume(d);
  return {
    type: "Layer",
    loc: this.getLocation(t, this.tokenStart),
    name: e
  };
}
function Yr(t) {
  this.tokenize(t.name);
}
const Tc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Yr,
  name: Cc,
  parse: Qr,
  structure: wc
}, Symbol.toStringTag, { value: "Module" })), Ac = "LayerList", vc = {
  children: [[
    "Layer"
  ]]
};
function Xr() {
  const t = this.createList();
  for (this.skipSC(); !this.eof && (t.push(this.Layer()), this.lookupTypeNonSC(0) === ft); )
    this.skipSC(), this.next(), this.skipSC();
  return {
    type: "LayerList",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function Jr(t) {
  this.children(t, () => this.token(ft, ","));
}
const Ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Jr,
  name: Ac,
  parse: Xr,
  structure: vc
}, Symbol.toStringTag, { value: "Module" })), $c = "MediaQuery", Lc = {
  modifier: [String, null],
  mediaType: [String, null],
  condition: ["Condition", null]
};
function Zr() {
  const t = this.tokenStart;
  let e = null, n = null, s = null;
  if (this.skipSC(), this.tokenType === d && this.lookupTypeNonSC(1) !== I) {
    const r = this.consume(d), o = r.toLowerCase();
    switch (o === "not" || o === "only" ? (this.skipSC(), e = o, n = this.consume(d)) : n = r, this.lookupTypeNonSC(0)) {
      case d: {
        this.skipSC(), this.eatIdent("and"), s = this.Condition("media");
        break;
      }
      case ht:
      case tt:
      case ft:
      case vt:
        break;
      default:
        this.error("Identifier or parenthesis is expected");
    }
  } else
    switch (this.tokenType) {
      case d:
      case I:
      case T: {
        s = this.Condition("media");
        break;
      }
      case ht:
      case tt:
      case vt:
        break;
      default:
        this.error("Identifier or parenthesis is expected");
    }
  return {
    type: "MediaQuery",
    loc: this.getLocation(t, this.tokenStart),
    modifier: e,
    mediaType: n,
    condition: s
  };
}
function ti(t) {
  t.mediaType ? (t.modifier && this.token(d, t.modifier), this.token(d, t.mediaType), t.condition && (this.token(d, "and"), this.node(t.condition))) : t.condition && this.node(t.condition);
}
const Pc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ti,
  name: $c,
  parse: Zr,
  structure: Lc
}, Symbol.toStringTag, { value: "Module" })), Oc = "MediaQueryList", Rc = {
  children: [[
    "MediaQuery"
  ]]
};
function ei() {
  const t = this.createList();
  for (this.skipSC(); !this.eof && (t.push(this.MediaQuery()), this.tokenType === ft); )
    this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function ni(t) {
  this.children(t, () => this.token(ft, ","));
}
const Ic = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ni,
  name: Oc,
  parse: ei,
  structure: Rc
}, Symbol.toStringTag, { value: "Module" })), _c = 38, Nc = "NestingSelector", Dc = {};
function si() {
  const t = this.tokenStart;
  return this.eatDelim(_c), {
    type: "NestingSelector",
    loc: this.getLocation(t, this.tokenStart)
  };
}
function ri() {
  this.token(L, "&");
}
const Fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ri,
  name: Nc,
  parse: si,
  structure: Dc
}, Symbol.toStringTag, { value: "Module" })), Mc = "Nth", jc = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function ii() {
  this.skipSC();
  const t = this.tokenStart;
  let e = t, n = null, s;
  return this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? s = this.Identifier() : s = this.AnPlusB(), e = this.tokenStart, this.skipSC(), this.lookupValue(0, "of") && (this.next(), n = this.SelectorList(), e = this.tokenStart), {
    type: "Nth",
    loc: this.getLocation(t, e),
    nth: s,
    selector: n
  };
}
function oi(t) {
  this.node(t.nth), t.selector !== null && (this.token(d, "of"), this.node(t.selector));
}
const Bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: oi,
  name: Mc,
  parse: ii,
  structure: jc
}, Symbol.toStringTag, { value: "Module" })), Uc = "Number", Wc = {
  value: String
};
function ai() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(b)
  };
}
function li(t) {
  this.token(b, t.value);
}
const zc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: li,
  name: Uc,
  parse: ai,
  structure: Wc
}, Symbol.toStringTag, { value: "Module" })), Hc = "Operator", Vc = {
  value: String
};
function ci() {
  const t = this.tokenStart;
  return this.next(), {
    type: "Operator",
    loc: this.getLocation(t, this.tokenStart),
    value: this.substrToCursor(t)
  };
}
function ui(t) {
  this.tokenize(t.value);
}
const Gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ui,
  name: Hc,
  parse: ci,
  structure: Vc
}, Symbol.toStringTag, { value: "Module" })), qc = "Parentheses", Kc = {
  children: [[]]
};
function hi(t, e) {
  const n = this.tokenStart;
  let s = null;
  return this.eat(I), s = t.call(this, e), this.eof || this.eat(y), {
    type: "Parentheses",
    loc: this.getLocation(n, this.tokenStart),
    children: s
  };
}
function fi(t) {
  this.token(I, "("), this.children(t), this.token(y, ")");
}
const Qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: fi,
  name: qc,
  parse: hi,
  structure: Kc
}, Symbol.toStringTag, { value: "Module" })), Yc = "Percentage", Xc = {
  value: String
};
function pi() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(F)
  };
}
function di(t) {
  this.token(F, t.value + "%");
}
const Jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: di,
  name: Yc,
  parse: pi,
  structure: Xc
}, Symbol.toStringTag, { value: "Module" })), Zc = "PseudoClassSelector", tu = "function", eu = {
  name: String,
  children: [["Raw"], null]
};
function gi() {
  const t = this.tokenStart;
  let e = null, n, s;
  return this.eat(X), this.tokenType === T ? (n = this.consumeFunctionName(), s = n.toLowerCase(), this.lookupNonWSType(0) == y ? e = this.createList() : hasOwnProperty.call(this.pseudo, s) ? (this.skipSC(), e = this.pseudo[s].call(this), this.skipSC()) : (e = this.createList(), e.push(
    this.Raw(null, !1)
  )), this.eat(y)) : n = this.consume(d), {
    type: "PseudoClassSelector",
    loc: this.getLocation(t, this.tokenStart),
    name: n,
    children: e
  };
}
function mi(t) {
  this.token(X, ":"), t.children === null ? this.token(d, t.name) : (this.token(T, t.name + "("), this.children(t), this.token(y, ")"));
}
const nu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: mi,
  name: Zc,
  parse: gi,
  structure: eu,
  walkContext: tu
}, Symbol.toStringTag, { value: "Module" })), su = "PseudoElementSelector", ru = "function", iu = {
  name: String,
  children: [["Raw"], null]
};
function ki() {
  const t = this.tokenStart;
  let e = null, n, s;
  return this.eat(X), this.eat(X), this.tokenType === T ? (n = this.consumeFunctionName(), s = n.toLowerCase(), this.lookupNonWSType(0) == y ? e = this.createList() : hasOwnProperty.call(this.pseudo, s) ? (this.skipSC(), e = this.pseudo[s].call(this), this.skipSC()) : (e = this.createList(), e.push(
    this.Raw(null, !1)
  )), this.eat(y)) : n = this.consume(d), {
    type: "PseudoElementSelector",
    loc: this.getLocation(t, this.tokenStart),
    name: n,
    children: e
  };
}
function Si(t) {
  this.token(X, ":"), this.token(X, ":"), t.children === null ? this.token(d, t.name) : (this.token(T, t.name + "("), this.children(t), this.token(y, ")"));
}
const ou = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Si,
  name: su,
  parse: ki,
  structure: iu,
  walkContext: ru
}, Symbol.toStringTag, { value: "Module" })), Xn = 47;
function Jn() {
  switch (this.skipSC(), this.tokenType) {
    case b:
      return this.Number();
    case T:
      return this.Function(this.readSequence, this.scope.Value);
    default:
      this.error("Number of function is expected");
  }
}
const au = "Ratio", lu = {
  left: ["Number", "Function"],
  right: ["Number", "Function", null]
};
function yi() {
  const t = this.tokenStart, e = Jn.call(this);
  let n = null;
  return this.skipSC(), this.isDelim(Xn) && (this.eatDelim(Xn), n = Jn.call(this)), {
    type: "Ratio",
    loc: this.getLocation(t, this.tokenStart),
    left: e,
    right: n
  };
}
function bi(t) {
  this.node(t.left), this.token(L, "/"), t.right ? this.node(t.right) : this.node(b, 1);
}
const cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: bi,
  name: au,
  parse: yi,
  structure: lu
}, Symbol.toStringTag, { value: "Module" }));
function uu() {
  return this.tokenIndex > 0 && this.lookupType(-1) === W ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
const hu = "Raw", fu = {
  value: String
};
function xi(t, e) {
  const n = this.getTokenStart(this.tokenIndex);
  let s;
  return this.skipUntilBalanced(this.tokenIndex, t || this.consumeUntilBalanceEnd), e && this.tokenStart > n ? s = uu.call(this) : s = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(n, s),
    value: this.substring(n, s)
  };
}
function Ci(t) {
  this.tokenize(t.value);
}
const pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Ci,
  name: hu,
  parse: xi,
  structure: fu
}, Symbol.toStringTag, { value: "Module" }));
function Zn() {
  return this.Raw(this.consumeUntilLeftCurlyBracket, !0);
}
function du() {
  const t = this.SelectorList();
  return t.type !== "Raw" && this.eof === !1 && this.tokenType !== ht && this.error(), t;
}
const gu = "Rule", mu = "rule", ku = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function wi() {
  const t = this.tokenIndex, e = this.tokenStart;
  let n, s;
  return this.parseRulePrelude ? n = this.parseWithFallback(du, Zn) : n = Zn.call(this, t), s = this.Block(!0), {
    type: "Rule",
    loc: this.getLocation(e, this.tokenStart),
    prelude: n,
    block: s
  };
}
function Ti(t) {
  this.node(t.prelude), this.node(t.block);
}
const Su = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Ti,
  name: gu,
  parse: wi,
  structure: ku,
  walkContext: mu
}, Symbol.toStringTag, { value: "Module" })), yu = "Scope", bu = {
  root: ["SelectorList", "Raw", null],
  limit: ["SelectorList", "Raw", null]
};
function Ai() {
  let t = null, e = null;
  this.skipSC();
  const n = this.tokenStart;
  return this.tokenType === I && (this.next(), this.skipSC(), t = this.parseWithFallback(
    this.SelectorList,
    () => this.Raw(!1, !0)
  ), this.skipSC(), this.eat(y)), this.lookupNonWSType(0) === d && (this.skipSC(), this.eatIdent("to"), this.skipSC(), this.eat(I), this.skipSC(), e = this.parseWithFallback(
    this.SelectorList,
    () => this.Raw(!1, !0)
  ), this.skipSC(), this.eat(y)), {
    type: "Scope",
    loc: this.getLocation(n, this.tokenStart),
    root: t,
    limit: e
  };
}
function vi(t) {
  t.root && (this.token(I, "("), this.node(t.root), this.token(y, ")")), t.limit && (this.token(d, "to"), this.token(I, "("), this.node(t.limit), this.token(y, ")"));
}
const xu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: vi,
  name: yu,
  parse: Ai,
  structure: bu
}, Symbol.toStringTag, { value: "Module" })), Cu = "Selector", wu = {
  children: [[
    "TypeSelector",
    "IdSelector",
    "ClassSelector",
    "AttributeSelector",
    "PseudoClassSelector",
    "PseudoElementSelector",
    "Combinator"
  ]]
};
function Ei() {
  const t = this.readSequence(this.scope.Selector);
  return this.getFirstListNode(t) === null && this.error("Selector is expected"), {
    type: "Selector",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function $i(t) {
  this.children(t);
}
const Tu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: $i,
  name: Cu,
  parse: Ei,
  structure: wu
}, Symbol.toStringTag, { value: "Module" })), Au = "SelectorList", vu = "selector", Eu = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function Li() {
  const t = this.createList();
  for (; !this.eof; ) {
    if (t.push(this.Selector()), this.tokenType === ft) {
      this.next();
      continue;
    }
    break;
  }
  return {
    type: "SelectorList",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function Pi(t) {
  this.children(t, () => this.token(ft, ","));
}
const $u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Pi,
  name: Au,
  parse: Li,
  structure: Eu,
  walkContext: vu
}, Symbol.toStringTag, { value: "Module" })), Lu = "String", Pu = {
  value: String
};
function Oi() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: Js(this.consume(Tt))
  };
}
function Ri(t) {
  this.token(Tt, fa(t.value));
}
const Ou = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Ri,
  name: Lu,
  parse: Oi,
  structure: Pu
}, Symbol.toStringTag, { value: "Module" })), Ru = 33;
function ts() {
  return this.Raw(null, !1);
}
const Iu = "StyleSheet", _u = "stylesheet", Nu = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function Ii() {
  const t = this.tokenStart, e = this.createList();
  let n;
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case W:
        this.next();
        continue;
      case Y:
        if (this.charCodeAt(this.tokenStart + 2) !== Ru) {
          this.next();
          continue;
        }
        n = this.Comment();
        break;
      case De:
        n = this.CDO();
        break;
      case nt:
        n = this.CDC();
        break;
      // CSS Syntax Module Level 3
      // §2.2 Error handling
      // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
      case z:
        n = this.parseWithFallback(this.Atrule, ts);
        break;
      // Anything else starts a qualified rule ...
      default:
        n = this.parseWithFallback(this.Rule, ts);
    }
    e.push(n);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(t, this.tokenStart),
    children: e
  };
}
function _i(t) {
  this.children(t);
}
const Du = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: _i,
  name: Iu,
  parse: Ii,
  structure: Nu,
  walkContext: _u
}, Symbol.toStringTag, { value: "Module" })), Fu = "SupportsDeclaration", Mu = {
  declaration: "Declaration"
};
function Ni() {
  const t = this.tokenStart;
  this.eat(I), this.skipSC();
  const e = this.Declaration();
  return this.eof || this.eat(y), {
    type: "SupportsDeclaration",
    loc: this.getLocation(t, this.tokenStart),
    declaration: e
  };
}
function Di(t) {
  this.token(I, "("), this.node(t.declaration), this.token(y, ")");
}
const ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Di,
  name: Fu,
  parse: Ni,
  structure: Mu
}, Symbol.toStringTag, { value: "Module" })), Bu = 42, es = 124;
function Ge() {
  this.tokenType !== d && this.isDelim(Bu) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
const Uu = "TypeSelector", Wu = {
  name: String
};
function Fi() {
  const t = this.tokenStart;
  return this.isDelim(es) ? (this.next(), Ge.call(this)) : (Ge.call(this), this.isDelim(es) && (this.next(), Ge.call(this))), {
    type: "TypeSelector",
    loc: this.getLocation(t, this.tokenStart),
    name: this.substrToCursor(t)
  };
}
function Mi(t) {
  this.tokenize(t.name);
}
const zu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Mi,
  name: Uu,
  parse: Fi,
  structure: Wu
}, Symbol.toStringTag, { value: "Module" })), ji = 43, Bi = 45, hn = 63;
function se(t, e) {
  let n = 0;
  for (let s = this.tokenStart + t; s < this.tokenEnd; s++) {
    const r = this.charCodeAt(s);
    if (r === Bi && e && n !== 0)
      return se.call(this, t + n + 1, !1), -1;
    Xt(r) || this.error(
      e && n !== 0 ? "Hyphen minus" + (n < 6 ? " or hex digit" : "") + " is expected" : n < 6 ? "Hex digit is expected" : "Unexpected input",
      s
    ), ++n > 6 && this.error("Too many hex digits", s);
  }
  return this.next(), n;
}
function me(t) {
  let e = 0;
  for (; this.isDelim(hn); )
    ++e > t && this.error("Too many question marks"), this.next();
}
function Hu(t) {
  this.charCodeAt(this.tokenStart) !== t && this.error((t === ji ? "Plus sign" : "Hyphen minus") + " is expected");
}
function Vu() {
  let t = 0;
  switch (this.tokenType) {
    case b:
      if (t = se.call(this, 1, !0), this.isDelim(hn)) {
        me.call(this, 6 - t);
        break;
      }
      if (this.tokenType === E || this.tokenType === b) {
        Hu.call(this, Bi), se.call(this, 1, !1);
        break;
      }
      break;
    case E:
      t = se.call(this, 1, !0), t > 0 && me.call(this, 6 - t);
      break;
    default:
      if (this.eatDelim(ji), this.tokenType === d) {
        t = se.call(this, 0, !0), t > 0 && me.call(this, 6 - t);
        break;
      }
      if (this.isDelim(hn)) {
        this.next(), me.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
const Gu = "UnicodeRange", qu = {
  value: String
};
function Ui() {
  const t = this.tokenStart;
  return this.eatIdent("u"), Vu.call(this), {
    type: "UnicodeRange",
    loc: this.getLocation(t, this.tokenStart),
    value: this.substrToCursor(t)
  };
}
function Wi(t) {
  this.tokenize(t.value);
}
const Ku = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Wi,
  name: Gu,
  parse: Ui,
  structure: qu
}, Symbol.toStringTag, { value: "Module" })), Qu = "Url", Yu = {
  value: String
};
function zi() {
  const t = this.tokenStart;
  let e;
  switch (this.tokenType) {
    case Q:
      e = ka(this.consume(Q));
      break;
    case T:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(T), this.skipSC(), e = Js(this.consume(Tt)), this.skipSC(), this.eof || this.eat(y);
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(t, this.tokenStart),
    value: e
  };
}
function Hi(t) {
  this.token(Q, Sa(t.value));
}
const Xu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Hi,
  name: Qu,
  parse: zi,
  structure: Yu
}, Symbol.toStringTag, { value: "Module" })), Ju = "Value", Zu = {
  children: [[]]
};
function Vi() {
  const t = this.tokenStart, e = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(t, this.tokenStart),
    children: e
  };
}
function Gi(t) {
  this.children(t);
}
const th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Gi,
  name: Ju,
  parse: Vi,
  structure: Zu
}, Symbol.toStringTag, { value: "Module" })), eh = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
}), nh = "WhiteSpace", sh = {
  value: String
};
function qi() {
  return this.eat(W), eh;
}
function Ki(t) {
  this.token(W, t.value);
}
const rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Ki,
  name: nh,
  parse: qi,
  structure: sh
}, Symbol.toStringTag, { value: "Module" })), ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: Aa,
  Atrule: Pa,
  AtrulePrelude: _a,
  AttributeSelector: Wa,
  Block: Ka,
  Brackets: Xa,
  CDC: tl,
  CDO: sl,
  ClassSelector: al,
  Combinator: pl,
  Comment: Sl,
  Condition: wl,
  Declaration: Fl,
  DeclarationList: Ul,
  Dimension: Hl,
  Feature: Kl,
  FeatureFunction: Jl,
  FeatureRange: sc,
  Function: ac,
  GeneralEnclosed: uc,
  Hash: dc,
  IdSelector: bc,
  Identifier: kc,
  Layer: Tc,
  LayerList: Ec,
  MediaQuery: Pc,
  MediaQueryList: Ic,
  NestingSelector: Fc,
  Nth: Bc,
  Number: zc,
  Operator: Gc,
  Parentheses: Qc,
  Percentage: Jc,
  PseudoClassSelector: nu,
  PseudoElementSelector: ou,
  Ratio: cu,
  Raw: pu,
  Rule: Su,
  Scope: xu,
  Selector: Tu,
  SelectorList: $u,
  String: Ou,
  StyleSheet: Du,
  SupportsDeclaration: ju,
  TypeSelector: zu,
  UnicodeRange: Ku,
  Url: Xu,
  Value: th,
  WhiteSpace: rh
}, Symbol.toStringTag, { value: "Module" })), oh = {
  node: ih
}, $t = xa(oh), wn = [
  "left",
  "right",
  "top",
  "bottom",
  "inset-block-start",
  "inset-block-end",
  "inset-inline-start",
  "inset-inline-end",
  "inset-block",
  "inset-inline",
  "inset"
];
function ue(t) {
  return wn.includes(t);
}
const Tn = [
  "margin-block-start",
  "margin-block-end",
  "margin-block",
  "margin-inline-start",
  "margin-inline-end",
  "margin-inline",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin"
];
function ah(t) {
  return Tn.includes(t);
}
const An = [
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "block-size",
  "inline-size",
  "min-block-size",
  "min-inline-size",
  "max-block-size",
  "max-inline-size"
];
function Qi(t) {
  return An.includes(t);
}
const Yi = [
  "justify-self",
  "align-self",
  "place-self"
];
function lh(t) {
  return Yi.includes(t);
}
const Xi = [
  ...wn,
  ...Tn,
  ...An,
  ...Yi,
  "position-anchor",
  "position-area"
], ch = [
  ...An,
  ...wn,
  ...Tn
];
function Ji(t) {
  return ch.includes(
    t
  );
}
const uh = [
  "top",
  "left",
  "right",
  "bottom",
  "start",
  "end",
  "self-start",
  "self-end",
  "center",
  "inside",
  "outside"
];
function Zi(t) {
  return uh.includes(t);
}
const hh = [
  "width",
  "height",
  "block",
  "inline",
  "self-block",
  "self-inline"
];
function fh(t) {
  return hh.includes(t);
}
const ns = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function ph(t) {
  const e = new SourceMapGenerator(), n = {
    line: 1,
    column: 0
  }, s = {
    line: 0,
    // should be zero to add first mapping
    column: 0
  }, r = {
    line: 1,
    column: 0
  }, o = {
    generated: r
  };
  let a = 1, l = 0, u = !1;
  const i = t.node;
  t.node = function(f) {
    if (f.loc && f.loc.start && ns.has(f.type)) {
      const p = f.loc.start.line, g = f.loc.start.column - 1;
      (s.line !== p || s.column !== g) && (s.line = p, s.column = g, n.line = a, n.column = l, u && (u = !1, (n.line !== r.line || n.column !== r.column) && e.addMapping(o)), u = !0, e.addMapping({
        source: f.loc.source,
        original: s,
        generated: n
      }));
    }
    i.call(this, f), u && ns.has(f.type) && (r.line = a, r.column = l);
  };
  const c = t.emit;
  t.emit = function(f, p, g) {
    for (let m = 0; m < f.length; m++)
      f.charCodeAt(m) === 10 ? (a++, l = 0) : l++;
    c(f, p, g);
  };
  const h = t.result;
  return t.result = function() {
    return u && e.addMapping(o), {
      css: h(),
      map: e
    };
  }, t;
}
const dh = 43, gh = 45, qe = (t, e) => {
  if (t === L && (t = e), typeof t == "string") {
    const n = t.charCodeAt(0);
    return n > 127 ? 32768 : n << 8;
  }
  return t;
}, to = [
  [d, d],
  [d, T],
  [d, Q],
  [d, at],
  [d, "-"],
  [d, b],
  [d, F],
  [d, E],
  [d, nt],
  [d, I],
  [z, d],
  [z, T],
  [z, Q],
  [z, at],
  [z, "-"],
  [z, b],
  [z, F],
  [z, E],
  [z, nt],
  [_, d],
  [_, T],
  [_, Q],
  [_, at],
  [_, "-"],
  [_, b],
  [_, F],
  [_, E],
  [_, nt],
  [E, d],
  [E, T],
  [E, Q],
  [E, at],
  [E, "-"],
  [E, b],
  [E, F],
  [E, E],
  [E, nt],
  ["#", d],
  ["#", T],
  ["#", Q],
  ["#", at],
  ["#", "-"],
  ["#", b],
  ["#", F],
  ["#", E],
  ["#", nt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", d],
  ["-", T],
  ["-", Q],
  ["-", at],
  ["-", "-"],
  ["-", b],
  ["-", F],
  ["-", E],
  ["-", nt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [b, d],
  [b, T],
  [b, Q],
  [b, at],
  [b, b],
  [b, F],
  [b, E],
  [b, "%"],
  [b, nt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", d],
  ["@", T],
  ["@", Q],
  ["@", at],
  ["@", "-"],
  ["@", nt],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", b],
  [".", F],
  [".", E],
  ["+", b],
  ["+", F],
  ["+", E],
  ["/", "*"]
], mh = to.concat([
  [d, _],
  [E, _],
  [_, _],
  [z, I],
  [z, Tt],
  [z, X],
  [F, F],
  [F, E],
  [F, T],
  [F, "-"],
  [y, d],
  [y, T],
  [y, F],
  [y, E],
  [y, _],
  [y, "-"]
]);
function eo(t) {
  const e = new Set(
    t.map(([n, s]) => qe(n) << 16 | qe(s))
  );
  return function(n, s, r) {
    const o = qe(s, r), a = r.charCodeAt(0);
    return (a === gh && s !== d && s !== T && s !== nt || a === dh ? e.has(n << 16 | a << 8) : e.has(n << 16 | o)) && this.emit(" ", W, !0), o;
  };
}
const kh = eo(to), no = eo(mh), ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe: no,
  spec: kh
}, Symbol.toStringTag, { value: "Module" })), Sh = 92;
function yh(t, e) {
  if (typeof e == "function") {
    let n = null;
    t.children.forEach((s) => {
      n !== null && e.call(this, n), this.node(s), n = s;
    });
    return;
  }
  t.children.forEach(this.node, this);
}
function bh(t) {
  Ys(t, (e, n, s) => {
    this.token(e, t.slice(n, s));
  });
}
function xh(t) {
  const e = /* @__PURE__ */ new Map();
  for (let [n, s] of Object.entries(t.node))
    typeof (s.generate || s) == "function" && e.set(n, s.generate || s);
  return function(n, s) {
    let r = "", o = 0, a = {
      node(u) {
        if (e.has(u.type))
          e.get(u.type).call(l, u);
        else
          throw new Error("Unknown node type: " + u.type);
      },
      tokenBefore: no,
      token(u, i) {
        o = this.tokenBefore(o, u, i), this.emit(i, u, !1), u === L && i.charCodeAt(0) === Sh && this.emit(`
`, W, !0);
      },
      emit(u) {
        r += u;
      },
      result() {
        return r;
      }
    };
    s && (typeof s.decorator == "function" && (a = s.decorator(a)), s.sourceMap && (a = ph(a)), s.mode in ss && (a.tokenBefore = ss[s.mode]));
    const l = {
      node: (u) => a.node(u),
      children: yh,
      token: (u, i) => a.token(u, i),
      tokenize: bh
    };
    return a.node(n), a.result();
  };
}
const Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: er,
  Atrule: sr,
  AtrulePrelude: ir,
  AttributeSelector: lr,
  Block: hr,
  Brackets: pr,
  CDC: gr,
  CDO: kr,
  ClassSelector: yr,
  Combinator: xr,
  Comment: wr,
  Condition: Ar,
  Declaration: $r,
  DeclarationList: Pr,
  Dimension: Rr,
  Feature: _r,
  FeatureFunction: Dr,
  FeatureRange: Mr,
  Function: Br,
  GeneralEnclosed: Wr,
  Hash: Hr,
  IdSelector: Kr,
  Identifier: Gr,
  Layer: Yr,
  LayerList: Jr,
  MediaQuery: ti,
  MediaQueryList: ni,
  NestingSelector: ri,
  Nth: oi,
  Number: li,
  Operator: ui,
  Parentheses: fi,
  Percentage: di,
  PseudoClassSelector: mi,
  PseudoElementSelector: Si,
  Ratio: bi,
  Raw: Ci,
  Rule: Ti,
  Scope: vi,
  Selector: $i,
  SelectorList: Pi,
  String: Ri,
  StyleSheet: _i,
  SupportsDeclaration: Di,
  TypeSelector: Mi,
  UnicodeRange: Wi,
  Url: Hi,
  Value: Gi,
  WhiteSpace: Ki
}, Symbol.toStringTag, { value: "Module" })), wh = {
  node: Ch
}, Th = xh(wh);
function Ah(t, e) {
  const n = Object.create(SyntaxError.prototype), s = new Error();
  return Object.assign(n, {
    name: t,
    message: e,
    get stack() {
      return (s.stack || "").replace(/^(.+\n){1,3}/, `${t}: ${e}
`);
    }
  });
}
const Ke = 100, rs = 60, is = "    ";
function os({ source: t, line: e, column: n, baseLine: s, baseColumn: r }, o) {
  function a(g, m) {
    return i.slice(g, m).map(
      (k, S) => String(g + S + 1).padStart(f) + " |" + k
    ).join(`
`);
  }
  const l = `
`.repeat(Math.max(s - 1, 0)), u = " ".repeat(Math.max(r - 1, 0)), i = (l + u + t).split(/\r\n?|\n|\f/), c = Math.max(1, e - o) - 1, h = Math.min(e + o, i.length + 1), f = Math.max(4, String(h).length) + 1;
  let p = 0;
  n += (is.length - 1) * (i[e - 1].substr(0, n - 1).match(/\t/g) || []).length, n > Ke && (p = n - rs + 3, n = rs - 2);
  for (let g = c; g <= h; g++)
    g >= 0 && g < i.length && (i[g] = i[g].replace(/\t/g, is), i[g] = (p > 0 && i[g].length > p ? "…" : "") + i[g].substr(p, Ke - 2) + (i[g].length > p + Ke - 1 ? "…" : ""));
  return [
    a(c, e),
    new Array(n + f + 2).join("-") + "^",
    a(e, h)
  ].filter(Boolean).join(`
`).replace(/^(\s+\d+\s+\|\n)+/, "").replace(/\n(\s+\d+\s+\|)+$/, "");
}
function as(t, e, n, s, r, o = 1, a = 1) {
  return Object.assign(Ah("SyntaxError", t), {
    source: e,
    offset: n,
    line: s,
    column: r,
    sourceFragment(u) {
      return os({ source: e, line: s, column: r, baseLine: o, baseColumn: a }, isNaN(u) ? 0 : u);
    },
    get formattedMessage() {
      return `Parse error: ${t}
` + os({ source: e, line: s, column: r, baseLine: o, baseColumn: a }, 2);
    }
  });
}
function vh(t) {
  const e = this.createList();
  let n = !1;
  const s = {
    recognizer: t
  };
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case Y:
        this.next();
        continue;
      case W:
        n = !0, this.next();
        continue;
    }
    let r = t.getNode.call(this, s);
    if (r === void 0)
      break;
    n && (t.onWhiteSpace && t.onWhiteSpace.call(this, r, e, s), n = !1), e.push(r);
  }
  return n && t.onWhiteSpace && t.onWhiteSpace.call(this, null, e, s), e;
}
const ls = () => {
}, Eh = 33, $h = 35, Qe = 59, cs = 123, us = 0;
function Lh(t) {
  return function() {
    return this[t]();
  };
}
function Ye(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const n of Object.keys(t)) {
    const s = t[n], r = s.parse || s;
    r && (e[n] = r);
  }
  return e;
}
function Ph(t) {
  const e = {
    context: /* @__PURE__ */ Object.create(null),
    features: Object.assign(/* @__PURE__ */ Object.create(null), t.features),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), t.scope),
    atrule: Ye(t.atrule),
    pseudo: Ye(t.pseudo),
    node: Ye(t.node)
  };
  for (const [n, s] of Object.entries(t.parseContext))
    switch (typeof s) {
      case "function":
        e.context[n] = s;
        break;
      case "string":
        e.context[n] = Lh(s);
        break;
    }
  return U(U({
    config: e
  }, e), e.node);
}
function Oh(t) {
  let e = "", n = "<unknown>", s = !1, r = ls, o = !1;
  const a = new la(), l = Object.assign(new ca(), Ph(t || {}), {
    parseAtrulePrelude: !0,
    parseRulePrelude: !0,
    parseValue: !0,
    parseCustomProperty: !1,
    readSequence: vh,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(i) {
      return i === cs ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(i) {
      return i === cs || i === Qe ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(i) {
      return i === Eh || i === Qe ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(i) {
      return i === Qe ? 2 : 0;
    },
    createList() {
      return new q();
    },
    createSingleNodeList(i) {
      return new q().appendData(i);
    },
    getFirstListNode(i) {
      return i && i.first;
    },
    getLastListNode(i) {
      return i && i.last;
    },
    parseWithFallback(i, c) {
      const h = this.tokenIndex;
      try {
        return i.call(this);
      } catch (f) {
        if (o)
          throw f;
        this.skip(h - this.tokenIndex);
        const p = c.call(this);
        return o = !0, r(f, p), o = !1, p;
      }
    },
    lookupNonWSType(i) {
      let c;
      do
        if (c = this.lookupType(i++), c !== W && c !== Y)
          return c;
      while (c !== us);
      return us;
    },
    charCodeAt(i) {
      return i >= 0 && i < e.length ? e.charCodeAt(i) : 0;
    },
    substring(i, c) {
      return e.substring(i, c);
    },
    substrToCursor(i) {
      return this.source.substring(i, this.tokenStart);
    },
    cmpChar(i, c) {
      return Gs(e, i, c);
    },
    cmpStr(i, c, h) {
      return Le(e, i, c, h);
    },
    consume(i) {
      const c = this.tokenStart;
      return this.eat(i), this.substrToCursor(c);
    },
    consumeFunctionName() {
      const i = e.substring(this.tokenStart, this.tokenEnd - 1);
      return this.eat(T), i;
    },
    consumeNumber(i) {
      const c = e.substring(this.tokenStart, qs(e, this.tokenStart));
      return this.eat(i), c;
    },
    eat(i) {
      if (this.tokenType !== i) {
        const c = Qs[i].slice(0, -6).replace(/-/g, " ").replace(/^./, (p) => p.toUpperCase());
        let h = `${/[[\](){}]/.test(c) ? `"${c}"` : c} is expected`, f = this.tokenStart;
        switch (i) {
          case d:
            this.tokenType === T || this.tokenType === Q ? (f = this.tokenEnd - 1, h = "Identifier is expected but function found") : h = "Identifier is expected";
            break;
          case _:
            this.isDelim($h) && (this.next(), f++, h = "Name is expected");
            break;
          case F:
            this.tokenType === b && (f = this.tokenEnd, h = "Percent sign is expected");
            break;
        }
        this.error(h, f);
      }
      this.next();
    },
    eatIdent(i) {
      (this.tokenType !== d || this.lookupValue(0, i) === !1) && this.error(`Identifier "${i}" is expected`), this.next();
    },
    eatDelim(i) {
      this.isDelim(i) || this.error(`Delim "${String.fromCharCode(i)}" is expected`), this.next();
    },
    getLocation(i, c) {
      return s ? a.getLocationRange(
        i,
        c,
        n
      ) : null;
    },
    getLocationFromList(i) {
      if (s) {
        const c = this.getFirstListNode(i), h = this.getLastListNode(i);
        return a.getLocationRange(
          c !== null ? c.loc.start.offset - a.startOffset : this.tokenStart,
          h !== null ? h.loc.end.offset - a.startOffset : this.tokenStart,
          n
        );
      }
      return null;
    },
    error(i, c) {
      const h = typeof c != "undefined" && c < e.length ? a.getLocation(c) : this.eof ? a.getLocation(ia(e, e.length - 1)) : a.getLocation(this.tokenStart);
      throw new as(
        i || "Unexpected input",
        e,
        h.offset,
        h.line,
        h.column,
        a.startLine,
        a.startColumn
      );
    }
  });
  return Object.assign(function(i, c) {
    e = i, c = c || {}, l.setSource(e, Ys), a.setSource(
      e,
      c.offset,
      c.line,
      c.column
    ), n = c.filename || "<unknown>", s = !!c.positions, r = typeof c.onParseError == "function" ? c.onParseError : ls, o = !1, l.parseAtrulePrelude = "parseAtrulePrelude" in c ? !!c.parseAtrulePrelude : !0, l.parseRulePrelude = "parseRulePrelude" in c ? !!c.parseRulePrelude : !0, l.parseValue = "parseValue" in c ? !!c.parseValue : !0, l.parseCustomProperty = "parseCustomProperty" in c ? !!c.parseCustomProperty : !1;
    const { context: h = "default", onComment: f } = c;
    if (!(h in l.context))
      throw new Error("Unknown context `" + h + "`");
    typeof f == "function" && l.forEachToken((g, m, k) => {
      if (g === Y) {
        const S = l.getLocation(m, k), x = Le(e, k - 2, k, "*/") ? e.slice(m + 2, k - 2) : e.slice(m + 2, k);
        f(x, S);
      }
    });
    const p = l.context[h].call(l, c);
    return l.eof || l.error(), p;
  }, {
    SyntaxError: as,
    config: l.config
  });
}
const Rh = 35, Ih = 42, hs = 43, _h = 45, Nh = 47, Dh = 117;
function so(t) {
  switch (this.tokenType) {
    case _:
      return this.Hash();
    case ft:
      return this.Operator();
    case I:
      return this.Parentheses(this.readSequence, t.recognizer);
    case ee:
      return this.Brackets(this.readSequence, t.recognizer);
    case Tt:
      return this.String();
    case E:
      return this.Dimension();
    case F:
      return this.Percentage();
    case b:
      return this.Number();
    case T:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, t.recognizer);
    case Q:
      return this.Url();
    case d:
      return this.cmpChar(this.tokenStart, Dh) && this.cmpChar(this.tokenStart + 1, hs) ? this.UnicodeRange() : this.Identifier();
    case L: {
      const e = this.charCodeAt(this.tokenStart);
      if (e === Nh || e === Ih || e === hs || e === _h)
        return this.Operator();
      e === Rh && this.error("Hex or identifier is expected", this.tokenStart + 1);
      break;
    }
  }
}
const Fh = {
  getNode: so
}, Mh = 35, jh = 38, Bh = 42, Uh = 43, Wh = 47, fs = 46, zh = 62, Hh = 124, Vh = 126;
function Gh(t, e) {
  e.last !== null && e.last.type !== "Combinator" && t !== null && t.type !== "Combinator" && e.push({
    // FIXME: this.Combinator() should be used instead
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function qh() {
  switch (this.tokenType) {
    case ee:
      return this.AttributeSelector();
    case _:
      return this.IdSelector();
    case X:
      return this.lookupType(1) === X ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case d:
      return this.TypeSelector();
    case b:
    case F:
      return this.Percentage();
    case E:
      this.charCodeAt(this.tokenStart) === fs && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case L: {
      switch (this.charCodeAt(this.tokenStart)) {
        case Uh:
        case zh:
        case Vh:
        case Wh:
          return this.Combinator();
        case fs:
          return this.ClassSelector();
        case Bh:
        case Hh:
          return this.TypeSelector();
        case Mh:
          return this.IdSelector();
        case jh:
          return this.NestingSelector();
      }
      break;
    }
  }
}
const Kh = {
  onWhiteSpace: Gh,
  getNode: qh
};
function Qh() {
  return this.createSingleNodeList(
    this.Raw(null, !1)
  );
}
function Yh() {
  const t = this.createList();
  if (this.skipSC(), t.push(this.Identifier()), this.skipSC(), this.tokenType === ft) {
    t.push(this.Operator());
    const e = this.tokenIndex, n = this.parseCustomProperty ? this.Value(null) : this.Raw(this.consumeUntilExclamationMarkOrSemicolon, !1);
    if (n.type === "Value" && n.children.isEmpty) {
      for (let s = e - this.tokenIndex; s <= 0; s++)
        if (this.lookupType(s) === W) {
          n.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
    }
    t.push(n);
  }
  return t;
}
function ps(t) {
  return t !== null && t.type === "Operator" && (t.value[t.value.length - 1] === "-" || t.value[t.value.length - 1] === "+");
}
const Xh = {
  getNode: so,
  onWhiteSpace(t, e) {
    ps(t) && (t.value = " " + t.value), ps(e.last) && (e.last.value += " ");
  },
  expression: Qh,
  var: Yh
}, Jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: Fh,
  Selector: Kh,
  Value: Xh
}, Symbol.toStringTag, { value: "Module" })), Zh = /* @__PURE__ */ new Set(["none", "and", "not", "or"]), tf = {
  parse: {
    prelude() {
      const t = this.createList();
      if (this.tokenType === d) {
        const e = this.substring(this.tokenStart, this.tokenEnd);
        Zh.has(e.toLowerCase()) || t.push(this.Identifier());
      }
      return t.push(this.Condition("container")), t;
    },
    block(t = !1) {
      return this.Block(t);
    }
  }
}, ef = {
  parse: {
    prelude: null,
    block() {
      return this.Block(!0);
    }
  }
};
function Xe(t, e) {
  return this.parseWithFallback(
    () => {
      try {
        return t.call(this);
      } finally {
        this.skipSC(), this.lookupNonWSType(0) !== y && this.error();
      }
    },
    e || (() => this.Raw(null, !0))
  );
}
const ds = {
  layer() {
    this.skipSC();
    const t = this.createList(), e = Xe.call(this, this.Layer);
    return (e.type !== "Raw" || e.value !== "") && t.push(e), t;
  },
  supports() {
    this.skipSC();
    const t = this.createList(), e = Xe.call(
      this,
      this.Declaration,
      () => Xe.call(this, () => this.Condition("supports"))
    );
    return (e.type !== "Raw" || e.value !== "") && t.push(e), t;
  }
}, nf = {
  parse: {
    prelude() {
      const t = this.createList();
      switch (this.tokenType) {
        case Tt:
          t.push(this.String());
          break;
        case Q:
        case T:
          t.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      return this.skipSC(), this.tokenType === d && this.cmpStr(this.tokenStart, this.tokenEnd, "layer") ? t.push(this.Identifier()) : this.tokenType === T && this.cmpStr(this.tokenStart, this.tokenEnd, "layer(") && t.push(this.Function(null, ds)), this.skipSC(), this.tokenType === T && this.cmpStr(this.tokenStart, this.tokenEnd, "supports(") && t.push(this.Function(null, ds)), (this.lookupNonWSType(0) === d || this.lookupNonWSType(0) === I) && t.push(this.MediaQueryList()), t;
    },
    block: null
  }
}, sf = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.LayerList()
      );
    },
    block() {
      return this.Block(!1);
    }
  }
}, rf = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.MediaQueryList()
      );
    },
    block(t = !1) {
      return this.Block(t);
    }
  }
}, of = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(!0);
    }
  }
}, af = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(!0);
    }
  }
}, lf = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.Scope()
      );
    },
    block(t = !1) {
      return this.Block(t);
    }
  }
}, cf = {
  parse: {
    prelude: null,
    block(t = !1) {
      return this.Block(t);
    }
  }
}, uf = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.Condition("supports")
      );
    },
    block(t = !1) {
      return this.Block(t);
    }
  }
}, hf = {
  container: tf,
  "font-face": ef,
  import: nf,
  layer: sf,
  media: rf,
  nest: of,
  page: af,
  scope: lf,
  "starting-style": cf,
  supports: uf
};
function ff() {
  const t = this.createList();
  this.skipSC();
  t: for (; !this.eof; ) {
    switch (this.tokenType) {
      case d:
        t.push(this.Identifier());
        break;
      case Tt:
        t.push(this.String());
        break;
      case ft:
        t.push(this.Operator());
        break;
      case y:
        break t;
      default:
        this.error("Identifier, string or comma is expected");
    }
    this.skipSC();
  }
  return t;
}
const Rt = {
  parse() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
}, Je = {
  parse() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
}, pf = {
  parse() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
}, df = {
  parse: ff
}, ke = {
  parse() {
    return this.createSingleNodeList(
      this.Nth()
    );
  }
}, gf = {
  dir: pf,
  has: Rt,
  lang: df,
  matches: Rt,
  is: Rt,
  "-moz-any": Rt,
  "-webkit-any": Rt,
  where: Rt,
  not: Rt,
  "nth-child": ke,
  "nth-last-child": ke,
  "nth-last-of-type": ke,
  "nth-of-type": ke,
  slotted: Je,
  host: Je,
  "host-context": Je
}, mf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: tr,
  Atrule: nr,
  AtrulePrelude: rr,
  AttributeSelector: ar,
  Block: ur,
  Brackets: fr,
  CDC: dr,
  CDO: mr,
  ClassSelector: Sr,
  Combinator: br,
  Comment: Cr,
  Condition: Tr,
  Declaration: Er,
  DeclarationList: Lr,
  Dimension: Or,
  Feature: Ir,
  FeatureFunction: Nr,
  FeatureRange: Fr,
  Function: jr,
  GeneralEnclosed: Ur,
  Hash: zr,
  IdSelector: qr,
  Identifier: Vr,
  Layer: Qr,
  LayerList: Xr,
  MediaQuery: Zr,
  MediaQueryList: ei,
  NestingSelector: si,
  Nth: ii,
  Number: ai,
  Operator: ci,
  Parentheses: hi,
  Percentage: pi,
  PseudoClassSelector: gi,
  PseudoElementSelector: ki,
  Ratio: yi,
  Raw: xi,
  Rule: wi,
  Scope: Ai,
  Selector: Ei,
  SelectorList: Li,
  String: Oi,
  StyleSheet: Ii,
  SupportsDeclaration: Ni,
  TypeSelector: Fi,
  UnicodeRange: Ui,
  Url: zi,
  Value: Vi,
  WhiteSpace: qi
}, Symbol.toStringTag, { value: "Module" })), kf = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude(t) {
      return this.AtrulePrelude(t.atrule ? String(t.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    condition(t) {
      return this.Condition(t.kind);
    },
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block() {
      return this.Block(!0);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  features: {
    supports: {
      selector() {
        return this.Selector();
      }
    },
    container: {
      style() {
        return this.Declaration();
      }
    }
  },
  scope: Jh,
  atrule: hf,
  pseudo: gf,
  node: mf
}, Sf = Oh(kf);
let yf = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", lt = (t = 21) => {
  let e = "", n = t | 0;
  for (; n--; )
    e += yf[Math.random() * 64 | 0];
  return e;
};
const ro = lt(), re = /* @__PURE__ */ new Set();
function Oe(t) {
  return !!(t && t.type === "Function" && t.name === "anchor");
}
function Lt(t, e = !1) {
  return Sf(t, {
    parseAtrulePrelude: !1,
    parseCustomProperty: !0,
    onParseError: (n) => {
      e && re.add(n);
    }
  });
}
function Z(t) {
  return Th(t, {
    // Default `safe` adds extra (potentially breaking) spaces for compatibility
    // with old browsers.
    mode: "spec"
  });
}
function io(t) {
  return t.type === "Declaration";
}
function bf(t) {
  return t.toArray().reduce(
    (e, n) => n.type === "Operator" && n.value === "," ? (e.push([]), e) : (n.type === "Identifier" && e[e.length - 1].push(n), e),
    [[]]
  );
}
function fn(t) {
  return t ? t.children.map((e) => {
    var r;
    let n;
    ((r = e.children.last) == null ? void 0 : r.type) === "PseudoElementSelector" && (e = ve(e), n = Z(e.children.last), e.children.pop());
    const s = Z(e);
    return {
      selector: s + (n != null ? n : ""),
      elementPart: s,
      pseudoElementPart: n
    };
  }).toArray() : [];
}
function xf() {
  re.size > 0 && (console.group(
    `The CSS anchor positioning polyfill was not applied due to ${re.size === 1 ? "a CSS parse error" : "CSS parse errors"}.`
  ), re.forEach((t) => {
    console.warn(t.formattedMessage);
  }), console.groupEnd());
}
function Cf() {
  re.clear();
}
const pn = [
  ...Xi,
  "anchor-scope",
  "anchor-name"
].reduce(
  (t, e) => (t[e] = `--${e}-${ro}`, t),
  {}
);
function wf(t, e) {
  return io(t) && pn[t.property] && e ? (e.children.appendData(G(U({}, t), {
    property: pn[t.property]
  })), { updated: !0 }) : { updated: !1 };
}
function Tf(t, e) {
  const n = ["inset", "inset-block", "inset-inline"];
  if (!io(t) || !e || !n.includes(t.property))
    return { updated: !1 };
  const s = (r, o) => {
    o && e.children.appendData(G(U({}, t), {
      property: r,
      value: {
        type: "Value",
        children: new q().fromArray([o])
      }
    }));
  };
  if (t.property === "inset") {
    const r = t.value.children.toArray(), [o, a, l, u] = (() => {
      switch (r.length) {
        case 1:
          return [r[0], r[0], r[0], r[0]];
        case 2:
          return [r[0], r[1], r[0], r[1]];
        case 3:
          return [r[0], r[1], r[2], r[1]];
        case 4:
          return [r[0], r[1], r[2], r[3]];
        default:
          return [];
      }
    })();
    s("top", o), s("right", a), s("bottom", l), s("left", u);
  } else if (t.property === "inset-block") {
    const r = t.value.children.toArray(), [o, a] = (() => {
      switch (r.length) {
        case 1:
          return [r[0], r[0]];
        case 2:
          return [r[0], r[1]];
        default:
          return [];
      }
    })();
    s("inset-block-start", o), s("inset-block-end", a);
  } else if (t.property === "inset-inline") {
    const r = t.value.children.toArray(), [o, a] = (() => {
      switch (r.length) {
        case 1:
          return [r[0], r[0]];
        case 2:
          return [r[0], r[1]];
        default:
          return [];
      }
    })();
    s("inset-inline-start", o), s("inset-inline-end", a);
  }
  return { updated: !0 };
}
function Af(t) {
  for (const e of t) {
    let n = !1;
    const s = Lt(e.css, !0);
    $t(s, {
      visit: "Declaration",
      enter(r) {
        var u;
        const o = (u = this.rule) == null ? void 0 : u.block, { updated: a } = Tf(
          r,
          o
        ), { updated: l } = wf(r, o);
        (l || a) && (n = !0);
      }
    }), n && (e.css = Z(s), e.changed = !0);
  }
  return t.some((e) => e.changed === !0);
}
var oo = /* @__PURE__ */ ((t) => (t.All = "all", t.None = "none", t))(oo || {});
function ot(t, e) {
  var s;
  return e = (s = pn[e]) != null ? s : e, (t instanceof HTMLElement ? getComputedStyle(t) : t.computedStyle).getPropertyValue(e).trim();
}
function Zt(t, e, n) {
  return ot(t, e) === n;
}
function vf(t, { selector: e, pseudoElementPart: n }) {
  const s = getComputedStyle(t, n), r = document.createElement("div"), o = document.createElement("style");
  r.id = `fake-pseudo-element-${lt()}`;
  for (const l of Array.from(s)) {
    const u = s.getPropertyValue(l);
    r.style.setProperty(l, u);
  }
  o.textContent += `#${r.id}${n} { content: ${s.content}; }`, o.textContent += `${e} { display: none !important; }`, document.head.append(o);
  const a = n === "::before" ? "afterbegin" : "beforeend";
  return t.insertAdjacentElement(a, r), { fakePseudoElement: r, sheet: o, computedStyle: s };
}
function Ef(t) {
  let e = t;
  for (; e; ) {
    if (Zt(e, "overflow", "scroll"))
      return e;
    e = e.parentElement;
  }
  return e;
}
function $f(t) {
  let e = Ef(t);
  return e === document.documentElement && (e = null), e != null ? e : { scrollTop: 0, scrollLeft: 0 };
}
function Lf(t, e) {
  const { elementPart: n, pseudoElementPart: s } = t, r = [];
  if (s && !(s === "::before" || s === "::after")) return r;
  const l = ie(e.roots, n);
  if (!s)
    return r.push(...l), r;
  for (const u of l) {
    const { fakePseudoElement: i, sheet: c, computedStyle: h } = vf(
      u,
      t
    ), f = i.getBoundingClientRect(), { scrollY: p, scrollX: g } = globalThis, m = $f(u);
    r.push({
      fakePseudoElement: i,
      computedStyle: h,
      removeFakePseudoElement() {
        i.remove(), c.remove();
      },
      // For https://floating-ui.com/docs/autoupdate#ancestorscroll to work on
      // `VirtualElement`s.
      contextElement: u,
      // https://floating-ui.com/docs/virtual-elements
      getBoundingClientRect() {
        const { scrollY: k, scrollX: S } = globalThis, { scrollTop: x, scrollLeft: A } = m;
        return DOMRect.fromRect({
          y: f.y + (p - k) + (m.scrollTop - x),
          x: f.x + (g - S) + (m.scrollLeft - A),
          width: f.width,
          height: f.height
        });
      }
    });
  }
  return r;
}
function Pf(t, e) {
  const n = ot(t, "anchor-name");
  return e ? n.split(",").map((s) => s.trim()).includes(e) : !n;
}
function Of(t, e) {
  const n = ot(t, "anchor-scope");
  return n === e || n === "all";
}
const vn = (t) => R(null, null, function* () {
  var n, s, r;
  let e = yield (n = H.getOffsetParent) == null ? void 0 : n.call(H, t);
  return (yield (s = H.isElement) == null ? void 0 : s.call(H, e)) || (e = (yield (r = H.getDocumentElement) == null ? void 0 : r.call(H, t)) || window.document.documentElement), e;
}), ie = (t, e) => t.flatMap(
  (n) => [...n.querySelectorAll(e)]
), gs = "InvalidMimeType";
function Rf(t) {
  return !!((t.type === "text/css" || t.rel === "stylesheet") && t.href);
}
function If(t) {
  const e = new URL(t.href, document.baseURI);
  if (Rf(t) && e.origin === location.origin)
    return e;
}
function _f(t) {
  return R(this, null, function* () {
    return (yield Promise.all(
      t.map((n) => R(null, null, function* () {
        var s;
        if (!n.url)
          return n;
        if ((s = n.el) != null && s.disabled)
          return null;
        try {
          const r = yield fetch(n.url.toString()), o = r.headers.get("content-type");
          if (!(o != null && o.startsWith("text/css"))) {
            const l = new Error(
              `Error loading ${n.url}: expected content-type "text/css", got "${o}".`
            );
            throw l.name = gs, l;
          }
          const a = yield r.text();
          return G(U({}, n), { css: a });
        } catch (r) {
          if (r instanceof Error && r.name === gs)
            return console.warn(r), null;
          throw r;
        }
      }))
    )).filter((n) => n !== null);
  });
}
const ms = '[style*="anchor"]', ks = '[style*="position-area"]';
function Nf(t) {
  const e = t ? t.filter(
    (s) => s instanceof HTMLElement && (s.matches(ms) || s.matches(ks))
  ) : Array.from(
    document.querySelectorAll(
      [
        ms,
        ks
      ].join(",")
    )
  ), n = [];
  return e.filter((s) => s instanceof HTMLElement).forEach((s) => {
    const r = lt(12), o = "data-has-inline-styles";
    s.setAttribute(o, r);
    const a = s.getAttribute("style"), l = `[${o}="${r}"] { ${a} }`;
    n.push({ el: s, css: l });
  }), n;
}
function Df(t) {
  return R(this, null, function* () {
    var o, a;
    const e = (o = t.elements) != null ? o : ie(t.roots, "link, style"), n = [];
    e.filter((l) => l instanceof HTMLElement).forEach((l) => {
      if (l.tagName.toLowerCase() === "link") {
        const u = If(l);
        u && n.push({ el: l, url: u });
      }
      l.tagName.toLowerCase() === "style" && n.push({ el: l, css: l.innerHTML });
    });
    const s = t.excludeInlineStyles ? (a = t.elements) != null ? a : [] : void 0, r = Nf(s);
    return yield _f([...n, ...r]);
  });
}
const Ff = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let ao = (t = 21) => {
  let e = "", n = crypto.getRandomValues(new Uint8Array(t |= 0));
  for (; t--; )
    e += Ff[n[t] & 63];
  return e;
};
const lo = "--pa-cascade-property", co = "data-anchor-position-wrapper", uo = "data-pa-wrapper-for-", Ss = "POLYFILL-POSITION-AREA", Mf = [
  "left",
  "center",
  "right",
  "span-left",
  "span-right",
  "x-start",
  "x-end",
  "span-x-start",
  "span-x-end",
  "self-x-start",
  "self-x-end",
  "span-self-x-start",
  "span-self-x-end",
  "span-all",
  "top",
  "bottom",
  "span-top",
  "span-bottom",
  "y-start",
  "y-end",
  "span-y-start",
  "span-y-end",
  "self-y-start",
  "self-y-end",
  "span-self-y-start",
  "span-self-y-end",
  "block-start",
  "block-end",
  "span-block-start",
  "span-block-end",
  "inline-start",
  "inline-end",
  "span-inline-start",
  "span-inline-end",
  "self-block-start",
  "self-block-end",
  "span-self-block-start",
  "span-self-block-end",
  "self-inline-start",
  "self-inline-end",
  "span-self-inline-start",
  "span-self-inline-end",
  "start",
  "end",
  "span-start",
  "span-end",
  "self-start",
  "self-end",
  "span-self-start",
  "span-self-end"
];
function ho(t) {
  return Mf.includes(t);
}
const ys = {
  left: [
    0,
    1,
    "Irrelevant"
    /* Irrelevant */
  ],
  center: [
    1,
    2,
    "Irrelevant"
    /* Irrelevant */
  ],
  right: [
    2,
    3,
    "Irrelevant"
    /* Irrelevant */
  ],
  "span-left": [
    0,
    2,
    "Irrelevant"
    /* Irrelevant */
  ],
  "span-right": [
    1,
    3,
    "Irrelevant"
    /* Irrelevant */
  ],
  "x-start": [
    0,
    1,
    "Physical"
    /* Physical */
  ],
  "x-end": [
    2,
    3,
    "Physical"
    /* Physical */
  ],
  "span-x-start": [
    0,
    2,
    "Physical"
    /* Physical */
  ],
  "span-x-end": [
    1,
    3,
    "Physical"
    /* Physical */
  ],
  "self-x-start": [
    0,
    1,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "self-x-end": [
    2,
    3,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "span-self-x-start": [
    0,
    2,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "span-self-x-end": [
    1,
    3,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "span-all": [
    0,
    3,
    "Irrelevant"
    /* Irrelevant */
  ],
  top: [
    0,
    1,
    "Irrelevant"
    /* Irrelevant */
  ],
  bottom: [
    2,
    3,
    "Irrelevant"
    /* Irrelevant */
  ],
  "span-top": [
    0,
    2,
    "Irrelevant"
    /* Irrelevant */
  ],
  "span-bottom": [
    1,
    3,
    "Irrelevant"
    /* Irrelevant */
  ],
  "y-start": [
    0,
    1,
    "Physical"
    /* Physical */
  ],
  "y-end": [
    2,
    3,
    "Physical"
    /* Physical */
  ],
  "span-y-start": [
    0,
    2,
    "Physical"
    /* Physical */
  ],
  "span-y-end": [
    1,
    3,
    "Physical"
    /* Physical */
  ],
  "self-y-start": [
    0,
    1,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "self-y-end": [
    2,
    3,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "span-self-y-start": [
    0,
    2,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "span-self-y-end": [
    1,
    3,
    "PhysicalSelf"
    /* PhysicalSelf */
  ],
  "block-start": [
    0,
    1,
    "Logical"
    /* Logical */
  ],
  "block-end": [
    2,
    3,
    "Logical"
    /* Logical */
  ],
  "span-block-start": [
    0,
    2,
    "Logical"
    /* Logical */
  ],
  "span-block-end": [
    1,
    3,
    "Logical"
    /* Logical */
  ],
  "inline-start": [
    0,
    1,
    "Logical"
    /* Logical */
  ],
  "inline-end": [
    2,
    3,
    "Logical"
    /* Logical */
  ],
  "span-inline-start": [
    0,
    2,
    "Logical"
    /* Logical */
  ],
  "span-inline-end": [
    1,
    3,
    "Logical"
    /* Logical */
  ],
  "self-block-start": [
    0,
    1,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "self-block-end": [
    2,
    3,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "span-self-block-start": [
    0,
    2,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "span-self-block-end": [
    1,
    3,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "self-inline-start": [
    0,
    1,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "self-inline-end": [
    2,
    3,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "span-self-inline-start": [
    0,
    2,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "span-self-inline-end": [
    1,
    3,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  start: [
    0,
    1,
    "Logical"
    /* Logical */
  ],
  end: [
    2,
    3,
    "Logical"
    /* Logical */
  ],
  "span-start": [
    0,
    2,
    "Logical"
    /* Logical */
  ],
  "span-end": [
    1,
    3,
    "Logical"
    /* Logical */
  ],
  "self-start": [
    0,
    1,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "self-end": [
    2,
    3,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "span-self-start": [
    0,
    2,
    "LogicalSelf"
    /* LogicalSelf */
  ],
  "span-self-end": [
    1,
    3,
    "LogicalSelf"
    /* LogicalSelf */
  ]
}, jf = [
  "left",
  "center",
  "right",
  "span-left",
  "span-right",
  "x-start",
  "x-end",
  "span-x-start",
  "span-x-end",
  "self-x-start",
  "self-x-end",
  "span-self-x-start",
  "span-self-x-end",
  "span-all"
], Bf = [
  "top",
  "center",
  "bottom",
  "span-top",
  "span-bottom",
  "y-start",
  "y-end",
  "span-y-start",
  "span-y-end",
  "self-y-start",
  "self-y-end",
  "span-self-y-start",
  "span-self-y-end",
  "span-all"
], Uf = [
  "block-start",
  "center",
  "block-end",
  "span-block-start",
  "span-block-end",
  "span-all"
], Wf = [
  "inline-start",
  "center",
  "inline-end",
  "span-inline-start",
  "span-inline-end",
  "span-all"
], zf = [
  "self-block-start",
  "center",
  "self-block-end",
  "span-self-block-start",
  "span-self-block-end",
  "span-all"
], Hf = [
  "self-inline-start",
  "center",
  "self-inline-end",
  "span-self-inline-start",
  "span-self-inline-end",
  "span-all"
], bs = [
  "start",
  "center",
  "end",
  "span-start",
  "span-end",
  "span-all"
], xs = [
  "self-start",
  "center",
  "self-end",
  "span-self-start",
  "span-self-end",
  "span-all"
], Vf = ["block", "top", "bottom", "y"], Gf = ["inline", "left", "right", "x"];
function dn(t) {
  const e = t.split("-");
  for (const n of e) {
    if (Vf.includes(n)) return "block";
    if (Gf.includes(n)) return "inline";
  }
  return "ambiguous";
}
function qf(t, e) {
  return e[0].includes(t[0]) && e[1].includes(t[1]) || e[0].includes(t[1]) && e[1].includes(t[0]);
}
const Kf = [
  [jf, Bf],
  [Uf, Wf],
  [zf, Hf],
  [bs, bs],
  [xs, xs]
];
function Qf(t) {
  for (const e of Kf)
    if (qf(t, e)) return !0;
  return !1;
}
const Cs = (t) => {
  const e = getComputedStyle(t);
  return {
    writingMode: e.writingMode,
    direction: e.direction
  };
}, Yf = (t, e) => R(null, null, function* () {
  const n = yield vn(t);
  switch (e) {
    case "Logical":
    case "Physical":
      return Cs(n);
    case "LogicalSelf":
    case "PhysicalSelf":
      return Cs(t);
    default:
      return null;
  }
}), Ze = (t) => t.reverse().map((e) => 3 - e), fo = (t, e) => t === "Irrelevant" ? e : t, Xf = (s, r) => R(null, [s, r], function* ({
  block: t,
  inline: e
}, n) {
  const o = fo(t[2], e[2]), a = yield Yf(n, o), l = {
    block: [t[0], t[1]],
    inline: [e[0], e[1]]
  };
  if (a) {
    if (a.direction === "rtl" && (l.inline = Ze(l.inline)), a.writingMode.startsWith("vertical")) {
      const u = l.block;
      l.block = l.inline, l.inline = u;
    }
    if (a.writingMode.startsWith("sideways")) {
      const u = l.block;
      l.block = l.inline, l.inline = u, a.writingMode.endsWith("lr") && (l.block = Ze(l.block));
    }
    a.writingMode.endsWith("rl") && (l.inline = Ze(l.inline));
  }
  return l;
}), Jf = ({
  block: t,
  inline: e
}) => {
  const n = [0, "top", "bottom", 0], s = [0, "left", "right", 0];
  return {
    block: [n[t[0]], n[t[1]]],
    inline: [s[e[0]], s[e[1]]]
  };
};
function ws([t, e]) {
  return t === 0 && e === 3 ? "center" : t === 0 ? "end" : e === 3 ? "start" : "center";
}
function Zf(t) {
  return t.type === "Declaration" && t.property === "position-area";
}
function tp(t) {
  const e = t.value.children.toArray().map(({ name: n }) => n);
  return e.length === 1 && (dn(e[0]) === "ambiguous" ? e.push(e[0]) : e.push("span-all")), e;
}
function ep(t) {
  if (!Zf(t)) return;
  const e = tp(t);
  if (!Qf(e)) return;
  const n = {};
  switch (dn(e[0])) {
    case "block":
      n.block = e[0], n.inline = e[1];
      break;
    case "inline":
      n.inline = e[0], n.block = e[1];
      break;
    case "ambiguous":
      dn(e[1]) == "block" ? (n.block = e[1], n.inline = e[0]) : (n.inline = e[1], n.block = e[0]);
      break;
  }
  const s = {
    block: ys[n.block],
    inline: ys[n.inline]
  }, r = `--pa-declaration-${ao(12)}`;
  return {
    values: n,
    grid: s,
    selectorUUID: r
  };
}
function np(t, e) {
  [
    // Insets are applied to a wrapping element
    "justify-self",
    "align-self"
  ].forEach((n) => {
    e.children.appendData({
      type: "Declaration",
      property: n,
      value: { type: "Raw", value: `var(--pa-value-${n})` },
      important: !1
    });
  }), e.children.appendData({
    type: "Declaration",
    property: lo,
    value: { type: "Raw", value: t.selectorUUID },
    important: !1
  });
}
function sp(t, e) {
  var s, r;
  let n;
  if (((s = t.parentElement) == null ? void 0 : s.tagName) === Ss)
    n = t.parentElement;
  else {
    n = document.createElement(Ss), n.style.display = "grid", n.style.position = "absolute";
    const o = getComputedStyle(t).pointerEvents;
    n.style.pointerEvents = "none", t.style.pointerEvents = o, ["top", "left", "right", "bottom"].forEach((a) => {
      n.style.setProperty(a, `var(--pa-value-${a})`);
    }), (r = t.parentElement) == null || r.insertBefore(n, t), n.appendChild(t);
  }
  return n.setAttribute(
    `${uo}${e}`,
    ""
  ), n;
}
function rp(t, e, n) {
  return R(this, null, function* () {
    const s = `--pa-target-${ao(12)}`, r = yield Xf(
      e.grid,
      t
    ), o = Jf(r), a = fo(
      e.grid.block[2],
      e.grid.inline[2]
    ), l = [
      "LogicalSelf",
      "PhysicalSelf"
      /* PhysicalSelf */
    ].includes(a) ? r : e.grid, u = {
      block: ws([l.block[0], l.block[1]]),
      inline: ws([
        l.inline[0],
        l.inline[1]
      ])
    };
    return {
      insets: o,
      alignments: u,
      targetUUID: s,
      targetEl: t,
      anchorEl: n,
      wrapperEl: sp(t, s),
      values: e.values,
      grid: e.grid,
      selectorUUID: e.selectorUUID
    };
  });
}
function ip(t, e) {
  return `
    [${co}="${e}"][${uo}${t}] {
      --pa-value-top: var(${t}-top);
      --pa-value-left: var(${t}-left);
      --pa-value-right: var(${t}-right);
      --pa-value-bottom: var(${t}-bottom);
      --pa-value-justify-self: var(${t}-justify-self);
      --pa-value-align-self: var(${t}-align-self);
    }
  `.replaceAll(`
`, "");
}
const op = [
  "normal",
  "most-width",
  "most-height",
  "most-block-size",
  "most-inline-size"
], ap = [
  "flip-block",
  "flip-inline",
  "flip-start"
];
function lp(t) {
  return t.type === "Declaration";
}
function cp(t) {
  return t.type === "Declaration" && t.property === "position-try-fallbacks";
}
function up(t) {
  return t.type === "Declaration" && t.property === "position-try-order";
}
function hp(t) {
  return t.type === "Declaration" && t.property === "position-try";
}
function fp(t) {
  return t.type === "Atrule" && t.name === "position-try";
}
function pp(t) {
  return ap.includes(t);
}
function dp(t) {
  return op.includes(t);
}
function gp(t, e) {
  const n = document.querySelector(t);
  if (n) {
    let s = kp(n);
    return e.forEach((r) => {
      s = po(s, r);
    }), s;
  }
}
function mp(t, e) {
  let n = t.declarations;
  return e.forEach((s) => {
    n = po(n, s);
  }), n;
}
function kp(t) {
  const e = {};
  return Xi.forEach((n) => {
    const s = ot(t, `--${n}-${ro}`);
    s && (e[n] = s);
  }), e;
}
const Sp = {
  "flip-block": {
    top: "bottom",
    bottom: "top",
    "inset-block-start": "inset-block-end",
    "inset-block-end": "inset-block-start",
    "margin-top": "margin-bottom",
    "margin-bottom": "margin-top"
  },
  "flip-inline": {
    left: "right",
    right: "left",
    "inset-inline-start": "inset-inline-end",
    "inset-inline-end": "inset-inline-start",
    "margin-left": "margin-right",
    "margin-right": "margin-left"
  },
  "flip-start": {
    left: "top",
    right: "bottom",
    top: "left",
    bottom: "right",
    "inset-block-start": "inset-block-end",
    "inset-block-end": "inset-block-start",
    "inset-inline-start": "inset-inline-end",
    "inset-inline-end": "inset-inline-start",
    "inset-block": "inset-inline",
    "inset-inline": "inset-block"
  }
}, yp = {
  "flip-block": {
    top: "bottom",
    bottom: "top",
    start: "end",
    end: "start",
    "self-end": "self-start",
    "self-start": "self-end"
  },
  "flip-inline": {
    left: "right",
    right: "left",
    start: "end",
    end: "start",
    "self-end": "self-start",
    "self-start": "self-end"
  },
  "flip-start": {
    top: "left",
    left: "top",
    right: "bottom",
    bottom: "right"
  }
}, bp = {
  "flip-block": {
    top: "bottom",
    bottom: "top",
    start: "end",
    end: "start"
  },
  "flip-inline": {
    left: "right",
    right: "left",
    start: "end",
    end: "start"
  },
  "flip-start": {
    // TODO: Requires fuller logic
  }
};
function xp(t, e) {
  return Sp[e][t] || t;
}
function Cp(t, e) {
  return yp[e][t] || t;
}
function wp(t, e) {
  if (e === "flip-start")
    return t;
  {
    const n = bp[e];
    return t.split("-").map((s) => n[s] || s).join("-");
  }
}
function Tp(t, e, n) {
  if (t === "margin") {
    const [s, r, o, a] = e.children.toArray();
    n === "flip-block" ? a ? e.children.fromArray([o, r, s, a]) : o && e.children.fromArray([o, r, s]) : n === "flip-inline" && a && e.children.fromArray([s, a, o, r]);
  } else if (t === "margin-block") {
    const [s, r] = e.children.toArray();
    n === "flip-block" && r && e.children.fromArray([r, s]);
  } else if (t === "margin-inline") {
    const [s, r] = e.children.toArray();
    n === "flip-inline" && r && e.children.fromArray([r, s]);
  }
}
const Ap = (t, e) => {
  var r;
  return ((r = Lt(`#id{${t}: ${e};}`).children.first) == null ? void 0 : r.block.children.first).value;
};
function po(t, e) {
  const n = {};
  return Object.entries(t).forEach(([s, r]) => {
    var u;
    const o = s, a = Ap(o, r), l = xp(o, e);
    l !== o && ((u = n[o]) != null || (n[o] = "revert")), $t(a, {
      visit: "Function",
      enter(i) {
        Oe(i) && i.children.forEach((c) => {
          oe(c) && Zi(c.name) && (c.name = Cp(c.name, e));
        });
      }
    }), o === "position-area" && a.children.forEach((i) => {
      oe(i) && ho(i.name) && (i.name = wp(i.name, e));
    }), o.startsWith("margin") && Tp(o, a, e), n[l] = Z(a);
  }), n;
}
function go(t) {
  const e = bf(t), n = [];
  return e.forEach((s) => {
    const r = {
      atRules: [],
      tactics: [],
      positionAreas: []
    };
    s.forEach((o) => {
      pp(o.name) ? r.tactics.push(o.name) : o.name.startsWith("--") ? r.atRules.push(o.name) : ho(o.name) && r.positionAreas.push(o.name);
    }), r.positionAreas.length ? n.push({
      positionArea: r.positionAreas[0],
      type: "position-area"
    }) : r.atRules.length && r.tactics.length ? n.push({
      tactics: r.tactics,
      atRule: r.atRules[0],
      type: "at-rule-with-try-tactic"
    }) : r.atRules.length ? n.push({
      atRule: r.atRules[0],
      type: "at-rule"
    }) : r.tactics.length && n.push({
      tactics: r.tactics,
      type: "try-tactic"
    });
  }), n;
}
function vp(t) {
  return cp(t) && t.value.children.first ? go(t.value.children) : [];
}
function Ep(t) {
  if (hp(t) && t.value.children.first) {
    const e = ve(t);
    let n;
    const s = e.value.children.first.name;
    s && dp(s) && (n = s, e.value.children.shift());
    const r = go(e.value.children);
    return { order: n, options: r };
  }
  return {};
}
function $p(t) {
  return up(t) && t.value.children.first ? {
    order: t.value.children.first.name
  } : {};
}
function Lp(t) {
  const { order: e, options: n } = Ep(t);
  if (e || n)
    return { order: e, options: n };
  const { order: s } = $p(t), r = vp(t);
  return s || r ? { order: s, options: r } : {};
}
function Pp(t) {
  return ue(t.property) || ah(t.property) || Qi(t.property) || lh(t.property) || ["position-anchor", "position-area"].includes(t.property);
}
function Op(t) {
  var e, n;
  if (fp(t) && ((e = t.prelude) != null && e.value) && ((n = t.block) != null && n.children)) {
    const s = t.prelude.value, r = t.block.children.filter(
      (a) => lp(a) && Pp(a)
    ), o = {
      uuid: `${s}-try-${lt(12)}`,
      declarations: Object.fromEntries(
        r.map((a) => [a.property, Z(a.value)])
      )
    };
    return { name: s, tryBlock: o };
  }
  return {};
}
function Rp(t) {
  const e = {}, n = {}, s = {};
  for (const r of t) {
    const o = Lt(r.css);
    $t(o, {
      visit: "Atrule",
      enter(a) {
        const { name: l, tryBlock: u } = Op(a);
        l && u && (e[l] = u);
      }
    });
  }
  for (const r of t) {
    let o = !1;
    const a = /* @__PURE__ */ new Set(), l = Lt(r.css);
    $t(l, {
      visit: "Declaration",
      enter(u) {
        var g;
        const i = (g = this.rule) == null ? void 0 : g.prelude, c = fn(i);
        if (!c.length) return;
        const { order: h, options: f } = Lp(u), p = {};
        h && (p.order = h), c.forEach(({ selector: m }) => {
          var k, S;
          f == null || f.forEach((x) => {
            var M, et, w;
            let A;
            if (x.type === "at-rule")
              A = x.atRule;
            else if (x.type === "try-tactic") {
              A = `${m}-${x.tactics.join("-")}`;
              const C = gp(
                m,
                x.tactics
              );
              C && (e[A] = {
                uuid: `${m}-${x.tactics.join("-")}-try-${lt(12)}`,
                declarations: C
              });
            } else if (x.type === "at-rule-with-try-tactic") {
              A = `${m}-${x.atRule}-${x.tactics.join("-")}`;
              const C = e[x.atRule], O = mp(
                C,
                x.tactics
              );
              O && (e[A] = {
                uuid: `${m}-${x.atRule}-${x.tactics.join("-")}-try-${lt(12)}`,
                declarations: O
              });
            }
            if (A && e[A]) {
              const C = `[data-anchor-polyfill="${e[A].uuid}"]`;
              (M = n[C]) != null || (n[C] = []), n[C].push(m), a.has(A) || ((et = p.fallbacks) != null || (p.fallbacks = []), p.fallbacks.push(e[A]), a.add(A), (w = this.stylesheet) == null || w.children.prependData({
                type: "Rule",
                prelude: {
                  type: "Raw",
                  value: C
                },
                block: {
                  type: "Block",
                  children: new q().fromArray(
                    Object.entries(e[A].declarations).map(
                      ([O, P]) => ({
                        type: "Declaration",
                        important: !0,
                        property: O,
                        value: {
                          type: "Raw",
                          value: P
                        }
                      })
                    )
                  )
                }
              }), o = !0);
            }
          }), Object.keys(p).length > 0 && (s[m] ? (p.order && (s[m].order = p.order), p.fallbacks && ((S = (k = s[m]).fallbacks) != null || (k.fallbacks = []), s[m].fallbacks.push(
            ...p.fallbacks
          ))) : s[m] = p);
        });
      }
    }), o && (r.css = Z(l), r.changed = !0);
  }
  return { fallbackTargets: n, validPositions: s };
}
function Ip(t, e) {
  return !t || t === e ? !1 : mo(t) ? t.document.contains(e) : t.contains(e);
}
function mo(t) {
  return !!(t && t === t.window);
}
function _p(t) {
  return Zt(t, "position", "fixed");
}
function gn(t) {
  return !!(t && (_p(t) || Zt(t, "position", "absolute")));
}
function Ts(t, e) {
  return t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING;
}
function Np(t) {
  return R(this, null, function* () {
    return yield H.getOffsetParent(t);
  });
}
function tn(t) {
  return R(this, null, function* () {
    if (!["absolute", "fixed"].includes(ot(t, "position")))
      return yield Np(t);
    let e = t.parentElement;
    for (; e; ) {
      if (!Zt(e, "position", "static") && Zt(e, "display", "block"))
        return e;
      e = e.parentElement;
    }
    return window;
  });
}
function Dp(t, e, n, s) {
  return R(this, null, function* () {
    const r = yield tn(t), o = yield tn(n);
    if (!(Ip(o, t) || mo(o)) || r === o && !(!gn(t) || Ts(t, n)))
      return !1;
    if (r !== o) {
      let a;
      const l = [];
      for (a = r; a && a !== o && a !== window; )
        l.push(a), a = yield tn(a);
      const u = l[l.length - 1];
      if (u instanceof HTMLElement && !(!gn(u) || Ts(u, n)))
        return !1;
    }
    {
      let a = t.parentElement;
      for (; a; ) {
        if (Zt(a, "content-visibility", "hidden"))
          return !1;
        a = a.parentElement;
      }
    }
    return !(e && s && As(t, e, s) !== As(n, e, s));
  });
}
function As(t, e, n) {
  for (; !(t.matches(n) && Of(t, e)); ) {
    if (!t.parentElement)
      return null;
    t = t.parentElement;
  }
  return t;
}
function Fp(t, e, n, s, r) {
  return R(this, null, function* () {
    if (!(t instanceof HTMLElement && n.length && gn(t)))
      return null;
    const o = n.flatMap((l) => Lf(l, r)).filter((l) => Pf(l, e)), a = s.map((l) => l.selector).join(",") || null;
    for (let l = o.length - 1; l >= 0; l--) {
      const u = o[l], i = "fakePseudoElement" in u;
      if (yield Dp(
        i ? u.fakePseudoElement : u,
        e,
        t,
        a
      ))
        return i && u.removeFakePseudoElement(), u;
    }
    return null;
  });
}
function Mp(t) {
  return t.type === "Declaration" && t.property === "anchor-name";
}
function jp(t) {
  return t.type === "Declaration" && t.property === "anchor-scope";
}
function mn(t) {
  return !!(t && t.type === "Function" && t.name === "anchor-size");
}
function we(t) {
  return !!(t && t.type === "Function" && t.name === "var");
}
function oe(t) {
  return !!(t.type === "Identifier" && t.name);
}
function Bp(t) {
  return !!(t.type === "Percentage" && t.value);
}
function vs(t, e) {
  let n, s, r, o = "", a = !1, l;
  const u = [];
  t.children.toArray().forEach((f) => {
    if (a) {
      o = `${o}${Z(f)}`;
      return;
    }
    if (f.type === "Operator" && f.value === ",") {
      a = !0;
      return;
    }
    u.push(f);
  });
  let [i, c] = u;
  if (c || (c = i, i = void 0), i && (oe(i) && i.name.startsWith("--") ? n = i.name : we(i) && i.children.first && (l = i.children.first.name)), c)
    if (Oe(t)) {
      if (oe(c) && Zi(c.name))
        s = c.name;
      else if (Bp(c)) {
        const f = Number(c.value);
        s = Number.isNaN(f) ? void 0 : f;
      }
    } else mn(t) && oe(c) && fh(c.name) && (r = c.name);
  const h = `--anchor-${lt(12)}`;
  return Object.assign(t, {
    type: "Raw",
    value: `var(${h})`,
    children: null
  }), Reflect.deleteProperty(t, "name"), {
    anchorName: n,
    anchorSide: s,
    anchorSize: r,
    fallbackValue: o,
    customPropName: l,
    uuid: h
  };
}
function Es(t) {
  return t.value.children.map(({ name: e }) => e);
}
let Vt = {}, Et = {}, Nt = {}, ae = {}, _t = {};
function Up() {
  Vt = {}, Et = {}, Nt = {}, ae = {}, _t = {};
}
function Wp(t, e) {
  var n;
  if ((Oe(t) || mn(t)) && e) {
    if (e.property.startsWith("--")) {
      const s = Z(e.value), r = vs(t);
      return ae[r.uuid] = s, Nt[e.property] = [
        ...(n = Nt[e.property]) != null ? n : [],
        r
      ], { changed: !0 };
    }
    if (Oe(t) && ue(e.property) || mn(t) && Ji(e.property)) {
      const s = vs(t);
      return { prop: e.property, data: s, changed: !0 };
    }
  }
  return {};
}
function $s(t, e, n) {
  return R(this, null, function* () {
    let s = e == null ? void 0 : e.anchorName;
    const r = e == null ? void 0 : e.customPropName;
    if (t && !s) {
      const u = ot(
        t,
        "position-anchor"
      );
      u ? s = u : r && (s = ot(t, r));
    }
    const o = s ? Vt[s] || [] : [], a = s ? Et[oo.All] || [] : [], l = s ? Et[s] || [] : [];
    return yield Fp(
      t,
      s || null,
      o,
      [...a, ...l],
      { roots: n.roots }
    );
  });
}
function zp(t, e) {
  return R(this, null, function* () {
    var h, f, p, g, m, k, S, x, A, M, et;
    const n = {}, s = {};
    Up();
    const { fallbackTargets: r, validPositions: o } = Rp(t);
    for (const w of t) {
      let C = !1;
      const O = Lt(w.css);
      $t(O, function(P) {
        var J, xt, Ot, Ct, pt, wt;
        const N = (J = this.rule) == null ? void 0 : J.prelude, $ = fn(N);
        if (Mp(P) && $.length)
          for (const B of Es(P))
            (xt = Vt[B]) != null || (Vt[B] = []), Vt[B].push(...$);
        if (jp(P) && $.length)
          for (const B of Es(P))
            (Ot = Et[B]) != null || (Et[B] = []), Et[B].push(...$);
        const {
          prop: v,
          data: j,
          changed: D
        } = Wp(P, this.declaration);
        if (v && j && $.length)
          for (const { selector: B } of $)
            n[B] = G(U({}, n[B]), {
              [v]: [...(pt = (Ct = n[B]) == null ? void 0 : Ct[v]) != null ? pt : [], j]
            });
        let V;
        if (this.block && (V = ep(P), V)) {
          np(
            V,
            this.block
          );
          for (const { selector: B } of $)
            s[B] = [
              ...(wt = s[B]) != null ? wt : [],
              V
            ];
        }
        (D || V) && (C = !0);
      }), C && (w.css = Z(O), w.changed = !0);
    }
    const a = new Set(Object.keys(Nt)), l = {}, u = (w) => {
      var P, N, $, v, j;
      const C = [], O = new Set((N = (P = l[w]) == null ? void 0 : P.names) != null ? N : []);
      for (; O.size > 0; )
        for (const D of O)
          C.push(...($ = Nt[D]) != null ? $ : []), O.delete(D), (j = (v = l[D]) == null ? void 0 : v.names) != null && j.length && l[D].names.forEach((V) => O.add(V));
      return C;
    };
    for (; a.size > 0; ) {
      const w = [];
      for (const C of t) {
        let O = !1;
        const P = Lt(C.css);
        $t(P, {
          visit: "Function",
          enter(N) {
            var D, V;
            const $ = (D = this.rule) == null ? void 0 : D.prelude, v = this.declaration, j = v == null ? void 0 : v.property;
            if (($ == null ? void 0 : $.children.isEmpty) === !1 && we(N) && v && j && N.children.first && a.has(N.children.first.name) && // For now, we only want assignments to other CSS custom properties
            j.startsWith("--")) {
              const J = N.children.first, xt = (V = Nt[J.name]) != null ? V : [], Ot = u(J.name);
              if (!(xt.length || Ot.length))
                return;
              const Ct = `${J.name}-anchor-${lt(12)}`, pt = Z(v.value);
              ae[Ct] = pt, l[j] || (l[j] = { names: [], uuids: [] });
              const wt = l[j];
              wt.names.includes(J.name) || wt.names.push(J.name), wt.uuids.push(Ct), w.push(j), J.name = Ct, O = !0;
            }
          }
        }), O && (C.css = Z(P), C.changed = !0);
      }
      a.clear(), w.forEach((C) => a.add(C));
    }
    for (const w of t) {
      let C = !1;
      const O = Lt(w.css);
      $t(O, {
        visit: "Function",
        enter(P) {
          var j, D, V, J, xt, Ot, Ct;
          const N = (j = this.rule) == null ? void 0 : j.prelude, $ = this.declaration, v = $ == null ? void 0 : $.property;
          if ((N == null ? void 0 : N.children.isEmpty) === !1 && we(P) && $ && v && P.children.first && // Now we only want assignments to inset/sizing properties
          (ue(v) || Qi(v))) {
            const pt = P.children.first, wt = (D = Nt[pt.name]) != null ? D : [], B = u(pt.name);
            if (!(wt.length || B.length))
              return;
            const fe = `${v}-${lt(12)}`;
            if (B.length) {
              const jt = /* @__PURE__ */ new Set([pt.name]);
              for (; jt.size > 0; )
                for (const Bt of jt) {
                  const K = l[Bt];
                  if ((V = K == null ? void 0 : K.names) != null && V.length && ((J = K == null ? void 0 : K.uuids) != null && J.length))
                    for (const Ut of K.names)
                      for (const Wt of K.uuids)
                        _t[Wt] = G(U({}, _t[Wt]), {
                          // - `key` (`propUuid`) is the property-specific
                          //   uuid to append to the new custom property name
                          // - `value` is the new property-specific custom
                          //   property value to use
                          [fe]: `${Ut}-${fe}`
                        });
                  jt.delete(Bt), (xt = K == null ? void 0 : K.names) != null && xt.length && K.names.forEach((Ut) => jt.add(Ut));
                }
            }
            const ko = fn(N);
            for (const jt of [...wt, ...B]) {
              const Bt = U({}, jt), K = `--anchor-${lt(12)}-${v}`, Ut = Bt.uuid;
              Bt.uuid = K;
              for (const { selector: Wt } of ko)
                n[Wt] = G(U({}, n[Wt]), {
                  [v]: [...(Ct = (Ot = n[Wt]) == null ? void 0 : Ot[v]) != null ? Ct : [], Bt]
                });
              _t[Ut] = G(U({}, _t[Ut]), {
                // - `key` (`propUuid`) is the property-specific
                //   uuid to append to the new custom property name
                // - `value` is the new property-specific custom
                //   property value to use
                [fe]: K
              });
            }
            pt.name = `${pt.name}-${fe}`, C = !0;
          }
        }
      }), C && (w.css = Z(O), w.changed = !0);
    }
    if (Object.keys(_t).length > 0)
      for (const w of t) {
        let C = !1;
        const O = Lt(w.css);
        $t(O, {
          visit: "Function",
          enter(P) {
            var N, $, v, j;
            if (we(P) && (($ = (N = P.children.first) == null ? void 0 : N.name) != null && $.startsWith("--")) && ((j = (v = this.declaration) == null ? void 0 : v.property) != null && j.startsWith("--")) && this.block) {
              const D = P.children.first, V = _t[D.name];
              if (V)
                for (const [J, xt] of Object.entries(V))
                  this.block.children.appendData({
                    type: "Declaration",
                    important: !1,
                    property: `${this.declaration.property}-${J}`,
                    value: {
                      type: "Raw",
                      value: Z(this.declaration.value).replace(
                        `var(${D.name})`,
                        `var(${xt})`
                      )
                    }
                  }), C = !0;
              ae[D.name] && (this.declaration.value = {
                type: "Raw",
                value: ae[D.name]
              }, C = !0);
            }
          }
        }), C && (w.css = Z(O), w.changed = !0);
      }
    const i = /* @__PURE__ */ new Map();
    for (const [w, C] of Object.entries(n)) {
      let O;
      w.startsWith("[data-anchor-polyfill=") && ((h = r[w]) != null && h.length) ? O = ie(
        e.roots,
        r[w].join(",")
      ) : O = ie(e.roots, w);
      for (const [P, N] of Object.entries(C))
        for (const $ of N)
          for (const v of O) {
            const j = yield $s(v, $, {
              roots: e.roots
            }), D = `--anchor-${lt(12)}`;
            i.set(v, G(U({}, (f = i.get(v)) != null ? f : {}), {
              [$.uuid]: D
            })), v.setAttribute(
              "style",
              `${$.uuid}: var(${D}); ${(p = v.getAttribute("style")) != null ? p : ""}`
            ), o[w] = G(U({}, o[w]), {
              declarations: G(U({}, (g = o[w]) == null ? void 0 : g.declarations), {
                [P]: [
                  ...(S = (k = (m = o[w]) == null ? void 0 : m.declarations) == null ? void 0 : k[P]) != null ? S : [],
                  G(U({}, $), { anchorEl: j, targetEl: v, uuid: D })
                ]
              })
            });
          }
    }
    const c = {
      el: document.createElement("link"),
      changed: !1,
      created: !0,
      css: ""
    };
    t.push(c);
    for (const [w, C] of Object.entries(s)) {
      const O = ie(e.roots, w);
      for (const P of O) {
        const N = yield $s(P, null, {
          roots: e.roots
        });
        for (const $ of C) {
          const v = yield rp(
            P,
            $,
            N
          );
          c.css += ip(
            v.targetUUID,
            $.selectorUUID
          ), c.changed = !0, o[w] = G(U({}, o[w]), {
            declarations: G(U({}, (x = o[w]) == null ? void 0 : x.declarations), {
              "position-area": [
                ...(et = (M = (A = o[w]) == null ? void 0 : A.declarations) == null ? void 0 : M["position-area"]) != null ? et : [],
                v
              ]
            })
          });
        }
      }
    }
    return { rules: o, inlineStyles: i, anchorScopes: Et };
  });
}
const Hp = [
  "as",
  "blocking",
  "crossorigin",
  // 'disabled' is not relevant for style elements, but this exclusion is
  // theoretical, as a <link rel=stylesheet disabled> will not be loaded, and
  // will not reach this part of the polyfill. See #246.
  "disabled",
  "fetchpriority",
  "href",
  "hreflang",
  "integrity",
  "referrerpolicy",
  "rel",
  "type"
];
function Ls(t, e, n = !1) {
  const s = [];
  for (const { el: r, css: o, changed: a, created: l = !1 } of t) {
    const u = { el: r, css: o, changed: !1 };
    if (a) {
      if (r.tagName.toLowerCase() === "style")
        r.innerHTML = o;
      else if (r instanceof HTMLLinkElement) {
        const i = document.createElement("style");
        i.textContent = o;
        for (const c of r.getAttributeNames())
          if (!c.startsWith("on") && !Hp.includes(c)) {
            const h = r.getAttribute(c);
            h !== null && i.setAttribute(c, h);
          }
        r.hasAttribute("href") && i.setAttribute("data-original-href", r.getAttribute("href")), l ? (i.setAttribute("data-generated-by-polyfill", "true"), document.head.insertAdjacentElement("beforeend", i)) : (r.insertAdjacentElement("beforebegin", i), r.remove()), u.el = i;
      } else if (r.hasAttribute("data-has-inline-styles")) {
        const i = r.getAttribute("data-has-inline-styles");
        if (i) {
          const c = `[data-has-inline-styles="${i}"]{`;
          let f = o.slice(c.length, 0 - "}".length);
          const p = e == null ? void 0 : e.get(r);
          if (p)
            for (const [g, m] of Object.entries(p))
              f = `${g}: var(${m}); ${f}`;
          r.setAttribute("style", f);
        }
      }
    }
    n && r.hasAttribute("data-has-inline-styles") && r.removeAttribute("data-has-inline-styles"), s.push(u);
  }
  return s;
}
const Vp = G(U({}, H), { _c: /* @__PURE__ */ new Map() }), Gp = (t, e) => {
  let n;
  switch (t) {
    case "start":
    case "self-start":
      n = 0;
      break;
    case "end":
    case "self-end":
      n = 100;
      break;
    default:
      typeof t == "number" && !Number.isNaN(t) && (n = t);
  }
  if (n !== void 0)
    return e ? 100 - n : n;
}, qp = (t, e) => {
  let n;
  switch (t) {
    case "block":
    case "self-block":
      n = e ? "width" : "height";
      break;
    case "inline":
    case "self-inline":
      n = e ? "height" : "width";
      break;
  }
  return n;
}, Ps = (t) => {
  switch (t) {
    case "top":
    case "bottom":
    case "inset-block-start":
    case "inset-block-end":
      return "y";
    case "left":
    case "right":
    case "inset-inline-start":
    case "inset-inline-end":
      return "x";
  }
  return null;
}, Kp = (t) => {
  switch (t) {
    case "x":
      return "width";
    case "y":
      return "height";
  }
  return null;
}, Os = (t) => ot(t, "display") === "inline", Rs = (t, e) => (e === "x" ? ["border-left-width", "border-right-width"] : ["border-top-width", "border-bottom-width"]).reduce(
  (s, r) => s + parseInt(ot(t, r), 10),
  0
) || 0, Se = (t, e) => parseInt(ot(t, `margin-${e}`), 10) || 0, Qp = (t) => ({
  top: Se(t, "top"),
  right: Se(t, "right"),
  bottom: Se(t, "bottom"),
  left: Se(t, "left")
}), en = (a) => R(null, [a], function* ({
  targetEl: t,
  targetProperty: e,
  anchorRect: n,
  anchorSide: s,
  anchorSize: r,
  fallback: o = null
}) {
  var l;
  if (!((r || s !== void 0) && t && n))
    return o;
  if (r) {
    if (!Ji(e))
      return o;
    let u;
    switch (r) {
      case "width":
      case "height":
        u = r;
        break;
      default: {
        let i = !1;
        const c = ot(t, "writing-mode");
        i = c.startsWith("vertical-") || c.startsWith("sideways-"), u = qp(r, i);
      }
    }
    return u ? `${n[u]}px` : o;
  }
  if (s !== void 0) {
    let u, i;
    const c = Ps(e);
    if (!(ue(e) && c && (!ue(s) || c === Ps(s))))
      return o;
    const h = [
      "top",
      "left",
      "inset-block-start",
      "inset-inline-start"
    ], f = [
      "bottom",
      "right",
      "inset-block-end",
      "inset-inline-end"
    ];
    switch (s) {
      case "left":
      case "top":
        u = 0;
        break;
      case "right":
      case "bottom":
        u = 100;
        break;
      case "center":
        u = 50;
        break;
      case "inside":
        u = h.includes(e) ? 0 : 100;
        break;
      case "outside":
        u = h.includes(e) ? 100 : 0;
        break;
      default:
        if (t) {
          const m = (yield (l = H.isRTL) == null ? void 0 : l.call(H, t)) || !1;
          u = Gp(s, m);
        }
    }
    const p = typeof u == "number" && !Number.isNaN(u), g = Kp(c);
    if (p && g) {
      f.includes(e) && (i = yield vn(t));
      let m = n[c] + n[g] * (u / 100);
      switch (e) {
        case "bottom":
        case "inset-block-end": {
          if (!i)
            break;
          let k = i.clientHeight;
          if (k === 0 && Os(i)) {
            const S = Rs(i, c);
            k = i.offsetHeight - S;
          }
          m = k - m;
          break;
        }
        case "right":
        case "inset-inline-end": {
          if (!i)
            break;
          let k = i.clientWidth;
          if (k === 0 && Os(i)) {
            const S = Rs(i, c);
            k = i.offsetWidth - S;
          }
          m = k - m;
          break;
        }
      }
      return `${m}px`;
    }
  }
  return o;
}), Yp = (t) => "wrapperEl" in t, Xp = (t) => "uuid" in t;
function Jp(t, e = !1) {
  return R(this, null, function* () {
    const n = document.documentElement;
    for (const [s, r] of Object.entries(t))
      for (const o of r) {
        const a = o.anchorEl, l = o.targetEl;
        if (a && l)
          if (Yp(o)) {
            const u = o.wrapperEl, i = (c, h, f) => R(null, null, function* () {
              return c === 0 ? "0px" : yield en({
                targetEl: u,
                targetProperty: h,
                anchorRect: f,
                anchorSide: c
              });
            });
            rn(
              a,
              u,
              () => R(null, null, function* () {
                const c = ot(
                  l,
                  lo
                );
                u.setAttribute(co, c);
                const h = yield H.getElementRects({
                  reference: a,
                  floating: u,
                  strategy: "absolute"
                }), f = o.insets, p = yield i(
                  f.block[0],
                  "top",
                  h.reference
                ), g = yield i(
                  f.block[1],
                  "bottom",
                  h.reference
                ), m = yield i(
                  f.inline[0],
                  "left",
                  h.reference
                ), k = yield i(
                  f.inline[1],
                  "right",
                  h.reference
                );
                n.style.setProperty(
                  `${o.targetUUID}-top`,
                  p || null
                ), n.style.setProperty(
                  `${o.targetUUID}-left`,
                  m || null
                ), n.style.setProperty(
                  `${o.targetUUID}-right`,
                  k || null
                ), n.style.setProperty(
                  `${o.targetUUID}-bottom`,
                  g || null
                ), n.style.setProperty(
                  `${o.targetUUID}-justify-self`,
                  o.alignments.inline
                ), n.style.setProperty(
                  `${o.targetUUID}-align-self`,
                  o.alignments.block
                );
              }),
              { animationFrame: e }
            );
          } else
            rn(
              a,
              l,
              () => R(null, null, function* () {
                const u = yield H.getElementRects({
                  reference: a,
                  floating: l,
                  strategy: "absolute"
                }), i = yield en({
                  targetEl: l,
                  targetProperty: s,
                  anchorRect: u.reference,
                  anchorSide: o.anchorSide,
                  anchorSize: o.anchorSize,
                  fallback: o.fallbackValue
                });
                n.style.setProperty(o.uuid, i);
              }),
              { animationFrame: e }
            );
        else if (Xp(o)) {
          const u = yield en({
            targetProperty: s,
            anchorSide: o.anchorSide,
            anchorSize: o.anchorSize,
            fallback: o.fallbackValue
          });
          n.style.setProperty(o.uuid, u);
        }
      }
  });
}
function Is(t, e) {
  return R(this, null, function* () {
    const n = yield H.getElementRects({
      reference: t,
      floating: t,
      strategy: "absolute"
    });
    return yield Xo(
      {
        x: t.offsetLeft,
        y: t.offsetTop,
        platform: Vp,
        rects: n,
        elements: {
          floating: t,
          reference: e
        },
        strategy: "absolute"
      },
      {
        padding: Qp(t)
      }
    );
  });
}
function Zp(t, e, n = !1) {
  return R(this, null, function* () {
    if (!e.length)
      return;
    const s = document.querySelectorAll(t);
    for (const r of s) {
      let o = !1;
      const a = yield vn(r);
      rn(
        // We're just checking whether the target element overflows, so we don't
        // care about the position of the anchor element in this case. Passing in
        // an empty object instead of a reference element avoids unnecessarily
        // watching for irrelevant changes.
        {},
        r,
        () => R(null, null, function* () {
          if (o)
            return;
          o = !0, r.removeAttribute("data-anchor-polyfill");
          const l = yield Is(r, a);
          if (Object.values(l).every((u) => u <= 0)) {
            r.removeAttribute("data-anchor-polyfill-last-successful"), o = !1;
            return;
          }
          for (const [u, { uuid: i }] of e.entries()) {
            r.setAttribute("data-anchor-polyfill", i);
            const c = yield Is(r, a);
            if (Object.values(c).every((h) => h <= 0)) {
              r.setAttribute("data-anchor-polyfill-last-successful", i), o = !1;
              break;
            }
            if (u === e.length - 1) {
              const h = r.getAttribute(
                "data-anchor-polyfill-last-successful"
              );
              h ? r.setAttribute("data-anchor-polyfill", h) : r.removeAttribute("data-anchor-polyfill"), o = !1;
              break;
            }
          }
        }),
        { animationFrame: n, layoutShift: !1 }
      );
    }
  });
}
function td(t, e = !1) {
  return R(this, null, function* () {
    var n, s;
    for (const r of Object.values(t))
      yield Jp((n = r.declarations) != null ? n : {}, e);
    for (const [r, o] of Object.entries(t))
      yield Zp(
        r,
        (s = o.fallbacks) != null ? s : [],
        e
      );
  });
}
function ed(t = {}) {
  const e = typeof t == "boolean" ? { useAnimationFrame: t } : t, n = e.useAnimationFrame === void 0 ? !!window.UPDATE_ANCHOR_ON_ANIMATION_FRAME : e.useAnimationFrame;
  return Array.isArray(e.elements) || (e.elements = void 0), (!Array.isArray(e.roots) || e.roots.length === 0) && (e.roots = [document]), Object.assign(e, {
    useAnimationFrame: n
  });
}
function sd(t) {
  return R(this, null, function* () {
    const e = ed(
      t != null ? t : window.ANCHOR_POSITIONING_POLYFILL_OPTIONS
    );
    let n = yield Df(e), s = {}, r;
    Cf();
    try {
      Af(n) && (n = Ls(n));
      const a = yield zp(n, { roots: e.roots });
      s = a.rules, r = a.inlineStyles;
    } catch (o) {
      throw xf(), o;
    }
    return Object.values(s).length && (Ls(n, r, !0), yield td(s, e.useAnimationFrame)), s;
  });
}
export {
  sd as default
};
//# sourceMappingURL=css-anchor-positioning-fn.js.map
