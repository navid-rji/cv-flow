import React from "react";

export function Footer() {
  return (
    <footer className="px-6 py-12 text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} CVflow. Free forever.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="/imprint" className="hover:underline">
            Imprint
          </a>
        </div>
      </div>
    </footer>
  );
}
