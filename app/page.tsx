"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useState } from "react";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Car,
  Droplets,
  Flower2,
  Hospital,
  Landmark,
  MapPin,
  Phone,
  School,
  ShieldCheck,
  Sun,
  Trees,
  Zap,
  type LucideIcon
} from "lucide-react";

// Replace these values to update the property, image slider, and contact details.
const property = {
  title: "Modern Luxury Multi-storey Residential House for Sale",
  location: "Bhaisepati, Lalitpur",
  price: "NPR 5.5 Crore",
  shortDescription:
    "A refined private residence designed for family comfort, premium entertaining, and effortless city access in one of Lalitpur's most desirable neighborhoods.",
  contactName: "Narayan Gaire",
  contactNumber: "+977 9742488804",
  contactPhoneHref: "tel:+9779742488804",
  whatsappUrl:
    "https://wa.me/9779742488804?text=Hello%20Narayan%20Gaire,%20I'm%20interested%20in%20this%20property.%20Could%20you%20please%20provide%20more%20information%3F",
  propertyType: "Bungalow House",
  landArea: "4 Aana 3 Paisa",
  roadAccess: "20 ft blacktop",
  facing: "South-East",
  floors: "3.5 Floors",
  bedrooms: "6 Bedrooms",
  bathrooms: "5 Bathrooms",
  parking: "3 Cars",
  heroImage:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
  overviewImage: "/images/house-image-5.png",
  images: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=85"
  ]
};

const keyInfo = [
  ["Location", property.location],
  ["Price", property.price],
  ["Property Type", property.propertyType],
  ["Land Area", property.landArea],
  ["Road Access", property.roadAccess],
  ["Facing Direction", property.facing],
  ["Floors", property.floors],
  ["Bedrooms", property.bedrooms],
  ["Bathrooms", property.bathrooms],
  ["Parking", property.parking]
];

const amenities: Array<[string, LucideIcon]> = [
  ["Parking", Car],
  ["Water Supply", Droplets],
  ["Electricity", Zap],
  ["Garden", Flower2],
  ["Balcony", Sun],
  ["Road Access", Landmark],
  ["Security", ShieldCheck],
  ["Nearby School", School],
  ["Nearby Hospital", Hospital],
  ["Peaceful Location", Trees],
  ["Family Layout", BedDouble],
  ["Premium Build", Building2]
];

