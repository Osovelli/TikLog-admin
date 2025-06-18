// Helper functions for content management
export const contentNameMap = {
  "/settings/about-us": "about-us",
  "/settings/terms": "terms-and-condition",
  "/settings/privacy": "privacy-policy",
  "/settings/delivery": "delivery-return-policy",
  "/settings/faq": "faq",
  "/settings/newsletter": "newsletter",
  "/settings/pages": "pages",
}

export const getContentNameFromPath = (path) => {
  return contentNameMap[path] || path.split("/").pop() || "unknown"
}

export const formatContentName = (name) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Generic content validation
export const validateContent = (content, maxLength = 2000) => {
  if (!content.trim()) {
    return { isValid: false, error: "Content cannot be empty" }
  }

  if (content.length > maxLength) {
    return { isValid: false, error: `Content exceeds maximum length of ${maxLength} characters` }
  }

  return { isValid: true }
}

// Privacy policy specific content suggestions
export const privacyPolicyTemplate = `
<h2>Information We Collect</h2>
<p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p>

<h2>How We Use Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services.</p>

<h2>Information Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>

<h2>Data Security</h2>
<p>We implement appropriate security measures to protect your personal information.</p>

<h2>Your Rights</h2>
<p>You have the right to access, update, or delete your personal information.</p>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us.</p>
`.trim()

// Terms and conditions template
export const termsConditionsTemplate = `
<h2>Acceptance of Terms</h2>
<p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>

<h2>Use License</h2>
<p>Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</p>

<h2>Disclaimer</h2>
<p>The materials are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>

<h2>Limitations</h2>
<p>In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials.</p>

<h2>Accuracy of Materials</h2>
<p>The materials may include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current.</p>

<h2>Modifications</h2>
<p>We may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.</p>
`.trim()

// About us template
export const aboutUsTemplate = `
<h2>Our Story</h2>
<p>Tell your visitors about your company's journey, when it was founded, and what inspired you to start this business.</p>

<h2>Our Mission</h2>
<p>Describe your company's mission and what you aim to achieve for your customers.</p>

<h2>Our Values</h2>
<p>Share the core values that guide your business decisions and customer relationships.</p>

<h2>Our Team</h2>
<p>Introduce key team members and their expertise that makes your company unique.</p>

<h2>Why Choose Us</h2>
<p>Explain what sets you apart from competitors and why customers should choose your services.</p>
`.trim()

//Delivery and return policy template
export const deliveryReturnPolicyTemplate = `
<h2>Shipping and Delivery</h2>
<div class="policy-section">
  <p>At Tiklog Inc, we are committed to providing reliable, clear, and customer-friendly policies when it comes to delivery and returns. Below is our general policy framework to guide both merchants and their customers.</p>

  <h3>📦 Delivery Policy</h3>
  
  <h4>1. Order Processing</h4>
  <p>All orders processed through Tiklog Inc-affiliated merchants are handled during standard business hours: Monday – Friday, 9 AM – 5 PM (local time). Orders placed after hours or on weekends/holidays may be processed the next business day.</p>

  <h4>2. Delivery Timeframe</h4>
  <p>Estimated delivery times vary based on the seller, product type, and shipping method selected at checkout. Typical delivery windows range between 3 – 7 business days for local orders. International delivery times may take 7 – 21 business days.</p>

  <h4>3. Shipping Confirmation & Tracking</h4>
  <p>Once your order is shipped, you will receive a confirmation email and tracking details (if available). Please ensure your shipping information is accurate to avoid delays.</p>

  <h4>4. Failed Deliveries</h4>
  <p>If a delivery attempt fails due to incorrect address or unavailability of the recipient, re-delivery may incur additional charges. Merchants reserve the right to cancel the order after repeated failed delivery attempts.</p>
</div>
`.trim()

// Content type configurations
export const contentConfigs = {
  "about-us": {
    title: "About Us",
    maxLength: 1245,
    placeholder: "Tell your visitors about your company, your story, and what makes you unique...",
    template: aboutUsTemplate,
  },
  "terms-and-condition": {
    title: "Terms & Conditions",
    maxLength: 2000,
    placeholder:
      "Enter your terms and conditions. Be clear about user rights, responsibilities, and legal requirements...",
    template: termsConditionsTemplate,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    maxLength: 3000,
    placeholder:
      "Enter your privacy policy. Include information about data collection, usage, storage, sharing, user rights, and contact information for privacy concerns...",
    template: privacyPolicyTemplate,
  },
  "delivery-return-policy": {
    title: "Delivery & Return Policy",
    maxLength: 2500,
    placeholder:
      "Enter your delivery and return policy. Include shipping times, costs, return procedures, and conditions...",
    template: deliveryReturnPolicyTemplate,
  },
  faq: {
    title: "FAQ",
    maxLength: 5000,
    placeholder: "Enter frequently asked questions and their answers to help your customers...",
    template: "",
  },
  newsletter: {
    title: "Newsletter",
    maxLength: 1500,
    placeholder: "Enter newsletter content and subscription information...",
    template: "",
  },
  pages: {
    title: "Pages",
    maxLength: 4000,
    placeholder: "Enter additional page content...",
    template: "",
  },
}
