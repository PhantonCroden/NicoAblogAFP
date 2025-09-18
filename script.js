// Basic interactivity: menu toggle, FAQ accordion, form validation + mock submit, download mock

document.addEventListener('DOMContentLoaded', function() {
  // menu toggle (small screens)
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuBtn){
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.style.display = expanded ? 'none' : 'flex';
    });
  }

  // FAQ accordion behavior
  const faqButtons = document.querySelectorAll('.faq-q');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close all first for single-open behavior
      faqButtons.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.style.display = 'none';
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.style.display = expanded ? 'none' : 'block';
    });
  });

  // Form handling
  const form = document.getElementById('apply-form');
  const msgBox = document.getElementById('form-msg');

  function showMessage(text, success = true){
    msgBox.hidden = false;
    msgBox.textContent = text;
    msgBox.style.borderColor = success ? 'rgba(2,100,60,0.06)' : 'rgba(150,30,30,0.08)';
    msgBox.style.background = success ? '#eef8f3' : '#fff1f0';
  }

  if (form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      // simple HTML5 validation check
      if (!form.checkValidity()){
        showMessage('Please complete the required fields correctly.', false);
        // highlight invalid fields
        const invalid = form.querySelector(':invalid');
        if (invalid) invalid.focus();
        return;
      }
      // gather data (demo only)
      const data = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        age: form.age.value,
        message: form.message.value.trim()
      };

      // Mock "submission" — in a real site, send to backend via fetch to an API endpoint.
      console.log('Application (demo):', data);
      showMessage('Thank you! Your application has been received (demo). A recruiter will contact you soon.');
      form.reset();

      // Optionally store locally to simulate tracking (not secure, demo only)
      try {
        const store = JSON.parse(localStorage.getItem('afp_applications') || '[]');
        store.push(Object.assign({submittedAt: new Date().toISOString()}, data));
        localStorage.setItem('afp_applications', JSON.stringify(store));
      } catch(e){ /* ignore storage errors */ }
    });
  }

  // Demo download: generate an info pack (text file) and download
  const dlBtn = document.getElementById('demo-download');
  if (dlBtn){
    dlBtn.addEventListener('click', () => {
      const content = [
        'Philippine Army — Recruitment Info Pack (Demo)',
        '',
        '1. Eligibility: Philippine citizen, required age range and education depends on program.',
        '2. Benefits: Healthcare, training, education support, housing/allowances.',
        '3. Steps: Apply -> Screening -> Training -> Assignment.',
        '',
        'Visit your local recruitment office for official information.'
      ].join('\n');
      const blob = new Blob([content], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AFP_Recruitment_Info_Pack.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  // Accessibility improvement: show/hide FAQ panels based on initial state
  document.querySelectorAll('.faq-a').forEach(panel => panel.style.display = 'none');
});