const galleryImages = [
  "/images/House Image 1.jpeg",
  "/images/House Image 3.png",
  "/images/House Image 4.png",
  "/images/House Image 5.png"
];

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  message: ""
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const hasEmptyField = Object.values(form).some((value) => !value.trim());
    if (hasEmptyField) {
      setError("Please complete every field before sending your inquiry.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          propertyTitle: property.title,
          propertyLocation: property.location,
          propertyPrice: property.price
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit your inquiry.");
      }

      window.location.href = "/thank-you";
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your inquiry."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <img className="hero-image-backdrop" src={property.heroImage} alt="" aria-hidden="true" />
        <img className="hero-image" src={property.heroImage} alt={property.title} />
        <div className="hero-overlay" />
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#">
            Elite Estate
          </a>
          <div className="nav-actions">
            <a className="phone-chip" href={property.contactPhoneHref}>
              {property.contactNumber}
            </a>
            <a className="btn btn-primary" href="#inquiry">
              Inquire Now <ArrowRight size={18} />
            </a>
          </div>
        </nav>

        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Exclusive Listing</p>
            <h1>{property.title}</h1>
            <p className="hero-description">{property.shortDescription}</p>
            <div className="hero-meta" aria-label="Property highlights">
              <span>
                <MapPin size={16} /> {property.location}
              </span>
              <span>{property.price}</span>
              <span>{property.landArea}</span>
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href="#inquiry">
                Request Information <ArrowRight size={18} />
              </a>
              <a className="btn btn-secondary" href="#gallery">
                View Gallery
              </a>
            </div>
          </div>

          <InquiryPanel
            formId="hero"
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>

      <section className="section" id="overview">
        <div className="section-inner overview-grid">
          <div
            className="overview-image"
            aria-label="Premium property exterior"
          >
            <img src={property.overviewImage} alt="Premium property exterior" />
          </div>
          <div className="overview-copy">
            <p className="eyebrow">Property Overview</p>
            <h2>Quiet luxury with generous proportions.</h2>
            <p>
              This residence balances formal living, warm family spaces, and practical everyday
              comfort. Large windows, premium finishes, private parking, and a peaceful residential
              setting make it ideal for buyers who want a polished home close to schools, hospitals,
              shopping, and major access roads.
            </p>
            <div className="stats">
              <div className="stat">
                <strong>6</strong>
                <span>Bedrooms</span>
              </div>
              <div className="stat">
                <strong>5</strong>
                <span>Bathrooms</span>
              </div>
              <div className="stat">
                <strong>3</strong>
                <span>Car Parking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">Key Information</p>
            <h2>Essential details at a glance.</h2>
          </div>
          <div className="info-grid">
            {keyInfo.map(([label, value]) => (
              <div className="info-item" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">Features & Amenities</p>
            <h2>Designed for calm, secure, practical living.</h2>
          </div>
          <div className="amenities">
            {amenities.map(([label, Icon]) => (
              <div className="amenity" key={label}>
                <Icon size={22} />
                <strong>{label}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="gallery">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">Image Gallery</p>
            <h2>A moving look through the residence.</h2>
            <p>
              Explore selected property views presented in a clean, high-resolution gallery.
            </p>
          </div>
          <div className="gallery-window" aria-label="Moving property image gallery">
            <div className="gallery-strip">
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <figure className="gallery-card" key={`${image}-${index}`}>
                  <img
                    className="gallery-image"
                    src={image}
                    alt={`Property gallery image ${(index % galleryImages.length) + 1}`}
                    loading={index < galleryImages.length ? "eager" : "lazy"}
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="inquiry">
        <div className="section-inner contact-layout">
          <div>
            <div className="section-heading">
              <p className="eyebrow">Contact</p>
              <h2>Request a private viewing or more information.</h2>
              <p>
                Share your details and the listing team will follow up with availability, documents,
                and next steps for this property.
              </p>
            </div>
            <div className="mini-details">
              <div className="mini-detail">
                <span>Contact Person</span>
                <strong>{property.contactName}</strong>
              </div>
              <div className="mini-detail">
                <span>Phone Number</span>
                <strong>{property.contactNumber}</strong>
              </div>
            </div>
          </div>

          <InquiryPanel
            className="sticky-panel"
            formId="contact"
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>
    </main>
  );
}

function InquiryPanel({
  form,
  setForm,
  onSubmit,
  isLoading,
  error,
  formId,
  className = ""
}: {
  form: typeof initialForm;
  setForm: Dispatch<SetStateAction<typeof initialForm>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
  formId: string;
  className?: string;
}) {
  return (
    <aside className={`side-panel ${className}`} aria-label="Contact and request information form">
      <section className="contact-profile" aria-labelledby={`${formId}-contact-title`}>
        <span className="contact-label">Contact Person</span>
        <h2 className="contact-name" id={`${formId}-contact-title`}>
          {property.contactName}
        </h2>
        <div className="contact-actions">
          <a
            className="contact-action contact-action-call"
            href={property.contactPhoneHref}
            aria-label={`Call ${property.contactName} at ${property.contactNumber}`}
          >
            <Phone size={20} aria-hidden="true" />
            <span>{property.contactNumber}</span>
          </a>
          <a
            className="contact-action contact-action-whatsapp"
            href={property.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Send WhatsApp message to ${property.contactName}`}
          >
            <WhatsAppIcon />
            <span>WhatsApp Message</span>
          </a>
        </div>
      </section>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor={`${formId}-fullName`}>Full Name</label>
          <input
            id={`${formId}-fullName`}
            name="fullName"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor={`${formId}-phone`}>Phone Number</label>
          <input
            id={`${formId}-phone`}
            name="phone"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            required
            autoComplete="tel"
          />
        </div>
        <div className="field">
          <label htmlFor={`${formId}-email`}>Email Address</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor={`${formId}-message`}>Message</label>
          <textarea
            id={`${formId}-message`}
            name="message"
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            required
          />
        </div>
        {error ? <p className="form-message">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </aside>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className="whatsapp-icon"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16.04 3.2A12.7 12.7 0 0 0 5.2 22.57L3.7 28.8l6.38-1.47A12.7 12.7 0 1 0 16.04 3.2Zm0 2.33a10.37 10.37 0 0 1 8.78 15.9 10.34 10.34 0 0 1-13.92 3.58l-.45-.27-3.6.83.85-3.5-.3-.47A10.37 10.37 0 0 1 16.04 5.53Zm-5.1 5.42c-.22.5-.82 1.14-.82 2.16 0 1.02.74 2 1.04 2.4.3.4 2.04 3.26 5.06 4.44 2.5.98 3.02.78 3.56.73.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.74.57Z"
      />
    </svg>
  );
}
