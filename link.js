(function () {
  'use strict';

  var host = document.getElementById('rql');
  var requests = [];
  var classes = [];
  var busy = {};

  // التحكم في جميع التبويبات
  var tabs = ['home', 'att', 'rec', 'stu', 'exm', 'reg', 'fee'];

  function syncTabs() {
    var active = location.hash.replace('#', '');
    if (tabs.indexOf(active) === -1) active = 'home';

    tabs.forEach(function (name) {
      var section = document.getElementById('v-' + name);
      var nav = document.getElementById('n-' + name);

      if (section) {
        section.hidden = name !== active;
        section.style.display = name === active ? '' : 'none';
      }

      if (nav) {
        nav.classList.toggle('on', name === active);
      }
    });
  }

  document.addEventListener('click', function(e) {
  var a = e.target.closest('#n-fee');
  if (!a) return;
  e.preventDefault();
  location.hash = '#fee';
  syncTabs();
}, true);
window.addEventListener('hashchange', syncTabs);

  if (!host) return;

  function safe(v) {
    return typeof esc === 'function'
      ? esc(v)
      : String(v == null ? '' : v);
  }

  function notify(msg) {
    if (typeof toast === 'function') toast(msg);
    else alert(msg);
  }

  function pending(r) {
    return !r.status || r.status === 'pending';
  }

  // عرض الطلبات
  function render() {
    var waiting = requests.filter(pending);
    var history = requests.filter(function (r) {
      return !pending(r);
    });

    host.innerHTML =
      '<div class="row"><b>الطلبات الجديدة: ' +
      waiting.length +
      '</b><button class="g" id="regRefresh">تحديث</button></div>' +

      (waiting.length
        ? waiting.map(function (r) {
            return '<div class="card" style="margin-top:10px">' +
              '<b>' + safe(r.n) + '</b>' +
              '<div class="sub">ولي الأمر: ' + safe(r.pn) + '</div>' +
              '<div class="sub">الهاتف: ' + safe(r.ph) + '</div>' +
              (r.ag
                ? '<div class="sub">العمر: ' + safe(r.ag) + '</div>'
                : '') +
              (r.m
                ? '<div class="sub">الحفظ السابق: ' + safe(r.m) + '</div>'
                : '') +

              '<label>المستوى</label>' +
              '<select id="regLevel_' + safe(r.id) + '">' +
              LV.map(function (v) {
                return '<option>' + safe(v) + '</option>';
              }).join('') +
              '</select>' +

              '<label>الفصل</label>' +
              '<select id="regClass_' + safe(r.id) + '">' +
              '<option value="">اختر الفصل</option>' +
              classes.map(function (c) {
                return '<option value="' + safe(c.id) + '">' +
                  safe(c.n || c.id) + (c.t ? ' — ' + safe(c.t) : '') +
                  '</option>';
              }).join('') +
              '</select>' +

              '<div class="row">' +
              '<button data-reg-action="accept" data-reg-id="' +
              safe(r.id) + '">اعتماد الطلب</button>' +
              '<button class="r" data-reg-action="reject" data-reg-id="' +
              safe(r.id) + '">رفض</button>' +
              '</div></div>';
          }).join('')
        : '<div class="empty">لا توجد طلبات جديدة حالياً</div>') +

      (history.length
        ? '<div class="card"><h2>سجل الطلبات السابقة</h2>' +
          history.map(function (r) {
            return '<div class="row" style="padding:8px 0;border-top:1px solid var(--line)">' +
              '<span>' + safe(r.n) + '</span>' +
              '<b>' +
              (r.status === 'accepted' ? 'تم القبول' : 'مرفوض') +
              '</b></div>';
          }).join('') +
          '</div>'
        : '');
  }

  // أزرار قبول ورفض الطلبات
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

    // رفض الطلب
    if (action === 'reject') {
      if (!confirm('هل تريد رفض طلب ' + r.n + '؟')) return;

      busy[id] = true;
      b.disabled = true;

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

    // قبول الطلب
    if (action === 'accept') {
      if (!r.uid) {
        notify('الطلب لا يحتوي على معرّف حساب ولي الأمر');
        return;
      }

      var level = document.getElementById('regLevel_' + id);
      var cls = document.getElementById('regClass_' + id);

      if (cls && !cls.value && classes.length) {
        if (!confirm('لم تختر فصلاً للطالب. هل تريد الاعتماد بدون فصل؟')) return;
      }

      if (!confirm('اعتماد الطالب ' + r.n + ' وإنشاء سجله؟')) return;

      var studentRef = fs.collection('st').doc();
      var sid = studentRef.id;
      var parentRef = fs.collection('parents').doc(r.uid);

      var student = {
        id: sid,
        name: r.n || '',
        l: level ? level.value : 'تمهيدي',
        s: 78,
        d: 1,
        pn: r.pn || '',
        ph: r.ph || '',
        h: [],
        c: cls ? cls.value : '',
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

      busy[id] = true;
      b.disabled = true;

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

  // تحميل الطلبات والفصول من Firebase
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) return;

    fs.collection('cl').onSnapshot(function (snapshot) {
      classes = snapshot.docs.map(function (doc) {
        return Object.assign({ id: doc.id }, doc.data());
      });
      render();
    }, function (err) {
      console.error(err);
    });

    fs.collection('reg').onSnapshot(function (snapshot) {
      requests = snapshot.docs.map(function (doc) {
        return Object.assign(
          { id: doc.id },
          doc.data()
        );
      });

      requests.sort(function (a, b) {
        var x = a.ts && a.ts.toMillis ? a.ts.toMillis() : 0;
        var y = b.ts && b.ts.toMillis ? b.ts.toMillis() : 0;
        return y - x;
      });

      render();
      syncTabs();

    }, function (err) {
      console.error(err);
      host.innerHTML =
        '<div class="empty">تعذّر تحميل الطلبات. تحقق من صلاحيات Firebase.</div>';
    });
  });

  render();
})();
                                     
