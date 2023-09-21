function mobileNav() {
	// Mobile nav button
	const navBtn = document.querySelector('.mobile-nav-btn');
	const nav = document.querySelector('.mobile-nav');
	const menuIcon = document.querySelector('.nav-icon');
  const overlay = document.querySelector('.overlay');

  navBtn.addEventListener('click', () => {
    nav.classList.toggle('mobile-nav--open');
		menuIcon.classList.toggle('nav-icon--active');
    overlay.classList.toggle('overlay--active')
		document.body.classList.toggle('no-scroll');
  })
}

export default mobileNav;