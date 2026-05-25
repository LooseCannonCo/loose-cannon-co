export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "var(--color-bg)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-family-display)",
          fontWeight: 700,
          fontSize: "clamp(2rem, 6vw, 4.5rem)",
          color: "var(--color-fg)",
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        Loose Cannon Co. scaffold OK
      </h1>
    </main>
  );
}
