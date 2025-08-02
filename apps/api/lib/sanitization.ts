

export const sanitizeText = (text: string, allowSpaces = true): string => {
    const basePattern = allowSpaces ? /[^a-zA-Z0-9\s'-]/g : /[^a-zA-Z0-9'-]/g;
    return text.replace(basePattern, '').trim();
  };
  
  export const sanitizeEmail = (email: string): string => {
    return email.replace(/[^a-zA-Z0-9@._+-]/g, '').trim().toLowerCase();
  };
  
  export const sanitizeAlphaNumeric = (text: string): string => {
    return text.replace(/[^a-zA-Z0-9]/g, '').trim();
  };
  
  export const sanitizeNumeric = (text: string): string => {
    return text.replace(/[^0-9]/g, '').trim();
  };
  
  export const sanitizeUserInput = (input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }): {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  } => {
    const sanitized: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {};
    
    if (input.firstName) sanitized.firstName = sanitizeText(input.firstName);
    if (input.lastName) sanitized.lastName = sanitizeText(input.lastName);
    if (input.email) sanitized.email = sanitizeEmail(input.email);
    if (input.password) sanitized.password = input.password; // Don't sanitize passwords
    
    return sanitized;
  };