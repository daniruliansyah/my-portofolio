interface SectionHeaderProps {
  label: string;
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        {/* Accent bar — ViscaBarca gets a blue→crimson gradient via .section-accent-bar */}
        <div className="section-accent-bar w-1 h-7 bg-th-accent rounded-full shrink-0" />
        <h2 className="text-xl font-extrabold tracking-tight uppercase text-th-ink">
          {label}
        </h2>
        {/* Horizontal rule — ViscaBarca gets a blue→crimson gradient via .section-rule */}
        <div className="section-rule flex-1 h-px bg-th-border" />
      </div>
    </div>
  );
}
