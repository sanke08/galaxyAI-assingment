/**
 * Authentication Utilities
 * 
 * Works with Clerk for token management.
 */

// We will rely on Clerk hooks in React components: useAuth()
// For non-React contexts (like simple fetch wrappers), we might rely on the browser's cookie handling
// or passed-in tokens.

// This file is kept for backward compatibility if needed, but in Next.js + Clerk, 
// auth state is mostly managed by Clerk's provider and hooks.

export const AUTH_TOKEN_KEY = 'clerk-db-jwt'; // Example key if we needed one

export function getStoredToken(): string | null {
    // With Clerk, we usually get the token via useAuth().getToken()
    // If we need to access it outside React, we might check cookies or local storage if we manually stored it.
    // For now, return null as we should use the hook.
    return null; 
}
