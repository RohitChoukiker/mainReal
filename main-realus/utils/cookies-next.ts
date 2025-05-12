// Simple cookie utility functions

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return undefined;
}

export function setCookie(name: string, value: string, options: any = {}): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  const {
    path = '/',
    expires,
    maxAge,
    domain,
    secure,
    sameSite = 'lax'
  } = options;
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (path) {
    cookieString += `; path=${path}`;
  }
  
  if (expires) {
    if (expires instanceof Date) {
      cookieString += `; expires=${expires.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires}`;
    }
  }
  
  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  
  if (secure) {
    cookieString += '; secure';
  }
  
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }
  
  document.cookie = cookieString;
}

export function deleteCookie(name: string, options: any = {}): void {
  setCookie(name, '', { ...options, maxAge: -1 });
}