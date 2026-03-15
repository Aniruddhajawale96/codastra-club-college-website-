export default function SectionTitle({ title, accent, subtitle }) {
    return (
        <>
            <h2 className="section-title reveal">
                {title} <span className="accent">{accent}</span>
            </h2>
            {subtitle && (
                <p className="section-subtitle reveal reveal-delay-1">{subtitle}</p>
            )}
            <div className="neon-divider reveal reveal-delay-1"></div>
        </>
    );
}
