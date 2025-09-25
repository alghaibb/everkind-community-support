/**
 * Phone number utilities for Australian phone numbers
 */

// Australian phone number patterns
const MOBILE_PATTERN = /^(\+61|0)4\d{8}$/;
const LANDLINE_PATTERN = /^(\+61|0)[2378]\d{8}$/;

/**
 * Clean phone number by removing all formatting
 * @param phone - Phone number with or without formatting
 * @returns Cleaned phone number (digits only with country code)
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';

  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Convert +61 to 0
  if (cleaned.startsWith('+61')) {
    cleaned = '0' + cleaned.substring(3);
  }

  // Ensure we have exactly 10 digits for mobile numbers
  if (cleaned.startsWith('04') && cleaned.length === 10) {
    return cleaned;
  }

  // Ensure we have exactly 10 digits for landline numbers  
  if (cleaned.match(/^0[2378]/) && cleaned.length === 10) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Format Australian phone number for display
 * @param phone - Raw phone number (e.g., "0415904443" or "61415904443")
 * @returns Formatted phone number (e.g., "0415 904 443" or "+61 415 904 443")
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  // First, completely clean the phone number
  const cleaned = phone.replace(/[^\d]/g, '');

  // Handle international format: 61XXXXXXXXX -> +61 XXX XXX XXX
  if (cleaned.length === 11 && cleaned.startsWith('61')) {
    // Mobile: 614XXXXXXXX -> +61 4XX XXX XXX
    if (cleaned.startsWith('614')) {
      return cleaned.replace(/^(61)(4\d{2})(\d{3})(\d{3})$/, '+$1 $2 $3 $4');
    }
    // Landline: 61[2378]XXXXXXXX -> +61 [2378] XXXX XXXX
    if (/^61[2378]/.test(cleaned)) {
      return cleaned.replace(/^(61)([2378])(\d{4})(\d{4})$/, '+$1 $2 $3 $4');
    }
  }

  // Handle mobile numbers: 04XXXXXXXX -> 04XX XXX XXX
  if (cleaned.length === 10 && cleaned.startsWith('04')) {
    return cleaned.replace(/^(04\d{2})(\d{3})(\d{3})$/, '$1 $2 $3');
  }

  // Handle landline numbers: 0[2378]XXXXXXXX -> 0X XXXX XXXX
  if (cleaned.length === 10 && /^0[2378]/.test(cleaned)) {
    return cleaned.replace(/^(0[2378])(\d{4})(\d{4})$/, '$1 $2 $3');
  }

  // Return original if it doesn't match any pattern
  return phone;
}

/**
 * Validate Australian phone number
 * @param phone - Phone number to validate
 * @returns True if valid Australian phone number
 */
export function validateAustralianPhone(phone: string): boolean {
  if (!phone) return false;

  const cleaned = phone.replace(/[^\d]/g, '');

  // Check for local format: 04XXXXXXXX or 0[2378]XXXXXXXX
  if (cleaned.length === 10) {
    return /^04\d{8}$/.test(cleaned) || /^0[2378]\d{8}$/.test(cleaned);
  }

  // Check for international format: 614XXXXXXXX or 61[2378]XXXXXXXX  
  if (cleaned.length === 11 && cleaned.startsWith('61')) {
    return /^614\d{8}$/.test(cleaned) || /^61[2378]\d{8}$/.test(cleaned);
  }

  return false;
}

/**
 * Format phone number as user types (for input fields)
 * @param value - Current input value
 * @returns Formatted value
 */
export function formatPhoneInput(value: string): string {
  if (!value) return '';

  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Don't format if too short
  if (digits.length < 2) return digits;

  // International format: 61XXXXXXXXX
  if (digits.startsWith('61')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return digits.replace(/^(61)(\d+)/, '+$1 $2');
    if (digits.length <= 8) return digits.replace(/^(61)(\d{3})(\d+)/, '+$1 $2 $3');
    return digits.replace(/^(61)(\d{3})(\d{3})(\d+)/, '+$1 $2 $3 $4');
  }

  // Mobile number formatting
  if (digits.startsWith('04') || digits.startsWith('4')) {
    const mobile = digits.startsWith('4') ? '0' + digits : digits;
    if (mobile.length <= 4) return mobile;
    if (mobile.length <= 7) return mobile.replace(/^(04\d{2})(\d+)/, '$1 $2');
    return mobile.replace(/^(04\d{2})(\d{3})(\d+)/, '$1 $2 $3');
  }

  // Landline number formatting
  if (digits.match(/^0?[2378]/)) {
    const landline = digits.startsWith('0') ? digits : '0' + digits;
    if (landline.length <= 2) return landline;
    if (landline.length <= 6) return landline.replace(/^(0[2378])(\d+)/, '$1 $2');
    return landline.replace(/^(0[2378])(\d{4})(\d+)/, '$1 $2 $3');
  }

  return digits;
}

/**
 * Get phone number type
 * @param phone - Phone number to check
 * @returns Type of phone number or null if invalid
 */
export function getPhoneType(phone: string): 'mobile' | 'landline' | null {
  const cleaned = cleanPhoneNumber(phone);

  if (MOBILE_PATTERN.test(cleaned)) return 'mobile';
  if (LANDLINE_PATTERN.test(cleaned)) return 'landline';

  return null;
}
