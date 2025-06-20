// This is a minimal middleware file to satisfy Next.js
// No functionality is implemented to keep things simple

export default function middleware() {
  // Empty middleware - does nothing
  return;
}

// Define which paths this middleware should run on
// Empty array means "no paths"
export const config = {
  matcher: [],
};
