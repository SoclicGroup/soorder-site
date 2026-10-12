/* Mini moteur pour les blocs interactifs du site Soorder (démo, simulateur, effet 3D). */
(function () {
  var comp = null, vals = {}, queued = false;
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (s) {
    for (var k in s) this.state[k] = s[k];
    if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; render(); }); }
  };
  window.DCLogic = DCLogic;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var CHECK = '<i><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>';
  var stepsKey = null;

  function renderSteps() {
    var list = document.querySelector('.how-list');
    if (!list || !vals.steps) return;
    var key = vals.steps.map(function (s) { return s.cls; }).join('|');
    if (key !== stepsKey) {
      stepsKey = key;
      list.innerHTML = vals.steps.map(function (s, i) {
        return '<button type="button" role="tab" class="' + s.cls + '" aria-selected="' + s.sel + '" data-step="' + i + '">' +
          '<span class="how-n">' + esc(s.n) + '</span><span><span class="how-t">' + esc(s.title) + '</span>' +
          (s.active ? '<ul class="how-subs">' + s.subs.map(function (x) { return '<li class="' + x.cls + '">' + CHECK + esc(x.label) + '</li>'; }).join('') + '</ul>' : '') +
          '</span>' + (s.active ? '<span class="how-bar" aria-hidden="true"><span class="how-fill" style="width:' + vals.barW + '"></span></span>' : '') +
          '</button>';
      }).join('');
    } else {
      vals.steps.forEach(function (s, i) {
        if (!s.active) return;
        var btn = list.children[i];
        var lis = btn.querySelectorAll('li');
        s.subs.forEach(function (x, j) { if (lis[j] && lis[j].className !== x.cls) lis[j].className = x.cls; });
        var f = btn.querySelector('.how-fill'); if (f) f.style.width = vals.barW;
      });
    }
  }

  function render() {
    vals = comp.renderVals() || {};
    document.querySelectorAll('[data-c]').forEach(function (el) {
      var c = (vals[el.dataset.c] || '') + (el.dataset.cx ? ' ' + el.dataset.cx : '');
      if (el.className !== c) el.className = c;
    });
    document.querySelectorAll('[data-s]').forEach(function (el) {
      el.dataset.s.split(';').forEach(function (pair) {
        var p = pair.split(':'); el.style.setProperty(p[0], vals[p[1]]);
      });
    });
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var t = String(vals[el.dataset.t]); if (el.textContent !== t) el.textContent = t;
    });
    document.querySelectorAll('[data-if]').forEach(function (el) {
      el.style.display = vals[el.dataset.if] ? 'contents' : 'none';
    });
    renderSteps();
  }

  function bind() {
    ['click', 'mousemove', 'mouseleave'].forEach(function (type) {
      document.querySelectorAll('[data-on-' + type + ']').forEach(function (el) {
        el.addEventListener(type, function (e) {
          var fn = vals[el.getAttribute('data-on-' + type)];
          if (typeof fn === 'function') fn(e);
        });
      });
    });
    var list = document.querySelector('.how-list');
    if (list) list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]');
      if (b && vals.steps) vals.steps[+b.dataset.step].pick();
    });
  }

  window.DC = {
    mount: function (Component) {
      function go() {
        comp = new Component({});
        render(); bind();
        if (comp.componentDidMount) comp.componentDidMount();
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
    }
  };
})();
