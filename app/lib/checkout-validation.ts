export type CheckoutValues = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  cardNumber: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

function isValidEmail(email: string): boolean {
  if (/\s/.test(email)) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && domain.includes(".");
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const address = values.address.trim();
  const city = values.city.trim();
  const postalCode = values.postalCode.trim();
  const cardNumber = values.cardNumber.trim().replace(/[\s-]/g, "");

  if (!fullName) errors.fullName = "Enter your full name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!address) errors.address = "Enter your shipping address.";
  if (!city) errors.city = "Enter your city.";
  if (!/^[0-9]{5}$/.test(postalCode)) errors.postalCode = "Postal code must be 5 digits.";
  if (!/^[0-9]{16}$/.test(cardNumber)) errors.cardNumber = "Card number must be 16 digits.";
  return errors;
}
