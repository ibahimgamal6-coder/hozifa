
(function () {
  'use strict';

  var host = document.getElementById('rql');
  if (!host) return;

  var requests = [];
  var busy = {};

  function escText(v) {
    return typeof esc === 'function' ? esc(v) : String(v || '');
  }

  function notify(msg) {
    if (typeof toast === 'function') toast(msg);
    else alert(msg);
  }

  function pending(r) {
    return !r.status || r.status === 'pending';
  }

  function render() {
    var waiting = requests.filter(pending);
    var history = requests.filter(function (r) {
      return !pending(r);
    });

    host.innerHTML =
      '<div class="row"><b>الطلبات الجديدة: ' + waiting.length +
      '</b><button class="g" id="regRefresh">تحديث</button></div>' +

      (waiting.length ? waiting.map(function (r) {
        return '<div class="card" style="margin-top:10px">' +
          '<b>' + escText(r.n) + '</b>' +
          '<div class="sub">ولي الأمر: ' + escText(r.pn) +
          '</div><div class="sub">الهاتف: ' + escText(r.ph) +
          '</div>' +
          (r.ag ? '<div class="sub">العمر: ' + escText(r.ag) + '</div>' : '') +
          (r.m ? '<div class="sub">الحفظ السابق: ' + escText(r.m) + '</div>' : '') +

          '<label>المستوى</label>' +
          '<select id="regLevel_' + escText(r.id) + '">' +
          LV.map(function (v) {
            return '<option>' + escText(v) + '</option>';
          }).join('') +
          '</select>' +

          '<div class="row">' +
          '<button data-reg-action="accept" data-reg-id="' + escText(r.id) + '">اعتماد الطلب</button>' +
          '<button class="r" data-reg-action="reject" data-reg-id="' + escText(r.id) + '">رفض</button>' +
          '</div></div>';
      }).join('') : '<div class="empty">لا توجد طلبات جديدة حالياً</div>') +

      (history.length ?
        '<div class="card"><h2>سجل الطلبات السابقة</h2>' +
        history.map(function (r) {
          return '<div class="row" style="padding:8px 0;border-top:1px solid var(--line)">' +
            '<span>' + escText(r.n) + '</span>' +
            '<b>' + (r.status === 'accepted' ? 'تم القبول' : 'مرفوض') + '</b>' +
            '</div>';
        }).join('') + '</div>' : '');
  }

  function setSection() {
    if (location.hash !== '#reg') return;

    document.querySelectorAll('main section').forEach(function (s) {
      s.hidden = s.id !== 'v-reg';
    });

    document.querySelectorAll('nav a').forEach(function (a) {
      a.className = a.id === 'n-reg' ? 'on' : '';
    });
  }

  window.addEventListener('hashchange', setSection);

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-reg-action],#regRefresh');
    if (!b) return;

    if (b.id === 'regRefresh') {
      notify('يتم تحديث الطلبات تلقائياً');
      return;
    }

    var id = b.dataset.regId;
    var action = b.dataset.regAction;
    var r = requests.filter(function (x) {
      return x.id === id;
    })[0];

    if (!r || !pending(r) || busy[id]) return;

    var user = firebase.auth().currentUser;
    if (!user) {
      notify('سجّل الدخول أولاً');
      return;
    }

    var regRef = fs.collection('reg').doc(id);
    busy[id] = true;
    b.disabled = true;

    if (action === 'reject') {
      if (!confirm('هل تريد رفض طلب ' + r.n + '؟')) {
        busy[id] = false;
        b.disabled = false;
        return;
      }

      regRef.update({
        status: 'rejected',
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
        reviewedBy: user.uid
      }).then(function () {
        notify('تم رفض الطلب مع الاحتفاظ بسجله');
      }).catch(function (err) {
        console.error(err);
        notify('تعذّر رفض الطلب. راجع صلاحيات Firebase');
      }).finally(function () {
        busy[id] = false;
      });

      return;
    }

    if (action === 'accept') {
      var level = document.getElementById('regLevel_' + id);
      var studentRef = fs.collection('st').doc();
      var sid = studentRef.id;
      var parentRef = fs.collection('parents').doc(r.uid);

      if (!r.uid) {
        busy[id] = false;
        b.disabled = false;
        notify('الطلب لا يحتوي على معرّف حساب ولي الأمر');
        return;
      }

      if (!confirm('اعتماد الطالب ' + r.n + ' وإنشاء سجله؟')) {
        busy[id] = false;
        b.disabled = false;
        return;
      }

      var student = {
        id: sid,
        name: r.n || '',
        l: level ? level.value : 'تمهيدي',
        s: 78,
        d: 1,
        pn: r.pn || '',
        ph: r.ph || '',
        h: [],
        c: '',
        mm: r.m || ''
      };

      if (r.ag) student.ag = r.ag;

      var batch = fs.batch();

      batch.set(studentRef, student);

      batch.set(parentRef, {
        kids: firebase.firestore.FieldValue.arrayUnion(sid),
        ph: r.ph || '',
        pn: r.pn || ''
      }, { merge: true });

      batch.update(regRef, {
        status: 'accepted',
        sid: sid,
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
        reviewedBy: user.uid
      });

      batch.commit().then(function () {
        notify('تم اعتماد الطالب وربط حساب ولي الأمر بنجاح');
      }).catch(function (err) {
        console.error(err);
        notify('لم يتم الاعتماد: ' + (err.message || 'تحقق من قواعد Firebase'));
      }).finally(function () {
        busy[id] = false;
      });
    }
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) return;

    fs.collection('reg').onSnapshot(function (snapshot) {
      requests = snapshot.docs.map(function (doc) {
        return Object.assign({ id: doc.id }, doc.data());
      });

      requests.sort(function (a, b) {
        var x = a.ts && a.ts.toMillis ? a.ts.toMillis() : 0;
        var y = b.ts && b.ts.toMillis ? b.ts.toMillis() : 0;
        return y - x;
      });

      render();
      setSection();

    }, function (err) {
      console.error(err);
      host.innerHTML = '<div class="empty">تعذّر تحميل الطلبات. تحقق من صلاحيات Firebase.</div>';
    });
  });

  render();
  setSection();
})();
(function () {
  function syncRequestsTab() {
    var active = location.hash === '#reg';
    var section = document.getElementById('v-reg');
    var nav = document.getElementById('n-reg');

    if (section) section.hidden = !active;

    if (active) {
      document.querySelectorAll('nav a').forEach(function (a) {
        a.classList.remove('on');
      });
      if (nav) nav.classList.add('on');
    } else if (nav) {
      nav.classList.remove('on');
    }
  }

  window.addEventListener('hashchange', syncRequestsTab);
  syncRequestsTab();
})();
 
