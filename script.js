const nav = document.querySelector('.nav')
const toggle = document.querySelector('.nav-toggle')
const links = document.querySelector('.nav-links')

document.getElementById('year').textContent = new Date().getFullYear()

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 8), { passive: true })

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open')
  toggle.setAttribute('aria-expanded', String(open))
})
const tabs = [...links.querySelectorAll('a[href^="#"]')]
const sections = tabs.map((tab) => document.querySelector(tab.getAttribute('href')))
const NAV_OFFSET = 120
let clickLockUntil = 0

const setActive = (id) => {
  tabs.forEach((tab) => {
    const isActive = tab.getAttribute('href') === `#${id}`
    tab.classList.toggle('active', isActive)
    if (isActive) tab.setAttribute('aria-current', 'true')
    else tab.removeAttribute('aria-current')
  })
}

const updateActiveFromScroll = () => {
  if (Date.now() < clickLockUntil) return
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  if (atBottom) return setActive(sections[sections.length - 1].id)
  const current = sections.filter((s) => s.getBoundingClientRect().top <= NAV_OFFSET).pop()
  setActive(current ? current.id : null)
}

links.addEventListener('click', (e) => {
  if (e.target.tagName !== 'A') return
  links.classList.remove('open')
  toggle.setAttribute('aria-expanded', 'false')
  const href = e.target.getAttribute('href')
  if (href.startsWith('#')) {
    setActive(href.slice(1))
    clickLockUntil = Date.now() + 900
  }
})

window.addEventListener('scroll', updateActiveFromScroll, { passive: true })
window.addEventListener('scrollend', () => {
  clickLockUntil = 0
  updateActiveFromScroll()
})
window.addEventListener('load', updateActiveFromScroll)
updateActiveFromScroll()

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 }
)
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

const lightbox = document.querySelector('.lightbox')
const lightboxImg = lightbox.querySelector('img')

document.querySelectorAll('.shot').forEach((shot) => {
  shot.addEventListener('click', () => {
    lightboxImg.src = shot.dataset.full
    lightboxImg.alt = shot.querySelector('img').alt
    lightbox.hidden = false
    document.body.style.overflow = 'hidden'
  })
})

const closeLightbox = () => {
  lightbox.hidden = true
  lightboxImg.src = ''
  document.body.style.overflow = ''
}
lightbox.addEventListener('click', closeLightbox)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox()
})
