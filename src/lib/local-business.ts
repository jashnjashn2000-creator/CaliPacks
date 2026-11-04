import { contactInfo, socialLinks } from "@/data/social";
import { SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/site";
import { DEFAULT_POSTAGE_GBP } from "@/lib/shipping";

/** NAP + hours aligned with the Google Maps listing for SMOKE CALI LTD. */
export const LOCAL_BUSINESS = {
  legalName: "SMOKE CALI LTD",
  name: SITE_NAME,
  url: SITE_URL,
  /** Same number as contactInfo.phone, in international format for structured data. */
  telephone: "+44 7473 108067",
  email: contactInfo.email,
  streetAddress: "5 Sagar Street",
  addressLocality: "Manchester",
  addressRegion: "England",
  postalCode: "M8 8EU",
  addressCountry: "GB",
  /** From Google Maps place pin */
  latitude: 53.4941439,
  longitude: -2.2500469,
  /** Daily shop hours (local UK time) */
  opens: "09:30",
  closes: "19:30",
  priceRange: "£",
  image: `${SITE_URL}/hero-cali-packs.webp`,
  logo: `${SITE_URL}${SITE_LOGO}`,
  /** Company director (supplied by the owner). */
  founder: "Kuldeep Singh",
  /**
   * TODO(owner): Companies House registration number, e.g. "12345678".
   * Leave empty until supplied — it is omitted from JSON-LD/llms.txt while empty.
   */
  companyNumber: "16543027",
  /** TODO(owner): ICO data protection fee registration number, e.g. "ZA123456" (omitted while empty). */
  icoRegistrationNumber: "",
  /** TODO(owner): VAT number if VAT-registered (omitted while empty). */
  vatID: "",
  /** TODO(owner): Google Business Profile URL (https://g.page/... or maps place URL) — add to sameAs. */
  googleBusinessProfileUrl: "https://www.google.com/maps/place/SMOKE+CALI+LTD/@53.4941439,-2.2500469,17z/data=!4m6!3m5!1s0x487bb17babc1f409:0xee37aaa9157833aa!8m2!3d53.4941439!4d-2.2500469!16s%2Fg%2F11xs2ywy5x",
} as const;

/** Shipping/returns facts used in Offer structured data — mirror /shipping and /returns. */
export const SHIPPING = {
  /** Default postage when a product does not set its own. Per-product postage overrides this. */
  rate: DEFAULT_POSTAGE_GBP,
  currency: "GBP",
  country: "GB",
  handlingMinDays: 2,
  handlingMaxDays: 3,
  transitMinDays: 2,
  transitMaxDays: 3,
} as const;

export const RETURNS = {
  /** 14-day change-of-mind cancellation right (Consumer Contracts Regulations 2013) for unopened/unused goods. */
  days: 14,
} as const;

/**
 * Offer shipping/returns JSON-LD. Pass the postage in GBP for this product
 * (0 = free UK delivery). Without it, the default £3.99 postage is used.
 */
export function offerShippingAndReturns(postageGbp: number = SHIPPING.rate) {
  const rate = postageGbp;
  return {
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: rate.toFixed(2),
        currency: SHIPPING.currency,
      },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: SHIPPING.country },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: SHIPPING.handlingMinDays,
          maxValue: SHIPPING.handlingMaxDays,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: SHIPPING.transitMinDays,
          maxValue: SHIPPING.transitMaxDays,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: SHIPPING.country,
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: RETURNS.days,
      returnMethod: "https://schema.org/ReturnByMail",
      merchantReturnLink: `${SITE_URL}/returns/`,
    },
  };
}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: LOCAL_BUSINESS.legalName,
        alternateName: SITE_NAME,
        url: SITE_URL,
        legalName: LOCAL_BUSINESS.legalName,
        logo: LOCAL_BUSINESS.logo,
        email: LOCAL_BUSINESS.email,
        telephone: LOCAL_BUSINESS.telephone,
        founder: { "@type": "Person", name: LOCAL_BUSINESS.founder, jobTitle: "Director" },
        address: { "@id": `${SITE_URL}/#address` },
        ...(LOCAL_BUSINESS.companyNumber
          ? {
              identifier: {
                "@type": "PropertyValue",
                propertyID: "Companies House",
                value: LOCAL_BUSINESS.companyNumber,
              },
            }
          : {}),
        ...(LOCAL_BUSINESS.vatID ? { vatID: LOCAL_BUSINESS.vatID } : {}),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: LOCAL_BUSINESS.telephone,
            email: LOCAL_BUSINESS.email,
            areaServed: "GB",
            availableLanguage: ["en-GB"],
          },
        ],
        sameAs: [
          LOCAL_BUSINESS.googleBusinessProfileUrl,
          socialLinks.facebook.href,
          socialLinks.instagram.href,
          socialLinks.tiktok.href,
          socialLinks.youtube.href,
        ].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-GB",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/shop/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": ["LocalBusiness", "Store"],
        "@id": `${SITE_URL}/#local`,
        name: LOCAL_BUSINESS.legalName,
        alternateName: SITE_NAME,
        url: SITE_URL,
        image: [LOCAL_BUSINESS.image, `${SITE_URL}/brand-showcase.webp`],
        logo: LOCAL_BUSINESS.logo,
        description:
          "Manchester smoke shop supplying wholesale Cali Packs at £0.20 per pack, minimum 50 pcs, plus grinders, glass, hookahs and accessories.",
        priceRange: LOCAL_BUSINESS.priceRange,
        telephone: LOCAL_BUSINESS.telephone,
        email: LOCAL_BUSINESS.email,
        address: {
          "@type": "PostalAddress",
          "@id": `${SITE_URL}/#address`,
          streetAddress: LOCAL_BUSINESS.streetAddress,
          addressLocality: LOCAL_BUSINESS.addressLocality,
          addressRegion: LOCAL_BUSINESS.addressRegion,
          postalCode: LOCAL_BUSINESS.postalCode,
          addressCountry: LOCAL_BUSINESS.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: LOCAL_BUSINESS.latitude,
          longitude: LOCAL_BUSINESS.longitude,
        },
        hasMap: contactInfo.mapLink,
        currenciesAccepted: "GBP",
        sameAs: [LOCAL_BUSINESS.googleBusinessProfileUrl, socialLinks.instagram.href, socialLinks.facebook.href].filter(Boolean),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [...WEEKDAYS],
            opens: LOCAL_BUSINESS.opens,
            closes: LOCAL_BUSINESS.closes,
          },
        ],
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
