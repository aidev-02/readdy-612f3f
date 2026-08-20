export default function MobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-50 border-t border-background-200/70 shadow-lg px-4 py-3 flex items-center gap-3">
      <a
        href="#formulario-comercial"
        className="flex-1 px-4 py-3 rounded-full bg-primary-500 text-background-50 text-sm font-semibold text-center cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2"
      >
        <i className="ri-file-list-3-line w-4 h-4 flex items-center justify-center" />
        Pedir proposta
      </a>
      <a
        href="https://wa.me/351000000000"
        rel="nofollow"
        className="px-4 py-3 rounded-full bg-accent-500 text-background-50 text-sm font-semibold text-center cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2"
      >
        <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
        WhatsApp
      </a>
    </div>
  );
}