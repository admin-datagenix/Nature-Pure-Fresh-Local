function TrustItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-sage/40 bg-white px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mango/35 text-lg" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-primary">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted">{desc}</p>
      </div>
    </div>
  );
}

export default function AccountTrustBar() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TrustItem icon="📦" title="Free shipping" desc="Free delivery on orders above ₹999" />
      <TrustItem icon="💳" title="Flexible payment" desc="UPI, cards, and cash on delivery" />
      <TrustItem icon="🎧" title="Support" desc="Mon–Sat, 9 AM – 6 PM IST" />
    </div>
  );
}
