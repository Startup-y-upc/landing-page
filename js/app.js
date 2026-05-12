// App JS: render content and add interactions
(async function(){
  // load i18n and components, then initialize UI
  const resolveLang = lang => lang === 'es_419' ? 'es_419' : 'en_US'
  const defaultLang = resolveLang(localStorage.getItem('r2g_lang') || 'en_US')
  const languageOptions = {
    en_US: { short: 'EN', ariaLabel: 'Switch language to Spanish' },
    es_419: { short: 'ES', ariaLabel: 'Cambiar idioma a inglés' },
  }
  const themeMeta = document.querySelector('meta[name="theme-color"]')
  let translations = {}
  async function loadTranslations(lang){
    try{
      const res = await fetch(`i18n/${lang}.json`)
      translations = await res.json()
    }catch(e){ console.error('i18n load error',e) }
  }

  function t(path){
    if(!path) return ''
    const parts = path.split('.')
    let cur = translations
    for(const p of parts){ if(cur && p in cur) cur = cur[p]; else return path }
    return cur
  }

  async function loadAll(){
    await loadTranslations(defaultLang)
    applyTranslations()
    initUI()
    // Apply translations again after dynamic content is rendered
    setTimeout(()=>applyTranslations(), 100)
  }

  function applyTranslations(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n')
      const val = t(key)
      if(el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea'){
        el.setAttribute('placeholder', val)
      } else if(el.tagName.toLowerCase() === 'select'){
        // For select elements, keep the placeholder text or label as data-i18n
        if(!el.value || el.value === '') el.textContent = val
      } else {
        el.textContent = val
      }
    })
  }

  function initUI(){
    const themeToggle = document.getElementById('theme-toggle')
    const langToggle = document.getElementById('lang-toggle')
    const storedTheme = localStorage.getItem('r2g_theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light')

    function syncLanguageControls(lang){
      const activeLang = resolveLang(lang)
      if(langToggle){
        const language = languageOptions[activeLang]
        langToggle.textContent = language.short
        langToggle.setAttribute('aria-label', language.ariaLabel)
        langToggle.setAttribute('aria-pressed', String(activeLang === 'es_419'))
      }
      document.documentElement.lang = activeLang === 'es_419' ? 'es' : 'en'
    }

    function applyTheme(theme){
      const isDark = theme === 'dark'
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
      localStorage.setItem('r2g_theme', theme)
      if(themeMeta){
        themeMeta.setAttribute('content', isDark ? '#0f172a' : '#ffffff')
      }
      if(themeToggle){
        themeToggle.setAttribute('aria-pressed', String(isDark))
        themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro')
        themeToggle.textContent = isDark ? '☀️' : '🌓'
      }
    }

    applyTheme(initialTheme)
    syncLanguageControls(defaultLang)

    if(themeToggle){
      themeToggle.addEventListener('click', ()=>{
        const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
        applyTheme(nextTheme)
      })
    }

    // mobile menu
    const menuToggle = document.getElementById('menu-toggle')
    const mobileNav = document.getElementById('mobile-nav')
    if(menuToggle && mobileNav){
      menuToggle.addEventListener('click', ()=>{
        const open = mobileNav.getAttribute('aria-hidden') === 'false'
        const nextOpen = !open
        mobileNav.style.display = nextOpen ? 'block' : 'none'
        mobileNav.setAttribute('aria-hidden', (!nextOpen).toString())
        menuToggle.setAttribute('aria-expanded', nextOpen.toString())
      })

      mobileNav.querySelectorAll('a').forEach(link=>{
        link.addEventListener('click', ()=>{
          mobileNav.style.display = 'none'
          mobileNav.setAttribute('aria-hidden', 'true')
          menuToggle.setAttribute('aria-expanded', 'false')
        })
      })
    }

    if(langToggle){
      langToggle.addEventListener('click', async ()=>{
        const currentLang = resolveLang(localStorage.getItem('r2g_lang') || defaultLang)
        const nextLang = currentLang === 'en_US' ? 'es_419' : 'en_US'
        localStorage.setItem('r2g_lang', nextLang)
        syncLanguageControls(nextLang)
        await loadTranslations(nextLang)
        applyTranslations()
      })
    }

    // Year
    const yearEl = document.getElementById('year')
    if(yearEl) yearEl.textContent = new Date().getFullYear()

    // Render dynamic content (features, fleet, steps, requirements, testimonials, faq)
    renderFeatures()
    renderFleet()
    renderSteps()
    renderRequirements()
    renderTestimonials()
    renderFAQ()
    initForm()
  }

  // Data and renderers (same content as before)
  const featuresData = [
    { titleKey: 'features.items.0.title', descKey: 'features.items.0.desc' },
    { titleKey: 'features.items.1.title', descKey: 'features.items.1.desc' },
    { titleKey: 'features.items.2.title', descKey: 'features.items.2.desc' },
    { titleKey: 'features.items.3.title', descKey: 'features.items.3.desc' },
    { titleKey: 'features.items.4.title', descKey: 'features.items.4.desc' },
    { titleKey: 'features.items.5.title', descKey: 'features.items.5.desc' },
  ]

  function renderFeatures(){
    const container = document.getElementById('features-list')
    if(!container) return
    container.innerHTML = ''
    featuresData.forEach(f=>{
      const el = document.createElement('div')
      el.className = 'card'
      el.innerHTML = `<h3>${t(f.titleKey)}</h3><p class="muted">${t(f.descKey)}</p>`
      container.appendChild(el)
    })
  }

  const categories = [
    { id: 'all', nameKey: 'fleet.categories.all' },
    { id: 'economic', nameKey: 'fleet.categories.economic' },
    { id: 'suv', nameKey: 'fleet.categories.suv' },
    { id: 'luxury', nameKey: 'fleet.categories.luxury' },
    { id: 'vans', nameKey: 'fleet.categories.vans' }
  ]
  const vehicles = [
    { id: 1, name: 'Toyota Yaris', category: 'economic', image: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg', price: 35, features: ['5 pasajeros','A/C','Manual'] },
    { id: 2, name: 'Kia Sportage', category: 'suv', image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg', price: 55, features: ['5 pasajeros','A/C','Automático'] },
    { id: 3, name: 'BMW Serie 3', category: 'luxury', image: 'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg', price: 95, features: ['5 pasajeros','A/C','Automático'] },
    { id: 4, name: 'Hyundai H1', category: 'vans', image: 'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg', price: 75, features: ['12 pasajeros','A/C'] },
    { id: 5, name: 'Suzuki Swift', category: 'economic', image: 'https://images.pexels.com/photos/1592261/pexels-photo-1592261.jpeg', price: 32, features: ['5 pasajeros','A/C','Manual'] },
    { id: 6, name: 'Toyota RAV4', category: 'suv', image: 'https://images.pexels.com/photos/13001670/pexels-photo-13001670.jpeg', price: 60, features: ['5 pasajeros','A/C','Automático'] },
  ]

  function renderFleet(){
    const catContainer = document.getElementById('fleet-categories')
    const fleetGrid = document.getElementById('fleet-grid')
    if(!catContainer || !fleetGrid) return
    catContainer.innerHTML = ''
    categories.forEach(cat=>{
      const btn = document.createElement('button')
      btn.textContent = t(cat.nameKey)
      btn.dataset.id = cat.id
      if(cat.id === 'all') btn.classList.add('active')
      btn.addEventListener('click', ()=> setActiveCategory(cat.id, btn))
      catContainer.appendChild(btn)
    })
    function render(list){
      fleetGrid.innerHTML = ''
      list.forEach(v=>{
        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
          <div class="img-wrap">
            <img src="${v.image}" alt="${v.name}" loading="lazy"/>
            <div class="category-badge">${t(`fleet.categories.${v.category}`)}</div>
          </div>
          <h3>${v.name}</h3>
          <div class="tags">${v.features.map(f=>`<span class="tag">${f}</span>`).join('')}</div>
          <div class="fleet-footer">
            <div class="price">$${v.price}<small>/day</small></div>
            <button class="btn-primary">${t('cta.reserve')||'Reservar'}</button>
          </div>
        `
        fleetGrid.appendChild(card)
      })
    }
    render(vehicles)
    window.setActiveCategory = function(id, btn){ setActiveCategory(id, btn) }
    function setActiveCategory(id, btn){
      document.querySelectorAll('#fleet-categories button').forEach(b=>b.classList.remove('active'))
      btn.classList.add('active')
      if(id === 'all') render(vehicles)
      else render(vehicles.filter(v=>v.category === id))
    }
  }

  function renderSteps(){
    const steps = [
      { number: 1, titleKey: 'how.steps.1.title', descKey: 'how.steps.1.desc' },
      { number: 2, titleKey: 'how.steps.2.title', descKey: 'how.steps.2.desc' },
      { number: 3, titleKey: 'how.steps.3.title', descKey: 'how.steps.3.desc' },
      { number: 4, titleKey: 'how.steps.4.title', descKey: 'how.steps.4.desc' },
      { number: 5, titleKey: 'how.steps.5.title', descKey: 'how.steps.5.desc' },
      { number: 6, titleKey: 'how.steps.6.title', descKey: 'how.steps.6.desc' },
    ]
    const cont = document.getElementById('how-steps')
    if(!cont) return
    cont.innerHTML = ''
    steps.forEach(s=>{
      const el=document.createElement('div')
      el.className='card'
      el.setAttribute('data-number', s.number)
      el.innerHTML=`<h3>${t(s.titleKey)}</h3><p class="muted">${t(s.descKey)}</p>`
      cont.appendChild(el)
    })
  }

  function renderRequirements(){
    const reqContainer = document.getElementById('requirements-list')
    if(reqContainer){
      reqContainer.innerHTML = ''
      const req = [
        { titleKey: 'requirements.driver.title', items: 'requirements.driver.items' },
        { titleKey: 'requirements.financial.title', items: 'requirements.financial.items' },
        { titleKey: 'requirements.documents.title', items: 'requirements.documents.items' },
      ]
      req.forEach(r=>{
        const el=document.createElement('div')
        el.className='card'
        const itemsKey = r.items.split('.')[1]
        const itemsList = translations.requirements[itemsKey]?.items || []
        el.innerHTML=`<h3>${t(r.titleKey)}</h3><ul>${itemsList.map(i=>`<li>${i}</li>`).join('')}</ul>`
        reqContainer.appendChild(el)
      })
    }

    const secContainer = document.getElementById('security-measures')
    if(secContainer){
      secContainer.innerHTML = ''
      const sec = [
        { titleKey: 'requirements.security.1.title', descKey: 'requirements.security.1.desc' },
        { titleKey: 'requirements.security.2.title', descKey: 'requirements.security.2.desc' },
        { titleKey: 'requirements.security.3.title', descKey: 'requirements.security.3.desc' },
        { titleKey: 'requirements.security.4.title', descKey: 'requirements.security.4.desc' },
      ]
      secContainer.className = 'security-measures'
      sec.forEach(s=>{
        const c=document.createElement('div')
        c.className='card'
        c.innerHTML=`<h4>${t(s.titleKey)}</h4><p class="muted">${t(s.descKey)}</p>`
        secContainer.appendChild(c)
      })
    }
  }

  function renderTestimonials(){
    const testimonials = [
      { nameKey: 'testimonials.items.1.name', locationKey: 'testimonials.items.1.location', textKey: 'testimonials.items.1.text', avatar:'https://randomuser.me/api/portraits/men/32.jpg' },
      { nameKey: 'testimonials.items.2.name', locationKey: 'testimonials.items.2.location', textKey: 'testimonials.items.2.text', avatar:'https://randomuser.me/api/portraits/women/44.jpg' },
      { nameKey: 'testimonials.items.3.name', locationKey: 'testimonials.items.3.location', textKey: 'testimonials.items.3.text', avatar:'https://randomuser.me/api/portraits/men/62.jpg' },
      { nameKey: 'testimonials.items.4.name', locationKey: 'testimonials.items.4.location', textKey: 'testimonials.items.4.text', avatar:'https://randomuser.me/api/portraits/women/68.jpg' },
    ]
    const tContainer = document.getElementById('testimonials-list')
    if(!tContainer) return
    tContainer.innerHTML = ''
    testimonials.forEach(tm=>{
      const c=document.createElement('div')
      c.className='card'
      c.innerHTML=`
        <div class="profile">
          <img src="${tm.avatar}" alt="${t(tm.nameKey)}"/>
          <div class="profile-info">
            <strong>${t(tm.nameKey)}</strong>
            <div class="location">${t(tm.locationKey)}</div>
            <div class="rating">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
        </div>
        <p class="muted">"${t(tm.textKey)}"</p>
      `
      tContainer.appendChild(c)
    })
  }

  function renderFAQ(){
    const faqs = [
      { qKey: 'faq.items.1.q', aKey: 'faq.items.1.a' },
      { qKey: 'faq.items.2.q', aKey: 'faq.items.2.a' },
      { qKey: 'faq.items.3.q', aKey: 'faq.items.3.a' },
      { qKey: 'faq.items.4.q', aKey: 'faq.items.4.a' },
    ]
    const faqList = document.getElementById('faq-list')
    if(!faqList) return
    faqList.innerHTML = ''
    faqs.forEach((f,i)=>{
      const el=document.createElement('div')
      el.className='faq'
      el.innerHTML=`
        <button aria-expanded="false">
          ${t(f.qKey)}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="answer">${t(f.aKey)}</div>
      `
      faqList.appendChild(el)
    })
    document.querySelectorAll('#faq-list .faq button').forEach(btn=>btn.addEventListener('click',()=>{
      const parent = btn.parentElement
      const ans = btn.nextElementSibling
      const open = parent.classList.contains('open')
      document.querySelectorAll('#faq-list .faq').forEach(el=>el.classList.remove('open'))
      document.querySelectorAll('#faq-list button').forEach(b=>b.setAttribute('aria-expanded','false'))
      if(!open){
        parent.classList.add('open')
        btn.setAttribute('aria-expanded','true')
      }
    }))
  }

  function initForm(){
    const form = document.getElementById('contact-form')
    if(!form) return
    // Update form labels and placeholders
    const fullnameInput = form.querySelector('input[type="text"]')
    const emailInput = form.querySelector('input[type="email"]')
    const phoneInput = form.querySelector('input[type="tel"]')
    const selectVehicle = form.querySelector('select')
    const startDate = form.querySelectorAll('input[type="date"]')[0]
    const endDate = form.querySelectorAll('input[type="date"]')[1]
    const message = form.querySelector('textarea')
    const submit = form.querySelector('button[type="submit"]')
    
    if(fullnameInput) fullnameInput.setAttribute('placeholder', t('contact.form.fullname'))
    if(emailInput) emailInput.setAttribute('placeholder', t('contact.form.email'))
    if(phoneInput) phoneInput.setAttribute('placeholder', t('contact.form.phone'))
    if(startDate) startDate.setAttribute('data-i18n', 'contact.form.startdate')
    if(endDate) endDate.setAttribute('data-i18n', 'contact.form.enddate')
    if(message) message.setAttribute('placeholder', t('contact.form.message'))
    if(submit) submit.textContent = t('contact.form.submit')
    
    form.addEventListener('submit', (e)=>{
      e.preventDefault()
      const success = document.getElementById('form-success')
      if(success){
        success.textContent = t('contact.success') || 'Message sent successfully!'
        success.style.display = 'block'
      }
      form.reset()
      setTimeout(()=> success.style.display='none',3000)
    })
  }

  // load everything
  await loadAll()
})()
