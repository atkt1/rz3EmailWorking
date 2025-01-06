// Utility function for smooth scrolling to sections
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const navbarHeight = 64; // Height of the navbar (h-16 = 64px)
  const buffer = 16; // Additional buffer for visual comfort
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - (navbarHeight + buffer);

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}