export default function Footer() {
  return (
    <>
      {/* Services Section */}
      <section className="min-h-[300px] border-t border-gray-200 bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid h-full grid-cols-1 gap-12 text-center md:grid-cols-3">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 justify-center">
                <svg
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="font-heading mb-2 text-lg text-gray-900">
                Envío gratis
              </h3>
              <p className="font-body text-sm text-gray-600">
                Por compras mayores de S/150
              </p>
            </div>

            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 justify-center">
                <svg
                  className="h-8 w-8 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-heading mb-2 text-lg text-gray-900">
                Garantía
              </h3>
              <p className="font-body text-sm text-gray-600">
                Productos de calidad
              </p>
            </div>

            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 justify-center">
                <svg
                  className="h-8 w-8 text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading mb-2 text-lg text-gray-900">
                Atención personalizada
              </h3>
              <p className="font-body text-sm text-gray-600">Te asesoramos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="border-t border-gray-200 bg-gradient-to-br from-purple-50 via-white to-rose-50 px-6 py-16">
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <div className="mb-12 grid flex-1 grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="flex flex-col">
              <div className="mb-4 flex">
                <a
                  href="/"
                  className="font-heading text-2xl font-bold text-gray-900"
                >
                  Crazzula
                </a>
              </div>
              <p className="font-body mb-6 max-w-xs text-sm leading-relaxed text-gray-600">
                En Crazzula, nos esforzamos por ofrecerte una experiencia de
                compra única y memorable.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-rose-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-amber-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-purple-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop */}
            <div className="flex flex-col">
              <h4 className="font-heading mb-4 text-lg font-bold text-gray-900 uppercase">
                Shop
              </h4>
              <div className="space-y-2">
                <a
                  href="/catalogo?category=necklaces"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Necklaces
                </a>
                <a
                  href="/catalogo?category=rings"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Rings
                </a>
                <a
                  href="/catalogo?category=earrings"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Earrings
                </a>
                <a
                  href="/catalogo?category=bracelets"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Bracelets
                </a>
              </div>
            </div>

            {/* Políticas */}
            <div className="flex flex-col">
              <h4 className="font-heading mb-4 text-lg font-bold text-gray-900 uppercase">
                Políticas
              </h4>
              <div className="space-y-2">
                <a
                  href="/about"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  About Us
                </a>
                <a
                  href="/contact"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact
                </a>
                <a
                  href="/shipping"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Shipping Info
                </a>
                <a
                  href="/returns"
                  className="font-body block text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Returns
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <h4 className="font-heading mb-4 text-lg font-bold text-gray-900 uppercase">
                Contact
              </h4>
              <div className="space-y-3">
                <div className="font-body text-sm text-gray-600">
                  <p>crazzula@gmail.com</p>
                </div>
                <div className="font-body text-sm text-gray-600">
                  <p>+51 912 896 552</p>
                </div>
                <div className="font-body text-sm text-gray-600">
                  <p>123 Jewelry Lane</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="font-body text-sm text-gray-600">
              © {new Date().getFullYear()} Crazzula - Brilla Sin Límites. Todos
              los derechos reservados.
            </p>
            <p className="font-body text-sm text-gray-600">
              Crazzula Group - RUC 20613897403
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
