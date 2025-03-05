export function createPricingPage(service) {
  const pricingContainer = document.createElement('div')
  pricingContainer.className = 'pricing-page'

  // Define pricing packages based on service type
  const isDynamic = service.name.toLowerCase().includes('dynamic website')
  const packages = isDynamic ? getDynamicPackages() : getStaticPackages()

  const content = `
    <div class="pricing-header">
      <h1>Pricing Plans</h1>
      <button class="close-button">×</button>
    </div>
    
    <div class="pricing-grid">
      ${packages.map(pkg => `
        <div class="pricing-card ${pkg.class}">
          ${pkg.recommended ? '<div class="recommended-badge">Most Popular</div>' : ''}
          <div class="card-header">
            <h2>${pkg.name}</h2>
            <div class="price">${pkg.price}</div>
          </div>
          <div class="card-content">
            <p class="package-description">${pkg.description}</p>
            <ul>
              ${pkg.features.map(feature => `
                <li class="${feature.highlight ? 'highlight' : ''} ${feature.note ? 'note' : ''}">
                  <i class="feature-icon">${feature.icon}</i>${feature.text}
                </li>
              `).join('')}
            </ul>
            <button class="select-plan">Get Started</button>
          </div>
        </div>
      `).join('')}
    </div>
  `

  pricingContainer.innerHTML = content
  document.body.appendChild(pricingContainer)

  // Add close button functionality
  const closeButton = pricingContainer.querySelector('.close-button')
  closeButton.addEventListener('click', () => {
    pricingContainer.classList.add('hiding')
    setTimeout(() => {
      document.body.removeChild(pricingContainer)
    }, 300)
  })

  // Add select plan functionality
  const selectButtons = pricingContainer.querySelectorAll('.select-plan')
  selectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const plan = button.closest('.pricing-card').querySelector('h2').textContent
      alert(`Thank you for selecting the ${plan}! We'll contact you shortly.`)
    })
  })

  // Show with animation
  requestAnimationFrame(() => {
    pricingContainer.classList.add('show')
  })
}

function getDynamicPackages() {
  return [
    {
      name: "Carina Starter Dynamic",
      price: "₹10,000 - ₹30,000",
      description: "Best for small businesses and personal brands needing a simple, interactive website.",
      class: "basic",
      features: [
        { icon: "📱", text: "5-10 pages with dynamic content updates", highlight: true },
        { icon: "📝", text: "Blogs, news, and testimonials management" },
        { icon: "🎯", text: "Mobile-responsive and SEO-friendly design" },
        { icon: "⚙️", text: "Basic admin panel for content management" },
        { icon: "🔗", text: "Contact forms and social media integration" },
        { icon: "💡", text: "Hosting and domain charges are extra", note: true }
      ]
    },
    {
      name: "Carina Business Pro",
      price: "₹30,000 - ₹80,000",
      description: "Ideal for startups and SMEs that require a feature-rich dynamic website.",
      class: "standard",
      features: [
        { icon: "📊", text: "10-20 pages with database integration" },
        { icon: "🎨", text: "Custom CMS or WordPress setup" },
        { icon: "🔐", text: "Secure admin panel for management" },
        { icon: "👥", text: "User login and authentication system" },
        { icon: "🔒", text: "Basic security setup (SSL, firewalls)" },
        { icon: "🚀", text: "Free domain and hosting for one year", highlight: true }
      ]
    },
    {
      name: "Carina E-Commerce Plus",
      price: "₹80,000 - ₹2,50,000",
      description: "Perfect for businesses looking to launch an online store with a seamless shopping experience.",
      class: "premium recommended",
      recommended: true,
      features: [
        { icon: "🛍️", text: "Full e-commerce setup with product catalog" },
        { icon: "💳", text: "Payment gateway integration" },
        { icon: "📊", text: "Advanced admin panel for management" },
        { icon: "🔐", text: "Secure authentication and order tracking" },
        { icon: "📈", text: "SEO optimization and marketing tools", highlight: true }
      ]
    },
    {
      name: "Carina Enterprise Custom",
      price: "₹2,50,000+",
      description: "Tailored for enterprises needing custom web applications or high-performance solutions.",
      class: "elite",
      features: [
        { icon: "⚡", text: "Fully customized backend with APIs" },
        { icon: "☁️", text: "Scalable cloud-based architecture" },
        { icon: "🤖", text: "AI/ML integrations and automation" },
        { icon: "🌐", text: "Multi-language support" },
        { icon: "🛡️", text: "High-end security measures" },
        { icon: "🔧", text: "Dedicated long-term support", highlight: true }
      ]
    }
  ]
}

function getStaticPackages() {
  return [
    {
      name: "Basic Package",
      price: "₹3,000 - ₹8,000",
      description: "Perfect for small businesses needing a simple yet professional web presence.",
      class: "basic",
      features: [
        { icon: "📄", text: "1-3 pages (Home, About, Contact)" },
        { icon: "📱", text: "Mobile responsive design" },
        { icon: "🎨", text: "Simple layout" },
        { icon: "📬", text: "Basic contact form integration" },
        { icon: "💡", text: "Hosting and domain charges extra", note: true }
      ]
    },
    {
      name: "Standard Package",
      price: "₹8,000 - ₹20,000",
      description: "Ideal for growing businesses that need more features and pages.",
      class: "standard",
      features: [
        { icon: "📑", text: "5-7 pages (Home, About, Services, Contact)" },
        { icon: "🔍", text: "SEO-friendly design" },
        { icon: "📱", text: "Fully mobile-responsive" },
        { icon: "🎯", text: "Custom UI design" },
        { icon: "🔒", text: "Basic SSL security" },
        { icon: "🚀", text: "Free hosting for one year", highlight: true }
      ]
    },
    {
      name: "Premium Package",
      price: "₹20,000 - ₹50,000",
      description: "For businesses wanting a high-quality website with advanced features.",
      class: "premium recommended",
      recommended: true,
      features: [
        { icon: "🌟", text: "8-15 pages with modern design" },
        { icon: "✨", text: "Custom graphics and animations" },
        { icon: "📈", text: "Advanced SEO optimization" },
        { icon: "📝", text: "Blog integration (static)" },
        { icon: "🎁", text: "Free domain and hosting for one year", highlight: true }
      ]
    },
    {
      name: "Elite Package",
      price: "₹50,000+",
      description: "Best suited for businesses needing a high-end static website.",
      class: "elite",
      features: [
        { icon: "💎", text: "15+ pages with professional design" },
        { icon: "🎮", text: "Interactive Three.js/Lottie animations" },
        { icon: "🎨", text: "Advanced UI/UX design" },
        { icon: "🌐", text: "Multi-language support" },
        { icon: "⚡", text: "Optimized performance and security" },
        { icon: "🛡️", text: "Lifetime limited support", highlight: true }
      ]
    }
  ]
}
